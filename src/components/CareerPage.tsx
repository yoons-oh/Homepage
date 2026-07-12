import { useTranslation } from 'react-i18next'
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Code2, Database, Layers3, ShieldCheck } from 'lucide-react'

const coreSkillKeys = ['skill1', 'skill2', 'skill3', 'skill4'] as const

const capabilityGroups = [
  {
    icon: Layers3,
    key: 'sap',
  },
  {
    icon: Code2,
    key: 'development',
  },
  {
    icon: Database,
    key: 'data',
  },
]

const careerItems = [
  {
    key: 'incruit',
  },
  {
    key: 'kyungdong',
  },
  {
    key: 'fnf',
  },
  {
    key: 'samsung',
  },
] as const

export default function CareerPage() {
  const { t } = useTranslation()
  const tArray = (key: string) => t(key, { returnObjects: true }) as string[]

  return (
    <main className="career-page">
      <div className="about-page-top">
        <a className="back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" />
          {t('common.home')}
        </a>
      </div>

      <section className="career-hero">
        <p className="eyebrow">{t('career.eyebrow')}</p>
        <h1>
          {t('career.headline1')}
          <span>{t('career.headline2')}</span>
        </h1>
        <p>{t('career.intro')}</p>
      </section>

      <section className="career-skill-panel" aria-label={t('career.skills_aria')}>
        <div>
          <ShieldCheck size={22} aria-hidden="true" />
          <h2>{t('career.skills_title')}</h2>
        </div>
        <ul>
          {coreSkillKeys.map((skill) => (
            <li key={skill}>
              <CheckCircle2 size={16} aria-hidden="true" />
              {t(`career.skills.${skill}`)}
            </li>
          ))}
        </ul>
      </section>

      <section className="career-capability-grid" aria-label={t('career.capabilities_aria')}>
        {capabilityGroups.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.key}>
              <Icon size={22} aria-hidden="true" />
              <h2>{t(`career.capabilities.${item.key}.title`)}</h2>
              <p>{t(`career.capabilities.${item.key}.text`)}</p>
            </article>
          )
        })}
      </section>

      <section className="career-timeline" aria-label={t('career.timeline_aria')}>
        <div className="section-title-row">
          <h2>{t('career.timeline_title')}</h2>
          <p>{t('career.timeline_description')}</p>
        </div>

        <div className="career-list">
          {careerItems.map((item) => (
            <article className="career-card" key={item.key}>
              <div className="career-card-meta">
                <BriefcaseBusiness size={18} aria-hidden="true" />
                <span>{t(`career.items.${item.key}.period`)}</span>
                <small>{t(`career.items.${item.key}.duration`)}</small>
              </div>
              <div className="career-card-body">
                <h3>{t(`career.items.${item.key}.company`)}</h3>
                <strong>{t(`career.items.${item.key}.role`)}</strong>
                <p>{t(`career.items.${item.key}.summary`)}</p>
                <ul>
                  {tArray(`career.items.${item.key}.tasks`).map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
