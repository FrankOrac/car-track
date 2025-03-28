import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Components
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Components
import Dashboard from "./pages/dashboard/Dashboard";
import Vehicles from "./pages/vehicles/Vehicles";
import VehicleDetails from "./pages/vehicles/VehicleDetails";
import Maintenance from "./pages/maintenance/Maintenance";
import Geofences from "./pages/geofences/Geofences";
import Alerts from "./pages/alerts/Alerts";
import Profile from "./pages/profile/Profile";
import Subscription from "./pages/subscription/Subscription";

// Admin Components
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import SubscriptionPlans from "./pages/admin/SubscriptionPlans";
import PaymentHistory from "./pages/admin/PaymentHistory";

// Layout Components
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";

// Auth Provider
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="geofences" element={<Geofences />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="subscription" element={<Subscription />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
            <Route path="payments" element={<PaymentHistory />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
