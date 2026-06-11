import useIsMobile from '../hooks/useIsMobile'
import DesktopSaving from './desktop/savings'
import MobileSaving from './mobile/savings'

export default function Saving() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileSaving /> : <DesktopSaving />
}
