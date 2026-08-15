import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Calculator, CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { createTesterApplication } from '../lib/testers'
import { emptyTesterApplicationForm, type TesterApplicationForm } from '../types/tester'

export default function TesterPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState<TesterApplicationForm>(emptyTesterApplicationForm)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const updateField = <K extends keyof TesterApplicationForm>(key: K, value: TesterApplicationForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      await createTesterApplication(form)
      setSubmitted(true)
      setForm(emptyTesterApplicationForm)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      setError(message.startsWith('tester.errors.') ? t(message) : message || t('tester_page.error'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="tester-page listing-shell">
      <section className="tester-hero">
        <div>
          <span>{t('tester_page.eyebrow')}</span>
          <h1>{t('tester_page.title')}</h1>
          <p>{t('tester_page.description')}</p>
        </div>
        <div className="tester-flow-card" aria-label={t('tester_page.flow_aria')}>
          <div>
            <strong>1</strong>
            <span>{t('tester_page.step1')}</span>
          </div>
          <ArrowRight size={16} aria-hidden="true" />
          <div>
            <strong>2</strong>
            <span>{t('tester_page.step2')}</span>
          </div>
          <ArrowRight size={16} aria-hidden="true" />
          <div>
            <strong>3</strong>
            <span>{t('tester_page.step3')}</span>
          </div>
        </div>
      </section>

      <section className="tester-app-intro" aria-label={t('tester_page.app_intro_aria')}>
        <article className="tester-app-card">
          <div className="tester-app-icon">
            <Calculator size={28} aria-hidden="true" />
          </div>
          <div>
            <span>{t('tester_page.app_label')}</span>
            <h2>{t('tester_page.app_title')}</h2>
            <p>{t('tester_page.app_description')}</p>
          </div>
        </article>
        <div className="tester-checkpoints">
          <div>
            <Sparkles size={18} aria-hidden="true" />
            <strong>{t('tester_page.point1_title')}</strong>
            <span>{t('tester_page.point1_text')}</span>
          </div>
          <div>
            <Sparkles size={18} aria-hidden="true" />
            <strong>{t('tester_page.point2_title')}</strong>
            <span>{t('tester_page.point2_text')}</span>
          </div>
          <div>
            <Sparkles size={18} aria-hidden="true" />
            <strong>{t('tester_page.point3_title')}</strong>
            <span>{t('tester_page.point3_text')}</span>
          </div>
        </div>
      </section>

      <section className="tester-layout">
        <form className="tester-form" onSubmit={handleSubmit}>
          <div className="tester-form-heading">
            <Mail size={18} aria-hidden="true" />
            <div>
              <span>{t('tester_page.form_label')}</span>
              <h2>{t('tester_page.form_title')}</h2>
            </div>
          </div>

          {submitted && (
            <div className="tester-notice success">
              <CheckCircle2 size={17} aria-hidden="true" />
              <span>{t('tester_page.success')}</span>
            </div>
          )}
          {error && <div className="tester-notice error">{error}</div>}

          <label>
            {t('tester_page.name')}
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder={t('tester_page.name_placeholder')}
              required
            />
          </label>
          <label>
            {t('tester_page.email')}
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder={t('tester_page.email_placeholder')}
              required
            />
          </label>
          <label>
            {t('tester_page.device')}
            <select value={form.device} onChange={(event) => updateField('device', event.target.value)}>
              <option value="android">{t('tester_page.device_android')}</option>
              <option value="tablet">{t('tester_page.device_tablet')}</option>
              <option value="both">{t('tester_page.device_both')}</option>
            </select>
          </label>
          <label>
            {t('tester_page.memo')}
            <textarea
              value={form.memo}
              onChange={(event) => updateField('memo', event.target.value)}
              placeholder={t('tester_page.memo_placeholder')}
            />
          </label>
          <label className="tester-check">
            <input
              type="checkbox"
              checked={form.canTest14Days}
              onChange={(event) => updateField('canTest14Days', event.target.checked)}
              required
            />
            <span>{t('tester_page.agree')}</span>
          </label>
          <button type="submit" disabled={busy}>
            {busy ? t('tester_page.saving') : t('tester_page.submit')}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </form>

        <aside className="tester-guide">
          <div>
            <ShieldCheck size={20} aria-hidden="true" />
            <h2>{t('tester_page.guide_title')}</h2>
          </div>
          <ol>
            <li>{t('tester_page.guide1')}</li>
            <li>{t('tester_page.guide2')}</li>
            <li>{t('tester_page.guide3')}</li>
            <li>{t('tester_page.guide4')}</li>
          </ol>
        </aside>
      </section>
    </main>
  )
}
