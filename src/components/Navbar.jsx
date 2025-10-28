import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await signOut();
    }
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-white text-xl font-bold">
                Cadena de Ahorro
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-white/90 text-sm">
                  <span className="font-semibold">
                    {profile?.full_name || user.email}
                  </span>
                  {profile?.role && (
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded text-xs">
                      {profile.role === 'admin' ? 'Admin' : 'Participante'}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-md"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
