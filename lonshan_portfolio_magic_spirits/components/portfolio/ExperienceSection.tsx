'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { EXPERIENCES } from '../../data/portfolio_data';

export function ExperienceSection() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  return (
    <section id="chronicle-hall" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden" aria-label="Work history">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.28em] sm:tracking-[0.5em] uppercase mb-3" style={{ color: config?.accentColor }}>
            Career Chronicle
          </p>
          <h2 className="text-3xl sm:text-4xl font-black" style={{ color: config?.textColor }}>
            Work History
          </h2>
        </motion.div>

        <div className="space-y-6">
          {EXPERIENCES.map((exp, i) => (
            <motion.article
              key={`${exp.company}-${exp.period}`}
              className="rounded-2xl p-4 sm:p-6 border min-w-0 overflow-hidden"
              style={{ background: config?.cardBg, borderColor: config?.cardBorder }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <h3 className="text-lg sm:text-xl font-bold min-w-0 break-words" style={{ color: config?.textColor }}>
                  {exp.role}
                </h3>
                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase break-words" style={{ color: config?.primaryColor }}>
                  {exp.period}
                </span>
              </div>
              <p className="text-sm font-semibold mb-3 break-words" style={{ color: config?.accentColor }}>
                {exp.company}
              </p>
              <p className="text-sm leading-relaxed mb-3 break-words" style={{ color: config?.subtextColor }}>
                {exp.description}
              </p>
              <ul className="space-y-1.5">
                {exp.bullets.map((b) => (
                  <li key={b} className="text-sm break-words" style={{ color: config?.subtextColor }}>
                    - {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
