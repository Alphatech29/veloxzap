import useIsMobile from '../hooks/useIsMobile'
import DesktopSettings from './desktop/Settings'

export default function Settings() {
  const isMobile = useIsMobile()
  if (isMobile) return null
  return <DesktopSettings />
}
