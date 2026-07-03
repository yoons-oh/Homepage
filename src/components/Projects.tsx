import { useTranslation } from 'react-i18next'
import { motion, type Variants } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import kidsEnglishIcon from '../assets/project-icons/kids-english.png'
import dailyMathIcon from '../assets/project-icons/daily-math.png'
import dailyEnglishIcon from '../assets/project-icons/daily-english.png'
import photoReaderIcon from '../assets/project-icons/english-photo-reader.png'
import marketSnapshotIcon from '../assets/project-icons/market-snapshot.png'
import munpiaNovelIcon from '../assets/project-icons/munpia-novel.png'

export type ProjectFilter = 'all' | 'apps' | 'youtube' | 'writing'

const pageCopy = {
  all: {
    title: 'projects.page_all_title',
    description: 'projects.page_all_description',
  },
  apps: {
    title: 'projects.page_apps_title',
    description: 'projects.page_apps_description',
  },
  youtube: {
    title: 'projects.page_youtube_title',
    description: 'projects.page_youtube_description',
  },
  writing: {
    title: 'projects.page_writing_title',
    description: 'projects.page_writing_description',
  },
} as const

const projects = [
  {
    key: 'kids_english',
    category: 'apps',
    tag: 'Education / AI',
    url: 'https://english-topaz-five.vercel.app/',
    status: 'Live',
    type: 'Website',
    accent: 'blue',
    image: kidsEnglishIcon,
    media: 'banner',
    span: 'standard',
  },
  {
    key: 'daily_math',
    category: 'apps',
    tag: 'Kids / Math',
    url: 'https://daily-math-one.vercel.app/auth',
    status: 'Live',
    type: 'Web App',
    accent: 'ink',
    image: dailyMathIcon,
    media: 'banner',
    span: 'wide',
  },
  {
    key: 'daily_english',
    category: 'apps',
    tag: 'Daily / English',
    url: 'https://daily-english-yoons.vercel.app/login',
    status: 'Live',
    type: 'Web App',
    accent: 'sky',
    image: dailyEnglishIcon,
    media: 'app',
    span: 'compact',
  },
  {
    key: 'photo_reader',
    category: 'apps',
    tag: 'Vision / AI',
    url: 'https://english-photo-reader.vercel.app/',
    status: 'Live',
    type: 'AI Tool',
    accent: 'mint',
    image: photoReaderIcon,
    media: 'app',
    span: 'standard',
  },
  {
    key: 'market_snapshot',
    category: 'youtube',
    tag: 'YouTube / Finance',
    url: 'https://www.youtube.com/channel/UC7QwAF2w5n0hMpWLdwymDAA',
    status: 'Channel',
    type: 'YouTube',
    accent: 'paper',
    image: marketSnapshotIcon,
    media: 'banner',
    span: 'standard',
  },
  {
    key: 'munpia_novel',
    category: 'writing',
    tag: 'Novel / Writing',
    url: 'https://novel.munpia.com/580908',
    status: 'Serial',
    type: 'Web Novel',
    accent: 'ink',
    image: munpiaNovelIcon,
    media: 'cover',
    span: 'standard',
  },
]

const wrap: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38 } },
}

type ProjectsProps = {
  filter?: ProjectFilter
  page?: boolean
}

export default function Projects({ filter = 'all', page = false }: ProjectsProps) {
  const { t } = useTranslation()
  const visibleProjects = filter === 'all' ? projects : projects.filter((project) => project.category === filter)
  const copy = pageCopy[filter]

  return (
    <section id="work" className={`work-section ${page ? 'project-page' : ''}`}>
      <div className="section-label">
        <span>{t('projects.subtitle')}</span>
        <a href="https://github.com/yoons-oh" target="_blank" rel="noreferrer">
          GitHub
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>

      <div className="section-title-row">
        <h2>{t(page ? copy.title : 'projects.title')}</h2>
        <p>{t(page ? copy.description : 'projects.description')}</p>
      </div>

      {!page && <div id="apps" className="anchor-offset" aria-hidden="true" />}
      <motion.div className="project-grid" variants={wrap} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        {visibleProjects.map((project) => {
          return (
            <motion.a
              className={`project-card ${project.accent} span-${project.span} media-${project.media}`}
              href={project.url}
              id={!page && project.key === 'munpia_novel' ? 'writing' : undefined}
              key={project.key}
              variants={item}
              target="_blank"
              rel="noreferrer"
            >
              <div className="project-topline">
                <span>{project.tag}</span>
                <small>{project.status}</small>
              </div>

              <div className="project-preview" aria-hidden="true">
                <div className="preview-window">
                  <span />
                  <span />
                  <span />
                </div>
                <img src={project.image} alt="" className="project-image" />
              </div>

              <div className="project-content">
                <span>{project.type}</span>
                <h3>{t(`project_list.${project.key}.name`)}</h3>
                <p>{t(`project_list.${project.key}.desc`)}</p>
              </div>

              <ArrowUpRight className="project-arrow" size={15} aria-hidden="true" />
            </motion.a>
          )
        })}
      </motion.div>
    </section>
  )
}
