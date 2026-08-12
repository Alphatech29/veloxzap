import useIsMobile from '../hooks/useIsMobile'
import DesktopCoinInfo from './desktop/wallet/CoinInfo'
import MobileCoinInfo from './mobile/wallet/CoinInfo'

export default function WalletCoin() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileCoinInfo /> : <DesktopCoinInfo />
}
