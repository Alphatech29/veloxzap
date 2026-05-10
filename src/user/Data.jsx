import useIsMobile from '../hooks/useIsMobile'
import DesktopData from './desktop/Data'
import MobileData from './mobile/Data'

export default function Data() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileData /> : <DesktopData />
}
