import { useState, useEffect } from 'react';
import { loadTareas, saveTareas } from '../../services/storage.js';

export default function useTareas() {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    setTareas(loadTareas());
  }, []);

  const crearTarea = (tarea) => {
    const nuevaTarea = { 
      ...tarea, 
      id: Date.now(), 
      estado: 'pendiente', 
      createdAt: new Date().toISOString() 
    };
    const actualizadas = [...tareas, nuevaTarea];
    setTareas(actualizadas);
    saveTareas(actualizadas);
  };

  const moverTarea = (id, nuevoEstado) => {
    const actualizadas = tareas.map(t => 
      t.id === id ? { ...t, estado: nuevoEstado, updatedAt: new Date().toISOString() } : t
    );
    setTareas(actualizadas);
    saveTareas(actualizadas);
  };

  const actualizarTarea = (id, updates) => {
    const actualizadas = tareas.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    setTareas(actualizadas);
    saveTareas(actualizadas);
  };

  const tareasPorEstado = {
    pendiente: tareas.filter(t => t.estado === 'pendiente'),
    en_proceso: tareas.filter(t => t.estado === 'en_proceso'),
    finalizado: tareas.filter(t => t.estado === 'finalizado'),
  };

  return {
    tareas,
    tareasPorEstado,
    crearTarea,
    moverTarea,
    actualizarTarea
  };
}