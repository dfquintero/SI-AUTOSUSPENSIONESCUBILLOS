const DB_KEY = 'asc_database';
const DB_VERSION = '1.0.0';
const SCHEMA_VERSION = '1.0';

const DATABASE_SCHEMA = {
  metadata: {
    version: DB_VERSION,
    schema_version: SCHEMA_VERSION,
    created_at: null,
    updated_at: null
  },
  tables: {
    users: {
      schema: {
        id: 'string',
        codigo: 'string',
        pin: 'string',
        nombre: 'string',
        rol: 'string',
        activo: 'boolean',
        fecha_creacion: 'datetime'
      },
      indexes: ['id', 'codigo', 'rol'],
      data: []
    },
    clientes: {
      schema: {
        id: 'string',
        placa: 'string',
        marca: 'string',
        modelo: 'string',
        anio: 'number',
        nombre: 'string',
        telefono: 'string',
        fecha_creacion: 'datetime'
      },
      indexes: ['id', 'placa'],
      data: []
    },
    herramientas: {
      schema: {
        id: 'string',
        nombre: 'string',
        cantidad: 'number',
        descripcion: 'string',
        categoria: 'string',
        imagen: 'string',
        fecha_creacion: 'datetime'
      },
      indexes: ['id', 'categoria'],
      data: []
    },
    repuestos: {
      schema: {
        id: 'string',
        nombre: 'string',
        cantidad: 'number',
        descripcion: 'string',
        precio: 'number',
        categoria: 'string',
        marca: 'string',
        imagen: 'string',
        fecha_creacion: 'datetime'
      },
      indexes: ['id', 'categoria'],
      data: []
    },
    transacciones: {
      schema: {
        id: 'string',
        tipo: 'string',
        categoria: 'string',
        monto: 'number',
        descripcion: 'string',
        placa: 'string',
        responsable: 'string',
        fecha: 'datetime',
        fecha_creacion: 'datetime'
      },
      indexes: ['id', 'placa', 'fecha'],
      data: []
    },
    tareas: {
      schema: {
        id: 'string',
        titulo: 'string',
        descripcion: 'string',
        prioridad: 'string',
        estado: 'string',
        placa: 'string',
        asignado_a: 'string',
        fecha_creacion: 'datetime',
        fecha_limite: 'datetime'
      },
      indexes: ['id', 'estado', 'prioridad'],
      data: []
    },
    audits: {
      schema: {
        id: 'string',
        fecha: 'datetime',
        usuario_id: 'string',
        accion: 'string',
        tabla: 'string',
        detalles: 'object'
      },
      indexes: ['id', 'usuario_id', 'tabla'],
      data: []
    }
  }
};

export function initializeDatabase() {
  try {
    const existing = localStorage.getItem(DB_KEY);
    if (existing) {
      const db = JSON.parse(existing);
      if (db.metadata.schema_version === SCHEMA_VERSION) {
        // Check if there's an active admin user
        const activeAdmins = db.tables.users.data.filter(u => u.rol === 'admin' && u.activo);
        if (activeAdmins.length === 0) {
          // Create default admin user
          const defaultAdmin = {
            id: 'users_default_admin',
            codigo: 'ADMIN',
            pin: '9999',
            nombre: 'Administrador',
            rol: 'admin',
            activo: true,
            fecha_creacion: new Date().toISOString()
          };
          db.tables.users.data.push(defaultAdmin);
          saveDatabase(db);
          console.log('Created default admin user');
        }
        return db;
      }
      // Migration logic would go here
      return migrateDatabase(db);
    }
    
    // Create new database
    const newDb = JSON.parse(JSON.stringify(DATABASE_SCHEMA));
    newDb.metadata.created_at = new Date().toISOString();
    newDb.metadata.updated_at = new Date().toISOString();
    
    // Create default admin user
    const defaultAdmin = {
      id: 'users_default_admin',
      codigo: 'ADMIN',
      pin: '9999',
      nombre: 'Administrador',
      rol: 'admin',
      activo: true,
      fecha_creacion: new Date().toISOString()
    };
    newDb.tables.users.data.push(defaultAdmin);
    
    saveDatabase(newDb);
    return newDb;
  } catch (error) {
    console.error('Error initializing database:', error);
    return JSON.parse(JSON.stringify(DATABASE_SCHEMA));
  }
}

