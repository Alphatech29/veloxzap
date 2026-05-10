import useIsMobile from '../hooks/useIsMobile'
import DesktopDeposit from './desktop/Deposit'
import MobileDeposit from './mobile/Deposit'

export default function Deposit() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileDeposit /> : <DesktopDeposit />
}
