'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { EDUCATION, LANGUAGES } from '../../data/portfolio_data';

export function EducationSection() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  return (
    <section
      id="scholar-archives"
      aria-label="Education and languages"
      className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p
            className="text-[11px] sm:text-xs font-bold tracking-[0.28em] sm:tracking-[0.5em] uppercase mb-3"
            style={{ color: config?.accentColor }}
          >
            Scholar Archive
          </p>
          <h2 className="text-3xl sm:text-4xl font-black" style={{ color: config?.textColor }}>
            Education and Languages
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.article
            className="rounded-2xl p-4 sm:p-6 border"
            style={{ background: config?.cardBg, borderColor: config?.cardBorder }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: config?.textColor }}>
              Education
            </h3>
            <div className="space-y-4">
              {EDUCATION.map((item) => (
                <div key={`${item.degree}-${item.period}`} className="min-w-0">
                  <p className="text-base font-semibold break-words" style={{ color: config?.textColor }}>
                    {item.degree}
                  </p>
                  <p className="text-sm break-words" style={{ color: config?.accentColor }}>
                    {item.institution}
                  </p>
                  <p className="text-xs uppercase tracking-wider mt-1" style={{ color: config?.subtextColor, opacity: 0.9 }}>
                    {item.period}
                  </p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            className="rounded-2xl p-4 sm:p-6 border"
            style={{ background: config?.cardBg, borderColor: config?.cardBorder }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: config?.textColor }}>
              Languages
            </h3>
            <ul className="space-y-3">
              {LANGUAGES.map((lang) => (
                <li
                  key={`${lang.name}-${lang.level}`}
                  className="flex items-center justify-between gap-4 rounded-xl px-3 py-2"
                  style={{ background: `${config?.primaryColor}12`, border: `1px solid ${config?.primaryColor}30` }}
                >
                  <span className="text-sm font-semibold" style={{ color: config?.textColor }}>
                    {lang.name}
                  </span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: config?.primaryColor }}>
                    {lang.level}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
