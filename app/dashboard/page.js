'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) router.push('/sign-in')
  }, [isSignedIn, router])

  // ===== Original state variables =====
  const [isLocked, setIsLocked] = useState(true)
  const [lockPassword, setLockPassword] = useState('')
  const [lockError, setLockError] = useState('')
  const [sessionToken, setSessionToken] = useState(null)

  const [phoneInput, setPhoneInput] = useState('')
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' })
  const [codeDisplay, setCodeDisplay] = useState(null)
  const [stats, setStats] = useState({ sessions: 0, maxSessions: 30, uptime: 0 })
  const [sessions, setSessions] = useState([])
  const [connectLoading, setConnectLoading] = useState(false)

  const [deleteModal, setDeleteModal] = useState({ open: false, phone: '' })
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  // Refs for particles
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // ===== Particles =====
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height
    let particles = []

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initParticles()
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(168,85,247,${Math.random() * 0.3 + 0.2})`
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0 || p.x > width) p.speedX *= -1
        if (p.y < 0 || p.y > height) p.speedY *= -1
      })
      animationRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // ===== Load data when unlocked =====
  useEffect(() => {
    if (!isLocked && sessionToken) {
      loadStatus()
      loadSessions()
      const interval = setInterval(() => {
        loadStatus()
        loadSessions()
      }, 15000)
      return () => clearInterval(interval)
    }
  }, [isLocked, sessionToken])

  // ===== API calls =====
  const loadStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStats({
        sessions: data.sessions || 0,
        maxSessions: data.maxSessions || 30,
        uptime: data.uptime || 0
      })
    } catch (e) {}
  }

  const loadSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (e) {
      setSessions([])
    }
  }

  const unlock = async () => {
    if (!lockPassword) return
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: lockPassword })
      })
      const data = await res.json()
      if (data.ok) {
        sessionStorage.setItem('panelAuth', lockPassword)
        setSessionToken(lockPassword)
        setIsLocked(false)
        setLockError('')
      } else {
        setLockError('Incorrect password')
        setLockPassword('')
      }
    } catch (err) {
      setLockError('Server error')
    }
  }

  const lockPanel = () => {
    sessionStorage.removeItem('panelAuth')
    setSessionToken(null)
    setIsLocked(true)
    setLockPassword('')
  }

  const requestPair = async () => {
    const phone = phoneInput.trim().replace(/\s+/g, '')
    if (!phone || !/^\d{7,15}$/.test(phone)) {
      setStatusMsg({ text: '⚠ Enter a valid number with country code', type: 'err' })
      return
    }
    setConnectLoading(true)
    setStatusMsg({ text: '⏳ Creating session, please wait…', type: 'info' })
    setCodeDisplay(null)

    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (data.code) {
        setCodeDisplay(data.code)
        setStatusMsg({ text: '✓ Pairing code ready — enter it in WhatsApp now!', type: 'ok' })
        loadStatus()
        loadSessions()
      } else {
        setStatusMsg({ text: '✗ ' + (data.error || 'Failed to generate code'), type: 'err' })
      }
    } catch (e) {
      setStatusMsg({ text: '✗ Server error', type: 'err' })
    }
    setConnectLoading(false)
  }

  const confirmDelete = async () => {
    if (!deletePassword) return
    setDeleteLoading(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/delsession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: deleteModal.phone, password: deletePassword })
      })
      const data = await res.json()
      if (data.ok) {
        setDeleteModal({ open: false, phone: '' })
        setDeletePassword('')
        showToast('🗑 Session deleted')
        loadStatus()
        loadSessions()
      } else {
        setDeleteError(data.error || 'Failed')
      }
    } catch (e) {
      setDeleteError('Server error')
    }
    setDeleteLoading(false)
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2200)
  }

  const copyCode = () => {
    if (codeDisplay && codeDisplay !== '— — — —') {
      navigator.clipboard?.writeText(codeDisplay).then(() => showToast('✓ Code copied!'))
    }
  }

  const formatUptime = (secs) => {
    const d = Math.floor(secs / 86400)
    const h = Math.floor((secs % 86400) / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (d > 0) return d + 'd ' + h + 'h'
    if (h > 0) return h + 'h ' + m + 'm'
    if (m > 0) return m + 'm ' + s + 's'
    return s + 's'
  }

  const formatSessionUptime = (ts) => {
    if (!ts) return 'connected'
    const secs = Math.floor((Date.now() - ts) / 1000)
    if (secs < 60) return secs + 's uptime'
    if (secs < 3600) return Math.floor(secs / 60) + 'm uptime'
    return Math.floor(secs / 3600) + 'h ' + Math.floor((secs % 3600) / 60) + 'm uptime'
  }

  if (!isSignedIn) return null // Redirect handled

  const { sessions: activeSessions, maxSessions, uptime } = stats
  const freeSlots = maxSessions - activeSessions
  const capacityPercent = Math.round((activeSessions / maxSessions) * 100)

  return (
    <>
      {/* Particles canvas */}
      <canvas ref={canvasRef} id="particles-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }} />

      {/* Lock screen overlay */}
      {isLocked && (
        <div id="lockScreen" style={{ display: 'flex' }}>
          <div className="lock-card">
            <span className="lock-icon">🤖</span>
            <div className="lock-title">CyberByte AI Bot</div>
            <div className="lock-sub">Enter your panel password to continue</div>
            {lockError && <div className="lock-error" style={{ display: 'block' }}>{lockError}</div>}
            <input
              type="password"
              placeholder="••••••••"
              value={lockPassword}
              onChange={(e) => setLockPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && unlock()}
            />
            <button className="btn btn-primary" onClick={unlock}>Unlock</button>
          </div>
        </div>
      )}

      {/* Main panel */}
      <div className="wrap" style={{ display: isLocked ? 'none' : 'flex' }}>
        <header>
          <div className="logo">
            <div className="logo-icon">🤖</div>
            Cyber<span>Byte</span> AI
          </div>
          <div className="header-right">
            <div className="status-pill"><div className="status-dot"></div>AI ONLINE</div>
            <div className="user-btn" onClick={() => signOut()}>
              <i className="fas fa-sign-out-alt"></i>
              <span className="user-email">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="lock-btn" onClick={lockPanel} title="Lock panel">🔒</div>
          </div>
        </header>

        <div className="content">
          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-card green">
              <div className="stat-label">Sessions</div>
              <div className="stat-value">{activeSessions}<span> / {maxSessions}</span></div>
              <div className="stat-sub">{freeSlots} slot{freeSlots !== 1 ? 's' : ''} free</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Server Uptime</div>
              <div className="stat-value">{formatUptime(uptime)}</div>
              <div className="stat-sub">since last restart</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="session-progress">
            <div className="progress-header">
              <span className="progress-label">Capacity</span>
              <span className="progress-count">{activeSessions} / {maxSessions}</span>
            </div>
            <div className="progress-track">
              <div className={`progress-fill ${capacityPercent >= 80 ? 'warn' : ''}`} style={{ width: capacityPercent + '%' }}></div>
            </div>
          </div>

          {/* Hero */}
          <div className="hero">
            <div className="hero-label">CyberByte AI Bot</div>
            <h1>Pair your<br /><em>WhatsApp</em><br />with AI</h1>
            <p>No Telegram needed. Enter your number, get a code, enter it in WhatsApp.</p>
          </div>

          {/* Connect card */}
          <div className="card">
            <div className="card-header"><div className="card-header-dot"></div>New Connection</div>
            <div className="card-body">
              <div className="field">
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="254712345678"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && requestPair()}
                />
              </div>
              <button className="btn btn-primary" onClick={requestPair} disabled={connectLoading}>
                {connectLoading ? <div className="spinner"></div> : 'Connect'}
              </button>
              {statusMsg.text && (
                <div className={`status-msg msg-${statusMsg.type}`} style={{ display: 'block' }}>
                  {statusMsg.text}
                </div>
              )}
              {codeDisplay && (
                <div id="codeDisplay" style={{ display: 'block' }}>
                  <div className="code-box">
                    <div className="code-label">Your Pairing Code</div>
                    <div className="code-value">{codeDisplay}</div>
                    <div className="code-actions"><button className="btn btn-copy" onClick={copyCode}>⎘ Copy</button></div>
                    <div className="code-hint">WhatsApp → Linked Devices → Link a Device<br />→ tap "Link with phone number instead"</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How to */}
          <div className="card">
            <div className="steps-toggle" onClick={(e) => {
              const stepsBody = document.getElementById('stepsBody')
              stepsBody.classList.toggle('open')
              e.currentTarget.querySelector('.chevron').classList.toggle('open')
            }}>
              <div className="steps-toggle-label"><div className="card-header-dot"></div>How to pair</div>
              <span className="chevron">▼</span>
            </div>
            <div className="steps-body" id="stepsBody">
              <div className="step"><div className="step-num">01</div><p><strong>Enter your number</strong><br />Country code + digits only. E.g. <code>254712345678</code></p></div>
              <div className="step"><div className="step-num">02</div><p><strong>Tap Connect</strong><br />Wait a few seconds for your pairing code.</p></div>
              <div className="step"><div className="step-num">03</div><p><strong>Open WhatsApp</strong><br />Linked Devices → Link a Device → enter code instead of QR.</p></div>
              <div className="step"><div className="step-num">04</div><p><strong>Done!</strong><br />Session saves to database — survives restarts automatically.</p></div>
            </div>
          </div>

          {/* Sessions list */}
          <div className="card">
            <div className="card-header"><div className="card-header-dot"></div>Active Sessions</div>
            <div className="card-body" style={{ paddingTop: '.75rem' }}>
              <div id="sessionList">
                {sessions.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon">🔌</span>No active sessions</div>
                ) : (
                  sessions.map(s => {
                    const isReconnecting = s.status === 'reconnecting'
                    return (
                      <div key={s.phoneNumber} className={`session-item ${isReconnecting ? 'reconnecting' : ''}`}>
                        <div className="session-left">
                          <div className={`session-dot ${isReconnecting ? 'dot-warn' : ''}`}></div>
                          <div className="session-info">
                            <div className="session-num">{s.phoneNumber}</div>
                            <div className="session-uptime">
                              {isReconnecting ? '⟳ Reconnecting…' : formatSessionUptime(s.connectedAt)}
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-danger" onClick={() => setDeleteModal({ open: true, phone: s.phoneNumber })}>Delete</button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <footer>
          CyberByte AI Bot &nbsp;·&nbsp; @cyberbyte/baileys &nbsp;·&nbsp; Max {maxSessions} sessions
        </footer>
      </div>

      {/* Support bar */}
      <div className="support-bar">
        <a href="https://wa.me/yourwhatsappnumber" target="_blank" title="WhatsApp Developer Chat"><i className="fab fa-whatsapp"></i></a>
        <a href="https://whatsapp.com/channel/yourchannel" target="_blank" title="WhatsApp Channel"><i className="fab fa-whatsapp"></i></a>
        <a href="https://t.me/yourtelegram" target="_blank" title="Telegram Channel"><i className="fab fa-telegram"></i></a>
      </div>

      {/* Toast */}
      <div id="toast" className={toastVisible ? 'show' : ''}>{toastMessage}</div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && setDeleteModal({ open: false, phone: '' })}>
          <div className="modal">
            <div className="modal-title">🗑 Delete Session</div>
            <div className="modal-sub">
              This will immediately disconnect <span className="modal-phone">{deleteModal.phone}</span> and remove it from the database.
            </div>
            {deleteError && <div className="modal-error" style={{ display: 'block' }}>{deleteError}</div>}
            <div className="modal-field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmDelete(); if (e.key === 'Escape') setDeleteModal({ open: false, phone: '' }); }}
              />
            </div>
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setDeleteModal({ open: false, phone: '' })}>Cancel</button>
              <button className="btn-confirm-delete" onClick={confirmDelete} disabled={deleteLoading}>
                {deleteLoading ? <div className="spinner-sm"></div> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
