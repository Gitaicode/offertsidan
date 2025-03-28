import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { SeedPage } from './pages/SeedPage';
import { AddUserPage } from './pages/AddUserPage';
import { AdminPage } from './pages/AdminPage';
import { useAuth } from './context/AuthContext';
import './App.css'

// Skyddad route-komponent
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' | 'ue' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Laddar...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/seed" element={<SeedPage />} />
          <Route path="/add-user" element={
            <ProtectedRoute requiredRole="admin">
              <AddUserPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="ue">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
            </ProtectedRoute>
          } />
          {/* Lägg till fler routes här när vi skapar sidorna */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
