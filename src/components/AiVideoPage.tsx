import { useTranslation } from 'react-i18next'
import { ArrowLeft, CheckCircle2, Cpu, Film, Gauge, Wrench } from 'lucide-react'

const environmentKeys = ['laptop', 'cpu', 'gpu', 'memory', 'os', 'runtime', 'model'] as const
const goalKeys = ['image', 'text', 'audio'] as const
const timelineKeys = ['setup', 'reference', 'text', 'audio', 'stability', 'result'] as const
const lessonKeys = ['models', 'resolution', 'audio', 'progress', 'workflow'] as const
const workflowKeys = ['start', 'duration', 'resolution', 'audio', 'finish'] as const

export default function AiVideoPage() {
  const { t } = useTranslation()
  const tArray = (key: string) => t(key, { returnObjects: true }) as string[]

  return (
    <main className="ai-video-page">
      <div className="about-page-top">
        <a className="back-link" href="/projects">
          <ArrowLeft size={15} aria-hidden="true" />
          {t('nav.projects')}
        </a>
      </div>

      <section className="ai-video-hero">
        <div>
          <p className="eyebrow">{t('ai_video.eyebrow')}</p>
          <h1>{t('ai_video.title')}</h1>
          <p>{t('ai_video.intro')}</p>
        </div>

        <figure className="ai-video-result">
          <video controls playsInline preload="metadata" src="/videos/minimax-h3-demo.mp4" aria-label={t('ai_video.video_label')} />
          <figcaption>{t('ai_video.video_caption')}</figcaption>
        </figure>
      </section>

      <section className="ai-video-panel">
        <div>
          <Film size={22} aria-hidden="true" />
          <h2>{t('ai_video.goals_title')}</h2>
        </div>
        <ul>
          {goalKeys.map((key) => (
            <li key={key}>
              <CheckCircle2 size={16} aria-hidden="true" />
              {t(`ai_video.goals.${key}`)}
            </li>
          ))}
        </ul>
      </section>

      <section className="ai-video-grid" aria-label={t('ai_video.environment_title')}>
        {environmentKeys.map((key) => (
          <article key={key}>
            <span>{t(`ai_video.environment.${key}.label`)}</span>
            <strong>{t(`ai_video.environment.${key}.value`)}</strong>
          </article>
        ))}
      </section>

      <section className="ai-video-section">
        <div className="section-title-row">
          <h2>{t('ai_video.timeline_title')}</h2>
          <p>{t('ai_video.timeline_description')}</p>
        </div>
        <div className="ai-video-timeline">
          {timelineKeys.map((key, index) => (
            <article key={key}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{t(`ai_video.timeline.${key}.title`)}</h3>
                <p>{t(`ai_video.timeline.${key}.text`)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-video-section">
        <div className="section-title-row">
          <h2>{t('ai_video.lessons_title')}</h2>
          <p>{t('ai_video.lessons_description')}</p>
        </div>
        <div className="ai-video-lessons">
          {lessonKeys.map((key) => (
            <article key={key}>
              <Wrench size={18} aria-hidden="true" />
              <h3>{t(`ai_video.lessons.${key}.title`)}</h3>
              <p>{t(`ai_video.lessons.${key}.text`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-video-split">
        <article>
          <Cpu size={20} aria-hidden="true" />
          <h2>{t('ai_video.workflow_title')}</h2>
          <ol>
            {workflowKeys.map((key) => (
              <li key={key}>{t(`ai_video.workflow.${key}`)}</li>
            ))}
          </ol>
        </article>
        <article>
          <Gauge size={20} aria-hidden="true" />
          <h2>{t('ai_video.result_title')}</h2>
          <ul>
            {tArray('ai_video.result_points').map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="ai-video-conclusion">
        <p>{t('ai_video.conclusion')}</p>
      </section>
    </main>
  )
}
