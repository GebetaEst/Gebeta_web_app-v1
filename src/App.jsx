// App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassPage from "./pages/ForgotPassPage";
import OTPPage from "./pages/OTPPage";
import ManagerNav from "./components/Sidebar/M-SidBarNav";
import Order from "./pages/M-DemoPages/Order";
import Menu from "./pages/M-DemoPages/menus";
import Customers from "./pages/M-DemoPages/customers";
import Analytics from "./pages/M-DemoPages/Analytics";
import Settings from "./pages/M-DemoPages/Settings";
import Landing from "./pages/Landing";
import NotFoundPage from "./pages/NotFoundPage";
import AdminNav from "./components/Sidebar/A-sidBarNav";
import EditUser from "./components/UserForms/A-EditUser";
import ProtectedRoute from "./components/ProtectedRoute";
import Verify from "./pages/verify";
import GlobalNotifications from "./components/GlobalNotifications";
import useUserStore from "./Store/UseStore";
import MoneyFlow from "./pages/A-DemoPages/A-analytics";
import { useOrderFetcher } from "./services/OrderPollingService"; // Correct import

function App() {
  const { user } = useUserStore();

  // Call the custom hook to handle order fetching
  // This hook encapsulates the polling and WebSocket logic.
  // The 'user' dependency will automatically handle starting/stopping.
  useOrderFetcher();

  return (
    <>
      <GlobalNotifications />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/money-flow" element={<MoneyFlow />} />

          <Route
            path="/managerDashboard"
            element={
              <ManagerNav />
            }
          />
          <Route
            path="/adminDashboard"
            element={
              // <ProtectedRoute allowedRoles={["Admin"]}>
              // </ProtectedRoute>
              <AdminNav />
            }
          />
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;