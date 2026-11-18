import { useState, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { domains, isExternal, projects, type Project, type ProjectFilter } from '../lib/projects'

export type { ProjectFilter }

const pageCopy = {
  all: { title: 'projects.page_all_title', description: 'projects.page_all_description' },
  apps: { title: 'projects.page_apps_title', description: 'projects.page_apps_description' },
  youtube: { title: 'projects.page_youtube_title', description: 'projects.page_youtube_description' },
  instagram: { title: 'projects.page_instagram_title', description: 'projects.page_instagram_description' },
  writing: { title: 'projects.page_writing_title', description: 'projects.page_writing_description' },
} as const

const tabs: { filter: ProjectFilter; href: string; key: string; fallback: string }[] = [
  { filter: 'all', href: '/projects', key: 'all', fallback: 'All' },
  { filter: 'apps', href: '/apps', key: 'apps', fallback: 'Apps' },
  { filter: 'youtube', href: '/youtube', key: 'youtube', fallback: 'YouTube' },
  { filter: 'instagram', href: '/instagram', key: 'instagram', fallback: 'Instagram' },
  { filter: 'writing', href: '/writing', key: 'writing', fallback: 'Writing' },
]

// apps lead the list; the rest follow
const groupOrder = ['apps', 'ai_video', 'youtube', 'instagram', 'writing'] as const

type ProjectsProps = {
  filter?: ProjectFilter
  page?: boolean
}

export default function Projects({ filter = 'all', page = false }: ProjectsProps) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState<Project | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const px = useSpring(x, { stiffness: 260, damping: 28 })
  const py = useSpring(y, { stiffness: 260, damping: 28 })
  const copy = pageCopy[filter]

  const groups = groupOrder
    .map((key) => domains.find((domain) => domain.key === key)!)
    .filter((domain) => filter === 'all' || domain.category === filter)
    .map((domain) => ({ domain, items: projects.filter((project) => project.category === domain.category) }))

  const onMove = (event: PointerEvent<HTMLElement>) => {
    x.set(event.clientX)
    y.set(event.clientY)
  }

  return (
    <section id="work" className={`wx-section ${page ? 'is-page' : ''}`} onPointerMove={onMove}>
      <header className="wx-head">
        <h2>{t(page ? copy.title : 'projects.title')}</h2>
        <p>{t(page ? copy.description : 'projects.description')}</p>
      </header>

      {page && (
        <div className="wx-tabs">
          {tabs.map((tab) => (
            <a key={tab.href} href={tab.href} className={filter === tab.filter ? 'is-active' : ''} aria-current={filter === tab.filter ? 'page' : undefined}>
              {t(`nav.${tab.key}`, { defaultValue: tab.fallback })}
            </a>
          ))}
        </div>
      )}

      {groups.map(({ domain, items }) => (
        <div className="wx-group" key={domain.key} style={{ ['--c' as string]: domain.color }}>
          <h3 className="wx-group-title">
            <i aria-hidden="true" />
            {t(`nav.${domain.key}`)}
            <small>{items.length}</small>
          </h3>
          <ul>
            {items.map((project) => {
              const name = t(`project_list.${project.key}.name`)
              const external = isExternal(project.url)
              return (
                <li key={project.key}>
                  <a
                    className="wx-row"
                    href={project.url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(project)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(null)}
                  >
                    <span className="wx-name">{name}</span>
                    <span className="wx-desc">{t(`project_list.${project.key}.desc`)}</span>
                    <span className="wx-type">{t(`project_meta.${project.key}.type`, { defaultValue: project.type })}</span>
                    <span className="wx-status">{t(`project_meta.${project.key}.status`, { defaultValue: project.status })}</span>
                    {project.image && <img className="wx-thumb" src={project.image} alt="" loading="lazy" />}
                    <ArrowUpRight className="wx-arrow" size={20} aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <motion.div
        className="wx-preview"
        style={{ x: px, y: py }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.88 }}
        transition={{ duration: 0.22 }}
        aria-hidden="true"
      >
        {hovered?.video ? (
          <video key={hovered.key} src={hovered.video} autoPlay muted loop playsInline />
        ) : hovered?.image ? (
          <img key={hovered.key} src={hovered.image} alt="" />
        ) : null}
      </motion.div>
    </section>
  )
}
