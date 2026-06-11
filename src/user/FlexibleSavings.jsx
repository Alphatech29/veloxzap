import useIsMobile from '../hooks/useIsMobile'
import DesktopFlexibleSavings from './desktop/savings/flexible'
import MobileFlexibleSavings from './mobile/savings/flexible'

export default function FlexibleSavings() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileFlexibleSavings /> : <DesktopFlexibleSavings />
}
