import useIsMobile from '../hooks/useIsMobile'
import DesktopNewsDetail from './desktop/wallet/NewsDetail'
import MobileNewsDetail from './mobile/wallet/NewsDetail'

export default function WalletNewsDetail() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileNewsDetail /> : <DesktopNewsDetail />
}
