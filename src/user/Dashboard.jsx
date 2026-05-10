import useIsMobile from '../hooks/useIsMobile'
import DesktopDashboard from './desktop/Dashboard'
import MobileDashboard from './mobile/Dashboard'

export default function Dashboard() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileDashboard /> : <DesktopDashboard />
}
