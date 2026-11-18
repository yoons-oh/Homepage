import { useTranslation } from 'react-i18next'
import { ArrowUpRight } from 'lucide-react'

const techs = ['React', 'TypeScript', 'Three.js', 'Firebase', 'Vercel', 'ComfyUI', 'AI Agents']

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="ab-section">
      <h2>{t('how.subtitle')}</h2>
      <div className="ab-body">
        <p>{t('about.p1')}</p>
        <p>{t('about.p2')}</p>
        <p className="ab-stack">{techs.join(', ')}</p>
        <a href="/about">
          {t('about.read_more')}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
