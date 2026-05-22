import useIsMobile from '../hooks/useIsMobile'
import DesktopChangePassword from './desktop/ChangePassword'
import MobileChangePassword from './mobile/ChangePassword'

export default function ChangePassword() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileChangePassword /> : <DesktopChangePassword />
}
