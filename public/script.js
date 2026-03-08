const socket = io();

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

let currentSessionId = null;

// Socket connection check
socket.on('connect', () => {
    console.log('✅ Connected to server');
    statusText.textContent = 'Connected to server';
});

socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
    statusText.textContent = 'Server connection failed';
    alert('Cannot connect to server. Make sure the server is running.');
});

socket.on('status', (data) => {
    console.log('Status:', data.message);
    statusText.textContent = data.message;
});

socket.on('pairing-code', (data) => {
    console.log('Pairing code received:', data);
    currentSessionId = data.sessionId;
    
    qrSection.style.display = 'none';
    pairingCodeSection.style.display = 'block';
    pairingCodeDisplay.textContent = data.formattedCode || data.code;
    
    document.querySelector('.spinner').style.display = 'none';
});

socket.on('qr-code', (data) => {
    console.log('QR code received');
    currentSessionId = data.sessionId;
    
    pairingCodeSection.style.display = 'none';
    qrSection.style.display = 'block';
    qrImage.src = data.qr;
    
    document.querySelector('.spinner').style.display = 'none';
});

socket.on('connected', (data) => {
    console.log('Connected successfully');
    currentSessionId = data.sessionId;
    
    pairingCodeSection.style.display = 'none';
    qrSection.style.display = 'none';
    successSection.style.display = 'block';
    
    document.querySelector('.spinner').style.display = 'none';
    startBtn.disabled = true;
});

socket.on('error', (data) => {
    console.error('Error:', data.message);
    errorSection.style.display = 'block';
    errorText.textContent = data.message;
    
    document.querySelector('.spinner').style.display = 'none';
});

// Start button click handler
startBtn.addEventListener('click', async () => {
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }
    
    if (!/^\d{10,15}$/.test(phoneNumber)) {
        alert('Please enter a valid phone number (10-15 digits)');
        return;
    }
    
    console.log('Starting pairing for:', phoneNumber);
    
    // Show status section
    statusSection.style.display = 'block';
    
    // Hide all result sections
    pairingCodeSection.style.display = 'none';
    qrSection.style.display = 'none';
    successSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Show spinner
    document.querySelector('.spinner').style.display = 'block';
    statusText.textContent = 'Starting connection...';
    
    try {
        const response = await fetch('/api/start-pairing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
        });
        
        const data = await response.json();
        console.log('Server response:', data);
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to start');
        }
        
        currentSessionId = data.sessionId;
        statusText.textContent = 'Waiting for pairing code...';
        
    } catch (error) {
        console.error('Fetch error:', error);
        document.querySelector('.spinner').style.display = 'none';
        errorSection.style.display = 'block';
        errorText.textContent = error.message;
    }
});

// Reset function
function resetForm() {
    currentSessionId = null;
    statusSection.style.display = 'none';
    pairingCodeSection.style.display = 'none';
    qrSection.style.display = 'none';
    successSection.style.display = 'none';
    errorSection.style.display = 'none';
    phoneInput.value = '';
    startBtn.disabled = false;
}

// Allow Enter key
phoneInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startBtn.click();
    }
});
