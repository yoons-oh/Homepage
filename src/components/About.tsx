import { useTranslation } from 'react-i18next'
import { ArrowUpRight, MapPin, Server, ShieldCheck, Workflow } from 'lucide-react'

const techs = ['React', 'TypeScript', 'Tailwind', 'Vercel', 'Supabase', 'AI Agents']

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="about-section">
      <div className="about-copy">
        <span>{t('about.title')}</span>
        <h2>
          Portfolio home for
          <br />
          real web/app tests.
        </h2>
        <p>{t('about.p1')}</p>
        <p>{t('about.p2')}</p>
        <div className="location-line">
          <MapPin size={14} aria-hidden="true" />
          {t('about.location')}
        </div>
        <a className="about-read-link" href="/about">
          {t('about.read_more')}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      <div className="about-panel">
        <div className="panel-row">
          <Workflow size={20} aria-hidden="true" />
          <div>
            <strong>Build flow</strong>
            <span>Idea, prototype, deploy, test</span>
          </div>
        </div>
        <div className="panel-row">
          <Server size={20} aria-hidden="true" />
          <div>
            <strong>Test targets</strong>
            <span>Web apps, mobile flows, data tools</span>
          </div>
        </div>
        <div className="panel-row">
          <ShieldCheck size={20} aria-hidden="true" />
          <div>
            <strong>Release habit</strong>
            <span>Small, visible, continuously improved</span>
          </div>
        </div>

        <div className="tech-cloud" aria-label="Technology stack">
          {techs.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
