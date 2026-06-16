"""
============================================================
 AUTOSUSPENSIONES CUBILLOS - Capa de Servicios (Backend)
 Lógica de negocios, validaciones y operaciones
============================================================
"""

from models_database import db
from typing import Dict, Tuple, List, Optional

class AuthService:
    """Servicio de autenticación"""
    
    @staticmethod
    def validar_credenciales(usuario: str, contraseña: str) -> Tuple[bool, str, str]:
        """Validar login y retornar (éxito, rol, nombre)"""
        u = usuario.strip().lower()
        p = contraseña.strip()
        
        usuario_db = db.get_usuario(u)
        if usuario_db and usuario_db["pass"] == p:
            return True, usuario_db["rol"], usuario_db["nombre"]
        return False, "", ""

class RepuestosService:
    """Servicio de gestión de repuestos"""
    
    @staticmethod
    def buscar_repuestos(query: str = "") -> List[Dict]:
        """Buscar repuestos por nombre o categoría"""
        q = query.lower().strip()
        repuestos = db.get_repuestos()
        if not q:
            return repuestos
        return [r for r in repuestos if q in r["nombre"].lower() or q in r["categoria"].lower()]
    
    @staticmethod
    def obtener_repuestos_bajo_stock() -> List[Dict]:
        """Obtener repuestos con stock <= mínimo"""
        return [r for r in db.get_repuestos() if r["stock"] <= r["minimo"]]
    
    @staticmethod
    def crear_repuesto(nombre: str, categoria: str, stock: int, minimo: int, precio: int) -> Dict:
        """Crear nuevo repuesto con validaciones"""
        # Validaciones
        nombre = nombre.strip()
        if not nombre or len(nombre) < 3:
            raise ValueError("Nombre debe tener al menos 3 caracteres")
        if stock < 0 or minimo < 0 or precio < 0:
            raise ValueError("Stock, mínimo y precio no pueden ser negativos")
        if stock < minimo:
            raise ValueError("Stock inicial no puede ser menor que el mínimo")
        
        rid = db.agregar_repuesto(nombre, categoria, stock, minimo, precio)
        db.guardar()
        return {"id": rid, "nombre": nombre, "categoria": categoria}
    
    @staticmethod
    def actualizar_stock(rid: int, cantidad: int, operacion: str) -> Tuple[bool, str]:
        """Actualizar stock de repuesto (operación: "+" o "-")"""
        r = db.get_repuesto(rid)
        if not r:
            return False, "Repuesto no encontrado"
        
        if cantidad <= 0:
            return False, "Cantidad debe ser positiva"
        
        if operacion == "-" and r["stock"] < cantidad:
            return False, f"Stock insuficiente. Disponibles: {r['stock']}"
        
        delta = cantidad if operacion == "+" else -cantidad
        db.update_repuesto_stock(rid, delta)
        db.guardar()
        return True, f"Stock actualizado a {r['stock']}"

