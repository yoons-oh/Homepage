import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { useCareerVisibility } from '../hooks/useCareerVisibility'
import { usePath } from '../lib/route'

const LANGS = [
  { code: 'ko', label: 'KO' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' },
  { code: 'zh', label: 'ZH' },
]
const CONTACT_EMAIL = 'yoonseukoh@gmail.com'

type NavChild = { key: string; href: string; fallback: string }
type NavGroup = { key: string; href: string; fallback: string; children?: NavChild[] }

function buildGroups(careerOpen: boolean): NavGroup[] {
  return [
    {
      key: 'work',
      href: '/projects',
      fallback: 'Work',
      children: [
        { key: 'all', href: '/projects', fallback: 'All' },
        { key: 'apps', href: '/apps', fallback: 'Apps' },
        { key: 'youtube', href: '/youtube', fallback: 'YouTube' },
        { key: 'instagram', href: '/instagram', fallback: 'Instagram' },
        { key: 'writing', href: '/writing', fallback: 'Writing' },
      ],
    },
    {
      key: 'lab',
      href: '/ai-video',
      fallback: 'Lab',
      children: [
        { key: 'ai_video', href: '/ai-video', fallback: 'AI Video' },
        { key: 'testers', href: '/testers', fallback: 'Testers' },
      ],
    },
    {
      key: 'about',
      href: '/about',
      fallback: 'About',
      children: careerOpen
        ? [
            { key: 'about', href: '/about', fallback: 'About' },
            { key: 'career', href: '/career', fallback: 'Career' },
          ]
        : undefined,
    },
    { key: 'restaurants', href: '/restaurants', fallback: 'Food' },
  ]
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isOpen: careerOpen } = useCareerVisibility()
  const path = usePath()
  const groups = buildGroups(careerOpen)
  const current = LANGS.find((lang) => i18n.language?.startsWith(lang.code)) ?? LANGS[1]
  const contactUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(t('contact.email_subject'))}&body=${encodeURIComponent(t('contact.email_body'))}`
  const label = (key: string, fallback: string) => t(`nav.${key}`, { defaultValue: fallback })
  const isActive = (group: NavGroup) =>
    group.href === path || (group.children ?? []).some((child) => child.href === path)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setLangOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <nav className={`rn-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="rn-nav-inner">
        <a className="rn-brand" href="/" aria-label="Yoon Lab home">
          <span className="rn-brand-symbol">Y</span>
          <span className="rn-brand-text">Yoon Lab</span>
        </a>

        <div className="rn-links" aria-label="Primary navigation">
          {groups.map((group) => (
            <div className={`rn-link-group ${isActive(group) ? 'is-active' : ''}`} key={group.key}>
              <a href={group.href} className="rn-link">
                {label(group.key, group.fallback)}
                {group.children && <ChevronDown size={13} aria-hidden="true" />}
              </a>
              {group.children && (
                <div className="rn-dropdown">
                  {group.children.map((child) => (
                    <a key={child.href} href={child.href} className={child.href === path ? 'is-current' : ''}>
                      {label(child.key, child.fallback)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rn-actions">
          <div className="rn-lang" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setLangOpen((value) => !value)} aria-label="Language">
              {current.label}
              <ChevronDown size={12} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  className="rn-lang-menu"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.14 }}
                >
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={current.code === lang.code ? 'active' : ''}
                      onClick={() => {
                        i18n.changeLanguage(lang.code)
                        setLangOpen(false)
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a className="rn-contact" href={contactUrl} target="_blank" rel="noreferrer" title={CONTACT_EMAIL}>
            {t('hero.contact')}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

          <button
            type="button"
            className="rn-menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="rn-sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {groups.map((group) => (
              <div className="rn-sheet-group" key={group.key}>
                <a href={group.href} className="rn-sheet-title">
                  {label(group.key, group.fallback)}
                </a>
                {group.children && (
                  <div className="rn-sheet-children">
                    {group.children.map((child) => (
                      <a key={child.href} href={child.href} className={child.href === path ? 'is-current' : ''}>
                        {label(child.key, child.fallback)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a className="rn-sheet-contact" href={contactUrl} target="_blank" rel="noreferrer">
              {t('hero.contact')} · {CONTACT_EMAIL}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
