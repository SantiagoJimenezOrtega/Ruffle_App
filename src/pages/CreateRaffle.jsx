import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipantForm from '../components/ParticipantForm';
import RaffleResults from '../components/RaffleResults';
import RaffleModal from '../components/RaffleModal';
import Navbar from '../components/Navbar';
import { performRaffle } from '../utils/raffleLogic';
import { saveCompleteRaffle } from '../services/raffleService';

export default function CreateRaffle() {
  const [participants, setParticipants] = useState([]);
  const [raffleResults, setRaffleResults] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedRaffleId, setSavedRaffleId] = useState(null);
  const navigate = useNavigate();

  const handleAddParticipant = (participant) => {
    setParticipants([...participants, participant]);
    setRaffleResults(null);
    setError(null);
    setSuccess(null);
  };

  const handleRemoveParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id));
    setRaffleResults(null);
    setError(null);
    setSuccess(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const performRaffleLogic = () => {
    return performRaffle(participants);
  };

  const handleSaveRaffle = async ({ name, monthlyAmount, results }) => {
    try {
      setError(null);
      setSuccess(null);

      const raffleInfo = {
        name: name,
        monthlyAmount: monthlyAmount,
        startMonth: 10, // November (0-indexed)
        startYear: 2025,
      };

      const savedData = await saveCompleteRaffle(raffleInfo, participants, results);

      setRaffleResults(results);
      setSavedRaffleId(savedData.raffle.id);
      setSuccess(`¡Sorteo "${name}" guardado exitosamente en la base de datos!`);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      // Redirect to raffle details after 2 seconds
      setTimeout(() => {
        navigate(`/sorteo/${savedData.raffle.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving raffle:', error);
      setError('Error al guardar el sorteo: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Crear Nuevo Sorteo
          </h1>
          <p className="text-white/80 text-lg">
            Sistema de asignación de meses con restricción de no consecutivos
          </p>
        </div>

        <div className="space-y-6">
          <ParticipantForm
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
          />

          {participants.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleOpenModal}
                className="px-10 py-4 bg-primary hover:bg-primary-dark text-white text-xl font-bold rounded-xl shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-200"
              >
                🎲 Realizar Sorteo
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border-l-4 border-green-500 rounded-lg p-4">
              <p className="text-white font-semibold">✅ {success}</p>
              {savedRaffleId && (
                <p className="text-white/80 text-sm mt-1">
                  ID del sorteo: {savedRaffleId}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-white font-semibold">❌ {error}</p>
            </div>
          )}

          {raffleResults && (
            <div id="results-section">
              <RaffleResults results={raffleResults} />
            </div>
          )}
        </div>
      </div>

      <RaffleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPerformRaffle={performRaffleLogic}
        onSave={handleSaveRaffle}
      />
    </div>
  );
}
