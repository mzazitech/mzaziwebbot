"use client"
import { useState } from "react"

export default function ConnectBot(){

const [owner,setOwner] = useState("")
const [number,setNumber] = useState("")
const [pairing,setPairing] = useState("")
const [loading,setLoading] = useState(false)

async function connectBot(){

setLoading(true)

const res = await fetch("/api/connect",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({ owner, number })
})

const data = await res.json()

setPairing(data.code)
setLoading(false)

}

return(

<div style={{padding:"40px",fontFamily:"sans-serif"}}>

<h1>Connect Your WhatsApp Bot</h1>

<br/>

<input
placeholder="Owner Number"
onChange={(e)=>setOwner(e.target.value)}
style={{padding:"10px",width:"300px"}}
/>

<br/><br/>

<input
placeholder="Pairing Number"
onChange={(e)=>setNumber(e.target.value)}
style={{padding:"10px",width:"300px"}}
/>

<br/><br/>

<button
onClick={connectBot}
style={{
padding:"10px 20px",
background:"black",
color:"white",
border:"none"
}}
>
{loading ? "Connecting..." : "Connect Bot"}
</button>

<br/><br/>

{pairing && (
<div>

<h2>Pairing Code</h2>

<h1 style={{letterSpacing:"5px"}}>
{pairing}
</h1>

<p>
Open WhatsApp → Linked Devices → Enter Code
</p>

</div>
)}

</div>

)
}