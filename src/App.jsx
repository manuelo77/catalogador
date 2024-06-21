import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import 'moment/locale/es'; // Para formato de fecha en español
import './App.css';

function App() {
  const [excelData, setExcelData] = useState(null);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DDTHH:mm')); // Fecha y hora inicial
  const [endDate, setEndDate] = useState(moment().add(5, 'minutes').format('YYYY-MM-DDTHH:mm')); // Fecha y hora final
  const [incrementMinutes, setIncrementMinutes] = useState(5); // Incremento de minutos para la fecha de finalización
  const [bidIncrement, setBidIncrement] = useState(10000); // Incremento de la puja global

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // Procesar los datos para eliminar puntos en números
      const processedData = data.slice(1).map(row => (
        row.map(cell => typeof cell === 'string' && !isNaN(cell.replace(/\./g, '')) ? cell.replace(/\./g, '') : cell)
      ));
  
      setExcelData(processedData); // Asignar los datos procesados
    };
    reader.readAsBinaryString(file);
  };
  

  const handleExportCSV = () => {
    if (!excelData) return;

    // Formatear los datos para CSV
    const formattedData = excelData.map((row, index) => {
      const formattedLotNumber = String(row[0]).padStart(3, '0');
      const startDateTime = moment(startDate).format('MM/DD/YY hh:mm A');
      const endDateTime = moment(endDate).add(index * incrementMinutes, 'minutes').format('MM/DD/YY hh:mm A');
      return [formattedLotNumber, row[1], row[2], bidIncrement, startDateTime, endDateTime, row[3]];
    });

    // Agregar encabezados al CSV
    const csvHeaders = ['lote_nro', 'descripcion_', 'precio_base_', 'incremento de la puja', 'fecha de inicio', 'fecha de finalizacion', 'vendedor_'];
    const csvData = [csvHeaders, ...formattedData];

    return (
      <CSVLink data={csvData} filename={'exported_data.csv'} separator={'|'}>
        <button className="px-4 py-2 mt-4 font-semibold text-white bg-orange-500 rounded hover:bg-orange-700">Exportar a CSV</button>
      </CSVLink>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-8 text-2xl font-bold text-center">Importar y exportar datos desde Excel con fechas configurables</h1>
      <div className="p-4">
      <a href="/formato_catalogo.xlsx" target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">Descargar ejemplo de catalogo en excel</a>
    </div>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".xlsx, .xls"
          className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Fecha y hora inicial:</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Fecha y hora final:</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Incremento de minutos para la fecha de finalización:</label>
        <input
          type="number"
          value={incrementMinutes}
          min={1}
          step={1}
          onChange={(e) => setIncrementMinutes(parseInt(e.target.value))}
          className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Incremento de la puja global:</label>
        <input
          type="number"
          value={bidIncrement}
          min={1}
          step={1}
          onChange={(e) => setBidIncrement(parseInt(e.target.value))}
          className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {excelData && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">lote_nro</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">descripcion</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">precio base</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">incremento de la puja</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">fecha de inicio</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">fecha de finalizacion</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">vendedor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {excelData.map((row, index) => (
                    <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">{String(row[0]).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row[1].replace(/\n/g, ' ')}</td> {/* Reemplazar saltos de línea con espacios */}
                    <td className="px-6 py-4 text-sm text-gray-900">{row[2]}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bidIncrement}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{moment(startDate).format('MM/DD/YY hh:mm A')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{moment(endDate).add(index * incrementMinutes, 'minutes').format('MM/DD/YY hh:mm A')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {handleExportCSV()}
        </>
      )}
    </div>
  );
}

export default App;
