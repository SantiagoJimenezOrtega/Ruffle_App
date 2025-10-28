import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';
import CreateRaffle from './pages/CreateRaffle';
import RaffleDetail from './pages/RaffleDetail';
import PublicRaffleView from './pages/PublicRaffleView';

function DashboardRouter() {
  const { profile, loading } = useAuth();

  console.log('DashboardRouter - Profile:', profile);
  console.log('DashboardRouter - Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
        <p className="text-white text-xl">Cargando perfil...</p>
      </div>
    );
  }

  if (profile?.role === 'admin') {
    console.log('Redirecting to Admin Dashboard');
    return <AdminDashboard />;
  }

  console.log('Redirecting to Participant Dashboard');
  return <ParticipantDashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public route for guests */}
      <Route path="/ver/:id" element={<PublicRaffleView />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />

      <Route
        path="/crear-sorteo"
        element={
          <ProtectedRoute requireAdmin>
            <CreateRaffle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sorteo/:id"
        element={
          <ProtectedRoute>
            <RaffleDetail />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
