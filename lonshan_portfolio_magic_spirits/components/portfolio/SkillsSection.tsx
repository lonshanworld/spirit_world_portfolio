'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { SKILLS } from '../../data/portfolio_data';

export function SkillsSection() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  return (
    <section id="elemental-archive" aria-label="Creator's skills" className="relative py-16 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          className="absolute right-1/4 top-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: config?.accentColor, opacity: 0.04 }}
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Location header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-[11px] sm:text-xs font-bold tracking-[0.28em] sm:tracking-[0.5em] uppercase mb-3"
            style={{ color: config?.accentColor }}
          >
            ✦ Creator&apos;s Skills
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-3"
            style={{ color: config?.textColor, textShadow: `0 0 30px ${config?.glowColor}` }}
          >
            Skills
          </h2>
          <p
            className="text-sm font-light tracking-wide max-w-md mx-auto"
            style={{ color: config?.subtextColor, opacity: 0.65 }}
          >
            Technologies and disciplines mastered across every project
          </p>
        </motion.div>

        {/* Discipline tablets */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {SKILLS.map((cat, ci) => (
            <motion.div
              key={cat.label}
              className="relative rounded-2xl p-4 sm:p-6 flex flex-col gap-5 overflow-hidden min-w-0"
              style={{
                background: config?.cardBg,
                border: `1px solid ${config?.cardBorder}`,
                boxShadow: `0 0 24px ${config?.glowColor}2A`,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: ci * 0.15, duration: 0.6 }}
            >
              {/* Tablet ambient glow line */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-6 right-6 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${config?.primaryColor}66, transparent)` }}
              />

              {/* Discipline label */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0" aria-hidden="true">{cat.symbol}</span>
                <h3
                  className="text-sm sm:text-base font-bold tracking-wide uppercase break-words min-w-0"
                  style={{ color: config?.textColor }}
                >
                  {cat.label}
                </h3>
              </div>

              {/* Elemental energy channels */}
              <div className="flex flex-col gap-4">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex justify-between gap-3 mb-1.5 min-w-0">
                      <span
                        className="text-sm font-medium min-w-0 break-words"
                        style={{ color: config?.subtextColor }}
                      >
                        {skill.name}
                      </span>
                      <span
                        className="text-xs font-bold tracking-wider"
                        style={{ color: config?.primaryColor }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                    {/* Energy channel */}
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: `${config?.primaryColor}1A` }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${config?.primaryColor}, ${config?.accentColor})`,
                          boxShadow: `0 0 10px ${config?.glowColor}`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.1 + si * 0.08 + 0.3, duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

 
