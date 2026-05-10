import useIsMobile from '../hooks/useIsMobile'
import DesktopCards from './desktop/Cards'
import MobileCards from './mobile/Cards'

export default function Cards() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileCards /> : <DesktopCards />
}
