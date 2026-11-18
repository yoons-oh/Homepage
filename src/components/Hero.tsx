import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { SHAPES } from '../lib/shapes'

const ParticleScene = lazy(() => import('./ParticleScene'))
const CONTACT_EMAIL = 'yoonseukoh@gmail.com'

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  } catch {
    return false
  }
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function StaticOrb() {
  return <div className="px-orb" aria-hidden="true" />
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia?.(query).matches ?? false)
  useEffect(() => {
    const list = window.matchMedia?.(query)
    if (!list) return
    const onChange = () => setMatch(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])
  return match
}

export default function Hero() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(true)
  const [webgl] = useState(hasWebGL)
  const [shape, setShape] = useState(0)
  const [requested, setRequested] = useState({ index: 0, nonce: 0 })
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  const narrow = useMedia('(max-width: 760px)')
  const contactUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(t('contact.email_subject'))}&body=${encodeURIComponent(t('contact.email_body'))}`
  const request = (index: number) => setRequested((prev) => ({ index, nonce: prev.nonce + 1 }))

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="top" className="px-hero" ref={sectionRef}>
      <div className="px-stage" onClick={() => webgl && request((shape + 1) % SHAPES.length)}>
        {webgl ? (
          <SceneBoundary fallback={<StaticOrb />}>
            <Suspense fallback={<StaticOrb />}>
              <ParticleScene
                active={inView}
                reducedMotion={reducedMotion}
                narrow={narrow}
                requested={requested}
                onShape={setShape}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          <StaticOrb />
        )}
      </div>

      <motion.h1
        className="px-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {t('hero.gen_title1')}
        <br />
        {t('hero.gen_title2')}
      </motion.h1>

      <motion.div
        className="px-side"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <p>{t('hero.prism_sub')}</p>
        <div className="px-links">
          <a href="#work">
            {t('hero.cta_work')}
            <ArrowDown size={15} aria-hidden="true" />
          </a>
          <a href={contactUrl} target="_blank" rel="noreferrer">
            {t('hero.contact')}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </motion.div>

      {webgl && (
        <div className="px-steps" role="tablist" aria-label={t('hero.gen_steps_label')}>
          {SHAPES.map((key, index) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={shape === index}
              className={shape === index ? 'is-active' : ''}
              onClick={() => request(index)}
            >
              {t(`hero.shape_${key}`)}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
