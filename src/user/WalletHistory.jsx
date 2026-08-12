import useIsMobile from '../hooks/useIsMobile'
import DesktopAssetHistory from './desktop/wallet/AssetHistory'
import MobileAssetHistory from './mobile/wallet/AssetHistory'

export default function WalletHistory() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileAssetHistory /> : <DesktopAssetHistory />
}
