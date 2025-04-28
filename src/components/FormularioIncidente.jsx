import React, { useState } from 'react';

const EstadoIncidente = {
  REVISION: 'En Revisión',
  AVANCE: 'Avance',
  RECUPERADO: 'Recuperado'
};

const FormularioIncidente = () => {
  // eslint-disable-next-line no-unused-vars
  const [estado, setEstado] = useState(EstadoIncidente.REVISION);
  const [prioridad, setPrioridad] = useState('P1');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [situacionActual, setSituacionActual] = useState('');
  const [impacto, setImpacto] = useState('');
  const [nota, setNota] = useState('');
  const [accionesRecuperacion, setAccionesRecuperacion] = useState('');
  const [causaRaiz, setCausaRaiz] = useState('');
  const [mostrarTabla, setMostrarTabla] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [tiempos, setTiempos] = useState([
    { inicio: '06:47:45', fin: '07:04:47', total: '0:17:02' },
    { inicio: '07:51:45', fin: '07:59:45', total: '0:08:00' },
    { inicio: '08:43:08', fin: '08:48:02', total: '0:04:54' }
  ]);
  const [diagnostico, setDiagnostico] = useState('');
  
  // Calcular duración automáticamente si hay fechas de inicio y fin
  const calcularDuracion = () => {
    if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) return "00h 00min 00s";
    
    // Aquí iría la lógica real para calcular la duración
    return "00h 00min 00s";
  };
  
  // Obtener color según estado
  const getColorEstado = () => {
    switch(estado) {
      case EstadoIncidente.REVISION:
        return '#FFD700'; // Amarillo
      case EstadoIncidente.AVANCE:
        return '#FFA07A'; // Salmón
      case EstadoIncidente.RECUPERADO:
        return '#90EE90'; // Verde claro
      default:
        return '#FFD700';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Sección del formulario */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Formulario de Gestión de Incidentes</h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Estado del Incidente</label>
              <select 
                className="w-full p-2 border rounded"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value={EstadoIncidente.REVISION}>En Revisión</option>
                <option value={EstadoIncidente.AVANCE}>Avance</option>
                <option value={EstadoIncidente.RECUPERADO}>Recuperado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Prioridad</label>
              <select 
                className="w-full p-2 border rounded"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Fecha Inicio</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Hora Inicio</label>
              <input 
                type="time" 
                className="w-full p-2 border rounded"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>
          </div>

          {estado === EstadoIncidente.RECUPERADO && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Fecha Fin</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Hora Fin</label>
                  <input 
                    type="time" 
                    className="w-full p-2 border rounded"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Acciones de recuperación</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Acción que permitió la recuperación del servicio"
                  value={accionesRecuperacion}
                  onChange={(e) => setAccionesRecuperacion(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Causa raíz</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Descripción de la causa"
                  value={causaRaiz}
                  onChange={(e) => setCausaRaiz(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={mostrarTabla}
                    onChange={() => setMostrarTabla(!mostrarTabla)}
                  />
                  <span className="text-sm font-medium">Incluir tabla de tiempos</span>
                </label>
              </div>

              {mostrarTabla && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Diagnóstico</label>
                  <textarea 
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Diagnóstico del incidente"
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                  ></textarea>
                </div>
              )}
            </>
          )}

          {(estado === EstadoIncidente.REVISION || estado === EstadoIncidente.AVANCE) && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Situación actual</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="Descripción que ayude a entender en donde está la revisión"
                value={situacionActual}
                onChange={(e) => setSituacionActual(e.target.value)}
              ></textarea>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Impacto</label>
            <textarea 
              className="w-full p-2 border rounded"
              rows="2"
              placeholder="Afectación servicio / usuarios"
              value={impacto}
              onChange={(e) => setImpacto(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Nota</label>
            <textarea 
              className="w-full p-2 border rounded"
              rows="2"
              placeholder="Observaciones con detalle que permitan brindar más información en el caso que amerite"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Sección de vista previa */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Vista previa del comunicado</h2>
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200 max-w-2xl mx-auto">
          <div className="text-center mb-2">
            <h1 className="text-navy-700 font-bold text-xl">GERENCIA DE PRODUCCIÓN Y SERVICIOS</h1>
            <h2 className="text-blue-700 text-lg">Gestión de Incidentes</h2>
            <hr className="my-2 border-blue-200" />
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-blue-800 text-lg">DESCRIPCIÓN DEL INCIDENTE</div>
              <div className="bg-blue-100 px-3 py-1 rounded-md text-center">
                <span className="font-bold">Prioridad</span><br/>
                <span className="text-center">{prioridad}</span>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: getColorEstado() }}
              ></div>
              <span className="text-green-600 font-medium">{estado}</span>
            </div>

            <div className="mb-3">
              <div className="flex items-center">
                <span className="text-blue-500">📅</span>
                <span className="ml-2">Inicio: {fechaInicio || 'aaaa-mm-dd'} Hora: {horaInicio || 'hh:mm'}</span>
              </div>
              
              {estado === EstadoIncidente.RECUPERADO && (
                <>
                  <div className="flex items-center">
                    <span className="text-blue-500">📅</span>
                    <span className="ml-2">Inicio: {fechaFin || 'aaaa-mm-dd'} Hora: {horaFin || 'hh:mm'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500">⏱️</span>
                    <span className="ml-2">Duración: {calcularDuracion()}</span>
                  </div>
                </>
              )}
            </div>

            {mostrarTabla && estado === EstadoIncidente.RECUPERADO && (
              <div className="mb-3">
                <table className="w-full bg-gray-800 text-white text-sm">
                  <thead>
                    <tr>
                      <th className="p-1 border border-gray-700">HORA INICIO</th>
                      <th className="p-1 border border-gray-700">HORA FIN</th>
                      <th className="p-1 border border-gray-700">TIEMPO TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiempos.map((tiempo, index) => (
                      <tr key={index}>
                        <td className="p-1 border border-gray-700">{tiempo.inicio}</td>
                        <td className="p-1 border border-gray-700">{tiempo.fin}</td>
                        <td className="p-1 border border-gray-700">{tiempo.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-2">
                  <div><strong>Diagnóstico:</strong> {diagnostico || 'Descripción del diagnóstico.'}</div>
                </div>
              </div>
            )}

            {estado === EstadoIncidente.RECUPERADO && (
              <>
                <div className="mb-2">
                  <strong>Acciones de recuperación:</strong> {accionesRecuperacion || 'Acción que permitió la recuperación del servicio'}
                </div>
                <div className="mb-2">
                  <strong>Causa raíz:</strong> {causaRaiz || 'Descripción de la causa'}
                </div>
              </>
            )}

            {(estado === EstadoIncidente.REVISION || estado === EstadoIncidente.AVANCE) && (
              <div className="mb-2">
                <strong>Situación actual:</strong> {situacionActual || 'Descripción que ayude a entender en donde está la revisión.'}
              </div>
            )}

            <div className="mb-2">
              <strong>Impacto:</strong> {impacto || 'Afectación servicio / usuarios'}
            </div>

            {nota && (
              <div className="mb-2">
                <span className="text-orange-500">📣</span> <strong>NOTA:</strong> {nota}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioIncidente;