class HerramientasService:
    """Servicio de gestión de herramientas"""
    
    @staticmethod
    def obtener_estadisticas() -> Dict:
        """Obtener stats: disponibles, en uso"""
        herramientas = db.get_herramientas()
        return {
            "disponibles": len([h for h in herramientas if h["estado"] == "Disponible"]),
            "en_uso": len([h for h in herramientas if h["estado"] == "En uso"]),
            "total": len(herramientas)
        }
    
    @staticmethod
    def crear_herramienta(nombre: str, marca: str, codigo: str, costo: int) -> int:
        """Crear herramienta y registrar gasto"""
        if not nombre.strip():
            raise ValueError("El nombre no puede estar vacío")
        if costo < 0:
            raise ValueError("El costo no puede ser negativo")
        
        hid = db.agregar_herramienta(nombre.strip(), marca.strip(), codigo.strip())
        db.guardar()
        
        # Registrar egreso automático
        if costo > 0:
            CuentasService.registrar_transaccion("Egreso", f"Compra Herramienta: {nombre}", costo)
            
        return hid

    @staticmethod
    def retirar_herramienta(hid: int, mecanico: str) -> Tuple[bool, str]:
        """Retirar herramienta para uso"""
        h = db.get_herramienta(hid)
        if not h:
            return False, "Herramienta no encontrada"
        
        if h["estado"] == "En uso":
            return False, f"Herramienta está en uso por: {h['asignada_a']}"
        
        from datetime import datetime
        hora = datetime.now().strftime("%H:%M")
        h["estado"] = "En uso"
        h["asignada_a"] = mecanico
        h["hora_retiro"] = hora
        db.guardar()
        return True, f"Herramienta retirada a las {hora}"
    
    @staticmethod
    def devolver_herramienta(hid: int, mecanico_actual: str, es_propietario: bool) -> Tuple[bool, str]:
        """Devolver herramienta al inventario"""
        h = db.get_herramienta(hid)
        if not h:
            return False, "Herramienta no encontrada"
        
        if h["estado"] == "Disponible":
            return False, "Herramienta ya está disponible"
        
        # Validar que sea el asignado o propietario
        if not es_propietario and h["asignada_a"] != mecanico_actual:
            return False, "Solo puedes devolver herramientas asignadas a ti"
        
        h["estado"] = "Disponible"
        h["asignada_a"] = None
        h["hora_retiro"] = None
        db.guardar()
        return True, "Herramienta devuelta al inventario"

class VehiculosService:
    """Servicio de gestión de vehículos e historial"""
    
    @staticmethod
    def buscar_vehiculo(placa: str) -> Optional[Dict]:
        """Buscar vehículo por placa"""
        return db.get_vehiculo(placa)
    
    @staticmethod
    def obtener_historial_vehiculo(placa: str) -> List[Dict]:
        """Obtener historial de reparaciones"""
        return sorted(db.get_historial(placa), key=lambda x: x["fecha"], reverse=True)
    
    @staticmethod
    def crear_registro_reparacion(placa: str, trabajo: str, repuestos: str, costo: int, mecanico: str) -> Tuple[bool, str]:
        """Crear nuevo registro de reparación"""
        placa = placa.strip().upper()
        trabajo = trabajo.strip()
        
        if not placa or len(placa) < 6:
            return False, "Placa inválida"
        if not trabajo or len(trabajo) < 5:
            return False, "Descripción del trabajo muy corta"
        if costo < 0:
            return False, "Costo no puede ser negativo"
        
        # Crear vehículo si no existe
        if not db.get_vehiculo(placa):
            db.agregar_vehiculo(placa, "—", "—", 2026, "Nuevo cliente", "—")
        
        db.agregar_historial(placa, trabajo, repuestos, costo, mecanico)
        db.guardar()
        return True, "Registro guardado correctamente"

class TareasService:
    """Servicio de gestión de tareas Kanban"""
    
    @staticmethod
    def obtener_tareas_por_estado(estado: str, mecanico: str = None) -> List[Dict]:
        """Obtener tareas filtradas por estado y opcionalmente por mecánico"""
        if estado not in ["Pendiente", "En proceso", "Finalizado"]:
            return []
        tareas = [t for t in db.get_tareas() if t["estado"] == estado]
        if mecanico:
            tareas = [t for t in tareas if t["mecanico"] == mecanico]
        return tareas
    
    @staticmethod
    def crear_tarea(placa: str, trabajo: str, mecanico: str, prioridad: str) -> Tuple[bool, str]:
        """Crear nueva tarea"""
        placa = placa.strip().upper()
        trabajo = trabajo.strip()
        
        if not placa:
            return False, "Placa requerida"
        if not trabajo or len(trabajo) < 5:
            return False, "Descripción del trabajo muy corta"
        if prioridad not in ["Alta", "Media", "Baja"]:
            return False, "Prioridad inválida"
        
        tid = db.agregar_tarea(placa, trabajo, mecanico, prioridad)
        db.guardar()
        return True, f"Tarea #{tid} creada"
    
    @staticmethod
    def cambiar_estado_tarea(tid: int, nuevo_estado: str, mecanico: str = None, es_propietario: bool = False) -> Tuple[bool, str]:
        """Cambiar estado de tarea"""
        t = db.get_tarea(tid)
        if not t:
            return False, "Tarea no encontrada"
        
        if nuevo_estado not in ["Pendiente", "En proceso", "Finalizado"]:
            return False, "Estado inválido"
        
        # Validar permisos: solo el mecánico asignado o propietario
        if mecanico and not es_propietario and t["mecanico"] != mecanico:
            return False, "Solo puedes mover tareas asignadas a ti"
        
        db.update_tarea_estado(tid, nuevo_estado)
        db.guardar()
        return True, f"Tarea #{tid} → {nuevo_estado}"

