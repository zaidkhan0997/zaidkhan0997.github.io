import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Github, Instagram, CheckCircle, Linkedin, Loader2 } from 'lucide-react';

export const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/kzaid0997@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Portfolio Message from ${formData.name} (${formData.email})`,
          _captcha: 'false',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Form submit failed');
      }
    } catch (err) {
      console.warn('Direct API submission failed, triggering mailto fallback:', err);
      window.location.href = `mailto:kzaid0997@gmail.com?subject=${encodeURIComponent(`Portfolio Inquiry from ${formData.name}`)}&body=${encodeURIComponent(`${formData.message}\n\nSender Email: ${formData.email}`)}`;
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-transparent py-20 border-b border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="inline-block rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400 border border-pink-500/20">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Contact & Collaboration
          </h2>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            Have questions or want to collaborate on Android kernels, device trees, or low-level systems programming? Send a direct email to <span className="text-cyan-400 font-mono font-semibold">kzaid0997@gmail.com</span> below!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Direct Contact Cards */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400">
                <Instagram className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Instagram</p>
                <a
                  href="https://www.instagram.com/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-white hover:text-pink-400 transition-colors"
                >
                  @zaidkhan0997
                </a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <Linkedin className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">LinkedIn Profile</p>
                <a
                  href="https://www.linkedin.com/in/zaid-khan-a74948212/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-white hover:text-blue-400 transition-colors"
                >
                  zaid-khan-a74948212
                </a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Mail className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Direct Inbox</p>
                <a href="mailto:kzaid0997@gmail.com" className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                  kzaid0997@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Send className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Telegram</p>
                <a href="https://t.me/zaidkhan0997" target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                  @zaidkhan0997
                </a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <Github className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">GitHub Profile</p>
                <a href="https://github.com/zaidkhan0997" target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-purple-400 transition-colors">
                  github.com/zaidkhan0997
                </a>
              </div>
            </motion.div>
          </div>

          {/* Interactive Live Email Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            className="rounded-2xl border border-white/10 bg-black/40 p-8 shadow-sm backdrop-blur-md"
          >
            <h3 className="text-xl font-bold text-white mb-2">Send a Direct Message</h3>
            <p className="text-xs text-white/60 mb-6">
              Submitting this form delivers your message straight to <strong className="text-cyan-400">kzaid0997@gmail.com</strong>.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-emerald-400">
                <CheckCircle className="h-12 w-12 animate-bounce text-emerald-400" />
                <p className="text-lg font-bold text-white">Message Delivered to Inbox!</p>
                <p className="text-xs text-white/60 max-w-xs">
                  Your message was sent directly to MOHD ZAID&apos;s email (kzaid0997@gmail.com). You will receive a reply soon!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="MOHD ZAID"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Let's build custom kernels together..."
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending to Inbox...</span>
                    </>
                  ) : (
                    <span>Send Message to Inbox &rarr;</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
