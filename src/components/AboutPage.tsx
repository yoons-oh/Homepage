import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowUpRight, Layers3, Rocket, Sparkles, Workflow } from 'lucide-react'

const notes = [
  {
    icon: Rocket,
    key: 'fast',
  },
  {
    icon: Sparkles,
    key: 'detail',
  },
  {
    icon: Workflow,
    key: 'ai',
  },
]

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <main className="about-page">
      <div className="about-page-top">
        <a className="back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" />
          {t('common.home')}
        </a>
        <a className="primary-link" href="/#work">
          {t('about_page.work_link')}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>

      <section className="about-essay">
        <p className="eyebrow">{t('about_page.eyebrow')}</p>
        <h1>
          {t('about_page.headline1')}
          <span>{t('about_page.headline2')}</span>
        </h1>

        <div className="essay-body">
          <p>{t('about_page.body1')}</p>
          <p>{t('about_page.body2')}</p>
          <p>{t('about_page.body3')}</p>
        </div>
      </section>

      <section className="about-notes" aria-label={t('about_page.notes_aria')}>
        {notes.map((note) => {
          const Icon = note.icon
          return (
            <article className="about-note" key={note.key}>
              <Icon size={22} aria-hidden="true" />
              <h2>{t(`about_page.notes.${note.key}.title`)}</h2>
              <p>{t(`about_page.notes.${note.key}.text`)}</p>
            </article>
          )
        })}
      </section>

      <section className="about-close">
        <Layers3 size={20} aria-hidden="true" />
        <p>{t('about_page.close')}</p>
      </section>
    </main>
  )
}
