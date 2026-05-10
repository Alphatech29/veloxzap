import useIsMobile from '../hooks/useIsMobile'
import DesktopContact from './desktop/Contact'
import MobileContact from './mobile/Contact'

export default function Contact() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileContact /> : <DesktopContact />
}
