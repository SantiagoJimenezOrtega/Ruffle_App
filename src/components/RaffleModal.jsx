import { useState } from 'react';

export default function RaffleModal({ isOpen, onClose, onSave, onPerformRaffle }) {
  const [raffleName, setRaffleName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveAndPerform = async () => {
    if (!raffleName.trim()) {
      alert('Por favor ingresa un nombre para el sorteo');
      return;
    }

    setSaving(true);

    try {
      // Perform raffle first
      const raffleResult = await onPerformRaffle();

      if (raffleResult.success) {
        // Then save to database
        await onSave({
          name: raffleName.trim(),
          monthlyAmount: parseFloat(monthlyAmount) || 0,
          results: raffleResult.results
        });
      }

      // Reset form
      setRaffleName('');
      setMonthlyAmount('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el sorteo: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Configurar Sorteo
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del Sorteo *
            </label>
            <input
              type="text"
              value={raffleName}
              onChange={(e) => setRaffleName(e.target.value)}
              placeholder="Ej: Cadena Noviembre 2025"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monto Mensual (opcional)
            </label>
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              placeholder="Ej: 1000000"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              El sorteo se realizará y guardará automáticamente en la base de datos.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveAndPerform}
            disabled={saving || !raffleName.trim()}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Realizar y Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
