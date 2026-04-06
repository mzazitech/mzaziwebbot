'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const message = `📬 New Contact Form from MZAZI XMD:\n\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📌 Subject: ${formData.subject}\n\n💬 Message:\n${formData.message}`;

      window.open(
        `https://wa.me/254750611309?text=${encodeURIComponent(message)}`,
        '_blank'
      );

      toast.success('Opening WhatsApp. Send your message there!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to open WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">📞 Contact Us</h1>
      <p className="text-gray-600 mb-12">Get in touch with our support team</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="card bg-white p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Describe your issue or question..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? '⏳ Opening...' : '📤 Send via WhatsApp'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card bg-white p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📱 WhatsApp</h3>
            <p className="text-gray-600 mb-4">Chat with us directly for fastest response</p>
            <a
              href="https://wa.me/254750611309"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Open WhatsApp
            </a>
          </div>

          <div className="card bg-white p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✉️ Email</h3>
            <p className="text-gray-700 font-medium">support@mzazixmd.com</p>
            <p className="text-gray-600 text-sm mt-2">Response within 24 hours</p>
          </div>

          <div className="card bg-white p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🕐 Business Hours</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Weekdays:</strong> 9:00 AM - 5:00 PM EAT
              </p>
              <p>
                <strong>Weekends:</strong> 10:00 AM - 3:00 PM EAT
              </p>
              <p className="text-sm text-gray-600 mt-3">
                We respond to all inquiries within 24 hours
              </p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 p-8 border-l-4 border-purple-500">
            <h3 className="text-lg font-bold text-purple-900 mb-3">💡 Pro Tip</h3>
            <p className="text-purple-900 text-sm">
              WhatsApp is the fastest way to reach us. Most inquiries are resolved within 1 hour!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}