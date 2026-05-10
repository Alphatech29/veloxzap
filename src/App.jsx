import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import GeneralLayout from './layouts/GeneralLayout'
import UserLayout from './layouts/UserLayout'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './user/Dashboard'
import More from './user/mobile/More'
import Profile from './user/Profile'
import Transactions from './user/Transactions'
import UserContact from './user/Contact'
import Convert from './user/Convert'
import Rewards from './user/Rewards'
import Cards from './user/Cards'
import Deposit from './user/Deposit'
import Airtime from './user/Airtime'
import Data from './user/Data'
import Bills from './user/Bills'
import UserNotFound from './user/NotFound'
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
      <AuthProvider>
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
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/user"
            element={
              <PrivateRoute>
                <UserLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="more" element={<More />} />
            <Route path="profile" element={<Profile />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="contact" element={<UserContact />} />
            <Route path="convert" element={<Convert />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="cards" element={<Cards />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="airtime" element={<Airtime />} />
            <Route path="data" element={<Data />} />
            <Route path="bills" element={<Bills />} />
            <Route path="*" element={<UserNotFound />} />
          </Route>

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forget-password" element={<ForgetPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
