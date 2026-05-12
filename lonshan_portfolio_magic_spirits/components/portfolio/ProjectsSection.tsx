'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { PROJECTS } from '../../data/portfolio_data';

// Corner rune marks — transforms a card into an artifact panel
function ArtifactCorners({ color }: { color: string | undefined }) {
  const c = color ?? '#888';
  return (
    <>
      <svg aria-hidden="true" className="absolute top-3 left-3 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M1 9 L1 1 L9 1" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
      </svg>
      <svg aria-hidden="true" className="absolute top-3 right-3 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M15 9 L15 1 L7 1" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
      </svg>
      <svg aria-hidden="true" className="absolute bottom-3 left-3 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M1 7 L1 15 L9 15" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
      </svg>
      <svg aria-hidden="true" className="absolute bottom-3 right-3 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M15 7 L15 15 L7 15" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
      </svg>
    </>
  );
}

export function ProjectsSection() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  return (
    <section id="memory-garden" aria-label="Creator's projects" className="relative py-32 px-6">
      {/* Ambient section glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          className="absolute left-1/4 top-1/3 w-96 h-96 rounded-full blur-3xl"
          style={{ background: config?.primaryColor, opacity: 0.04 }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
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
            className="text-xs font-bold tracking-[0.5em] uppercase mb-3"
            style={{ color: config?.accentColor }}
          >
            ✦ Creator's Work
          </p>
          <h2
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ color: config?.textColor, textShadow: `0 0 30px ${config?.glowColor}` }}
          >
            Projects
          </h2>
          <p
            className="text-sm font-light tracking-wide max-w-md mx-auto"
            style={{ color: config?.subtextColor, opacity: 0.65 }}
          >
            A collection of real systems built and shipped
          </p>
        </motion.div>

        {/* Artifact grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.id}
              className="group relative rounded-2xl p-7 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              onClick={() => project.link ? window.open(project.link, '_blank', 'noopener,noreferrer') : undefined}
              style={{
                cursor: project.link ? 'pointer' : 'default',
                background: config?.cardBg,
                border: `1px solid ${config?.cardBorder}`,
                boxShadow: `0 0 0 0 ${config?.glowColor}`,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{
                boxShadow: `0 0 35px ${config?.glowColor}, 0 0 70px ${config?.glowColor}33`,
              }}
            >
              {/* Artifact corner runes */}
              <ArtifactCorners color={config?.primaryColor} />

              {/* Hover radiance */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${config?.primaryColor}1A, transparent 65%)`,
                }}
              />

              {/* Artifact glyph */}
              <div
                className="text-4xl w-12 h-12 flex items-center justify-center rounded-xl"
                style={{
                  background: `${config?.primaryColor}18`,
                  border: `1px solid ${config?.primaryColor}33`,
                  boxShadow: `0 0 16px ${config?.glowColor}44`,
                }}
                aria-hidden="true"
              >
                {project.symbol}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-xl font-bold leading-snug"
                    style={{ color: config?.textColor }}
                  >
                    {project.title}
                  </h3>
                  {project.link && (
                    <span
                      aria-hidden="true"
                      className="text-xs opacity-0 group-hover:opacity-70 transition-opacity duration-300 mt-1 shrink-0"
                      style={{ color: config?.primaryColor }}
                    >
                      inspect →
                    </span>
                  )}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: config?.subtextColor }}
                >
                  {project.description}
                </p>
              </div>

              {/* Essence tags */}
              <div className="flex flex-wrap gap-2 mt-1" aria-label="Technologies">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: `${config?.primaryColor}1A`,
                      color: config?.primaryColor,
                      border: `1px solid ${config?.primaryColor}2E`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

