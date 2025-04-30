import React, { useState, useRef, useEffect } from 'react';

const EstadoIncidente = {
  REVISION: 'En Revisión',
  AVANCE: 'Avance',
  RECUPERADO: 'Recuperado'
};

const FormularioIncidente = () => {
  // Valores para cálculo de prioridad
  const [afectacionTotal, setAfectacionTotal] = useState(false);
  const [afectacionParcial, setAfectacionParcial] = useState(false);
  const [delayIncidente, setDelayIncidente] = useState(false);
  const [impactoMasivo, setImpactoMasivo] = useState(false);
  const [impactoMultiple, setImpactoMultiple] = useState(false);
  const [impactoPuntual, setImpactoPuntual] = useState(true); // Por defecto
  const [criticaUrgencia, setCriticaUrgencia] = useState(false);
  const [altaUrgencia, setAltaUrgencia] = useState(false);
  const [mediaUrgencia, setMediaUrgencia] = useState(true); // Por defecto
  const [bajaUrgencia, setBajaUrgencia] = useState(false);
  const [horarioAlta, setHorarioAlta] = useState(true); // Por defecto
  const [horarioBaja, setHorarioBaja] = useState(false);
  const [puntajePrioridad, setPuntajePrioridad] = useState(6); // Valor inicial

  const [estado, setEstado] = useState(EstadoIncidente.REVISION);
  const [prioridad, setPrioridad] = useState('P2');
  const [fechaInicio, setFechaInicio] = useState('2025-04-28');
  const [horaInicio, setHoraInicio] = useState('10:15:00');
  const [fechaFin, setFechaFin] = useState('2025-04-28');
  const [horaFin, setHoraFin] = useState('12:30:00');
  const [situacionActual, setSituacionActual] = useState('Equipo técnico realizando diagnóstico inicial.');
  const [impacto, setImpacto] = useState('Afecta a 30% de usuarios del sistema ERP.');
  const [nota, setNota] = useState('Se recomienda usar sistema alternativo mientras dure la incidencia.');
  const [accionesRecuperacion, setAccionesRecuperacion] = useState('Se reinició el servidor principal y se actualizaron parámetros de configuración.');
  const [causaRaiz, setCausaRaiz] = useState('Saturación de memoria en servidor de aplicaciones por consultas no optimizadas.');
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [tiempos, setTiempos] = useState([
    { inicio: '10:15:00', fin: '10:45:00', total: '0:30:00' },
    { inicio: '11:05:00', fin: '11:32:00', total: '0:27:00' },
  ]);
  const [diagnostico, setDiagnostico] = useState('Se identificaron consultas SQL recursivas que consumían memoria excesiva del servidor de aplicaciones.');
  const [mostrarCalculadoraPrioridad, setMostrarCalculadoraPrioridad] = useState(false);
  const vistaPreviewRef = useRef(null);
  
  // Función para añadir una nueva fila a la tabla de tiempos
  const agregarTiempo = () => {
    setTiempos([...tiempos, { inicio: '', fin: '', total: '' }]);
  };

  // Función para actualizar una entrada en la tabla de tiempos
  const actualizarTiempo = (index, campo, valor) => {
    const nuevosTiempos = [...tiempos];
    nuevosTiempos[index][campo] = valor;
    
    // Calcular total si inicio y fin están presentes
    if (campo === 'inicio' || campo === 'fin') {
      if (nuevosTiempos[index].inicio && nuevosTiempos[index].fin) {
        // Convertir a Date para calcular la diferencia
        const [horaInicio, minInicio, segInicio = '00'] = nuevosTiempos[index].inicio.split(':').map(Number);
        const [horaFin, minFin, segFin = '00'] = nuevosTiempos[index].fin.split(':').map(Number);
        
        // Calcular segundos totales
        const inicioEnSegundos = horaInicio * 3600 + minInicio * 60 + +segInicio;
        const finEnSegundos = horaFin * 3600 + minFin * 60 + +segFin;
        const diferenciaSegundos = finEnSegundos - inicioEnSegundos;
        
        if (diferenciaSegundos >= 0) {
          // Convertir de vuelta a formato h:m:s
          const horas = Math.floor(diferenciaSegundos / 3600);
          const minutos = Math.floor((diferenciaSegundos % 3600) / 60);
          const segundos = diferenciaSegundos % 60;
          nuevosTiempos[index].total = `${horas}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        } else {
          nuevosTiempos[index].total = 'Error en tiempo';
        }
      }
    }
    
    setTiempos(nuevosTiempos);
  };

  // Función para eliminar una fila de la tabla de tiempos
  const eliminarTiempo = (index) => {
    const nuevosTiempos = tiempos.filter((_, i) => i !== index);
    setTiempos(nuevosTiempos);
  };
  
  // Calcular duración automáticamente si hay fechas de inicio y fin
  const calcularDuracion = () => {
    if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) return "00h 00min 00s";
    
    // Crear objetos Date para inicio y fin
    const inicio = new Date(`${fechaInicio}T${horaInicio}`);
    const fin = new Date(`${fechaFin}T${horaFin}`);
    
    // Calcular la diferencia en milisegundos
    const diferencia = fin - inicio;
    
    if (diferencia < 0) return "00h 00min 00s"; // Prevenir duraciones negativas
    
    // Convertir a horas, minutos y segundos
    const segundosTotales = Math.floor(diferencia / 1000);
    const horas = Math.floor(segundosTotales / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;
    
    // Formatear como hh:mm:ss
    return `${horas.toString().padStart(2, '0')}h ${minutos.toString().padStart(2, '0')}min ${segundos.toString().padStart(2, '0')}s`;
  };
  
  // Calcular prioridad basada en los criterios seleccionados
  const calcularPrioridad = React.useCallback(() => {
    let puntaje = 0;
    
    // Afectación
    if (afectacionTotal) puntaje += 3;
    else if (afectacionParcial) puntaje += 2;
    if (delayIncidente) puntaje += 1;
    
    // Impacto
    if (impactoMasivo) puntaje += 3;
    else if (impactoMultiple) puntaje += 2;
    else if (impactoPuntual) puntaje += 1;
    
    // Urgencia
    if (criticaUrgencia) puntaje += 4;
    else if (altaUrgencia) puntaje += 3;
    else if (mediaUrgencia) puntaje += 2;
    else if (bajaUrgencia) puntaje += 1;
    
    // Horario
    if (horarioAlta) puntaje += 2;
    else if (horarioBaja) puntaje += 1;
    
    setPuntajePrioridad(puntaje);
    
    // Determinar P1, P2, P3 o P4 basado en puntaje
    if (puntaje >= 12) {
      setPrioridad('P1');
    } else if (puntaje >= 10 && puntaje <= 11) {
      setPrioridad('P2');
    } else if (puntaje >= 5 && puntaje <= 9) {
      setPrioridad('P3');
    } else {
      setPrioridad('P4');
    }
  }, [
    afectacionTotal, afectacionParcial, delayIncidente,
    impactoMasivo, impactoMultiple, impactoPuntual,
    criticaUrgencia, altaUrgencia, mediaUrgencia, bajaUrgencia,
    horarioAlta, horarioBaja
  ]);
  
  // Efecto para calcular la prioridad cuando cambian los criterios
  useEffect(() => {
    calcularPrioridad();
  }, [calcularPrioridad]);
  
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
    <div className="w-full max-w-4xl mx-auto p-4">
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
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium mb-1 text-gray-700">Prioridad</label>
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setMostrarCalculadoraPrioridad(!mostrarCalculadoraPrioridad)}
                >
                  {mostrarCalculadoraPrioridad ? 'Ocultar calculadora' : 'Calcular prioridad'}
                </button>
              </div>
              <select 
                className="w-full p-2 border rounded"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
                disabled={mostrarCalculadoraPrioridad}
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>
            </div>
          </div>
          
          {mostrarCalculadoraPrioridad && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold mb-2 text-blue-800 text-center">Calculadora de Prioridad</h3>
              <p className="text-center mb-2">Puntaje actual: <span className="font-bold">{puntajePrioridad}</span> - Prioridad: <span className="font-bold text-red-600">{prioridad}</span></p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Afectación */}
                <div className="border-r border-blue-200 pr-2">
                  <h4 className="font-semibold text-blue-700 mb-1">Afectación</h4>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="afectacionTotal"
                      name="afectacion"
                      checked={afectacionTotal}
                      onChange={() => {
                        setAfectacionTotal(true);
                        setAfectacionParcial(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="afectacionTotal" className="text-sm">Indisponibilidad Total (3)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="afectacionParcial"
                      name="afectacion"
                      checked={afectacionParcial}
                      onChange={() => {
                        setAfectacionParcial(true);
                        setAfectacionTotal(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="afectacionParcial" className="text-sm">Indisponibilidad Parcial (2)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="delayIncidente"
                      checked={delayIncidente}
                      onChange={() => setDelayIncidente(!delayIncidente)}
                      className="mr-1"
                    />
                    <label htmlFor="delayIncidente" className="text-sm">Delay (1)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="afectacionNinguna"
                      name="afectacion"
                      checked={!afectacionTotal && !afectacionParcial}
                      onChange={() => {
                        setAfectacionTotal(false);
                        setAfectacionParcial(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="afectacionNinguna" className="text-sm">Ninguna (0)</label>
                  </div>
                </div>
                
                {/* Impacto */}
                <div className="border-r border-blue-200 pr-2">
                  <h4 className="font-semibold text-blue-700 mb-1">Impacto</h4>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="impactoMasivo"
                      name="impactoUsuarios"
                      checked={impactoMasivo}
                      onChange={() => {
                        setImpactoMasivo(true);
                        setImpactoMultiple(false);
                        setImpactoPuntual(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="impactoMasivo" className="text-sm">Masivo (3)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="impactoMultiple"
                      name="impactoUsuarios"
                      checked={impactoMultiple}
                      onChange={() => {
                        setImpactoMasivo(false);
                        setImpactoMultiple(true);
                        setImpactoPuntual(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="impactoMultiple" className="text-sm">Múltiple (2)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="impactoPuntual"
                      name="impactoUsuarios"
                      checked={impactoPuntual}
                      onChange={() => {
                        setImpactoMasivo(false);
                        setImpactoMultiple(false);
                        setImpactoPuntual(true);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="impactoPuntual" className="text-sm">Puntual (1)</label>
                  </div>
                </div>
                
                {/* Urgencia */}
                <div className="border-r border-blue-200 pr-2">
                  <h4 className="font-semibold text-blue-700 mb-1">Urgencia</h4>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="criticaUrgencia"
                      name="urgencia"
                      checked={criticaUrgencia}
                      onChange={() => {
                        setCriticaUrgencia(true);
                        setAltaUrgencia(false);
                        setMediaUrgencia(false);
                        setBajaUrgencia(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="criticaUrgencia" className="text-sm">Crítica (4)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="altaUrgencia"
                      name="urgencia"
                      checked={altaUrgencia}
                      onChange={() => {
                        setCriticaUrgencia(false);
                        setAltaUrgencia(true);
                        setMediaUrgencia(false);
                        setBajaUrgencia(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="altaUrgencia" className="text-sm">Alta (3)</label>
                  </div>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="mediaUrgencia"
                      name="urgencia"
                      checked={mediaUrgencia}
                      onChange={() => {
                        setCriticaUrgencia(false);
                        setAltaUrgencia(false);
                        setMediaUrgencia(true);
                        setBajaUrgencia(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="mediaUrgencia" className="text-sm">Media (2)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bajaUrgencia"
                      name="urgencia"
                      checked={bajaUrgencia}
                      onChange={() => {
                        setCriticaUrgencia(false);
                        setAltaUrgencia(false);
                        setMediaUrgencia(false);
                        setBajaUrgencia(true);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="bajaUrgencia" className="text-sm">Baja (1)</label>
                  </div>
                </div>
                
                {/* Horario */}
                <div>
                  <h4 className="font-semibold text-blue-700 mb-1">Horario</h4>
                  <div className="flex items-center mb-1">
                    <input
                      type="radio"
                      id="horarioAlta"
                      name="horario"
                      checked={horarioAlta}
                      onChange={() => {
                        setHorarioAlta(true);
                        setHorarioBaja(false);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="horarioAlta" className="text-sm text-xs">Alta Carga TX 08h00-23h00 (2)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="horarioBaja"
                      name="horario"
                      checked={horarioBaja}
                      onChange={() => {
                        setHorarioAlta(false);
                        setHorarioBaja(true);
                      }}
                      className="mr-1"
                    />
                    <label htmlFor="horarioBaja" className="text-sm text-xs">Baja Carga TX 23h00-08h00 (1)</label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-blue-200 pt-2">
                <p className="text-sm mb-1"><strong>Criterios de prioridad:</strong></p>
                <p className="text-xs">- P1 (12): <span className="font-semibold">Alta</span> - Atención en 5 minutos</p>
                <p className="text-xs">- P2 (10-11): <span className="font-semibold">Media</span> - Atención en 10 minutos</p>
                <p className="text-xs">- P3 (5-9): <span className="font-semibold">Baja</span> - Atención en 15 minutos</p>
                <p className="text-xs">- P4 (4): <span className="font-semibold">Muy Baja</span> - Atención en 20 minutos</p>
              </div>
            </div>
          )}
          

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
                step="1"
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
                    step="1"
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
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Tabla de Tiempos</label>
                      <button 
                        type="button" 
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        onClick={agregarTiempo}
                      >
                        Añadir Tiempo
                      </button>
                    </div>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 p-2">Hora Inicio</th>
                          <th className="border border-gray-300 p-2">Hora Fin</th>
                          <th className="border border-gray-300 p-2">Tiempo Total</th>
                          <th className="border border-gray-300 p-2">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tiempos.map((tiempo, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">
                              <input 
                                type="time" 
                                className="w-full p-1 border rounded"
                                value={tiempo.inicio}
                                onChange={(e) => actualizarTiempo(index, 'inicio', e.target.value)}
                                step="1"
                              />
                            </td>
                            <td className="border border-gray-300 p-2">
                              <input 
                                type="time" 
                                className="w-full p-1 border rounded"
                                value={tiempo.fin}
                                onChange={(e) => actualizarTiempo(index, 'fin', e.target.value)}
                                step="1"
                              />
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {tiempo.total}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              <button 
                                type="button" 
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                onClick={() => eliminarTiempo(index)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                </>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Vista previa del comunicado</h2>
        </div>
        <div 
          ref={vistaPreviewRef}
          className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200 max-w-2xl mx-auto"
        >
          <div className="text-center mb-1">
            <h1 className="text-blue-900 font-bold text-xl">GERENCIA DE PRODUCCIÓN Y SERVICIOS</h1>
            <h2 className="text-blue-700 font-bold">Gestión de Incidentes</h2>
            <hr className="my-1 border-blue-200" />
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4">
            <div className="mb-3">
              <div className="mb-0 pb-0 leading-none">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-blue-800 text-lg">DESCRIPCIÓN DEL INCIDENTE</div>
                                        <div className="bg-blue-100 px-3 py-1 rounded-md text-center">
                    <span className="font-bold">Prioridad</span><br/>
                    <span className="text-center">{prioridad}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-0 pt-0">
                <div 
                  className="w-4 h-4 rounded-full mr-1" 
                  style={{ backgroundColor: getColorEstado() }}
                ></div>
                <span 
                  className="font-medium text-sm"
                  style={{ 
                    color: estado === EstadoIncidente.REVISION ? '#B7950B' : 
                           estado === EstadoIncidente.AVANCE ? '#E74C3C' : '#2ECC71' 
                  }}
                >{estado}</span>
              </div>
            </div>

            {!mostrarTabla && (
              <div className="mb-2">
                <div className="flex items-center text-sm">
                  <span className="text-blue-500">📅</span>
                  <span className="ml-1"><strong>Inicio:</strong> {fechaInicio || 'aaaa-mm-dd'} <strong>Hora:</strong> {horaInicio || 'hh:mm'}</span>
                </div>
                
                {estado === EstadoIncidente.RECUPERADO && (
                  <>
                    <div className="flex items-center text-sm">
                      <span className="text-blue-500">📅</span>
                      <span className="ml-1"><strong>Fin:</strong> {fechaFin || 'aaaa-mm-dd'} <strong>Hora:</strong> {horaFin || 'hh:mm'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500">⏳</span>
                      <span className="ml-1"><strong>Duración:</strong> {calcularDuracion()}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {mostrarTabla && estado === EstadoIncidente.RECUPERADO && (
              <div className="mb-3">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-1 border border-gray-700">HORA INICIO</th>
                      <th className="p-1 border border-gray-700">HORA FIN</th>
                      <th className="p-1 border border-gray-700">TIEMPO TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-black">
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
                  <div className="text-sm leading-tight"><strong>Diagnóstico:</strong> {diagnostico || 'Descripción del diagnóstico.'}</div>
                </div>
              </div>
            )}

            {estado === EstadoIncidente.RECUPERADO && (
              <>
                <div className="mb-1 text-sm leading-tight">
                  <strong>Acciones de recuperación:</strong> {accionesRecuperacion || 'Acción que permitió la recuperación del servicio'}
                </div>
                <div className="mb-1 text-sm leading-tight">
                  <strong>Causa raíz:</strong> {causaRaiz || 'Descripción de la causa'}
                </div>
              </>
            )}

            {(estado === EstadoIncidente.REVISION || estado === EstadoIncidente.AVANCE) && (
              <div className="mb-1 text-sm leading-tight">
                <strong>Situación actual:</strong> {situacionActual || 'Descripción que ayude a entender en donde está la revisión.'}
              </div>
            )}

            <div className="mb-1 text-sm leading-tight">
              <strong>Impacto:</strong> {impacto || 'Afectación servicio / usuarios'}
            </div>

            {nota && (
              <div className="mb-1 text-sm leading-tight">
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
