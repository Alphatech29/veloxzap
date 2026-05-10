import useIsMobile from '../hooks/useIsMobile'
import DesktopConvert from './desktop/Convert'
import MobileConvert from './mobile/Convert'

export default function Convert() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileConvert /> : <DesktopConvert />
}
