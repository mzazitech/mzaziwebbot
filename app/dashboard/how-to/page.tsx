export default function HowToLink() {
  const steps = [
    {
      step: 1,
      title: 'Deploy a Bot',
      description: 'Go to "My Bots" and click "Deploy New Bot"',
      icon: '📝',
      details: 'Fill in your bot name and WhatsApp number, then proceed to payment.',
    },
    {
      step: 2,
      title: 'Complete Payment',
      description: 'Pay 50 KSH via Paystack to activate your bot',
      icon: '💳',
      details: 'Use your debit card or mobile money. Transaction is instant.',
    },
    {
      step: 3,
      title: 'Scan QR Code',
      description: 'Scan the QR code with your WhatsApp phone',
      icon: '📱',
      details: 'Open WhatsApp on your phone and scan the displayed QR code.',
    },
    {
      step: 4,
      title: 'Confirm Connection',
      description: 'Confirm the connection on your WhatsApp device',
      icon: '✅',
      details: 'Accept the login request on your phone. Your bot is now active!',
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">📖 How to Link Your Bot</h1>
      <p className="text-gray-600 mb-12">Complete guide to get your WhatsApp bot online in 5 minutes</p>

      {/* Steps */}
      <div className="space-y-6 mb-12">
        {steps.map((item) => (
          <div key={item.step} className="card bg-white p-8 hover:shadow-card-hover transition-all">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold">
                  {item.step}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{item.details}</p>
              </div>
              <div className="text-5xl opacity-20 flex-shrink-0">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Section */}
      <div className="card bg-white p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📺 Video Tutorial</h2>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🎥</p>
            <p className="text-gray-700 font-semibold">Video tutorial coming soon</p>
            <p className="text-gray-600 text-sm mt-2">Check back later for step-by-step video guide</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card bg-white p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ Common Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I use multiple phone numbers?',
              a: 'Yes! Deploy multiple bots with different phone numbers. Your subscription determines how many.',
            },
            {
              q: 'What if my bot goes offline?',
              a: 'Check your internet connection and scan the QR code again. Contact support if issues persist.',
            },
            {
              q: 'Can I customize my bot commands?',
              a: 'Yes! Use custom commands in the bot settings to automate responses.',
            },
          ].map((item, i) => (
            <details key={i} className="group border-b pb-4">
              <summary className="cursor-pointer font-semibold text-gray-800 group-open:text-purple-600 transition">
                {item.q}
              </summary>
              <p className="text-gray-600 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
