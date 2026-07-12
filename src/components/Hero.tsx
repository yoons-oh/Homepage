import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowUpRight, BadgeCheck, Layers3, Rocket, Sparkles } from 'lucide-react'
import aiBuilderLab from '../assets/hero-portfolio/ai-builder-lab.png'
import creatorWorkspace from '../assets/hero-portfolio/creator-workspace.png'

const YOUTUBE_URL = 'https://www.youtube.com/channel/UC7QwAF2w5n0hMpWLdwymDAA'
const trustItems = [
  { label: 'Kids English', href: '/apps' },
  { label: 'Daily Math', href: '/apps' },
  { label: 'Daily English', href: '/apps' },
  { label: 'Photo Reader', href: '/apps' },
  { label: 'Market Snapshot', href: YOUTUBE_URL, external: true },
  { label: 'Web Novel', href: '/writing' },
]

export default function Hero() {
  const { t } = useTranslation()
  const contactUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=yoonseukoh@gmail.com&su=${encodeURIComponent(t('contact.email_subject'))}&body=${encodeURIComponent(t('contact.email_body'))}`

  return (
    <section id="top" className="portfolio-hero">
      <div className="portfolio-kicker">
        <div>
          <span>{t('hero.badge')}</span>
          <p>{t('hero.long_sub')}</p>
        </div>
        <div className="hero-quick-actions">
          <a className="hero-mail-link" href={contactUrl} target="_blank" rel="noreferrer">
            {t('hero.contact')}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="hero-admin-link" href="/admin/login">
            {t('hero.admin')}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>

      <motion.h1
        className="portfolio-title"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48 }}
      >
        Portfolio
      </motion.h1>

      <div className="portfolio-visual-grid">
        <motion.a
          className="portfolio-image-card square"
          href="/apps"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <img src={aiBuilderLab} alt="" />
          <div className="visual-caption">
            <span>
              <Rocket size={15} aria-hidden="true" />
              AI Builder
            </span>
            <strong>{t('hero.visual_left')}</strong>
          </div>
        </motion.a>

        <motion.a
          className="portfolio-image-card wide"
          href="/projects"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <img src={creatorWorkspace} alt="" />
          <div className="visual-caption">
            <span>
              <Layers3 size={15} aria-hidden="true" />
              Yoon Lab
            </span>
            <strong>{t('hero.visual_right')}</strong>
          </div>
        </motion.a>
      </div>

      <div className="portfolio-strip" aria-label="Featured work">
        <a className="strip-summary" href="/projects">
          <BadgeCheck size={18} aria-hidden="true" />
          <strong>{t('hero.strip_count')}</strong>
          <span>{t('hero.strip_desc')}</span>
        </a>
        {trustItems.map((item) => (
          <a key={item.label} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
            <Sparkles size={14} aria-hidden="true" />
            {item.label}
          </a>
        ))}
      </div>
    </section>
  )
}
