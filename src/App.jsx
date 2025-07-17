import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ForgotPassPage from './pages/ForgotPassPage'
import OTPPage from './pages/OTPPage'
import ManagerNav from './components/Sidebar/M-SidBarNav'
import Order from './pages/M-DemoPages/Order'
import Menu from './pages/M-DemoPages/menus'
import Customers from './pages/M-DemoPages/customers'
import Analytics from './pages/M-DemoPages/Analytics'
import Settings from './pages/M-DemoPages/Settings'
import Landing from './pages/Landing'
import NotFoundPage from './pages/NotFoundPage'
import AdminNav from './components/Sidebar/A-sidBarNav'

import setupLocatorUI from '@locator/runtime'

if (process.env.NODE_ENV === 'development') {
  setupLocatorUI()
}
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Sidebar/>   */}
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPassPage />} />
          <Route path='/otp' element={<OTPPage />} />
          <Route path='/managerDashboard' element={<ManagerNav />} />
          <Route path='/orders' element={<Order />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/adminDashboard' element={<AdminNav />} />
          <Route path='*' element={<NotFoundPage />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
