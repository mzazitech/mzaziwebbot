export default function Home(){

return(

<div className="container">

{/* HERO */}

<div className="card" style={{textAlign:"center"}}>

<h1 className="title">
Mzazi Tech Bot Hosting
</h1>

<p style={{marginTop:"10px"}}>
Connect your WhatsApp bot instantly using pairing code.  
Fast, secure and reliable hosting.
</p>

<a href="/connect" className="linkbtn">
Connect Your Bot
</a>

</div>


{/* FEATURES */}

<div style={{marginTop:"40px"}}>

<h2 style={{marginBottom:"20px"}}>
Features
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"20px"
}}>

<div className="card">

<h3>⚡ Fast Connection</h3>

<p style={{marginTop:"10px"}}>
Connect your WhatsApp bot instantly using pairing code system.
</p>

</div>

<div className="card">

<h3>🤖 Multi Bot</h3>

<p style={{marginTop:"10px"}}>
Run multiple WhatsApp bots simultaneously with stable sessions.
</p>

</div>

<div className="card">

<h3>🔒 Secure</h3>

<p style={{marginTop:"10px"}}>
All sessions are securely stored and protected.
</p>

</div>

<div className="card">

<h3>🌐 Web Dashboard</h3>

<p style={{marginTop:"10px"}}>
Manage and monitor your bot directly from the website.
</p>

</div>

</div>

</div>


{/* COMMUNITY */}

<div className="card" style={{marginTop:"40px",textAlign:"center"}}>

<h2>Join Our Community</h2>

<p style={{marginTop:"10px"}}>
Stay updated with the latest features and updates.
</p>

<a
href="https://chat.whatsapp.com/C8pzXYhMJMyKbHMdehT9Yt"
className="linkbtn"
style={{marginTop:"20px"}}
>

Join WhatsApp Group

</a>

</div>


{/* FOOTER */}

<div style={{
marginTop:"40px",
textAlign:"center",
opacity:"0.6"
}}>

<p>
© 2026 Mzazi Tech Inc
</p>

</div>


</div>

)

}
