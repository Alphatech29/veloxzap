import useIsMobile from '../hooks/useIsMobile'
import DesktopTradeHistory from './desktop/TradeHistory'
import MobileTradeHistory from './mobile/TradeHistory'

export default function TradeHistory() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileTradeHistory /> : <DesktopTradeHistory />
}
