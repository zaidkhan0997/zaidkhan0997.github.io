import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Github, Instagram, CheckCircle, Linkedin, Loader2 } from 'lucide-react';

const ContactCard3D = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`rounded-3xl border border-white/20 bg-white/[0.03] p-4.5 sm:p-5 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)] hover:border-cyan-300/80 hover:bg-white/[0.09] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

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
          <span className="inline-block rounded-full bg-pink-400/20 px-3.5 py-1 text-xs font-semibold text-pink-300 border border-pink-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Contact & Collaboration
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Have questions or want to collaborate on Android kernels, device trees, or low-level systems programming? Send a direct email to <span className="text-cyan-300 font-mono font-semibold">kzaid0997@gmail.com</span> below!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Direct Contact Cards */}
          <div className="space-y-3.5 sm:space-y-4">
            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-pink-400/40 bg-white/[0.08] text-pink-300 backdrop-blur-md shadow-sm">
                <Instagram className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Instagram</p>
                <a
                  href="https://www.instagram.com/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-bold text-white hover:text-pink-300 transition-colors truncate block"
                >
                  @zaidkhan0997
                </a>
              </div>
            </ContactCard3D>

            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/40 bg-white/[0.08] text-blue-300 backdrop-blur-md shadow-sm">
                <Linkedin className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">LinkedIn Profile</p>
                <a
                  href="https://www.linkedin.com/in/zaid-khan-a74948212/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-bold text-white hover:text-blue-300 transition-colors truncate block"
                >
                  zaid-khan-a74948212
                </a>
              </div>
            </ContactCard3D>

            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-white/[0.08] text-cyan-300 backdrop-blur-md shadow-sm">
                <Mail className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Direct Inbox</p>
                <a href="mailto:kzaid0997@gmail.com" className="text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors truncate block">
                  kzaid0997@gmail.com
                </a>
              </div>
            </ContactCard3D>

            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-white/[0.08] text-cyan-300 backdrop-blur-md shadow-sm">
                <Send className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Telegram</p>
                <a href="https://t.me/zaidkhan0997" target="_blank" rel="noreferrer" className="text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors truncate block">
                  @zaidkhan0997
                </a>
              </div>
            </ContactCard3D>

            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-400/40 bg-white/[0.08] text-purple-300 backdrop-blur-md shadow-sm">
                <Github className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">GitHub Profile</p>
                <a href="https://github.com/zaidkhan0997" target="_blank" rel="noreferrer" className="text-xs sm:text-sm font-bold text-white hover:text-purple-300 transition-colors truncate block">
                  github.com/zaidkhan0997
                </a>
              </div>
            </ContactCard3D>
          </div>

          {/* Interactive Live Email Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            className="rounded-3xl border border-white/20 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)]"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Send a Direct Message</h3>
            <p className="text-xs text-white/70 mb-6">
              Submitting this form delivers your message straight to <strong className="text-cyan-300">kzaid0997@gmail.com</strong>.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-emerald-300">
                <CheckCircle className="h-12 w-12 animate-bounce text-emerald-300" />
                <p className="text-lg font-bold text-white">Message Delivered to Inbox!</p>
                <p className="text-xs text-white/70 max-w-xs">
                  Your message was sent directly to MOHD ZAID&apos;s email (kzaid0997@gmail.com). You will receive a reply soon!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="MOHD ZAID"
                    className="w-full rounded-2xl border border-white/20 bg-white/[0.05] px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/20 bg-white/[0.05] px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Let's build custom kernels together..."
                    className="w-full rounded-2xl border border-white/20 bg-white/[0.05] px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-3 text-xs font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-md"
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
