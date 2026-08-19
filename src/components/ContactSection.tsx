import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

const ContactCard3D = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
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
      className={`frosted-glass-card rounded-3xl p-4.5 sm:p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Direct Web3Forms submission to kzaid0997@gmail.com
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '64687595-5c1d-40aa-9a57-7977461877f0',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: 'Portfolio Contact Form (@zaidkhan0997)',
          subject: `New Message from ${formData.name} via Portfolio`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch {
      // Fallback
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-transparent py-20 border-b border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="inline-block rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-semibold text-rose-300 border border-rose-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            COLLABORATION &amp; INQUIRIES
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Get In Touch
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Have questions or want to collaborate on Android kernels, device trees, or low-level systems programming? Send a direct email to <span className="text-rose-300 font-mono font-semibold">kzaid0997@gmail.com</span> below!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 max-w-5xl mx-auto items-stretch">
          {/* Left Column: Fast Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-4.5">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 backdrop-blur-md shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">Location</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">Himachal Pradesh, India</p>
              </div>
            </ContactCard3D>

            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-4.5">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 backdrop-blur-md shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">Direct Email</p>
                <a
                  href="mailto:kzaid0997@gmail.com"
                  className="text-xs sm:text-sm font-bold text-white hover:text-rose-300 transition-colors truncate block"
                >
                  kzaid0997@gmail.com
                </a>
              </div>
            </ContactCard3D>

            <ContactCard3D className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-4.5">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 backdrop-blur-md shadow-sm">
                <Send className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">Telegram</p>
                <a href="https://t.me/zaidkhan0997" target="_blank" rel="noreferrer" className="text-xs sm:text-sm font-bold text-white hover:text-rose-300 transition-colors truncate block">
                  @zaidkhan0997
                </a>
              </div>
            </ContactCard3D>

            <ContactCard3D className="p-4 sm:p-4.5">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="h-4 w-4 text-rose-400 shrink-0" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Turnaround</h4>
              </div>
              <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                Active daily across GitHub, Telegram, and developer email channels.
              </p>
            </ContactCard3D>
          </div>

          {/* Right Column: Interactive Send Email Form */}
          <div className="lg:col-span-7 flex flex-col">
            <ContactCard3D className="flex-1 flex flex-col justify-between p-5 sm:p-7">
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <MessageSquare className="h-4.5 w-4.5 text-rose-300" />
                  Send Instant Message
                </h3>
                <p className="text-xs text-white/70">
                  Submitting this form delivers your message straight to <strong className="text-rose-300">kzaid0997@gmail.com</strong>.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-6 text-center space-y-2.5 my-auto"
                >
                  <CheckCircle2 className="h-10 w-10 text-rose-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Message Sent Successfully!</h4>
                  <p className="text-xs text-white/80">
                    Thank you! I will review your message and reply to your email address shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-white/30 backdrop-blur-md focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-white/30 backdrop-blur-md focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Inquiry about custom kernel trees, AOSP builds, or collaboration..."
                        className="w-full rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-white/30 backdrop-blur-md focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400/30 resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-600 active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </ContactCard3D>
          </div>
        </div>
      </div>
    </section>
  );
};
