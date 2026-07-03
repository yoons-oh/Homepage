import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects, { type ProjectFilter } from './components/Projects'
import HowIWork from './components/HowIWork'
import Stats from './components/Stats'
import About from './components/About'
import AboutPage from './components/AboutPage'
import Footer from './components/Footer'

function App() {
  const path = window.location.pathname
  const isAboutPage = path === '/about'
  const projectPages: Partial<Record<string, ProjectFilter>> = {
    '/projects': 'all',
    '/apps': 'apps',
    '/writing': 'writing',
    '/youtube': 'youtube',
  }
  const projectFilter = projectPages[path]

  return (
    <div className="site-shell">
      <Navbar />
      {isAboutPage ? (
        <>
          <AboutPage />
          <Footer />
        </>
      ) : projectFilter ? (
        <>
          <Projects filter={projectFilter} page />
          <Footer />
        </>
      ) : (
        <>
          <Hero />
          <Projects />
          <HowIWork />
          <Stats />
          <About />
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
