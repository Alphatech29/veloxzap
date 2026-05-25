import useIsMobile from '../hooks/useIsMobile'
import DesktopCryptoExchange from './desktop/CryptoExchange'
import MobileCryptoExchange from './mobile/CryptoExchange'

export default function CryptoExchange() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileCryptoExchange /> : <DesktopCryptoExchange />
}