export function saveDatabase(db) {
  try {
    db.metadata.updated_at = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

export function getTable(db, tableName) {
  if (!db.tables[tableName]) {
    console.error(`Table ${tableName} does not exist`);
    return null;
  }
  return db.tables[tableName].data;
}

export function setTable(db, tableName, data) {
  if (!db.tables[tableName]) {
    console.error(`Table ${tableName} does not exist`);
    return db;
  }
  db.tables[tableName].data = data;
  return db;
}

export function insert(db, tableName, record) {
  const table = db.tables[tableName];
  if (!table) {
    console.error(`Table ${tableName} does not exist`);
    return db;
  }
  
  if (!record.id) {
    record.id = `${tableName}_${Date.now()}`;
  }
  
  if (table.schema.fecha_creacion && !record.fecha_creacion) {
    record.fecha_creacion = new Date().toISOString();
  }
  
  table.data.push(record);
  return db;
}

export function update(db, tableName, id, updates) {
  const table = db.tables[tableName];
  if (!table) {
    console.error(`Table ${tableName} does not exist`);
    return db;
  }
  
  const index = table.data.findIndex(record => record.id === id);
  if (index === -1) {
    console.error(`Record with id ${id} not found in table ${tableName}`);
    return db;
  }
  
  table.data[index] = { ...table.data[index], ...updates };
  return db;
}

export function deleteRecord(db, tableName, id) {
  const table = db.tables[tableName];
  if (!table) {
    console.error(`Table ${tableName} does not exist`);
    return db;
  }
  
  table.data = table.data.filter(record => record.id !== id);
  return db;
}

export function select(db, tableName, where = null) {
  const table = db.tables[tableName];
  if (!table) {
    console.error(`Table ${tableName} does not exist`);
    return [];
  }
  
  if (!where) {
    return table.data;
  }
  
  return table.data.filter(record => {
    return Object.keys(where).every(key => record[key] === where[key]);
  });
}

export function migrateDatabase(oldDb) {
  // Migration logic for future schema changes
  console.log('Migrating database from version', oldDb.metadata.schema_version, 'to', SCHEMA_VERSION);
  return oldDb;
}

// Legacy migration from old storage format
export function migrateFromLegacy() {
  const legacyKeys = {
    'asc_users': 'users',
    'asc_herramientas': 'herramientas',
    'asc_repuestos': 'repuestos',
    'asc_transacciones': 'transacciones',
    'asc_tareas': 'tareas',
    'asc_clientes': 'clientes',
    'asc_audits': 'audits'
  };
  
  const db = initializeDatabase();
  let hasLegacyData = false;
  
  Object.keys(legacyKeys).forEach(legacyKey => {
    const tableName = legacyKeys[legacyKey];
    const legacyData = localStorage.getItem(legacyKey);
    
    if (legacyData) {
      hasLegacyData = true;
      try {
        const data = JSON.parse(legacyData);
        db.tables[tableName].data = data;
        console.log(`Migrated ${data.length} records from ${legacyKey} to ${tableName}`);
      } catch (error) {
        console.error(`Error migrating ${legacyKey}:`, error);
      }
    }
  });
  
  // Ensure there's always an active admin after migration
  const activeAdmins = db.tables.users.data.filter(u => u.rol === 'admin' && u.activo);
  if (activeAdmins.length === 0) {
    const defaultAdmin = {
      id: 'users_default_admin',
      codigo: 'ADMIN',
      pin: '9999',
      nombre: 'Administrador',
      rol: 'admin',
      activo: true,
      fecha_creacion: new Date().toISOString()
    };
    db.tables.users.data.push(defaultAdmin);
    console.log('Created default admin user after migration');
  }
  
  if (hasLegacyData) {
    saveDatabase(db);
    // Optionally clear legacy data
    // Object.keys(legacyKeys).forEach(key => localStorage.removeItem(key));
  }
  
  return db;
}
