import React, { useState, useEffect } from 'react';

const GeneradorComunicados = () => {
  // Estados
  const [tipo, setTipo] = useState('evento-inicio');
  const [descripcion, setDescripcion] = useState('');
  const [impacto, setImpacto] = useState('');
  const [motivo, setMotivo] = useState('');
  const [impactoMant, setImpactoMant] = useState('');
  const [ejecutor, setEjecutor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [estadoInicio, setEstadoInicio] = useState('');
  const [acciones, setAcciones] = useState('');
  const [accionesEjecutadas, setAccionesEjecutadas] = useState('');
  const [accionesEnCurso, setAccionesEnCurso] = useState('');
  const [fechaInicioFin, setFechaInicioFin] = useState('');
  const [horaInicioFin, setHoraInicioFin] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [duracionCalculada, setDuracionCalculada] = useState('00:00:00');
  const [estadoFin, setEstadoFin] = useState('');
  const [nota, setNota] = useState('');
  const [resultado, setResultado] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('¡Comunicado copiado al portapapeles!');

  // Establecer fechas y horas actuales al cargar
  useEffect(() => {
    establecerFechaHoraActual();
  }, []);

  // Calcular duración cuando cambien las fechas u horas relevantes
  useEffect(() => {
    const calcularDuracionInterna = () => {
      try {
        if (!fechaInicioFin || !horaInicioFin || !fechaFin || !horaFin) {
          return;
        }
        
        const inicio = new Date(`${fechaInicioFin}T${horaInicioFin}`);
        const fin = new Date(`${fechaFin}T${horaFin}`);
        
        const diferencia = fin - inicio;
        
        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
        
        const duracion = 
          `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
        
        setDuracionCalculada(duracion);
      } catch (error) {
        console.error('Error al calcular duración:', error);
      }
    };
    
    calcularDuracionInterna();
  }, [fechaInicioFin, horaInicioFin, fechaFin, horaFin]);
  
  // Cuando cambie el tipo, actualizar automáticamente el estado correspondiente
  useEffect(() => {
    if (tipo === 'evento-inicio' || tipo === 'incidente-inicio') {
      setEstadoInicio('En revisión');
    } else if (tipo === 'evento-fin' || tipo === 'incidente-fin') {
      setEstadoFin('Recuperado');
    } else if (tipo === 'mantenimiento-inicio') {
      setEstadoInicio('En curso');
    } else if (tipo === 'mantenimiento-fin') {
      setEstadoFin('Finalizado');
    }
  }, [tipo]);

  // Funciones
  const establecerFechaHoraActual = () => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0];
    
    setFechaInicio(fechaActual);
    setHoraInicio(horaActual);
    setFechaInicioFin(fechaActual);
    setHoraInicioFin(horaActual);
    setFechaFin(fechaActual);
    setHoraFin(horaActual);
  };
  
  const limpiarCampos = () => {
    // Limpiar campos de texto
    setDescripcion('');
    setImpacto('');
    setMotivo('');
    setImpactoMant('');
    setEjecutor('');
    setAcciones('');
    setAccionesEjecutadas('');
    setAccionesEnCurso('');
    setNota('');
    
    // Restablecer fechas y horas actuales
    establecerFechaHoraActual();
    
    // Mostrar alerta
    setAlertaMensaje('¡Campos limpiados correctamente!');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const seleccionarTipo = (nuevoTipo) => {
    const tipoAnterior = tipo;
    setTipo(nuevoTipo);
    
    // Transferir datos entre tipos del mismo grupo
    
    // Para eventos
    if (tipoAnterior.startsWith('evento-') && nuevoTipo.startsWith('evento-')) {
      if (nuevoTipo === 'evento-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
        if (tipoAnterior === 'evento-seguimiento' && acciones && !nota) {
          setNota("Acciones realizadas:\n" + acciones);
        }
      }
      
      if (nuevoTipo === 'evento-seguimiento' && tipoAnterior === 'evento-inicio' && !acciones) {
        setAcciones("Acciones en proceso:\n");
      }
    }
    
    // Para incidentes
    if (tipoAnterior.startsWith('incidente-') && nuevoTipo.startsWith('incidente-')) {
      if (nuevoTipo === 'incidente-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
      }
      
      if (nuevoTipo === 'incidente-avance' && tipoAnterior === 'incidente-inicio') {
        setAccionesEnCurso("Acción 1. Proveedor / Área interna\n");
      }
    }
    
    // Para mantenimientos
    if (tipoAnterior.startsWith('mantenimiento-') && nuevoTipo.startsWith('mantenimiento-')) {
      if (tipoAnterior === 'mantenimiento-inicio' && nuevoTipo === 'mantenimiento-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
      }
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    
    const partes = fechaISO.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const generarMensaje = () => {
    let mensaje = "";
    
    if (tipo === 'evento-inicio') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoVal = estadoInicio || "En revisión";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `*GESTIÓN EVENTO*\n🟡 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}`;
    }
    else if (tipo === 'evento-seguimiento') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      
      mensaje = `*GESTIÓN EVENTO*\n🔁 *Seguimiento*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Acciones:*`;
      
      if (acciones) {
        const lineasAcciones = acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n        • ${lineasAcciones[i]}`;
          }
        }
      } else {
        mensaje += "\n        • Sin acciones registradas";
      }
    }
    else if (tipo === 'evento-fin') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoVal = estadoFin || "Recuperado";
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `*GESTIÓN EVENTO*\n🟢 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}\n*Acciones:*`;
      
      if (acciones) {
        const lineasAcciones = acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            // Verificar si la línea contiene información del responsable con %%
            if (linea.includes('%%')) {
              // Formato: Acción %% Responsable
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              // Solo la acción
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      } else {
        mensaje += "\n        • Sin acciones registradas";
      }
    }
    else if (tipo === 'mantenimiento-inicio') {
      const motivoVal = motivo || "Descripción del Mantenimiento";
      const impactoVal = impactoMant || "Impacto servicio / usuarios / clientes";
      const ejecutorVal = ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = estadoInicio || "En curso";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `⚠️ *MANTENIMIENTO*\n\n*Estado:* ${estadoVal}\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}`;
    }
    else if (tipo === 'mantenimiento-fin') {
      const motivoVal = motivo || "Descripción del Mantenimiento";
      const impactoVal = impactoMant || "Impacto servicio / usuarios / clientes";
      const ejecutorVal = ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = estadoFin || "Finalizado";
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `✅ *MANTENIMIENTO*\n\n*Estado:* ${estadoVal}\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}`;
    }
    else if (tipo === 'incidente-inicio') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoVal = estadoInicio || "En revisión";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `*GESTIÓN INCIDENTE*\n🟡 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}`;
    }
    else if (tipo === 'incidente-avance') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      
      mensaje = `*GESTIÓN INCIDENTE*\n🔁 *Avance*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}`;
      
      if (accionesEnCurso) {
        mensaje += "\n*Acciones en curso:*";
        const lineasAcciones = accionesEnCurso.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            // Verificar si la línea contiene información del responsable con %%
            if (linea.includes('%%')) {
              // Formato: Acción %% Responsable
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              // Solo la acción
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      }
      
      if (accionesEjecutadas) {
        mensaje += "\n*Acciones ejecutadas:*";
        const lineasAcciones = accionesEjecutadas.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            // Verificar si la línea contiene información del responsable con %%
            if (linea.includes('%%')) {
              // Formato: Acción %% Responsable
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              // Solo la acción
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      }
    }
    else if (tipo === 'incidente-fin') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoFin = 'Recuperado';
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `*GESTIÓN INCIDENTE*\n🟢 *${estadoFin}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}\n*Acciones ejecutadas:*`;
      
      if (accionesEjecutadas) {
        const lineasAcciones = accionesEjecutadas.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            // Verificar si la línea contiene información del responsable con %%
            if (linea.includes('%%')) {
              // Formato: Acción %% Responsable
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              // Solo la acción
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      } else {
        mensaje += "\n        • Sin acciones ejecutadas";
      }
    }
    
    // Agregar nota si existe
    if (nota) {
      // Para mantenimientos, formatear la nota de manera diferente
      if (tipo.startsWith('mantenimiento-')) {
        mensaje += `\n\n*📣 NOTA:*\n        Observaciones con detalle que permitan brindar más información en el caso que amerite.`;
        // Si el usuario agregó texto, lo incluimos
        if (nota.trim() !== "") {
          mensaje = mensaje.replace("Observaciones con detalle que permitan brindar más información en el caso que amerite.", nota);
        }
      } else {
        // Para otros tipos de comunicados, usar el formato estándar
        mensaje += `\n\n*📣 NOTA:*\n        ${nota}`;
      }
    }
    
    setResultado(mensaje);
    setMostrarAlerta(false);
  };

  const copiar = () => {
    if (!resultado) {
      alert("No hay ningún comunicado generado para copiar.");
      return;
    }
    
    // Método 1: Usar la API moderna del portapapeles
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(resultado)
        .then(() => {
          setAlertaMensaje('¡Comunicado copiado al portapapeles!');
          setMostrarAlerta(true);
          setTimeout(() => setMostrarAlerta(false), 3000);
        })
        .catch(err => {
          console.error('Error al copiar con API moderna:', err);
          // Si falla, intentar el método alternativo
          copiarMetodoAlternativo();
        });
    } else {
      // Si no está disponible la API moderna, usar el método alternativo
      copiarMetodoAlternativo();
    }
  };

  const copiarMetodoAlternativo = () => {
    // Método 2: Crear un textarea temporal
    const textArea = document.createElement("textarea");
    textArea.value = resultado;
    
    // Evitar el scroll al agregar el elemento
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      
      if (successful) {
        setAlertaMensaje('¡Comunicado copiado al portapapeles!');
        setMostrarAlerta(true);
        setTimeout(() => setMostrarAlerta(false), 3000);
      } else {
        // Método 3: Si todo falla, mostrar el texto para copiar manualmente
        alert("No se pudo copiar automáticamente. Por favor, selecciona y copia el texto manualmente:\n\n" + resultado);
      }
    } catch (err) {
      console.error('Error al copiar con método alternativo:', err);
      alert("Error al copiar. Por favor, selecciona y copia el texto manualmente.");
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <header className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg p-8 text-center rounded-2xl mb-10 border border-yellow-500/20 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-6xl text-gray-900 font-bold shadow-lg transform hover:rotate-12 transition-transform duration-300">
            📝
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wider mb-3">
            Generador de Comunicados
          </h1>
          <p className="text-xl text-gray-300">
            Sistema de creación de comunicados para el Grupo de Monitoreo
          </p>
        </header>
        
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 mb-10 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mt-0 border-b border-yellow-500/30 pb-4 mb-6">
            Tipo de Comunicado
          </h2>
          
          {/* Tipos de Evento */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mt-6 mb-4 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-3"></span>
              Eventos
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'evento-inicio' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('evento-inicio')}
              >
                <span className="text-3xl mb-2">🟡</span>
                <span className="font-semibold">Inicio</span>
              </div>
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'evento-seguimiento' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('evento-seguimiento')}
              >
                <span className="text-3xl mb-2">🔁</span>
                <span className="font-semibold">Seguimiento</span>
              </div>
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'evento-fin' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('evento-fin')}
              >
                <span className="text-3xl mb-2">🟢</span>
                <span className="font-semibold">Fin</span>
              </div>
            </div>
          </div>
          
          {/* Tipos de Mantenimiento */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mt-6 mb-4 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-3"></span>
              Mantenimientos
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'mantenimiento-inicio' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('mantenimiento-inicio')}
              >
                <span className="text-3xl mb-2">⚠️</span>
                <span className="font-semibold">Inicio</span>
              </div>
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'mantenimiento-fin' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('mantenimiento-fin')}
              >
                <span className="text-3xl mb-2">✅</span>
                <span className="font-semibold">Fin</span>
              </div>
            </div>
          </div>
          
          {/* Tipos de Incidente */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mt-6 mb-4 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-3"></span>
              Incidentes
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'incidente-inicio' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('incidente-inicio')}
              >
                <span className="text-3xl mb-2">🟡</span>
                <span className="font-semibold">Inicio</span>
              </div>
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'incidente-avance' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('incidente-avance')}
              >
                <span className="text-3xl mb-2">🔁</span>
                <span className="font-semibold">Avance</span>
              </div>
              <div 
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  tipo === 'incidente-fin' 
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => seleccionarTipo('incidente-fin')}
              >
                <span className="text-3xl mb-2">🟢</span>
                <span className="font-semibold">Fin</span>
              </div>
            </div>
          </div>

          {/* Campos para Evento o Incidente */}
          {(tipo.startsWith('evento-') || tipo.startsWith('incidente-')) && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Descripción:</label>
                <input 
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  type="text" 
                  placeholder="DESCRIPCION DEL INCIDENTE"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Impacto:</label>
                <input 
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  type="text" 
                  placeholder="Impacto servicio / usuarios"
                  value={impacto}
                  onChange={(e) => setImpacto(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Campos para Mantenimiento */}
          {tipo.startsWith('mantenimiento-') && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Motivo:</label>
                <input 
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  type="text" 
                  placeholder="Descripción del Mantenimiento"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Impacto:</label>
                <input 
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  type="text" 
                  placeholder="Impacto servicio / usuarios / clientes"
                  value={impactoMant}
                  onChange={(e) => setImpactoMant(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Ejecutor:</label>
                <input 
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  type="text" 
                  placeholder="Nombre del proveedor o área interna que ejecuta el mantenimiento"
                  value={ejecutor}
                  onChange={(e) => setEjecutor(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Campos comunes para Inicio */}
          {(tipo.endsWith('-inicio')) && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Fecha:</label>
                  <input 
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    type="date" 
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Hora:</label>
                  <input 
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    type="time" 
                    step="1"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Estado:</label>
                <input 
                  className="w-full p-4 bg-gray-700/30 border border-gray-600/50 rounded-xl text-gray-400 cursor-not-allowed"
                  type="text" 
                  value={estadoInicio}
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Campos para Seguimiento (solo Eventos) */}
          {tipo === 'evento-seguimiento' && (
            <div className="mt-6">
              <label className="block mb-2 font-semibold text-gray-300">Acciones (una por línea):</label>
              <textarea 
                className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                placeholder="Acción 1. Proveedor / Área interna
Acción 2. Proveedor / Área interna"
                value={acciones}
                onChange={(e) => setAcciones(e.target.value)}
              ></textarea>
            </div>
          )}
          
          {/* Campos para Avance (solo Incidentes) */}
          {tipo === 'incidente-avance' && (
            <div className="space-y-6 mt-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Acciones en curso (una por línea):</label>
                <textarea 
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  placeholder="Formato: Acción %% Responsable (opcional)
Ejemplo:
Análisis de logs %% Equipo de Monitoreo
Revisión de configuración %% DBA Team
Escalamiento a proveedor"
                  value={accionesEnCurso}
                  onChange={(e) => setAccionesEnCurso(e.target.value)}
                ></textarea>
                <p className="text-sm text-gray-400 mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Use %% para separar la acción del responsable. Si no incluye responsable, solo escriba la acción.
                </p>
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Acciones ejecutadas (una por línea):</label>
                <textarea 
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  placeholder="Formato: Acción %% Responsable (opcional)
Ejemplo:
Reinicio de servicios %% Equipo de Infraestructura
Limpieza de caché %% Soporte N1
Verificación inicial"
                  value={accionesEjecutadas}
                  onChange={(e) => setAccionesEjecutadas(e.target.value)}
                ></textarea>
                <p className="text-sm text-gray-400 mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Use %% para separar la acción del responsable. Si no incluye responsable, solo escriba la acción.
                </p>
              </div>
            </div>
          )}
          
          {/* Campos para Fin */}
          {tipo.endsWith('-fin') && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Fecha inicio:</label>
                  <input 
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    type="date" 
                    value={fechaInicioFin}
                    onChange={(e) => setFechaInicioFin(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Hora inicio:</label>
                  <input 
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    type="time" 
                    step="1"
                    value={horaInicioFin}
                    onChange={(e) => setHoraInicioFin(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Fecha fin:</label>
                  <input 
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    type="date" 
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Hora fin:</label>
                  <input 
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    type="time" 
                    step="1"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Duración calculada:</label>
                <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl text-center">
                  <span className="text-3xl font-bold text-yellow-400">{duracionCalculada}</span>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Estado:</label>
                <input 
                  className="w-full p-4 bg-gray-700/30 border border-gray-600/50 rounded-xl text-gray-400 cursor-not-allowed"
                  type="text" 
                  value={estadoFin}
                  readOnly
                />
              </div>
              
              {(tipo === 'evento-fin' || tipo === 'incidente-fin') && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Acciones ejecutadas:</label>
                  <textarea 
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    placeholder="Formato: Acción %% Responsable (opcional)
Ejemplo:
Reinicio del servidor %% Equipo de Infraestructura
Actualización de base de datos %% DBA Team
Verificación de logs"
                    value={tipo === 'evento-fin' ? acciones : accionesEjecutadas}
                    onChange={(e) => tipo === 'evento-fin' ? setAcciones(e.target.value) : setAccionesEjecutadas(e.target.value)}
                  ></textarea>
                  <p className="text-sm text-gray-400 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Use %% para separar la acción del responsable. Si no incluye responsable, solo escriba la acción.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8">
            <label className="block mb-2 font-semibold text-gray-300">Nota adicional (opcional):</label>
            <textarea 
              className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-32 resize-y focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
              placeholder="Observaciones con detalle que permitan brindar más información en el caso que amerite"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
              onClick={generarMensaje}
            >
              Generar Comunicado
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 mb-10 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mt-0 border-b border-yellow-500/30 pb-4 mb-6">
            Comunicado Generado
          </h2>
          <div className="bg-gray-900 p-6 rounded-xl font-mono border-l-4 border-yellow-500 mt-4 min-h-40 overflow-x-auto leading-relaxed">
            <pre className="whitespace-pre-wrap text-gray-100">{resultado}</pre>
          </div>
          
          {mostrarAlerta && (
            <div className="my-6 p-4 rounded-xl bg-green-500/20 border-l-4 border-green-500 animate-fade-in">
              <p className="text-green-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {alertaMensaje}
              </p>
            </div>
          )}
          
          <div className="flex gap-4 mt-8">
            <button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
              onClick={copiar}
            >
              Copiar al Portapapeles
            </button>
            <button 
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5"
              onClick={limpiarCampos}
            >
              Limpiar Campos
            </button>
          </div>
        </div>
        
        <footer className="text-center py-8 mt-12 text-gray-400 text-sm border-t border-gray-700/50">
          <p className="mb-2">Desarrollado por Luis Herrera | Grupo Fractalia</p>
          <p className="text-xs">Generador de Comunicados para el Grupo de Monitoreo - Versión 1.2</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados; Crear un textarea temporal
    const textArea = document.createElement("textarea");
    textArea.value = resultado;
    
    // Evitar el scroll al agregar el elemento
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      
      if (successful) {
        setAlertaMens
