import { initializeDatabase, saveDatabase, getTable, setTable, insert, update, deleteRecord, select, migrateFromLegacy } from './database.js';

let db = null;

function getDb() {
  if (!db) {
    db = initializeDatabase();
    // Try to migrate from legacy storage
    migrateFromLegacy();
  }
  return db;
}

export function loadUsers() {
  try {
    return getTable(getDb(), 'users') || [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

export function saveUsers(users) {
  try {
    const db = getDb();
    setTable(db, 'users', users);
    saveDatabase(db);
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

export function loadHerramientas() {
  try {
    return getTable(getDb(), 'herramientas') || [];
  } catch (error) {
    console.error('Error loading herramientas:', error);
    return [];
  }
}

export function saveHerramientas(herramientas) {
  try {
    const db = getDb();
    setTable(db, 'herramientas', herramientas);
    saveDatabase(db);
  } catch (error) {
    console.error('Error saving herramientas:', error);
  }
}

export function loadHerramientasHistorial() {
  try {
    const db = getDb();
    // For now, return empty array - historial would need its own table
    return [];
  } catch (error) {
    console.error('Error loading herramientas historial:', error);
    return [];
  }
}

export function saveHerramientasHistorial(historial) {
  try {
    // For now, this would need its own table
    console.log('saveHerramientasHistorial not implemented in new structure');
  } catch (error) {
    console.error('Error saving herramientas historial:', error);
  }
}

export function loadRepuestos() {
  try {
    return getTable(getDb(), 'repuestos') || [];
  } catch (error) {
    console.error('Error loading repuestos:', error);
    return [];
  }
}

export function saveRepuestos(repuestos) {
  try {
    const db = getDb();
    setTable(db, 'repuestos', repuestos);
    saveDatabase(db);
  } catch (error) {
    console.error('Error saving repuestos:', error);
  }
}

export function loadTransacciones() {
  try {
    return getTable(getDb(), 'transacciones') || [];
  } catch (error) {
    console.error('Error loading transacciones:', error);
    return [];
  }
}

export function saveTransacciones(transacciones) {
  try {
    const db = getDb();
    setTable(db, 'transacciones', transacciones);
    saveDatabase(db);
  } catch (error) {
    console.error('Error saving transacciones:', error);
  }
}

export function loadTareas() {
  try {
    return getTable(getDb(), 'tareas') || [];
  } catch (error) {
    console.error('Error loading tareas:', error);
    return [];
  }
}

export function saveTareas(tareas) {
  try {
    const db = getDb();
    setTable(db, 'tareas', tareas);
    saveDatabase(db);
  } catch (error) {
    console.error('Error saving tareas:', error);
  }
}

export function loadClientes() {
  try {
    return getTable(getDb(), 'clientes') || [];
  } catch (error) {
    console.error('Error loading clientes:', error);
    return [];
  }
}

export function saveClientes(clientes) {
  try {
    const db = getDb();
    setTable(db, 'clientes', clientes);
    saveDatabase(db);
  } catch (error) {
    console.error('Error saving clientes:', error);
  }
}

export function loadAudits() {
  try {
    return getTable(getDb(), 'audits') || [];
  } catch (error) {
    console.error('Error loading audits:', error);
    return [];
  }
}

export function saveAudits(audits) {
  try {
    const db = getDb();
    setTable(db, 'audits', audits);
    saveDatabase(db);
  } catch (error) {
    console.error('Error saving audits:', error);
  }
}

// New database-specific functions
export { getDb, insert, update, deleteRecord, select, saveDatabase };