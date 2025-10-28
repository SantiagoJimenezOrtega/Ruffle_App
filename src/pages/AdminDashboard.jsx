import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllRaffles } from '../services/raffleService';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRaffles();
  }, []);

  const loadRaffles = async () => {
    try {
      const data = await getAllRaffles();
      setRaffles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-300 border-green-500',
      completed: 'bg-blue-500/20 text-blue-300 border-blue-500',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500',
    };

    const labels = {
      active: 'Activo',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Bienvenido, {profile?.full_name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Sorteos</div>
            <div className="text-3xl font-bold text-white">{raffles.length}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Sorteos Activos</div>
            <div className="text-3xl font-bold text-white">
              {raffles.filter((r) => r.status === 'active').length}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completados</div>
            <div className="text-3xl font-bold text-white">
              {raffles.filter((r) => r.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            to="/crear-sorteo"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-200"
          >
            + Crear Nuevo Sorteo
          </Link>
        </div>

        {/* Raffles List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            Historial de Sorteos
          </h2>

          {loading && (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">Cargando sorteos...</p>
          )}

          {error && (
            <div className="bg-red-500/20 border-l-4 border-red-500 rounded p-4">
              <p className="text-white">Error: {error}</p>
            </div>
          )}

          {!loading && !error && raffles.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No hay sorteos creados aún.
            </p>
          )}

          {!loading && !error && raffles.length > 0 && (
            <div className="space-y-4">
              {raffles.map((raffle) => (
                <div
                  key={raffle.id}
                  className="bg-white/10 rounded-lg p-5 border border-white/10 hover:bg-white/15 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {raffle.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Creado el{' '}
                        {new Date(raffle.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {getStatusBadge(raffle.status)}
                  </div>

                  {raffle.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{raffle.description}</p>
                  )}

                  {raffle.monthly_amount > 0 && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Monto mensual:{' '}
                      <span className="font-semibold text-white">
                        ${parseFloat(raffle.monthly_amount).toLocaleString()}
                      </span>
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/sorteo/${raffle.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
