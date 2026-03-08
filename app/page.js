export default function Home() {

return (

<div className="main">

<header className="navbar">
<h2>Mzazi Tech</h2>
<a href="/connect" className="navbtn">Connect Bot</a>
</header>


<section className="hero">

<h1>WhatsApp Bot Hosting</h1>

<p>
Connect your WhatsApp bot instantly using pairing code.
Simple, fast and secure.
</p>

<a href="/connect" className="connectbtn">
Start Connecting
</a>

</section>


<section className="features">

<div className="card">
<h3>⚡ Fast</h3>
<p>Instant bot connection using pairing code.</p>
</div>

<div className="card">
<h3>🤖 Multi Bot</h3>
<p>Run multiple bots without problems.</p>
</div>

<div className="card">
<h3>🔒 Secure</h3>
<p>Sessions stored safely on server.</p>
</div>

<div className="card">
<h3>🌐 Dashboard</h3>
<p>Manage bots easily through website.</p>
</div>

</section>


<footer className="footer">

<p>© 2026 Mzazi Tech Inc</p>

</footer>



<style jsx>{`

.main{
background:#0b0b0b;
color:white;
min-height:100vh;
font-family:Arial, Helvetica, sans-serif;
}


/* NAVBAR */

.navbar{
display:flex;
justify-content:space-between;
align-items:center;
padding:20px 40px;
border-bottom:1px solid #222;
}

.navbtn{
background:#00eaff;
padding:10px 18px;
color:black;
text-decoration:none;
border-radius:6px;
font-weight:bold;
}


/* HERO */

.hero{
text-align:center;
padding:100px 20px;
}

.hero h1{
font-size:50px;
margin-bottom:20px;
}

.hero p{
opacity:0.7;
margin-bottom:30px;
}

.connectbtn{
background:#00eaff;
padding:14px 28px;
color:black;
text-decoration:none;
border-radius:8px;
font-weight:bold;
}


/* FEATURES */

.features{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:20px;
padding:40px;
}

.card{
background:#111;
padding:25px;
border-radius:10px;
border:1px solid #222;
}

.card h3{
margin-bottom:10px;
}


/* FOOTER */

.footer{
text-align:center;
padding:30px;
border-top:1px solid #222;
opacity:0.6;
}

`}</style>


</div>

)

}
