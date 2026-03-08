const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const path = require("path")

async function startConnection(number){

const sessionPath = path.join("./sessions", number)

const { state, saveCreds } = await useMultiFileAuthState(sessionPath)

const sock = makeWASocket({
auth: state,
printQRInTerminal:false
})

sock.ev.on("creds.update", saveCreds)

const code = await sock.requestPairingCode(number)

return code

}

module.exports = { startConnection }