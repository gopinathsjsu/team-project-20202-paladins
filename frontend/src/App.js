import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import theme from './styles/theme';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import Home from "./pages/Home";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuth2Success from "./pages/OAuth2Success";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import CreateRestaurant from "./pages/manager/CreateRestaurant";
import NotFound from "./pages/NotFound";

// Routes
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/booking/:restaurantId" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/success" element={<OAuth2Success />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['RESTAURANT_MANAGER']} />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/create" element={<CreateRestaurant />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
