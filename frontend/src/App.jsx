import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public
import Home from './Components/Home';

// User
import Login from './User/Login';
import Signup from './User/Signup';
import Uhome from './User/Uhome';
import Products from './User/Products';
import Uitem from './User/Uitem';
import MyOrders from './User/MyOrders';

// Seller
import Slogin from './Seller/Slogin';
import Ssignup from './Seller/Ssignup';
import Shome from './Seller/Shome';
import Addbook from './Seller/Addbook';
import MyProducts from './Seller/MyProducts';
import SOrders from './Seller/Orders';

// Admin
import Alogin from './Admin/Alogin';
import Asignup from './Admin/Asignup';
import Ahome from './Admin/Ahome';
import Users from './Admin/Users';
import SellerAdmin from './Admin/Seller';
import Items from './Admin/items';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="loading-wrapper"><div className="spinner" /></div>;
  if (!user || role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<Home />} />

      {/* User Auth */}
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/signup" element={<Signup />} />

      {/* User Protected */}
      <Route path="/user/home" element={<ProtectedRoute allowedRole="user"><Uhome /></ProtectedRoute>} />
      <Route path="/user/products" element={<ProtectedRoute allowedRole="user"><Products /></ProtectedRoute>} />
      <Route path="/user/book/:id" element={<ProtectedRoute allowedRole="user"><Uitem /></ProtectedRoute>} />
      <Route path="/user/orders" element={<ProtectedRoute allowedRole="user"><MyOrders /></ProtectedRoute>} />

      {/* Seller Auth */}
      <Route path="/seller/login" element={<Slogin />} />
      <Route path="/seller/signup" element={<Ssignup />} />

      {/* Seller Protected */}
      <Route path="/seller/home" element={<ProtectedRoute allowedRole="seller"><Shome /></ProtectedRoute>} />
      <Route path="/seller/add-book" element={<ProtectedRoute allowedRole="seller"><Addbook /></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute allowedRole="seller"><MyProducts /></ProtectedRoute>} />
      <Route path="/seller/orders" element={<ProtectedRoute allowedRole="seller"><SOrders /></ProtectedRoute>} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<Alogin />} />
      <Route path="/admin/signup" element={<Asignup />} />

      {/* Admin Protected */}
      <Route path="/admin/home" element={<ProtectedRoute allowedRole="admin"><Ahome /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><Users /></ProtectedRoute>} />
      <Route path="/admin/sellers" element={<ProtectedRoute allowedRole="admin"><SellerAdmin /></ProtectedRoute>} />
      <Route path="/admin/books" element={<ProtectedRoute allowedRole="admin"><Items /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1230',
              color: '#f1f5f9',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0d1230' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0d1230' } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
