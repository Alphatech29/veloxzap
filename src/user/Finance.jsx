import useIsMobile from '../hooks/useIsMobile'
import DesktopFinance from './desktop/Finance'
import MobileFinance from './mobile/Finance'

export default function Finance() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileFinance /> : <DesktopFinance />
}
