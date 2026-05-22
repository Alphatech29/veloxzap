import useIsMobile from '../hooks/useIsMobile'
import DesktopTransactionPin from './desktop/TransactionPin'
import MobileTransactionPin from './mobile/TransactionPin'

export default function TransactionPin() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileTransactionPin /> : <DesktopTransactionPin />
}
