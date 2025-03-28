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
import VehicleMap from "./pages/dashboard/VehicleMap";
import VehicleDetail from "./pages/dashboard/VehicleDetail";
import VehicleList from "./pages/vehicles/VehicleList";
import AddVehicle from "./pages/vehicles/AddVehicle";
import EditVehicle from "./pages/vehicles/EditVehicle";
import Maintenance from "./pages/maintenance/Maintenance";
import Geofences from "./pages/geofences/Geofences";
import Alerts from "./pages/alerts/Alerts";
import Profile from "./pages/profile/Profile";
import Subscription from "./pages/subscription/Subscription";
import SubscriptionPlans from "./pages/subscription/SubscriptionPlans";
import PaymentHistory from "./pages/subscription/PaymentHistory";

// Admin Components
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserProfile from "./pages/profile/UserProfile";

// Layout Components
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import AppLayout from "./components/Layout/AppLayout";

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

          {/* Protected Routes */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="vehicle-map" element={<VehicleMap />} />
              <Route path="vehicles" element={<VehicleList />} />
              <Route path="vehicles/add" element={<AddVehicle />} />
              <Route path="vehicles/:id" element={<VehicleDetail />} />
              <Route path="vehicles/edit/:id" element={<EditVehicle />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="geofences" element={<Geofences />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={<Subscription />} />
              <Route
                path="subscription/plans"
                element={<SubscriptionPlans />}
              />
              <Route
                path="subscription/payments"
                element={<PaymentHistory />}
              />
              <Route path="settings" element={<Settings />} />
            </Route>
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
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
