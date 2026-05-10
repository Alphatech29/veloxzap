import useIsMobile from '../hooks/useIsMobile'
import DesktopBills from './desktop/Bills'
import MobileBills from './mobile/Bills'

export default function Bills() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileBills /> : <DesktopBills />
}
