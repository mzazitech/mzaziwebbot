const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store active sessions
const activeSessions = new Map();

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to start pairing
app.post('/api/start-pairing', async (req, res) => {
    const { phoneNumber, sessionId } = req.body;
    
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate a session ID if not provided
    const session = sessionId || `session_${Date.now()}`;
    
    try {
        // Start WhatsApp connection
        await startWhatsAppSession(session, phoneNumber, req.io || io);
        
        res.json({ 
            success: true, 
            sessionId: session,
            message: 'Pairing initiated. Check the website for the code.'
        });
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({ error: 'Failed to start pairing process' });
    }
});

async function startWhatsAppSession(sessionId, phoneNumber, io) {
    const { state, saveCreds } = await useMultiFileAuthState(`auth_info_${sessionId}`);
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['WhatsApp Bot', 'Chrome', '1.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: false,
        emitOwnEvents: true
    });

    // Store socket in active sessions
    activeSessions.set(sessionId, sock);

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            // Generate QR code as data URL
            const qrDataURL = await QRCode.toDataURL(qr);
            io.emit('qr-code', { sessionId, qr: qrDataURL });
        }

        if (connection === 'open') {
            console.log(`Session ${sessionId} connected!`);
            io.emit('connected', { 
                sessionId, 
                message: 'Bot connected successfully!' 
            });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`Session ${sessionId} closed. Reconnect: ${shouldReconnect}`);
            
            if (shouldReconnect) {
                startWhatsAppSession(sessionId, phoneNumber, io);
            } else {
                activeSessions.delete(sessionId);
                io.emit('logged-out', { sessionId });
            }
        }
    });

    // Handle credentials update
    sock.ev.on('creds.update', saveCreds);

    // If phone number is provided, try to request pairing code
    if (phoneNumber && !sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                // Format phone number (remove any non-numeric characters)
                const formattedNumber = phoneNumber.replace(/\D/g, '');
                
                // Request pairing code
                const pairingCode = await sock.requestPairingCode(formattedNumber);
                
                // Format the code for better readability
                const formattedCode = pairingCode.match(/.{1,4}/g).join('-');
                
                io.emit('pairing-code', { 
                    sessionId, 
                    code: pairingCode,
                    formattedCode: formattedCode
                });
                
                console.log(`Pairing code for ${phoneNumber}: ${formattedCode}`);
            } catch (error) {
                console.error('Error requesting pairing code:', error);
                io.emit('error', { 
                    sessionId, 
                    message: 'Failed to generate pairing code. Please try again.' 
                });
            }
        }, 2000);
    }

    // Handle messages (optional)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.key.fromMe) {
            console.log('Received message:', m.message?.conversation);
            // Process commands here if needed
        }
    });

    return sock;
}

// API endpoint to check session status
app.get('/api/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = activeSessions.get(sessionId);
    
    res.json({
        active: !!session,
        connected: session?.user ? true : false
    });
});

// API endpoint to disconnect session
app.post('/api/disconnect/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = activeSessions.get(sessionId);
    
    if (session) {
        session.end();
        activeSessions.delete(sessionId);
        res.json({ success: true, message: 'Session disconnected' });
    } else {
        res.status(404).json({ error: 'Session not found' });
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
