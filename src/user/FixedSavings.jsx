import useIsMobile from '../hooks/useIsMobile'
import DesktopFixedSavings from './desktop/savings/fixed'
import MobileFixedSavings from './mobile/savings/fixed'

export default function FixedSavings() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileFixedSavings /> : <DesktopFixedSavings />
}
