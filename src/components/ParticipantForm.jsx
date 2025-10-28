import { useState } from 'react';

export default function ParticipantForm({ participants, onAddParticipant, onRemoveParticipant }) {
  const [name, setName] = useState('');
  const [slots, setSlots] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    onAddParticipant({
      id: Date.now(),
      name: name.trim(),
      slots: parseInt(slots)
    });

    setName('');
    setSlots(1);
  };

  const totalSlots = participants.reduce((sum, p) => sum + p.slots, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Agregar Participantes</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del participante"
            className="flex-1 min-w-[200px] px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white/90 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-primary/50 transition-all"
          />

          <select
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
            className="px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white/90 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="1">1 Cupo</option>
            <option value="2">2 Cupos</option>
          </select>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Agregar
          </button>
        </div>
      </form>

      {participants.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{participants.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Participantes</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{totalSlots}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Cupos</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{totalSlots}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Meses Necesarios</div>
            </div>
          </div>

          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex justify-between items-center bg-white/90 rounded-lg p-4 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="font-semibold text-gray-800">{participant.name}</div>
                  <div className="text-sm text-gray-600">
                    {participant.slots} cupo{participant.slots > 1 ? 's' : ''}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveParticipant(participant.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {participants.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          No hay participantes agregados
        </p>
      )}
    </div>
  );
}
