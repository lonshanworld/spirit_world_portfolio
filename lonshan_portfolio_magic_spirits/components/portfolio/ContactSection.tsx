'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { CONTACT_LINKS } from '../../data/portfolio_data';

function SummoningCircle({ primaryColor, accentColor, glowColor }: {
  primaryColor: string | undefined;
  accentColor: string | undefined;
  glowColor: string | undefined;
}) {
  const p = primaryColor ?? '#888';
  const a = accentColor ?? '#666';

  const runePoints = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: 72 * Math.cos(rad), y: 72 * Math.sin(rad) };
  });

  return (
    <svg
      aria-hidden="true"
      viewBox="-90 -90 180 180"
      className="w-48 h-48"
      style={{ filter: `drop-shadow(0 0 12px ${glowColor ?? p}44)` }}
    >
      <motion.circle
        r={72}
        fill="none"
        stroke={p}
        strokeWidth={0.6}
        strokeDasharray="5 9"
        style={{ originX: '50%', originY: '50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />
      <motion.circle
        r={52}
        fill="none"
        stroke={a}
        strokeWidth={0.5}
        strokeDasharray="3 7"
        style={{ originX: '50%', originY: '50%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />
      <motion.circle
        r={34}
        fill="none"
        stroke={p}
        strokeWidth={0.4}
        strokeOpacity={0.5}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {runePoints.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={i % 2 === 0 ? 2.5 : 1.5}
          fill={i % 2 === 0 ? p : a}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
      <motion.circle
        r={4}
        fill={p}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export function ContactSection() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  const [formData, setFormData] = useState({ email: '', title: '', description: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyContactValue = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 1500);
    } catch {
      setCopiedField(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: string[] = [];
    if (!formData.email.trim()) {
      validationErrors.push('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.push('Please provide a valid email.');
    }
    if (!formData.title.trim() && !formData.description.trim()) {
      validationErrors.push('Please provide a subject or message.');
    }
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setStatus('sending');
    setMessage('');
    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';
      if (!accessKey) {
        setStatus('error');
        setMessage('Form is not configured. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY.');
        return;
      }

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          from_email: formData.email,
          subject: formData.title || 'New message from portfolio',
          message: formData.description || formData.title,
          email: formData.email,
          title: formData.title,
          description: formData.description,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setMessage('Message sent successfully. Thank you.');
        setFormData({ email: '', title: '', description: '' });
      } else {
        setStatus('error');
        setMessage('Failed to send message. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again or email directly.');
    }
  };

  return (
    <section id="void-portal" aria-label="Contact - get in touch" className="relative py-16 sm:py-28 px-4 sm:px-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        <motion.div
          className="rounded-full blur-3xl"
          style={{ width: '50vw', height: '50vh', background: config?.primaryColor, opacity: 0.05 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-[11px] sm:text-xs font-bold tracking-[0.28em] sm:tracking-[0.5em] uppercase mb-3"
            style={{ color: config?.accentColor }}
          >
            Get In Touch
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
            style={{ color: config?.textColor, textShadow: `0 0 30px ${config?.glowColor}` }}
          >
            Contact
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: config?.subtextColor, opacity: 0.85 }}
          >
            Open to new opportunities. Send a message and let&apos;s talk.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <SummoningCircle
            primaryColor={config?.primaryColor}
            accentColor={config?.accentColor}
            glowColor={config?.glowColor}
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {CONTACT_LINKS.map((c, i) => (
            <motion.div
              key={c.label}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] group min-w-0"
              style={{
                background: config?.cardBg,
                border: `1px solid ${config?.cardBorder}`,
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i + 0.4 }}
              whileHover={{
                boxShadow: `0 0 24px ${config?.glowColor}`,
                borderColor: config?.primaryColor,
              }}
            >
              <span className="text-xl sm:text-2xl shrink-0" aria-hidden="true">{c.symbol}</span>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-left flex-1 min-w-0"
              >
                <div
                  className="text-[11px] sm:text-xs font-bold tracking-widest uppercase"
                  style={{ color: config?.accentColor }}
                >
                  {c.label}
                </div>
                <div
                  className="text-xs sm:text-sm font-medium break-all"
                  style={{ color: config?.subtextColor }}
                >
                  {c.value}
                </div>
              </a>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyContactValue(c.label, c.value)}
                  className="text-[11px] sm:text-xs px-2 py-1 rounded-md border transition-colors"
                  style={{
                    borderColor: config?.cardBorder,
                    color: copiedField === c.label ? '#86efac' : config?.subtextColor,
                    background: copiedField === c.label ? 'rgba(134, 239, 172, 0.12)' : 'transparent',
                  }}
                  aria-label={`Copy ${c.label}`}
                >
                  {copiedField === c.label ? 'Copied' : 'Copy'}
                </button>
                <span
                  className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: config?.primaryColor }}
                  aria-hidden="true"
                >
                  {'->'}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="text-left rounded-2xl p-4 sm:p-5 border mb-10 space-y-4"
          style={{ background: config?.cardBg, borderColor: config?.cardBorder }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold" style={{ color: config?.textColor }}>
            Send Message
          </h3>
          <label htmlFor="contact-email" className="text-xs font-semibold tracking-wide uppercase" style={{ color: config?.accentColor }}>
            Your email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-lg px-3 py-2 text-sm bg-black/20 border outline-none"
            style={{ borderColor: config?.cardBorder, color: config?.textColor }}
            disabled={status === 'sending'}
          />
          <label htmlFor="contact-subject" className="text-xs font-semibold tracking-wide uppercase" style={{ color: config?.accentColor }}>
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="What would you like to discuss?"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            className="w-full rounded-lg px-3 py-2 text-sm bg-black/20 border outline-none"
            style={{ borderColor: config?.cardBorder, color: config?.textColor }}
            disabled={status === 'sending'}
          />
          <label htmlFor="contact-message" className="text-xs font-semibold tracking-wide uppercase" style={{ color: config?.accentColor }}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            placeholder="Share your project, role, or opportunity details"
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="w-full rounded-lg px-3 py-2 text-sm bg-black/20 border outline-none resize-none"
            style={{ borderColor: config?.cardBorder, color: config?.textColor }}
            disabled={status === 'sending'}
          />
          {errors.length > 0 && (
            <div className="text-sm space-y-1" style={{ color: '#fca5a5' }}>
              {errors.map((err) => (
                <p key={err}>- {err}</p>
              ))}
            </div>
          )}
          {message && (
            <p className="text-sm" style={{ color: status === 'success' ? '#86efac' : '#fca5a5' }}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${config?.primaryColor}, ${config?.accentColor})`,
              color: '#000',
            }}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>

        <motion.p
          className="text-xs tracking-widest uppercase"
          style={{ color: config?.subtextColor, opacity: 0.55 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.55 }}
          viewport={{ once: true }}
        >
          The spirits remember every visitor
        </motion.p>
      </div>
    </section>
  );
}
