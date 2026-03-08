"use client"

import { useState } from "react"

export default function Home() {

const [pairingNumber, setPairingNumber] = useState("")
const [ownerNumber, setOwnerNumber] = useState("")
const [pairingCode, setPairingCode] = useState("")
const [loading, setLoading] = useState(false)

const connectBot = async () => {

if (!pairingNumber || !ownerNumber) {
alert("Fill all fields")
return
}

setLoading(true)

try {

const res = await fetch("/api/connect", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
pairingNumber,
ownerNumber
})
})

const data = await res.json()

if (data.code) {
setPairingCode(data.code)
}

} catch (err) {
console.log(err)
alert("Error connecting bot")
}

setLoading(false)
}

return (

<div className="container">

<h1>Mzazi WhatsApp Bot</h1>

<p>Enter numbers below to generate pairing code</p>

<div className="form">

<input
type="text"
placeholder="Pairing Number"
value={pairingNumber}
onChange={(e)=>setPairingNumber(e.target.value)}
/>

<input
type="text"
placeholder="Owner Number"
value={ownerNumber}
onChange={(e)=>setOwnerNumber(e.target.value)}
/>

<button onClick={connectBot}>
{loading ? "Connecting..." : "Generate Pairing Code"}
</button>

</div>

{pairingCode && (

<div className="codeBox">

<h2>Pairing Code</h2>

<div className="code">
{pairingCode}
</div>

<p>Enter this code on WhatsApp to connect bot</p>

</div>

)}

</div>

)

}
