import useIsMobile from '../hooks/useIsMobile'
import DesktopProfile from './desktop/Profile'
import MobileProfile from './mobile/Profile'

export default function Profile() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileProfile /> : <DesktopProfile />
}
