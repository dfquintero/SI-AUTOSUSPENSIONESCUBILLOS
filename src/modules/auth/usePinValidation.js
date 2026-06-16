import { loadUsers } from '../../services/storage.js';

export default function usePinValidation() {
  const validatePin = (pin, requiredRole = null) => {
    const users = loadUsers();
    const user = users.find(u => u.pin === pin && u.activo);
    
    if (!user) {
      return { valid: false, reason: 'PIN incorrecto o usuario inactivo' };
    }
    
    if (requiredRole && user.rol !== requiredRole && user.rol !== 'admin') {
      return { valid: false, reason: 'No tienes permisos para esta acción' };
    }
    
    return { valid: true, user };
  };
  
  return { validatePin };
}