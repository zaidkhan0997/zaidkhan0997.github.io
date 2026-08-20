import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, MessageSquare, ShieldCheck, MapPin, UploadCloud, X, FileCode2, Paperclip } from 'lucide-react';

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
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 768) return;
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
  const [attachment, setAttachment] = useState<{
    name: string;
    content: string; // base64 string
    size: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    // Max 8MB file size limit
    const MAX_SIZE_BYTES = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage('File size exceeds 8MB limit. Please attach a smaller file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Content = result.includes(',') ? result.split(',')[1] : result;
      setAttachment({
        name: file.name,
        content: base64Content,
        size: file.size,
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop();
    return ext ? ext.toUpperCase().slice(0, 4) : 'FILE';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      // Secure Cloudflare Worker endpoint connected to Brevo
      const res = await fetch('https://portfolio-contact-api.zaidkhan0997.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          attachment: attachment
            ? {
                name: attachment.name,
                content: attachment.content,
              }
            : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        // Automatically return form to normal after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setErrorMessage(data?.error?.message || 'Failed to send message. Please try again or email directly.');
      }
    } catch {
      setErrorMessage('Network error occurred. Please try again or email directly.');
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
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <ContactCard3D className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-4.5">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 backdrop-blur-md shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider">Location</p>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">Himachal Pradesh, India</p>
                </div>
              </ContactCard3D>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ContactCard3D className="p-4 sm:p-4.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="h-4 w-4 text-rose-400 shrink-0" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Turnaround</h4>
                </div>
                <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                  Active daily across GitHub, Telegram, and developer email channels.
                </p>
              </ContactCard3D>
            </motion.div>
          </div>

          {/* Right Column: Interactive Send Email Form */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
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
                  className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-6 text-center space-y-3 my-auto"
                >
                  <CheckCircle2 className="h-10 w-10 text-rose-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Message Sent Successfully!</h4>
                  <p className="text-xs text-white/80 max-w-sm mx-auto">
                    Thank you! I will review your message and reply to your email address shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500 hover:text-white transition-all font-ubuntu"
                    >
                      Send Another Message &rarr;
                    </button>
                  </div>
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
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Inquiry about custom kernel trees, AOSP builds, or collaboration..."
                        className="w-full rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-white/30 backdrop-blur-md focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400/30 resize-none"
                      />
                    </div>

                    {/* Modern Drag & Drop File Upload Zone */}
                    <div>
                      <label className="block text-[11px] font-semibold text-white/80 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                        <span>Attach File / Logs (Optional)</span>
                        <span className="text-[10px] text-rose-300/80 font-mono lowercase">max 8mb</span>
                      </label>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".log,.txt,.patch,.diff,.zip,.tar,.gz,.pdf,.png,.jpg,.jpeg,.json,.xml"
                      />

                      <AnimatePresence mode="wait">
                        {attachment ? (
                          /* Attached File Badge Card */
                          <motion.div
                            key="attached"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-rose-400/50 bg-rose-500/10 p-3 text-xs text-white backdrop-blur-md shadow-sm"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300">
                                <FileCode2 className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="rounded bg-rose-400/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-rose-300 uppercase">
                                    {getFileExtension(attachment.name)}
                                  </span>
                                  <p className="font-semibold truncate text-xs text-white">
                                    {attachment.name}
                                  </p>
                                </div>
                                <p className="text-[10px] text-white/60 font-mono mt-0.5">
                                  {formatFileSize(attachment.size)} &bull; <span className="text-emerald-400">Ready to send</span>
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={removeAttachment}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-all shrink-0"
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ) : (
                          /* Drag & Drop Upload Zone */
                          <motion.div
                            key="dropper"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ${
                              isDragging
                                ? 'border-rose-400 bg-rose-500/20 scale-[1.01] shadow-[0_0_20px_rgba(255,48,71,0.3)]'
                                : 'border-white/20 bg-white/[0.02] hover:border-rose-400/60 hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-white/80 group-hover:text-rose-300 transition-colors">
                              <UploadCloud className={`h-5 w-5 text-rose-400 transition-transform duration-200 group-hover:-translate-y-0.5 ${isDragging ? 'scale-125' : ''}`} />
                              <span className="text-xs font-semibold">
                                {isDragging ? 'Drop file here to attach' : 'Drag & drop file or log here, or click to browse'}
                              </span>
                            </div>
                            <p className="mt-1 text-[10px] text-white/50 group-hover:text-white/70 transition-colors">
                              Supports .log, .patch, .zip, .tar, .pdf, images (Max 8MB)
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5 text-center">
                      {errorMessage}
                    </p>
                  )}

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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
