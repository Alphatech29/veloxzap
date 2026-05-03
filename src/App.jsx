import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GeneralLayout from './layouts/GeneralLayout'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/index'
import AirtimeData from './pages/AirtimeData'
import GiftCards from './pages/GiftCards'
import PayBills from './pages/PayBills'
import Login from './auth/login'
import Register from './auth/register'
import ForgetPassword from './auth/forgetPassword'
import ResetPassword from './auth/resetPassword'
import CryptoSwap from './pages/CryptoSwap'
import SpendGlobally from './pages/SpendGlobally'
import VirtualCard from './pages/VirtualCard'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/blog/BlogPost'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<GeneralLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/airtime" element={<AirtimeData />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/bills" element={<PayBills />} />
          <Route path="/virtual-card" element={<VirtualCard/>} />
          <Route path="/crypto-swap" element={<CryptoSwap/>} />
          <Route path="/spend-globally" element={<SpendGlobally/>} />
          <Route path="/company/about" element={<About />} />
          <Route path="/company/blog" element={<Blog />} />
          <Route path="/company/blog/:id" element={<BlogPost />} />
          <Route path="/company/contact" element={<Contact />} />
          <Route path="/company" element={<Navigate to="/company/about" replace />} />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <div>Users Page</div>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>


        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
