import useIsMobile from '../hooks/useIsMobile'
import DesktopBills from './desktop/bills'
import MobileBills from './mobile/bills'

export default function Bills() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileBills /> : <DesktopBills />
}
