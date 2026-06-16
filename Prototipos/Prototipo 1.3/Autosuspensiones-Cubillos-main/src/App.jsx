import React, { useState, useEffect } from 'react';
import HomeLayout from './components/templates/HomeLayout';
import GridOpciones from './components/organisms/GridOpciones';
import SearchBarPlaca from './components/molecules/SearchBarPlaca';
import CardHistorial from './components/organisms/CardHistorial';
import ListaHerramientas from './components/organisms/ListaHerramientas';
import ModuloRepuestos from './components/organisms/ModuloRepuestos';
import ModuloContabilidad from './components/organisms/ModuloContabilidad';
import ModuloAdministrador from './components/organisms/ModuloAdministrador';

export default function App() {
  // 1. ESTADOS DE NAVEGACIÓN Y PLACAS
  const [activeTab, setActiveTab] = useState('inicio');
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  // Datos por defecto
  const datosDefault = {
    herramientas: [
      { id: "herr-1", nombre: 'Pistola de impacto neumática', en_uso: false, mecanico_codigo: null, mecanico_nombre: null, actualizado_en: null },
      { id: "herr-2", nombre: 'Prensa para bujes de tijera', en_uso: true, mecanico_codigo: 'MEC-0001', mecanico_nombre: 'Carlos', actualizado_en: new Date(Date.now() - 3600000).toISOString() },
      { id: "herr-3", nombre: 'Extractor de terminales de dirección', en_uso: false, mecanico_codigo: null, mecanico_nombre: null, actualizado_en: null },
      { id: "herr-4", nombre: 'Torquímetro de 1/2 pulgada', en_uso: false, mecanico_codigo: null, mecanico_nombre: null, actualizado_en: null },
    ],
    vehiculos: [
      { 
        id: "veh-1",
        placa: 'TXA-123', 
        marca: 'Hyundai',
        modelo: 'Atos',
        anio: 2012,
        propietario: { id: "prop-1", nombre: 'Jorge Cárdenas' },
        trabajos: [
          { 
            id: "trab-1", 
            fecha_inicio: '2026-05-14', 
            descripcion: 'Cambio de amortiguadores delanteros', 
            mecanico: { nombre: 'Carlos' } 
          }
        ]
      }
    ],
    repuestos: [
      { id: 1, nombre: 'Buje Tijera Mazda 3', stock_actual: 4, stock_minimo: 5 },
      { id: 2, nombre: 'Amortiguador Gabriel', stock_actual: 12, stock_minimo: 5 }
    ],
    pagos: [
      { id: 'pago-1', monto: 120000, metodo: 'Efectivo', fecha: '2026-06-12', notas: 'Mano de obra y repuestos Mazda' },
      { id: 'pago-2', monto: 250000, metodo: 'Transferencia', fecha: '2026-06-13', notas: 'Suspensión completa Taxi' }
    ],
    gastos: [
      { id: 'gasto-1', tipo: 'HERRAMIENTA', descripcion: 'Compra de juego de llaves', monto: 85000, fecha: '2026-06-10' },
      { id: 'gasto-2', tipo: 'REPUESTO', descripcion: 'Lote de amortiguadores', monto: 140000, fecha: '2026-06-11' }
    ],
    mecanicos: [
      { id: 'mec-1', codigo: 'MEC-0001', nombre: 'Carlos', telefono: '3001234567', especialidad: 'Suspensión', activo: true, creado_en: '2026-01-10T10:00:00.000Z' },
      { id: 'mec-2', codigo: 'MEC-0002', nombre: 'Luis', telefono: '3109876543', especialidad: 'Frenos', activo: true, creado_en: '2026-02-15T11:30:00.000Z' }
    ]
  };

  // 2. ESTADO DE HERRAMIENTAS (Con localStorage)
  const [herramientas, setHerramientas] = useState(() => {
    const stored = localStorage.getItem('herramientas');
    return stored ? JSON.parse(stored) : datosDefault.herramientas;
  });

  // 3. DATOS DE VEHICULOS (Con localStorage)
  const [baseDatosVehiculos, setBaseDatosVehiculos] = useState(() => {
    const stored = localStorage.getItem('vehiculos');
    return stored ? JSON.parse(stored) : datosDefault.vehiculos;
  });

  // 3.5 ESTADO DE REPUESTOS (Con localStorage)
  const [repuestos, setRepuestos] = useState(() => {
    const stored = localStorage.getItem('repuestos');
    return stored ? JSON.parse(stored) : datosDefault.repuestos;
  });

  // 3.6 ESTADO FINANCIERO (Con localStorage)
  const [pagos, setPagos] = useState(() => {
    const stored = localStorage.getItem('pagos');
    return stored ? JSON.parse(stored) : datosDefault.pagos;
  });

  const [gastos, setGastos] = useState(() => {
    const stored = localStorage.getItem('gastos');
    return stored ? JSON.parse(stored) : datosDefault.gastos;
  });

  // 3.7 ESTADO DE MECANICOS (Con localStorage)
  const [mecanicos, setMecanicos] = useState(() => {
    const stored = localStorage.getItem('mecanicos');
    return stored ? JSON.parse(stored) : datosDefault.mecanicos;
  });

  // GUARDAR EN LOCALSTORAGE CUANDO LOS ESTADOS CAMBIEN
  useEffect(() => {
    localStorage.setItem('mecanicos', JSON.stringify(mecanicos));
  }, [mecanicos]);

  useEffect(() => {
    localStorage.setItem('herramientas', JSON.stringify(herramientas));
  }, [herramientas]);

  useEffect(() => {
    localStorage.setItem('vehiculos', JSON.stringify(baseDatosVehiculos));
  }, [baseDatosVehiculos]);

  useEffect(() => {
    localStorage.setItem('repuestos', JSON.stringify(repuestos));
  }, [repuestos]);

  useEffect(() => {
    localStorage.setItem('pagos', JSON.stringify(pagos));
  }, [pagos]);

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos));
  }, [gastos]);

  const listaPlacas = baseDatosVehiculos.map(t => t.placa);

  // 4. LÓGICA DE INTERACCIÓN
  const manejarSeleccionPlaca = (placa) => {
    setFiltroPlaca(placa);
    const datos = baseDatosVehiculos.find(t => t.placa === placa);
    setVehiculoSeleccionado(datos || null);
  };

  const manejarAccionHerramienta = (id) => {
    setHerramientas(herramientas.map(h => {
      if (h.id === id) {
        if (!h.en_uso) {
          // Solo pedir el código sin mostrar la lista
          const codigo = prompt("Ingrese el código del mecánico:");
          
          if (!codigo) return h;
          
          // Validar que el código exista
          const mecanico = mecanicos.find(m => m.codigo === codigo.trim() && m.activo);
          if (!mecanico) {
            alert('⚠️ Código de mecánico inválido o inactivo');
            return h;
          }
          
          return { ...h, en_uso: true, mecanico_codigo: mecanico.codigo, mecanico_nombre: mecanico.nombre, actualizado_en: new Date().toISOString() };
        } else {
          return { ...h, en_uso: false, mecanico_codigo: null, mecanico_nombre: null, actualizado_en: new Date().toISOString() };
        }
      }
      return h;
    }));
  };

  const manejarAgregarRepuesto = (nuevoAñadido) => {
    setRepuestos([nuevoAñadido, ...repuestos]);
  };

  const manejarAgregarTransaccion = (transaccion, tipo) => {
    if (tipo === 'ingreso') {
      setPagos([transaccion, ...pagos]);
    } else {
      setGastos([transaccion, ...gastos]);
    }
  };

  const manejarAgregarVehiculoYTrabajo = (nuevoVehiculo) => {
    setBaseDatosVehiculos([nuevoVehiculo, ...baseDatosVehiculos]);
    // Alertar al usuario que la placa se agregó
    alert(`Vehículo con placa ${nuevoVehiculo.placa} y su trabajo han sido registrados exitosamente.`);
  };

  // 5. RENDERIZADO CONDICIONAL DE PANTALLAS
  const renderContenido = () => {
    switch (activeTab) {
      case 'inicio':
        return <GridOpciones onSeleccionar={(id) => setActiveTab(id)} />;
      case 'historico':
        return (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#1d1d1f', textAlign: 'left' }}>Histórico de Placas</h2>
            <SearchBarPlaca 
              filtro={filtroPlaca} 
              setFiltro={(valor) => {
                setFiltroPlaca(valor);
                if(!valor) setVehiculoSeleccionado(null);
                const exacto = baseDatosVehiculos.find(t => t.placa === valor);
                if(exacto) setVehiculoSeleccionado(exacto);
              }}
              placasExistentes={listaPlacas}
              onSeleccionarPlaca={manejarSeleccionPlaca}
            />
            <CardHistorial vehiculo={vehiculoSeleccionado} />
          </div>
        );
      case 'herramientas':
        return (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '6px', color: '#1d1d1f', textAlign: 'left' }}>Control de Herramientas</h2>
            <p style={{ fontSize: '14px', color: '#86868b', margin: '0 0 20px 0', textAlign: 'left' }}>
              Registre la salida y devolución de equipos del taller para evitar pérdidas.
            </p>
            <ListaHerramientas 
              herramientas={herramientas} 
              onAccionHerramienta={manejarAccionHerramienta} 
            />
          </div>
        );
      case 'administrador':
        return (
          <ModuloAdministrador 
            mecanicos={mecanicos}
            setMecanicos={setMecanicos}
            herramientas={herramientas}
            setHerramientas={setHerramientas}
            stats={{
              vehiculos: baseDatosVehiculos.length,
              herramientas: herramientas.length,
              repuestos: repuestos.length
            }}
            onAgregarVehiculoTrabajo={manejarAgregarVehiculoYTrabajo}
          />
        );
      case 'repuestos':
        return <ModuloRepuestos repuestos={repuestos} onAgregarRepuesto={manejarAgregarRepuesto} />;
      case 'contabilidad':
        return <ModuloContabilidad pagos={pagos} gastos={gastos} onAgregarTransaccion={manejarAgregarTransaccion} />;
      default:
        return <GridOpciones onSeleccionar={(id) => setActiveTab(id)} />;
    }
  };

  return (
    <HomeLayout 
      mostrarBotonVolver={activeTab !== 'inicio'} 
      onVolver={() => {
        setActiveTab('inicio');
        setFiltroPlaca('');
        setVehiculoSeleccionado(null);
      }}
    >
      {renderContenido()}
    </HomeLayout>
  );
}
