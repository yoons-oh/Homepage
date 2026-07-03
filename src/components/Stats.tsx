import { useTranslation } from 'react-i18next'

export default function Stats() {
  const { t } = useTranslation()

  return (
    <section className="stats-band" aria-label="Portfolio metrics">
      {[
        { value: '6+', label: t('stats.apps') },
        { value: '100%', label: t('stats.deployed') },
        { value: t('stats.speed_value'), label: t('stats.speed') },
      ].map((stat) => (
        <div key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  )
}
