import useIsMobile from '../hooks/useIsMobile'
import DesktopWallet from './desktop/wallet'
import MobileWallet from './mobile/wallet'

export default function Wallet() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileWallet /> : <DesktopWallet />
}
