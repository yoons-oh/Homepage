import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects, { type ProjectFilter } from './components/Projects'
import HowIWork from './components/HowIWork'
import Stats from './components/Stats'
import About from './components/About'
import AboutPage from './components/AboutPage'
import RestaurantsPage from './components/RestaurantsPage'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import Footer from './components/Footer'
import { useVisitTracker } from './hooks/useVisitTracker'

function App() {
  const path = window.location.pathname
  const isAboutPage = path === '/about'
  const isRestaurantsPage = path === '/restaurants'
  const isAdminLoginPage = path === '/admin/login'
  const isAdminPage = path === '/admin'
  const projectPages: Partial<Record<string, ProjectFilter>> = {
    '/projects': 'all',
    '/apps': 'apps',
    '/writing': 'writing',
    '/youtube': 'youtube',
  }
  const projectFilter = projectPages[path]
  useVisitTracker(path)

  return (
    <div className="site-shell">
      <Navbar />
      {isAdminLoginPage ? (
        <AdminLogin />
      ) : isAdminPage ? (
        <AdminDashboard />
      ) : isAboutPage ? (
        <>
          <AboutPage />
          <Footer />
        </>
      ) : isRestaurantsPage ? (
        <>
          <RestaurantsPage />
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
