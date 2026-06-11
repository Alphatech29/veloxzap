import useIsMobile from '../hooks/useIsMobile'
import DesktopTargetSavings from './desktop/savings/target'
import MobileTargetSavings from './mobile/savings/target'

export default function TargetSavings() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileTargetSavings /> : <DesktopTargetSavings />
}
