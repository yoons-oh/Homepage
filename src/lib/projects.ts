import kidsEnglish from '../assets/project-web/kids-english.webp'
import dailyMath from '../assets/project-web/daily-math.webp'
import dailyEnglish from '../assets/project-web/daily-english.webp'
import photoReader from '../assets/project-web/english-photo-reader.webp'
import arrowWayOut from '../assets/project-web/arrow-way-out.webp'
import marketSnapshot from '../assets/project-web/market-snapshot.webp'
import munpiaNovel from '../assets/project-web/munpia-novel.webp'
import honjaHaebollae from '../assets/project-web/honja-haebollae.webp'
import dalbamYadam from '../assets/project-web/dalbam-yadam.webp'
import igInvest from '../assets/project-web/ig-yoons1822.webp'
import igShopping from '../assets/project-web/ig-yoons0818.webp'

export type ProjectCategory = 'apps' | 'youtube' | 'instagram' | 'writing' | 'lab'
export type ProjectFilter = 'all' | 'apps' | 'youtube' | 'instagram' | 'writing'

export type Project = {
  key: string
  category: ProjectCategory
  tag: string
  url: string
  status: string
  type: string
  /** brand colour used for 3D panels and card glow */
  color: string
  image?: string
  /** image width / height */
  aspect?: number
  video?: string
  notesKey?: string
  featured?: boolean
}

export const YOUTUBE_URL = 'https://www.youtube.com/channel/UC7QwAF2w5n0hMpWLdwymDAA'

export const projects: Project[] = [
  {
    key: 'kids_english',
    category: 'apps',
    tag: 'Education / AI',
    url: 'https://english-topaz-five.vercel.app/',
    status: 'Live',
    type: 'Website',
    color: '#2f7bff',
    image: kidsEnglish,
    aspect: 900 / 439,
    featured: true,
  },
  {
    key: 'daily_math',
    category: 'apps',
    tag: 'Kids / Math',
    url: 'https://daily-math-one.vercel.app/auth',
    status: 'Live',
    type: 'Web App',
    color: '#7a3cff',
    image: dailyMath,
    aspect: 900 / 439,
    featured: true,
  },
  {
    key: 'daily_english',
    category: 'apps',
    tag: 'Daily / English',
    url: 'https://daily-english-yoons.vercel.app/login',
    status: 'Live',
    type: 'Web App',
    color: '#3d8bff',
    image: dailyEnglish,
    aspect: 1,
  },
  {
    key: 'photo_reader',
    category: 'apps',
    tag: 'Vision / AI',
    url: 'https://english-photo-reader.vercel.app/',
    status: 'Live',
    type: 'AI Tool',
    color: '#1f5bff',
    image: photoReader,
    aspect: 1,
  },
  {
    key: 'arrow_way_out',
    category: 'apps',
    tag: 'Puzzle / Game',
    url: 'https://arrow-way-out.vercel.app/',
    status: 'Live',
    type: 'Game',
    color: '#14b8a6',
    image: arrowWayOut,
    aspect: 393 / 237,
  },
  {
    key: 'minimax_h3_video',
    category: 'lab',
    tag: 'AI Video / Local',
    url: '/ai-video',
    status: 'Demo',
    type: 'AI Video',
    color: '#0ea5e9',
    video: '/videos/minimax-h3-demo.mp4',
    notesKey: 'project_notes.minimax_h3_video',
  },
  {
    key: 'market_snapshot',
    category: 'youtube',
    tag: 'YouTube / Finance',
    url: YOUTUBE_URL,
    status: 'Channel',
    type: 'YouTube',
    color: '#ef4444',
    image: marketSnapshot,
    aspect: 460 / 178,
  },
  {
    key: 'honja_haebollae',
    category: 'youtube',
    tag: 'YouTube / Solo',
    url: 'https://www.youtube.com/channel/UC8hsRza9jwF0rszZr6mRhgA',
    status: 'Channel',
    type: 'YouTube',
    color: '#ff5b57',
    image: honjaHaebollae,
    aspect: 900 / 560,
  },
  {
    key: 'dalbam_yadam',
    category: 'youtube',
    tag: 'YouTube / Story',
    url: 'https://www.youtube.com/channel/UCd-jeRxHDF3bfNDtQeNIwJA',
    status: 'Channel',
    type: 'YouTube',
    color: '#ffb84a',
    image: dalbamYadam,
    aspect: 900 / 560,
  },
  {
    key: 'ig_yoons1822',
    category: 'instagram',
    tag: 'Instagram / Investing',
    url: 'https://www.instagram.com/yoons1822/',
    status: 'Account',
    type: 'Instagram',
    color: '#ff4fa3',
    image: igInvest,
    aspect: 900 / 560,
  },
  {
    key: 'ig_yoons0818',
    category: 'instagram',
    tag: 'Instagram / Shopping',
    url: 'https://www.instagram.com/yoons_0818/',
    status: 'Account',
    type: 'Instagram',
    color: '#ff8a50',
    image: igShopping,
    aspect: 900 / 560,
  },
  {
    key: 'munpia_novel',
    category: 'writing',
    tag: 'Novel / Writing',
    url: 'https://novel.munpia.com/580908',
    status: 'Serial',
    type: 'Web Novel',
    color: '#b45309',
    image: munpiaNovel,
    aspect: 675 / 900,
  },
]

export const isExternal = (url: string) => /^https?:\/\//.test(url)

export type Domain = {
  key: 'youtube' | 'instagram' | 'writing' | 'apps' | 'ai_video'
  category: ProjectCategory
  href: string
  /** spectral colour, ordered like light leaving a prism (red → violet) */
  color: string
}

export const domains: Domain[] = [
  { key: 'youtube', category: 'youtube', href: '/youtube', color: '#ff5b57' },
  { key: 'instagram', category: 'instagram', href: '/instagram', color: '#ff4fa3' },
  { key: 'writing', category: 'writing', href: '/writing', color: '#ffb84a' },
  { key: 'apps', category: 'apps', href: '/apps', color: '#3fe3b4' },
  { key: 'ai_video', category: 'lab', href: '/ai-video', color: '#8b7dff' },
]

export const countIn = (category: ProjectCategory) => projects.filter((project) => project.category === category).length
