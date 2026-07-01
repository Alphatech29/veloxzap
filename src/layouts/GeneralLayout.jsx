import { Outlet } from 'react-router-dom'
import Header from '../components/partials/header'
import Footer from '../components/partials/footer'
import DownloadApp from '../components/partials/DownloadApp'

export default function GeneralLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <DownloadApp />
      <Footer />
    </>
  )
}
