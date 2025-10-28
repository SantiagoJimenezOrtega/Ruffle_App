import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRaffleById, deleteRaffle, swapRaffleResults } from '../services/raffleService';
import Navbar from '../components/Navbar';

export default function RaffleDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [raffleData, setRaffleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [swapping, setSwapping] = useState(false);

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

  const handleResultClick = (result) => {
    if (!isAdmin) return;

    if (!selectedResult) {
      setSelectedResult(result);
    } else if (selectedResult.id === result.id) {
      setSelectedResult(null);
    } else {
      handleSwap(selectedResult, result);
    }
  };

  const handleSwap = async (result1, result2) => {
    if (!confirm(`¿Intercambiar ${result1.month_display} con ${result2.month_display}?`)) {
      setSelectedResult(null);
      return;
    }

    setSwapping(true);
    try {
      console.log('Intercambiando:', result1.id, result2.id);
      await swapRaffleResults(result1.id, result2.id);
      console.log('Swap completado, recargando datos...');
      await loadRaffleData();
      console.log('Datos recargados');
      setSelectedResult(null);
      alert('✅ Intercambio realizado exitosamente');
    } catch (err) {
      console.error('Error al intercambiar:', err);
      alert('Error al intercambiar: ' + err.message);
    } finally {
      setSwapping(false);
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/ver/${id}`;
    navigator.clipboard.writeText(publicUrl);
    alert('✅ Link público copiado al portapapeles!\n\n' + publicUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-900 dark:text-white text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !raffleData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-500/20 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-gray-900 dark:text-white font-semibold">Error: {error || 'Sorteo no encontrado'}</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{raffle.name}</h1>
            {raffle.description && (
              <p className="text-gray-600 dark:text-gray-400 text-lg">{raffle.description}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyPublicLink}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              📋 Copiar Link Público
            </button>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                Eliminar Sorteo
              </button>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Estado</div>
            <div className="text-xl font-bold text-white capitalize">{raffle.status}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Participantes</div>
            <div className="text-xl font-bold text-white">{participants.length}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Cupos</div>
            <div className="text-xl font-bold text-white">
              {participants.reduce((sum, p) => sum + p.slots, 0)}
            </div>
          </div>

          {raffle.monthly_amount > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Monto Mensual</div>
              <div className="text-xl font-bold text-white">
                ${parseFloat(raffle.monthly_amount).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Participants List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Meses asignados:</p>
                      <div className="flex flex-wrap gap-2">
                        {months
                          .sort((a, b) => a.month_index - b.month_index)
                          .map((month) => (
                            <span
                              key={month.id}
                              className="px-3 py-1 bg-primary/30 border border-blue-500 rounded text-white text-sm"
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Calendario del Sorteo</h2>
            {isAdmin && (
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/10 px-3 py-1.5 rounded-lg">
                {selectedResult ? '👉 Selecciona otro mes para intercambiar' : 'Click en un mes para intercambiar'}
              </div>
            )}
          </div>

          {swapping && (
            <div className="mb-4 p-3 bg-yellow-500/20 border-l-4 border-yellow-500 rounded-lg">
              <p className="text-gray-900 dark:text-white font-semibold">🔄 Intercambiando posiciones...</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results
              .sort((a, b) => a.month_index - b.month_index)
              .map((result) => {
                const participant = participants.find((p) => p.id === result.participant_id);
                const isSelected = selectedResult?.id === result.id;
                return (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`bg-white/90 rounded-xl p-4 border-l-4 shadow-md transition-all duration-200 ${
                      isAdmin ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''
                    } ${
                      isSelected
                        ? 'border-yellow-500 ring-4 ring-yellow-500/50 scale-105'
                        : 'border-blue-500'
                    }`}
                  >
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-1">
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
            className="text-gray-600 dark:text-gray-400 hover:text-white transition-colors"
          >
            ← Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
