import useIsMobile from '../hooks/useIsMobile'
import DesktopUserNotFound from './desktop/NotFound'
import MobileUserNotFound from './mobile/NotFound'

export default function UserNotFound() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileUserNotFound /> : <DesktopUserNotFound />
}
