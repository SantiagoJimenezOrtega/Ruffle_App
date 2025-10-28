import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRaffleById, deleteRaffle } from '../services/raffleService';
import Navbar from '../components/Navbar';

export default function RaffleDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [raffleData, setRaffleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRaffleData();
  }, [id]);

  const loadRaffleData = async () => {
    try {
      const data = await getRaffleById(id);
      setRaffleData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este sorteo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await deleteRaffle(id);
      alert('Sorteo eliminado exitosamente');
      navigate('/dashboard');
    } catch (err) {
      alert('Error al eliminar el sorteo: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-white text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !raffleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-500/20 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-white font-semibold">Error: {error || 'Sorteo no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { raffle, participants, results } = raffleData;

  // Group results by participant
  const participantResults = {};
  results.forEach((result) => {
    if (!participantResults[result.participant_id]) {
      const participant = participants.find((p) => p.id === result.participant_id);
      participantResults[result.participant_id] = {
        name: participant?.name || 'Desconocido',
        months: [],
      };
    }
    participantResults[result.participant_id].months.push(result);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{raffle.name}</h1>
            {raffle.description && (
              <p className="text-white/80 text-lg">{raffle.description}</p>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                Eliminar Sorteo
              </button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="text-white/70 text-sm mb-1">Estado</div>
            <div className="text-xl font-bold text-white capitalize">{raffle.status}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="text-white/70 text-sm mb-1">Participantes</div>
            <div className="text-xl font-bold text-white">{participants.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="text-white/70 text-sm mb-1">Total Cupos</div>
            <div className="text-xl font-bold text-white">
              {participants.reduce((sum, p) => sum + p.slots, 0)}
            </div>
          </div>

          {raffle.monthly_amount > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
              <div className="text-white/70 text-sm mb-1">Monto Mensual</div>
              <div className="text-xl font-bold text-white">
                ${parseFloat(raffle.monthly_amount).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Participants List */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Participantes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participants.map((participant) => {
              const months = participantResults[participant.id]?.months || [];
              return (
                <div
                  key={participant.id}
                  className="bg-white/10 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{participant.name}</h3>
                    <span className="px-2 py-1 bg-white/20 rounded text-white text-sm">
                      {participant.slots} cupo{participant.slots > 1 ? 's' : ''}
                    </span>
                  </div>

                  {months.length > 0 && (
                    <div className="mt-3">
                      <p className="text-white/70 text-sm mb-2">Meses asignados:</p>
                      <div className="flex flex-wrap gap-2">
                        {months
                          .sort((a, b) => a.month_index - b.month_index)
                          .map((month) => (
                            <span
                              key={month.id}
                              className="px-3 py-1 bg-primary/30 border border-primary rounded text-white text-sm"
                            >
                              {month.month_display}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Results */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Calendario del Sorteo</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results
              .sort((a, b) => a.month_index - b.month_index)
              .map((result) => {
                const participant = participants.find((p) => p.id === result.participant_id);
                return (
                  <div
                    key={result.id}
                    className="bg-white/90 rounded-xl p-4 border-l-4 border-primary shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-200"
                  >
                    <div className="text-primary font-bold text-lg mb-1">
                      {result.month_display}
                    </div>
                    <div className="text-gray-800 font-semibold">
                      {participant?.name || 'Desconocido'}
                    </div>
                    {result.total_slots > 1 && (
                      <div className="text-sm text-gray-600 mt-1">
                        Cupo {result.slot_number} de {result.total_slots}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/80 hover:text-white transition-colors"
          >
            ← Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
