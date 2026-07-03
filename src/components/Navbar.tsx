import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Mail } from 'lucide-react'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KO' },
  { code: 'ja', label: 'JA' },
  { code: 'zh', label: 'ZH' },
]
const CONTACT_EMAIL = 'yoonseukoh@gmail.com'
const CONTACT_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent('홈페이지를 보고 연락드립니다')}&body=${encodeURIComponent('안녕하세요, Yoon님.\n\n홈페이지를 보고 연락드립니다.\n')}`

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const current = LANGS.find((lang) => i18n.language.startsWith(lang.code)) ?? LANGS[0]
  const navItems = [
    { key: 'home', href: '/' },
    { key: 'projects', href: '/projects' },
    { key: 'apps', href: '/apps' },
    { key: 'writing', href: '/writing' },
    { key: 'youtube', href: '/youtube' },
    { key: 'about', href: '/about' },
  ] as const

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setLangOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <nav className={`nav-bar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a className="brand-mark" href="/" aria-label="Yoon home">
          <span className="brand-symbol">Y</span>
          <span className="brand-text">Yoon Lab</span>
        </a>

        <div className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.key} href={item.href}>
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <div className="lang-switch" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setLangOpen((value) => !value)}>
              {current.label}
              <ChevronDown size={12} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  className="lang-menu"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
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

          <a
            className="nav-contact"
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t('nav.contact')}: ${CONTACT_EMAIL}`}
            title={`Send email to ${CONTACT_EMAIL}`}
          >
            <Mail size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </nav>
  )
}
