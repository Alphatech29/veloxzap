import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ThemeProvider, useTheme } from '../context/ThemeContext'
import UserSidebar from '../components/partials/userSidebar'
import UserTopbar from '../components/partials/userTopbar'
import UserFooter from '../components/partials/userFooter'
import UserMobileHeader from '../components/partials/userMobileHeader'
import UserMobileTabs from '../components/partials/userMobileTabs'
import useIsMobile from '../hooks/useIsMobile'
import { AlertProvider } from '../components/ui/Alert'
import './css/UserLayout.css'

function UserShell() {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth/login', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  if (!isAuthenticated) return null

  async function handleLogout() {
    await logout()
    navigate('/auth/login', { replace: true })
  }

  if (isMobile) {
    return (
      <div className="ul-shell min-h-screen" data-theme={theme}>
        <AlertProvider>
          <UserMobileHeader />
          <main
            className="px-4 pt-[72px] pb-[88px]"
            style={{
              paddingTop: 'calc(60px + env(safe-area-inset-top) + 16px)',
              paddingBottom: 'calc(88px + env(safe-area-inset-bottom) + 16px)',
            }}
          >
            <Outlet />
          </main>
          <UserMobileTabs />
        </AlertProvider>
      </div>
    )
  }

  return (
    <div className="ul-shell min-h-screen" data-theme={theme}>
      <AlertProvider>
        <UserSidebar
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onLogout={handleLogout}
        />

        {drawerOpen && (
          <button
            type="button"
            className="hidden max-[959px]:block fixed inset-0 z-[35] bg-[var(--c-scrim)] border-0"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <div className="flex flex-col min-h-screen min-w-0 pt-[68px] min-[960px]:ml-[260px]">
          <UserTopbar
            onOpenDrawer={() => setDrawerOpen(true)}
            onLogout={handleLogout}
          />

          <main className="flex-1 px-4 py-5 min-[960px]:px-[30px] min-[960px]:pt-[26px] min-[960px]:pb-10">
            <Outlet />
          </main>

          <UserFooter />
        </div>
      </AlertProvider>
    </div>
  )
}

export default function UserLayout() {
  return (
    <ThemeProvider>
      <UserShell />
    </ThemeProvider>
  )
}
