import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Bot, FileSearch, Rocket, Wrench } from 'lucide-react'

const steps = [
  { key: 'step1', num: '01', icon: FileSearch },
  { key: 'step2', num: '02', icon: Bot },
  { key: 'step3', num: '03', icon: Wrench },
  { key: 'step4', num: '04', icon: Rocket },
]

export default function HowIWork() {
  const { t } = useTranslation()

  return (
    <section className="process-section">
      <div className="section-title-row">
        <h2>{t('how.title')}</h2>
        <p>{t('how.subtitle')}</p>
      </div>

      <div className="process-grid">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.article
              className="process-card"
              key={step.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36, delay: index * 0.06 }}
            >
              <span>{step.num}</span>
              <Icon size={22} aria-hidden="true" />
              <h3>{t(`how.${step.key}_title`)}</h3>
              <p>{t(`how.${step.key}_desc`)}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
