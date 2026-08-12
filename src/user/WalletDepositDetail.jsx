import useIsMobile from '../hooks/useIsMobile'
import DesktopDepositDetail from './desktop/wallet/DepositDetail'
import MobileDepositDetail from './mobile/wallet/DepositDetail'

export default function WalletDepositDetail() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileDepositDetail /> : <DesktopDepositDetail />
}
