import React, { useState } from 'react';
import './App.css';

function App() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(2);
  const [hour, setHour] = useState(16);
  const [minute, setMinute] = useState(0);
  const [lotes, setLotes] = useState([]);
  const [numLotes, setNumLotes] = useState(1);
  const [incrementMinutes, setIncrementMinutes] = useState(5);

  const addLotes = () => {
    let newLotes = [];
    let currentYear = year;
    let currentMonth = month;
    let currentDay = day;
    let currentHour = hour;
    let currentMinute = minute;

    for (let i = 0; i < numLotes; i++) {
      const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}T${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

      newLotes.push(startDate);

      // Actualiza la hora y minuto para el próximo lote
      let newMinute = currentMinute + incrementMinutes;
      let newHour = currentHour;
      let newDay = currentDay;
      let newMonth = currentMonth;
      let newYear = currentYear;

      if (newMinute >= 60) {
        newMinute = newMinute % 60;
        newHour++;
        if (newHour >= 24) {
          newHour = newHour % 24;
          newDay++;
          // Ajusta los días del mes
          if (newDay > 30) { // Simplificación: todos los meses tienen 30 días
            newDay = 1;
            newMonth++;
            if (newMonth > 12) {
              newMonth = 1;
              newYear++;
            }
          }
        }
      }
      currentMinute = newMinute;
      currentHour = newHour;
      currentDay = newDay;
      currentMonth = newMonth;
      currentYear = newYear;
    }

    setLotes(newLotes);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + lotes.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lotes.csv");
    document.body.appendChild(link);

    link.click();
  };

  return (
    <div className='bg-slate-300 p-4'>
      <div className='flex flex-col items-center'>
        <div className='contenedor p-4 border border-gray-400 rounded'>
          <div className='contenido'>
            <label className='block mb-2'>
              Año
              <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} className='border p-2 w-full' />
            </label>
            <label className='block mb-2'>
              Mes
              <input type="number" value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className='border p-2 w-full' />
            </label>
            <label className='block mb-2'>
              Día
              <input type="number" value={day} onChange={(e) => setDay(parseInt(e.target.value))} className='border p-2 w-full' />
            </label>
            <label className='block mb-2'>
              Hora
              <input type="number" value={hour} onChange={(e) => setHour(parseInt(e.target.value))} className='border p-2 w-full' />
            </label>
            <label className='block mb-2'>
              Minuto
              <input type="number" value={minute} onChange={(e) => setMinute(parseInt(e.target.value))} className='border p-2 w-full' />
            </label>
            <label className='block mb-2'>
              Cantidad de Lotes
              <input type="number" value={numLotes} onChange={(e) => setNumLotes(parseInt(e.target.value))} className='border p-2 w-full' />
            </label>
            <label className='block mb-2'>
              Incremento de Minutos
              <input type="number" value={incrementMinutes} onChange={(e) => setIncrementMinutes(parseInt(e.target.value))} className='border p-2 w-full' />
            </label>
            <button onClick={addLotes} className='bg-blue-500 text-white px-4 py-2 rounded mt-4'>Agregar Lotes</button>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <h2 className='text-lg font-bold mb-4'>Lotes</h2>
        <ul>
          {lotes.map((lote, index) => (
            <li key={index} className='mb-2'>
              {lote}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleExport} className='bg-green-500 text-white px-4 py-2 rounded mt-4'>Exportar CSV</button>
    </div>
  );
}

export default App;
