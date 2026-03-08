const socket = io();
let currentSessionId = null;

// DOM Elements
const phoneInput = document.getElementById('phoneNumber');
const startBtn = document.getElementById('startBtn');
const statusSection = document.getElementById('statusSection');
const statusText = document.getElementById('statusText');
const pairingCodeSection = document.getElementById('pairingCodeSection');
const pairingCodeDisplay = document.getElementById('pairingCode');
const qrSection = document.getElementById('qrSection');
const qrImage = document.getElementById('qrImage');
const successSection = document.getElementById('successSection');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');

// Socket event handlers
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('pairing-code', (data) => {
    // Hide QR if showing
    qrSection.style.display = 'none';
    
    // Show pairing code
    pairingCodeSection.style.display = 'block';
    pairingCodeDisplay.textContent = data.formattedCode || data.code;
    statusText.textContent = 'Pairing code generated!';
    
    // Stop spinner
    document.querySelector('.spinner').style.display = 'none';
});

socket.on('qr-code', (data) => {
    // Hide pairing code if showing
    pairingCodeSection.style.display = 'none';
    
    // Show QR code
    qrSection.style.display = 'block';
    qrImage.src = data.qr;
    statusText.textContent = 'Scan QR code with WhatsApp';
    
    // Stop spinner
    document.querySelector('.spinner').style.display = 'none';
});

socket.on('connected', (data) => {
    // Hide all intermediate sections
    pairingCodeSection.style.display = 'none';
    qrSection.style.display = 'none';
    
    // Show success
    successSection.style.display = 'block';
    statusText.textContent = 'Connected!';
    document.querySelector('.spinner').style.display = 'none';
    
    // Disable start button
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
});

socket.on('error', (data) => {
    errorSection.style.display = 'block';
    errorText.textContent = data.message;
    statusText.textContent = 'Error occurred';
    document.querySelector('.spinner').style.display = 'none';
});

socket.on('logged-out', (data) => {
    resetForm();
    alert('Session logged out from WhatsApp');
});

// Start connection
startBtn.addEventListener('click', async () => {
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }
    
    // Validate phone number (basic check)
    if (!/^\d{10,15}$/.test(phoneNumber)) {
        alert('Please enter a valid phone number (10-15 digits)');
        return;
    }
    
    // Generate a session ID
    currentSessionId = `session_${Date.now()}`;
    
    // Show status section
    statusSection.style.display = 'block';
    
    // Reset displays
    pairingCodeSection.style.display = 'none';
    qrSection.style.display = 'none';
    successSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Show spinner
    document.querySelector('.spinner').style.display = 'block';
    statusText.textContent = 'Connecting to WhatsApp...';
    
    try {
        const response = await fetch('/api/start-pairing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                sessionId: currentSessionId
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to start pairing');
        }
        
        console.log('Session started:', data);
        
    } catch (error) {
        console.error('Error:', error);
        statusText.textContent = 'Connection failed';
        document.querySelector('.spinner').style.display = 'none';
        errorSection.style.display = 'block';
        errorText.textContent = error.message;
    }
});

// Reset form function
function resetForm() {
    currentSessionId = null;
    statusSection.style.display = 'none';
    pairingCodeSection.style.display = 'none';
    qrSection.style.display = 'none';
    successSection.style.display = 'none';
    errorSection.style.display = 'none';
    phoneInput.value = '';
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
}

// Allow Enter key to submit
phoneInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startBtn.click();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (currentSessionId) {
        fetch(`/api/disconnect/${currentSessionId}`, {
            method: 'POST'
        }).catch(console.error);
    }
});
