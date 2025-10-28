import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllRaffles } from '../services/raffleService';
import Navbar from '../components/Navbar';

export default function ParticipantDashboard() {
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
      // Filter only active raffles for participants
      setRaffles(data.filter((r) => r.status === 'active'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mi Dashboard</h1>
          <p className="text-white/80 text-lg">
            Bienvenido, {profile?.full_name}
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            ¿Cómo funciona la cadena de ahorro?
          </h2>
          <ul className="text-white/90 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Cada participante recibe un mes asignado para recibir el ahorro</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Todos los participantes pagan mensualmente el monto acordado</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>El mes que te corresponde, recibes el total acumulado</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consulta con el administrador sobre sorteos disponibles</span>
            </li>
          </ul>
        </div>

        {/* Raffles List */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Sorteos Activos
          </h2>

          {loading && (
            <p className="text-white/70 text-center py-8">Cargando sorteos...</p>
          )}

          {error && (
            <div className="bg-red-500/20 border-l-4 border-red-500 rounded p-4">
              <p className="text-white">Error: {error}</p>
            </div>
          )}

          {!loading && !error && raffles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg mb-4">
                No hay sorteos activos en este momento.
              </p>
              <p className="text-white/60 text-sm">
                Contacta al administrador para más información.
              </p>
            </div>
          )}

          {!loading && !error && raffles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {raffles.map((raffle) => (
                <div
                  key={raffle.id}
                  className="bg-white/10 rounded-lg p-5 border border-white/10 hover:bg-white/15 transition-all"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {raffle.name}
                    </h3>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/20 text-green-300 border-green-500">
                      Activo
                    </div>
                  </div>

                  {raffle.description && (
                    <p className="text-white/80 mb-3 text-sm">
                      {raffle.description}
                    </p>
                  )}

                  {raffle.monthly_amount > 0 && (
                    <p className="text-white/70 text-sm mb-4">
                      Monto mensual:{' '}
                      <span className="font-semibold text-white text-lg">
                        ${parseFloat(raffle.monthly_amount).toLocaleString()}
                      </span>
                    </p>
                  )}

                  <p className="text-white/60 text-xs mb-4">
                    Creado el{' '}
                    {new Date(raffle.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>

                  <Link
                    to={`/sorteo/${raffle.id}`}
                    className="inline-block px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Ver Detalles
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
