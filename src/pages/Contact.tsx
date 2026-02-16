import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { db } from '../lib/database';
import { v4 as uuid } from 'uuid';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await db.messages.create({
      id: uuid(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      read: false,
      createdAt: new Date().toISOString(),
    });
    setSending(false);
    setSubmitted(true);
  };

  const inputClasses = "w-full bg-apex-black border border-apex-gray/30 rounded-lg px-4 py-3 text-sm text-white placeholder:text-apex-white-dim/50 transition-all";

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-apex-black-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-apex-orange text-xs font-bold uppercase tracking-widest mb-3">Get In Touch</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white">
              CONTACT <span className="text-gradient">US</span>
            </h1>
            <p className="text-apex-white-dim mt-4 max-w-2xl">
              Whether you're looking for your dream car or have questions about our services, 
              our team is here to help. Reach out anytime.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <ScrollReveal>
              <div className="space-y-6">
                <div className="card-premium bg-apex-black-light rounded-2xl p-6 border border-apex-gray/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apex-orange/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-apex-orange" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Visit Our Showroom</h3>
                      <p className="text-apex-white-dim text-sm">Jabbi Kunda, Nyambai Main Road</p>
                      <p className="text-apex-white-dim text-sm">Brikama – WCR, The Gambia</p>
                    </div>
                  </div>
                </div>

                <div className="card-premium bg-apex-black-light rounded-2xl p-6 border border-apex-gray/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apex-orange/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-apex-orange" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Call Us</h3>
                      <p className="text-apex-white-dim text-sm">+220 200 7261-KING</p>
                      <p className="text-apex-white-dim text-sm">Mon-Sat: 9AM - 8PM</p>
                    </div>
                  </div>
                </div>

                <div className="card-premium bg-apex-black-light rounded-2xl p-6 border border-apex-gray/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apex-orange/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-apex-orange" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Email Us</h3>
                      <p className="text-apex-white-dim text-sm">kingautos112@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={200}>
              <div className="lg:col-span-2 bg-apex-black-light rounded-2xl border border-apex-gray/30 p-8">
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-apex-white-dim">Thank you for reaching out. Our team will respond within 24 hours.</p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="mt-6 text-apex-orange font-semibold hover:underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-xl font-bold text-white mb-6">Send Us a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input required placeholder="Your Name *" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className={inputClasses} />
                        <input required type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inputClasses} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className={inputClasses} />
                        <input required placeholder="Subject *" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className={inputClasses} />
                      </div>
                      <textarea required placeholder="Your Message *" rows={6} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className={inputClasses} />
                      <button
                        type="submit"
                        disabled={sending}
                        className="btn-premium bg-gradient-premium text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                      >
                        {sending ? 'Sending...' : 'Send Message'}
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
