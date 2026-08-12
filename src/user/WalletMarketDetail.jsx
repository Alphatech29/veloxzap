import useIsMobile from '../hooks/useIsMobile'
import DesktopMarketDetail from './desktop/wallet/MarketDetail'
import MobileMarketDetail from './mobile/wallet/MarketDetail'

export default function WalletMarketDetail() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileMarketDetail /> : <DesktopMarketDetail />
}
