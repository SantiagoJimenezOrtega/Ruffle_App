export default function RaffleResults({ results }) {
  const exportToJSON = () => {
    const data = {
      fecha_sorteo: new Date().toISOString(),
      resultados: results
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, 'sorteo-cadena-ahorro.json');
  };

  const exportToCSV = () => {
    let csv = 'Mes,Año,Participante,Cupo\n';

    results.forEach(result => {
      csv += `"${result.display}",${result.year},"${result.participantName}",${result.slotNumber}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, 'sorteo-cadena-ahorro.csv');
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printResults = () => {
    window.print();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Resultados del Sorteo</h2>

      <div className="mb-6 p-4 bg-green-500/20 border-l-4 border-green-500 rounded-lg">
        <p className="text-white font-semibold">
          ✓ Sorteo realizado exitosamente! Ninguna persona tiene meses consecutivos.
        </p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={exportToJSON}
          className="px-5 py-2.5 bg-white/90 hover:bg-white text-primary font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Exportar JSON
        </button>
        <button
          onClick={exportToCSV}
          className="px-5 py-2.5 bg-white/90 hover:bg-white text-primary font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Exportar CSV
        </button>
        <button
          onClick={printResults}
          className="px-5 py-2.5 bg-white/90 hover:bg-white text-primary font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Imprimir
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white/90 rounded-xl p-5 border-l-4 border-primary shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-200"
          >
            <div className="text-lg font-bold text-primary mb-2">
              {result.display}
            </div>
            <div className="text-gray-800 font-semibold text-lg">
              {result.participantName}
            </div>
            {result.totalSlots > 1 && (
              <div className="text-sm text-gray-600 mt-1">
                Cupo {result.slotNumber} de {result.totalSlots}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
