import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Navigate based on role (will be handled by App routing)
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-purple-600 to-purple-900">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Bienvenido</h1>
            <p className="text-white/80">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border-l-4 border-red-500 rounded p-4">
                <p className="text-white text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/90 border-2 border-white/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/90 border-2 border-white/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-white font-semibold hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
