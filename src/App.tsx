import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects, { type ProjectFilter } from './components/Projects'
import HowIWork from './components/HowIWork'
import Stats from './components/Stats'
import About from './components/About'
import AboutPage from './components/AboutPage'
import CareerPage from './components/CareerPage'
import RestaurantsPage from './components/RestaurantsPage'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import Footer from './components/Footer'
import { useCareerVisibility } from './hooks/useCareerVisibility'
import { useVisitTracker } from './hooks/useVisitTracker'

function App() {
  const path = window.location.pathname
  const isAboutPage = path === '/about'
  const isCareerPage = path === '/career'
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
  const { isOpen: careerOpen, loading: careerLoading } = useCareerVisibility()
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
      ) : isCareerPage ? (
        <>
          {careerLoading ? (
            <main className="listing-shell">
              <div className="empty-state">경력 페이지 상태를 확인하는 중입니다.</div>
            </main>
          ) : careerOpen ? (
            <CareerPage />
          ) : (
            <main className="listing-shell">
              <div className="empty-state">경력 페이지가 닫혀 있습니다.</div>
            </main>
          )}
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
