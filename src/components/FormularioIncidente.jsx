import React, { useState } from 'react';

const FormularioIncidente = () => {
  // Estados para el formulario principal
  const [descripcionIncidente, setDescripcionIncidente] = useState('DESCRIPCIÓN DEL INCIDENTE');
  const [estado, setEstado] = useState('En Revisión');
  const [prioridad, setPrioridad] = useState('P2');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [situacionActual, setSituacionActual] = useState('Descripción que ayude a entender en donde está la revisión.');
  const [impacto, setImpacto] = useState('Afectación servicio / usuarios');
  const [nota, setNota] = useState('Observaciones con detalle que permitan brindar más información en el caso que amerite');
  const [accionesRecuperacion, setAccionesRecuperacion] = useState('Acción que permitió la recuperación del servicio');
  const [causaRaiz, setCausaRaiz] = useState('Descripción de la causa');
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [diagnostico, setDiagnostico] = useState('Se identificaron consultas SQL recursivas que consumían memoria excesiva del servidor de aplicaciones.');
  const [mostrarCalculadoraPrioridad, setMostrarCalculadoraPrioridad] = useState(false);
  
  // Estados para el cálculo de prioridad
  const [afectacion, setAfectacion] = useState(0);
  const [impactoUsuarios, setImpactoUsuarios] = useState(1);
  const [urgencia, setUrgencia] = useState(2);
  const [horario, setHorario] = useState(2);
  
  // Estado para la tabla de tiempos
  const [tiempos, setTiempos] = useState([
    { inicio: '10:15:00', fin: '10:45:00', total: '0:30:00' },
    { inicio: '11:05:00', fin: '11:32:00', total: '0:27:00' },
  ]);

  // Calcular el puntaje de prioridad
  const calcularPuntajePrioridad = () => {
    return afectacion + impactoUsuarios + urgencia + horario;
  };

  // Actualizar la prioridad basada en el puntaje
  const actualizarPrioridad = (puntaje) => {
    if (puntaje >= 12) {
      setPrioridad('P1');
    } else if (puntaje >= 10 && puntaje <= 11) {
      setPrioridad('P2');
    } else if (puntaje >= 5 && puntaje <= 9) {
      setPrioridad('P3');
    } else {
      setPrioridad('P4');
    }
  };

  // Manejar cambios en el cálculo de prioridad
  const handleAfectacionChange = (value) => {
    setAfectacion(value);
    const newPuntaje = value + impactoUsuarios + urgencia + horario;
    actualizarPrioridad(newPuntaje);
  };

  const handleImpactoChange = (value) => {
    setImpactoUsuarios(value);
    const newPuntaje = afectacion + value + urgencia + horario;
    actualizarPrioridad(newPuntaje);
  };

  const handleUrgenciaChange = (value) => {
    setUrgencia(value);
    const newPuntaje = afectacion + impactoUsuarios + value + horario;
    actualizarPrioridad(newPuntaje);
  };

  const handleHorarioChange = (value) => {
    setHorario(value);
    const newPuntaje = afectacion + impactoUsuarios + urgencia + value;
    actualizarPrioridad(newPuntaje);
  };

  // Función para añadir una nueva fila a la tabla de tiempos
  const agregarTiempo = () => setTiempos([...tiempos, { inicio: '', fin: '', total: '' }]);

  // Función para actualizar una entrada en la tabla de tiempos
  const actualizarTiempo = (index, campo, valor) => {
    const nuevosTiempos = [...tiempos];
    nuevosTiempos[index][campo] = valor;
    
    // Calcular total si inicio y fin están presentes
    if ((campo === 'inicio' || campo === 'fin') && nuevosTiempos[index].inicio && nuevosTiempos[index].fin) {
      const [horaInicio, minInicio, segInicio = '00'] = nuevosTiempos[index].inicio.split(':').map(Number);
      const [horaFin, minFin, segFin = '00'] = nuevosTiempos[index].fin.split(':').map(Number);
      
      const inicioEnSegundos = horaInicio * 3600 + minInicio * 60 + +segInicio;
      const finEnSegundos = horaFin * 3600 + minFin * 60 + +segFin;
      const diferenciaSegundos = finEnSegundos - inicioEnSegundos;
      
      if (diferenciaSegundos >= 0) {
        const horas = Math.floor(diferenciaSegundos / 3600);
        const minutos = Math.floor((diferenciaSegundos % 3600) / 60);
        const segundos = diferenciaSegundos % 60;
        nuevosTiempos[index].total = `${horas}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      } else {
        nuevosTiempos[index].total = 'Error en tiempo';
      }
    }
    
    setTiempos(nuevosTiempos);
  };

  // Función para eliminar una fila de la tabla de tiempos
  const eliminarTiempo = (index) => setTiempos(tiempos.filter((_, i) => i !== index));
  
  // Calcular duración automáticamente si hay fechas de inicio y fin
  const calcularDuracion = () => {
    if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) return "00h 00min 00s";
    
    const inicio = new Date(`${fechaInicio}T${horaInicio}`);
    const fin = new Date(`${fechaFin}T${horaFin}`);
    const diferencia = fin - inicio;
    
    if (diferencia < 0) return "00h 00min 00s";
    
    const segundosTotales = Math.floor(diferencia / 1000);
    const horas = Math.floor(segundosTotales / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;
    
    return `${horas.toString().padStart(2, '0')}h ${minutos.toString().padStart(2, '0')}min ${segundos.toString().padStart(2, '0')}s`;
  };

  // Obtener color según estado
  const getColorEstado = () => {
    const colores = {
      'En Revisión': '#FFD700',
      'Avance': '#FFA07A',
      'Recuperado': '#90EE90'
    };
    return colores[estado] || '#FFD700';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Sección del formulario */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Formulario de Gestión de Incidentes</h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          {/* Descripción del incidente - nuevo campo */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Descripción del Incidente</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={descripcionIncidente}
              onChange={(e) => setDescripcionIncidente(e.target.value)}
              placeholder="DESCRIPCIÓN DEL INCIDENTE"
            />
          </div>

          {/* Estado y Prioridad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Estado del Incidente</label>
              <select 
                className="w-full p-2 border rounded"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="En Revisión">En Revisión</option>
                <option value="Avance">Avance</option>
                <option value="Recuperado">Recuperado</option>
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
              >
                {['P1', 'P2', 'P3', 'P4'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Calculadora de Prioridad */}
          {mostrarCalculadoraPrioridad && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold mb-2 text-blue-800 text-center">Calculadora de Prioridad</h3>
              <p className="text-center mb-2">Puntaje actual: <span className="font-bold">{calcularPuntajePrioridad()}</span> - Prioridad: <span className="font-bold text-red-600">{prioridad}</span></p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Afectación */}
                <div className="border-r border-blue-200 p-2 rounded-lg bg-blue-100">
                  <h4 className="font-semibold text-blue-700 mb-2 text-center">Afectación</h4>
                  {[
                    {id: 'afectacionTotal', label: 'Indisponibilidad Total (3)', value: 3},
                    {id: 'afectacionParcial', label: 'Indisponibilidad Parcial (2)', value: 2},
                    {id: 'delayIncidente', label: 'Delay (1)', value: 1},
                    {id: 'afectacionNinguna', label: 'Ninguna (0)', value: 0, defaultChecked: true}
                  ].map(item => (
                    <div key={item.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={item.id}
                        name="afectacion"
                        className="mr-2"
                        checked={afectacion === item.value}
                        onChange={() => handleAfectacionChange(item.value)}
                      />
                      <label htmlFor={item.id} className="text-sm">{item.label}</label>
                    </div>
                  ))}
                </div>
                
                {/* Impacto */}
                <div className="border-r border-blue-200 p-2 rounded-lg bg-blue-100">
                  <h4 className="font-semibold text-blue-700 mb-2 text-center">Impacto</h4>
                  {[
                    {id: 'impactoMasivo', label: 'Masivo (3)', value: 3},
                    {id: 'impactoMultiple', label: 'Múltiple (2)', value: 2},
                    {id: 'impactoPuntual', label: 'Puntual (1)', value: 1, defaultChecked: true}
                  ].map(item => (
                    <div key={item.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={item.id}
                        name="impactoUsuarios"
                        className="mr-2"
                        checked={impactoUsuarios === item.value}
                        onChange={() => handleImpactoChange(item.value)}
                      />
                      <label htmlFor={item.id} className="text-sm">{item.label}</label>
                    </div>
                  ))}
                </div>
                
                {/* Urgencia */}
                <div className="border-r border-blue-200 p-2 rounded-lg bg-blue-100">
                  <h4 className="font-semibold text-blue-700 mb-2 text-center">Urgencia</h4>
                  {[
                    {id: 'criticaUrgencia', label: 'Crítica (4)', value: 4},
                    {id: 'altaUrgencia', label: 'Alta (3)', value: 3},
                    {id: 'mediaUrgencia', label: 'Media (2)', value: 2, defaultChecked: true},
                    {id: 'bajaUrgencia', label: 'Baja (1)', value: 1}
                  ].map(item => (
                    <div key={item.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={item.id}
                        name="urgencia"
                        className="mr-2"
                        checked={urgencia === item.value}
                        onChange={() => handleUrgenciaChange(item.value)}
                      />
                      <label htmlFor={item.id} className="text-sm">{item.label}</label>
                    </div>
                  ))}
                </div>
                
                {/* Horario */}
                <div className="p-2 rounded-lg bg-blue-100">
                  <h4 className="font-semibold text-blue-700 mb-2 text-center">Horario</h4>
                  {[
                    {id: 'horarioAlta', label: 'Alta Carga TX 08h00-23h00 (2)', value: 2, defaultChecked: true},
                    {id: 'horarioBaja', label: 'Baja Carga TX 23h00-08h00 (1)', value: 1}
                  ].map(item => (
                    <div key={item.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={item.id}
                        name="horario"
                        className="mr-2"
                        checked={horario === item.value}
                        onChange={() => handleHorarioChange(item.value)}
                      />
                      <label htmlFor={item.id} className="text-xs">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Criterios de prioridad */}
              <div className="border-t border-blue-200 pt-2 bg-white p-2 rounded-lg">
                <p className="text-sm mb-1 text-center"><strong>Criterios de prioridad:</strong></p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    {bg: 'bg-red-100', titulo: 'P1 (≥12)', nivel: 'Alta', tiempo: '5 minutos'},
                    {bg: 'bg-orange-100', titulo: 'P2 (10-11)', nivel: 'Media', tiempo: '10 minutos'},
                    {bg: 'bg-yellow-100', titulo: 'P3 (5-9)', nivel: 'Baja', tiempo: '15 minutos'},
                    {bg: 'bg-green-100', titulo: 'P4 (≤4)', nivel: 'Muy Baja', tiempo: '20 minutos'}
                  ].map((criterio, idx) => (
                    <div key={idx} className={`${criterio.bg} p-1 rounded text-center`}>
                      <p className="text-xs">{criterio.titulo}: <span className="font-semibold">{criterio.nivel}</span></p>
                      <p className="text-xs">Atención en {criterio.tiempo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fecha y hora de inicio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Fecha Inicio</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                placeholder="aaaa-mm-dd"
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
                placeholder="hh:mm:ss"
              />
            </div>
          </div>

          {/* Campos para estado Recuperado */}
          {estado === 'Recuperado' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Fecha Fin</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    placeholder="aaaa-mm-dd"
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
                    placeholder="hh:mm:ss"
                  />
                </div>
              </div>

              {/* Campos adicionales para Recuperado */}
              {['Acciones de recuperación', 'Causa raíz'].map((campo, idx) => (
                <div key={idx} className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">{campo}</label>
                  <textarea 
                    className="w-full p-2 border rounded"
                    rows="2"
                    placeholder={`${campo === 'Acciones de recuperación' ? 'Acción que permitió la recuperación del servicio' : 'Descripción de la causa'}`}
                    value={campo === 'Acciones de recuperación' ? accionesRecuperacion : causaRaiz}
                    onChange={(e) => campo === 'Acciones de recuperación' ? setAccionesRecuperacion(e.target.value) : setCausaRaiz(e.target.value)}
                  ></textarea>
                </div>
              ))}

              {/* Checkbox para mostrar tabla */}
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

              {/* Tabla de tiempos */}
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
                            {['inicio', 'fin'].map(campo => (
                              <td key={campo} className="border border-gray-300 p-2">
                                <div className="flex items-center">
                                  <input 
                                    type="time" 
                                    className="w-full p-1 border rounded"
                                    value={tiempo[campo]}
                                    onChange={(e) => actualizarTiempo(index, campo, e.target.value)}
                                    step="1"
                                  />
                                  <span className="ml-2">⌚</span>
                                </div>
                              </td>
                            ))}
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

          {/* Situación actual para estados de Revisión o Avance */}
          {(estado === 'En Revisión' || estado === 'Avance') && (
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

          {/* Campos comunes a todos los estados */}
          {['Impacto', 'Nota'].map((campo, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">{campo}</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows="2"
                placeholder={campo === 'Impacto' ? 'Afectación servicio / usuarios' : 'Observaciones con detalle'}
                value={campo === 'Impacto' ? impacto : nota}
                onChange={(e) => campo === 'Impacto' ? setImpacto(e.target.value) : setNota(e.target.value)}
              ></textarea>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de vista previa */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Vista previa del comunicado</h2>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200 max-w-2xl mx-auto">
          <div className="text-center mb-1">
            <h1 className="text-blue-900 font-bold text-xl">GERENCIA DE PRODUCCIÓN Y SERVICIOS</h1>
            <h2 className="text-blue-700 font-bold">Gestión de Incidentes</h2>
            <hr className="my-1 border-blue-200" />
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4">
            <div className="mb-3">
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-blue-900 text-xl uppercase">{descripcionIncidente}</div>
                    <div className="flex items-center -mt-1">
                      <div 
                        className="w-4 h-4 rounded-full mr-1" 
                        style={{ backgroundColor: getColorEstado() }}
                      ></div>
                      <span 
                        className="font-bold text-sm"
                        style={{ 
                          color: estado === 'En Revisión' ? '#B7950B' : 
                                estado === 'Avance' ? '#E74C3C' : '#2ECC71' 
                        }}
                      >{estado}</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 px-3 py-1 rounded-md text-center">
                    <span className="font-bold text-sm">Prioridad</span><br/>
                    <span className="text-center font-bold text-lg">{prioridad}</span>
                  </div>
                </div>
              </div>
            </div>

            {!mostrarTabla && (
              <div className="mb-4">
                <div className="flex items-center text-sm mb-0">
                  <span className="mr-1">📅</span>
                  <span className="font-medium"><strong>Inicio:</strong> {fechaInicio || 'aaaa-mm-dd'} <strong>Hora:</strong> {horaInicio || 'hh:mm'}</span>
                </div>
                
                {estado === 'Recuperado' && (
                  <>
                    <div className="flex items-center text-sm mb-0">
                      <span className="mr-1">📅</span>
                      <span className="font-medium"><strong>Fin:</strong> {fechaFin || 'aaaa-mm-dd'} <strong>Hora:</strong> {horaFin || 'hh:mm'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-1">⏳</span>
                      <span className="font-medium"><strong>Duración:</strong> {calcularDuracion()}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tabla en el comunicado */}
            {mostrarTabla && estado === 'Recuperado' && (
              <div className="mb-3">
                <div className="flex justify-center">
                  <table className="text-sm" style={{ tableLayout: 'fixed', width: 'auto' }}>
                    <thead className="bg-gray-800 text-white text-center">
                      <tr>
                        <th className="p-1 border border-gray-700" style={{ width: '80px' }}>HORA INICIO</th>
                        <th className="p-1 border border-gray-700" style={{ width: '80px' }}>HORA FIN</th>
                        <th className="p-1 border border-gray-700" style={{ width: '80px' }}>TIEMPO TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-black">
                      {tiempos.map((tiempo, index) => (
                        <tr key={index}>
                          <td className="p-1 border border-gray-700 text-center">{tiempo.inicio}</td>
                          <td className="p-1 border border-gray-700 text-center">{tiempo.fin}</td>
                          <td className="p-1 border border-gray-700 text-center">{tiempo.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2">
                  <div className="text-sm leading-tight"><strong>Diagnóstico:</strong> {diagnostico || 'Descripción del diagnóstico.'}</div>
                </div>
              </div>
            )}
            
            {/* Campos adicionales en el comunicado */}
            {estado === 'Recuperado' && !mostrarTabla && (
              <>
                <div className="mb-2 text-sm leading-tight font-medium">
                  <strong>Acciones de recuperación:</strong> {accionesRecuperacion || 'Acción que permitió la recuperación del servicio'}
                </div>
                <div className="mb-2 text-sm leading-tight font-medium">
                  <strong>Causa raíz:</strong> {causaRaiz || 'Descripción de la causa'}
                </div>
              </>
            )}

            {(estado === 'En Revisión' || estado === 'Avance') && (
              <div className="mb-2 text-sm leading-tight font-medium">
                <strong>Situación actual:</strong> {situacionActual || 'Descripción que ayude a entender en donde está la revisión.'}
              </div>
            )}

            <div className="mb-4 text-sm leading-tight font-medium">
              <strong>Impacto:</strong> {impacto || 'Afectación servicio / usuarios'}
            </div>

            {nota && (
              <div className="text-sm leading-tight font-medium">
                <span className="mr-1">📣</span> <strong>NOTA:</strong> {nota}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Pie de página con atribución */}
      <div className="text-center mt-4 mb-8 text-gray-600">
        <p className="text-sm">© 2025 Generador de Comunicados de Incidentes • Desarrollado por Luis Alberto Herrera Lara</p>
      </div>
    </div>
  );
};

export default FormularioIncidente;
