import React, { useState, lazy, Suspense } from 'react';
import PinModal from './components/molecules/PinModal.jsx';
import AppInfoModal from './components/molecules/AppInfoModal.jsx';
import usePinValidation from './modules/auth/usePinValidation.js';
import GridOpciones from './components/organisms/GridOpciones.jsx';
import './styles.css';

const AdminView = lazy(() => import('./modules/admin/AdminView.jsx'));
const TareasView = lazy(() => import('./modules/tareas/TareasView.jsx'));
const ContabilidadView = lazy(() => import('./modules/contabilidad/ContabilidadView.jsx'));
const HerramientasView = lazy(() => import('./modules/herramientas/HerramientasView.jsx'));
const RepuestosView = lazy(() => import('./modules/repuestos/RepuestosView.jsx'));
const HistorialVehiculosView = lazy(() => import('./modules/historial/HistorialVehiculosView.jsx'));

const opciones = [
  { 
    id: 'tareas', 
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ), 
    label: 'Gestor de Tareas', 
    color: '#348FCB' 
  },
  { 
    id: 'herramientas', 
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ), 
    label: 'Inventario Herramientas', 
    color: '#3283BC' 
  },
  { 
    id: 'repuestos', 
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ), 
    label: 'Inventario Repuestos', 
    color: '#3077AD' 
  },
  { 
    id: 'historico', 
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
        <circle cx="7" cy="17" r="2"></circle>
        <path d="M9 17h6"></path>
        <circle cx="17" cy="17" r="2"></circle>
      </svg>
    ), 
    label: 'Historial Vehiculos', 
    color: '#2E6B9E' 
  },
  { 
    id: 'contabilidad', 
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ), 
    label: 'Contabilidad', 
    color: '#2C5F8F' 
  },
  { 
    id: 'administrador', 
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ), 
    label: 'Panel Administrador', 
    color: '#34495E' 
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');
  const [pendingTab, setPendingTab] = useState(null);
  const [appInfoVisible, setAppInfoVisible] = useState(false);
  const { validatePin } = usePinValidation();

  const handleMenuClick = (opcion) => {
    if (opcion.id === 'administrador' || opcion.id === 'contabilidad') {
      setAdminPinError('');
      setAdminModalVisible(true);
      setPendingTab(opcion.id);
      return;
    }
    setActiveTab(opcion.id);
  };

  const volverAlInicio = () => {
    setActiveTab('inicio');
  };

  const renderContenido = () => {
    switch (activeTab) {
      case 'inicio':
        return <GridOpciones onSeleccionar={handleMenuClick} />;
      case 'tareas':
        return (
          <Suspense fallback={<div className="card card-body"><p>Cargando...</p></div>}>
            <TareasView />
          </Suspense>
        );
      case 'contabilidad':
        return (
          <Suspense fallback={<div className="card card-body"><p>Cargando...</p></div>}>
            <ContabilidadView />
          </Suspense>
        );
      case 'herramientas':
        return (
          <Suspense fallback={<div className="card card-body"><p>Cargando...</p></div>}>
            <HerramientasView />
          </Suspense>
        );
      case 'repuestos':
        return (
          <Suspense fallback={<div className="card card-body"><p>Cargando...</p></div>}>
            <RepuestosView />
          </Suspense>
        );
      case 'historico':
        return (
          <Suspense fallback={<div className='card card-body'><p>Cargando...</p></div>}>
            <HistorialVehiculosView />
          </Suspense>
        );
      case 'administrador':
        return (
          <Suspense fallback={<div className="card card-body"><p>Cargando...</p></div>}>
            <AdminView />
          </Suspense>
        );
      default:
        return <GridOpciones onSeleccionar={handleMenuClick} />;
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          {activeTab !== 'inicio' && (
            <button className="button button-secondary button-small button-back" onClick={volverAlInicio}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span style={{ fontWeight: '700' }}>Volver</span>
            </button>
          )}
        </div>
        <div className="header-center">
          <h1 className="header-title">AUTOSUSPENSIONES CUBILLOS</h1>
        </div>
        <div className="header-right">
          <button 
            className="button button-secondary button-small" 
            onClick={() => setAppInfoVisible(true)}
            style={{ padding: '8px 12px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
      </header>
      <main className={'main-content ' + (activeTab === 'inicio' ? 'main-content-centered' : '')}>
        <div className="page-wrapper">{renderContenido()}</div>
      </main>
      <PinModal
        visible={adminModalVisible}
        title="Validación Administrador"
        error={adminPinError}
        onClose={() => setAdminModalVisible(false)}
        onConfirm={(pin) => {
          const result = validatePin(pin, 'admin');
          if (!result.valid) {
            setAdminPinError(result.reason);
            return;
          }
          setAdminModalVisible(false);
          if (pendingTab === 'contabilidad') {
            setActiveTab('contabilidad');
            setPendingTab(null);
          } else {
            setActiveTab('administrador');
            setPendingTab(null);
          }
        }}
      />
      <AppInfoModal
        visible={appInfoVisible}
        onClose={() => setAppInfoVisible(false)}
      />
    </div>
  );
}