class CuentasService:
    """Servicio de gestión de cuentas/transacciones"""
    
    @staticmethod
    def obtener_resumen() -> Dict:
        """Obtener resumen de ingresos, egresos y saldo"""
        transacciones = db.get_transacciones()
        ingresos = sum(t["monto"] for t in transacciones if t["tipo"] == "Ingreso")
        egresos = sum(t["monto"] for t in transacciones if t["tipo"] == "Egreso")
        return {
            "ingresos": ingresos,
            "egresos": egresos,
            "saldo": ingresos - egresos
        }
    
    @staticmethod
    def registrar_transaccion(tipo: str, concepto: str, monto: int) -> Tuple[bool, str]:
        """Registrar nueva transacción"""
        tipo = tipo.strip()
        concepto = concepto.strip()
        
        if tipo not in ["Ingreso", "Egreso"]:
            return False, "Tipo debe ser 'Ingreso' o 'Egreso'"
        if not concepto or len(concepto) < 3:
            return False, "Concepto muy corto"
        if monto <= 0:
            return False, "Monto debe ser positivo"
        
        db.agregar_transaccion(tipo, concepto, monto)
        db.guardar()
        return True, f"{tipo} registrado: ${monto:,}"
    
    @staticmethod
    def obtener_ultimas_transacciones(limite: int = 8) -> List[Dict]:
        """Obtener últimas transacciones"""
        transacciones = db.get_transacciones()
        return list(reversed(transacciones[-limite:]))

class AuditoriaService:
    """Servicio de auditoría y logs"""
    
    @staticmethod
    def registrar_accion(usuario: str, accion: str):
        """Registrar acción en log"""
        db.agregar_log(usuario, accion)
        db.guardar()
    
    @staticmethod
    def obtener_log(limite: int = 10) -> List[Dict]:
        """Obtener log de auditoría"""
        return db.get_log(limite)

class DashboardService:
    """Servicio para datos del panel de propietario"""
    
    @staticmethod
    def obtener_metricas_hoy() -> Dict:
        """Obtener métricas para dashboard"""
        tareas = db.get_tareas()
        herramientas = db.get_herramientas()
        repuestos = db.get_repuestos()
        
        return {
            "tareas_activas": len([t for t in tareas if t["estado"] != "Finalizado"]),
            "herramientas_en_uso": len([h for h in herramientas if h["estado"] == "En uso"]),
            "repuestos_stock_bajo": len([r for r in repuestos if r["stock"] <= r["minimo"]])
        }
    
    @staticmethod
    def obtener_herramientas_en_uso() -> List[Dict]:
        """Obtener herramientas asignadas actualmente"""
        return [h for h in db.get_herramientas() if h["estado"] == "En uso"]
    
    @staticmethod
    def obtener_repuestos_bajo_stock() -> List[Dict]:
        """Obtener repuestos con stock bajo"""
        return [r for r in db.get_repuestos() if r["stock"] <= r["minimo"]]
