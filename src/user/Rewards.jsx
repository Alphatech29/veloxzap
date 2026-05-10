import useIsMobile from '../hooks/useIsMobile'
import DesktopRewards from './desktop/Rewards'
import MobileRewards from './mobile/Rewards'

export default function Rewards() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileRewards /> : <DesktopRewards />
}
