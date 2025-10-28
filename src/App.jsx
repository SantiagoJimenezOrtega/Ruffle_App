import { useState } from 'react';
import ParticipantForm from './components/ParticipantForm';
import RaffleResults from './components/RaffleResults';
import { performRaffle } from './utils/raffleLogic';

function App() {
  const [participants, setParticipants] = useState([]);
  const [raffleResults, setRaffleResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAddParticipant = (participant) => {
    setParticipants([...participants, participant]);
    setRaffleResults(null); // Reset results when participants change
    setError(null);
  };

  const handleRemoveParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
    setRaffleResults(null); // Reset results when participants change
    setError(null);
  };

  const handlePerformRaffle = () => {
    const result = performRaffle(participants);

    if (result.success) {
      setRaffleResults(result.results);
      setError(null);
    } else {
      setError(result.error);
      setRaffleResults(null);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Sorteo de Cadena de Ahorro
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
                onClick={handlePerformRaffle}
                className="px-10 py-4 bg-primary hover:bg-primary-dark text-white text-xl font-bold rounded-xl shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-200"
              >
                🎲 Realizar Sorteo
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-white font-semibold">❌ {error}</p>
            </div>
          )}

          {raffleResults && <RaffleResults results={raffleResults} />}
        </div>

        <footer className="mt-12 text-center text-white/60 text-sm">
          <p>Sistema de Cadena de Ahorro - 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
