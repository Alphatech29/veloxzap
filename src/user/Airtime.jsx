import useIsMobile from '../hooks/useIsMobile'
import DesktopAirtime from './desktop/Airtime'
import MobileAirtime from './mobile/Airtime'

export default function Airtime() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileAirtime /> : <DesktopAirtime />
}
