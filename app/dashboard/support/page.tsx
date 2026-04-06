import Link from 'next/link';

export default function Support() {
  const faqs = [
    {
      q: 'How long does it take for my bot to go online?',
      a: 'Your bot should be online within 30 seconds after scanning the QR code.',
    },
    {
      q: 'Can I deploy multiple bots?',
      a: 'Yes! Your subscription determines how many concurrent bots you can run. Free tier allows 1, Weekly/Monthly increase this.',
    },
    {
      q: 'What happens if my bot goes offline?',
      a: 'Rescan the QR code or check your internet connection. Contact support for persistent issues.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'No refunds or reversals. Please ensure correct details before payment.',
    },
    {
      q: 'Can I edit my bot after deployment?',
      a: 'Yes, you can edit bot settings, commands, and configurations from your dashboard.',
    },
    {
      q: 'What if I forget my bot password?',
      a: 'Contact support via WhatsApp and we can help reset your credentials.',
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">🆘 Support Center</h1>
      <p className="text-gray-600 mb-12">Find answers to common questions and get help</p>

      {/* FAQ */}
      <div className="card bg-white p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details key={i} className="group border-b pb-4 last:border-b-0">
              <summary className="cursor-pointer font-semibold text-gray-800 group-open:text-purple-600 transition flex justify-between items-center">
                <span>{item.q}</span>
                <span className="text-purple-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: '💬',
            title: 'Live Chat',
            description: 'Chat with our support team in real-time',
            action: 'Start Chat',
          },
          {
            icon: '📧',
            title: 'Email Support',
            description: 'Email us for detailed assistance',
            action: 'Send Email',
            href: 'mailto:support@mzazixmd.com',
          },
          {
            icon: '📱',
            title: 'WhatsApp',
            description: 'Get instant help via WhatsApp',
            action: 'Message Us',
            href: 'https://wa.me/254750611309',
          },
        ].map((option, i) => (
          <div key={i} className="card bg-white p-8 text-center hover:shadow-card-hover transition-all">
            <div className="text-5xl mb-4">{option.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h3>
            <p className="text-gray-600 mb-6">{option.description}</p>
            <Link href={option.href || '#'}>
              <button className="btn-primary w-full">{option.action}</button>
            </Link>
          </div>
        ))}
      </div>

      {/* Troubleshooting */}
      <div className="card bg-amber-50 p-8 mt-12 border-l-4 border-amber-500">
        <h3 className="text-xl font-bold text-amber-900 mb-4">🔧 Troubleshooting</h3>
        <ul className="space-y-3 text-amber-900">
          <li>
            <strong>Bot not responding:</strong> Check if the bot is marked as "active" in your dashboard
          </li>
          <li>
            <strong>QR code won't scan:</strong> Make sure your WhatsApp is up to date
          </li>
          <li>
            <strong>Payment failed:</strong> Verify your card details and try again
          </li>
          <li>
            <strong>Session error:</strong> Rescan the QR code or redeploy the bot
          </li>
        </ul>
      </div>
    </div>
  );
}