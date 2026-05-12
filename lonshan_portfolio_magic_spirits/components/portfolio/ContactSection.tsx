'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { CONTACT_LINKS } from '../../data/portfolio_data';

// Animated SVG summoning circle
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
      {/* Outer rotating ring */}
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
      {/* Inner counter-rotating ring */}
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
      {/* Innermost pulsing circle */}
      <motion.circle
        r={34}
        fill="none"
        stroke={p}
        strokeWidth={0.4}
        strokeOpacity={0.5}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Cardinal rune marks */}
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
      {/* Center crystal */}
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

  return (
    <section id="void-portal" aria-label="Contact — get in touch" className="relative py-32 px-6">
      {/* Ambient glow */}
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
        {/* Location header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs font-bold tracking-[0.5em] uppercase mb-3"
            style={{ color: config?.accentColor }}
          >
            ✦ Get In Touch
          </p>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: config?.textColor, textShadow: `0 0 30px ${config?.glowColor}` }}
          >
            Contact
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: config?.subtextColor, opacity: 0.65 }}
          >
            Open to new opportunities. Send a message and let's talk.
          </p>
        </motion.div>

        {/* Summoning circle */}
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

        {/* Invocation links */}
        <motion.div
          className="flex flex-col gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {CONTACT_LINKS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
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
              <span className="text-2xl" aria-hidden="true">{c.symbol}</span>
              <div className="text-left">
                <div
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: config?.accentColor }}
                >
                  {c.label}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: config?.subtextColor }}
                >
                  {c.value}
                </div>
              </div>
              <span
                className="ml-auto text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: config?.primaryColor }}
                aria-hidden="true"
              >
                →
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* World closing inscription */}
        <motion.p
          className="text-xs tracking-widest uppercase"
          style={{ color: config?.subtextColor, opacity: 0.35 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.35 }}
          viewport={{ once: true }}
        >
          The spirits remember every visitor
        </motion.p>
      </div>
    </section>
  );
}

