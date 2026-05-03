import { Outlet } from 'react-router-dom'
import Header from '../components/partials/header'
import Footer from '../components/partials/footer'

export default function GeneralLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
