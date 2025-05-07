import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Theme
import theme from './styles/theme';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuth2Success from "./pages/OAuth2Success";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import UserProfile from './pages/UserProfile';
import UserBookings from './pages/UserBookings';
import NotFound from "./pages/NotFound";

// Routes
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home2" element={<Home2 />} />
              <Route path="/restaurants" element={<RestaurantList />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/booking/:restaurantId" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth2/success" element={<OAuth2Success />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}> {/* Or adjust ProtectedRoute logic */}
                <Route path="/bookings" element={<UserBookings />} />
                <Route
                  path="/booking/:restaurantId"
                  element={<Booking />}
                />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['RESTAURANT_MANAGER']} />}>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              </Route>
              <Route path="/booking" element={<Navigate to="/" replace />} />
              <Route
                  path="/booking/:restaurantId"
                  element={
                    <ProtectedRoute> {/* Keep if booking requires login */}
                      <Booking /> {/* <--- Use the existing Booking component */}
                    </ProtectedRoute>
                  }
              />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
