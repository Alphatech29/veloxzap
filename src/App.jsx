import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import GeneralLayout from './layouts/GeneralLayout'
import UserLayout from './layouts/UserLayout'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './user/Dashboard'
import More from './user/mobile/More'
import Profile from './user/Profile'
import Transactions from './user/Transactions'
import UserContact from './user/Contact'
import Convert from './user/Convert'
import Wallet from './user/Wallet'
import WalletCoin from './user/mobile/wallet/CoinInfo'
import WalletHistory from './user/mobile/wallet/AssetHistory'
import WalletDepositDetail from './user/mobile/wallet/DepositDetail'
import Rewards from './user/Rewards'
import Saving from './user/Saving'
import TargetSavings from './user/TargetSavings'
import FixedSavings from './user/FixedSavings'
import FlexibleSavings from './user/FlexibleSavings'
import Cards from './user/Cards'
import Deposit from './user/Deposit'
import Withdraw from './user/Withdraw'
import Airtime from './user/Airtime'
import Data from './user/Data'
import Bills from './user/Bills'
import TradeCards from './user/TradeCards'
import TradeHistory from './user/TradeHistory'
import Settings from './user/Settings'
import ChangePassword from './user/ChangePassword'
import TransactionPin from './user/TransactionPin'
import UserNotFound from './user/NotFound'
import Home from './pages/index'
import AirtimeData from './pages/AirtimeData'
import GiftCards from './pages/GiftCards'
import PayBills from './pages/PayBills'
import Login from './auth/login'
import Register from './auth/register'
import ForgetPassword from './auth/forgetPassword'
import ResetPassword from './auth/resetPassword'
import VerifyEmail from './auth/verifyEmail'
import CryptoSwap from './pages/CryptoSwap'
import SpendGlobally from './pages/SpendGlobally'
import VirtualCard from './pages/VirtualCard'
import About from './pages/About'
import Security from './pages/Security'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import CookiePolicy from './pages/CookiePolicy'
import Community from './pages/Community'
import SystemStatus from './pages/SystemStatus'
import Blog from './pages/Blog'
import BlogPost from './pages/blog/BlogPost'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        <Route element={<GeneralLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/airtime" element={<AirtimeData />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/bills" element={<PayBills />} />
          <Route path="/virtual-card" element={<VirtualCard/>} />
          <Route path="/crypto-swap" element={<CryptoSwap/>} />
          <Route path="/spend-globally" element={<SpendGlobally/>} />
          <Route path="/about" element={<About />} />
          <Route path="/security" element={<Security />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/community" element={<Community />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
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
          <Route path="wallet" element={<Wallet />} />
          <Route path="wallet/coin/:symbol" element={<WalletCoin />} />
          <Route path="wallet/history" element={<WalletHistory />} />
          <Route path="wallet/history/:id" element={<WalletDepositDetail />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="savings" element={<Saving />} />
          <Route path="savings/target-savings" element={<TargetSavings />} />
          <Route path="savings/fixed-savings" element={<FixedSavings />} />
          <Route path="savings/flexible-savings" element={<FlexibleSavings />} />
          <Route path="cards" element={<Cards />} />
          <Route path="deposit"  element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="airtime" element={<Airtime />} />
          <Route path="data" element={<Data />} />
          <Route path="bills" element={<Bills />} />
          <Route path="trade-cards" element={<TradeCards />} />
          <Route path="trade-history" element={<TradeHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="transaction-pin" element={<TransactionPin />} />
          <Route path="*" element={<UserNotFound />} />
        </Route>

        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
