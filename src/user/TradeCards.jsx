import useIsMobile from '../hooks/useIsMobile'
import DesktopTradeCards from './desktop/TradeCards'
import MobileTradeCards from './mobile/TradeCards'

export default function TradeCards() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileTradeCards /> : <DesktopTradeCards />
}
