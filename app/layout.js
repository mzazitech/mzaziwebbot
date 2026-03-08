import "./globals.css"

export const metadata = {
title: "Mzazi Bot",
description: "WhatsApp Bot Connector"
}

export default function RootLayout({ children }) {
return (
<html lang="en">
<body>
{children}
</body>
</html>
)
}
