import useIsMobile from '../hooks/useIsMobile'
import DesktopTransactions from './desktop/Transactions'
import MobileTransactions from './mobile/Transactions'

export default function Transactions() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileTransactions /> : <DesktopTransactions />
}
