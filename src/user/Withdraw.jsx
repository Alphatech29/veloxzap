import useIsMobile from '../hooks/useIsMobile'
import DesktopWithdraw from './desktop/Withdraw'
import MobileWithdraw from './mobile/Withdraw'

export default function Withdraw() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileWithdraw /> : <DesktopWithdraw />
}
