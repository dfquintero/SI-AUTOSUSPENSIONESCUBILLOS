"""
============================================================
 AUTOSUSPENSIONES CUBILLOS - Capa de Datos
 Modelos y acceso a base de datos simulada en JSON
============================================================
"""

import json
from datetime import datetime, date
from typing import Dict, List, Optional
import os

# Ruta del archivo JSON de persistencia (siempre relativo a este módulo)
DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "database.json")

class Database:
    """Gestor centralizado de base de datos"""
    
    def __init__(self):
        self.db = self._cargar_db()
    
    def _cargar_db(self) -> Dict:
        """Cargar DB desde JSON o inicializar con datos por defecto"""
        if os.path.exists(DB_PATH):
            try:
                with open(DB_PATH, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception:
                pass
        return self._db_defecto()
    
    def _db_defecto(self) -> Dict:
        """Datos por defecto"""
        return {
            "usuarios": {
                "gustavo": {"pass": "1234", "rol": "propietario", "nombre": "Gustavo Cubillos"},
                "mec1":    {"pass": "1234", "rol": "mecanico",    "nombre": "Carlos Méndez"},
                "mec2":    {"pass": "1234", "rol": "mecanico",    "nombre": "Pedro Sánchez"},
                "mec3":    {"pass": "1234", "rol": "mecanico",    "nombre": "Luis Torres"},
            },
            "repuestos": [
                {"id": 1, "nombre": "Amortiguador delantero",   "stock": 4,  "minimo": 2, "precio": 85000,  "categoria": "Suspensión"},
                {"id": 2, "nombre": "Rótula de dirección",      "stock": 6,  "minimo": 3, "precio": 35000,  "categoria": "Dirección"},
                {"id": 3, "nombre": "Pastillas de freno",       "stock": 1,  "minimo": 4, "precio": 45000,  "categoria": "Frenos"},
                {"id": 4, "nombre": "Rodamiento de rueda",      "stock": 5,  "minimo": 2, "precio": 55000,  "categoria": "Suspensión"},
                {"id": 5, "nombre": "Aceite motor 20W50 1L",    "stock": 12, "minimo": 5, "precio": 18000,  "categoria": "Lubricantes"},
                {"id": 6, "nombre": "Buje de suspensión",       "stock": 3,  "minimo": 2, "precio": 28000,  "categoria": "Suspensión"},
                {"id": 7, "nombre": "Terminal de dirección",    "stock": 7,  "minimo": 3, "precio": 32000,  "categoria": "Dirección"},
                {"id": 8, "nombre": "Filtro de aceite",         "stock": 0,  "minimo": 3, "precio": 12000,  "categoria": "Filtros"},
                {"id": 9, "nombre": "Disco de freno",           "stock": 2,  "minimo": 2, "precio": 75000,  "categoria": "Frenos"},
                {"id":10, "nombre": "Resorte espiral delan.",   "stock": 3,  "minimo": 1, "precio": 95000,  "categoria": "Suspensión"},
            ],
            "herramientas": [
                {"id": 1, "nombre": "Llave de tubo 17mm",      "estado": "Disponible", "asignada_a": None, "hora_retiro": None},
                {"id": 2, "nombre": "Prensa hidráulica",       "estado": "En uso",     "asignada_a": "Carlos Méndez", "hora_retiro": "08:30"},
                {"id": 3, "nombre": "Soldadora eléctrica",     "estado": "Disponible", "asignada_a": None, "hora_retiro": None},
                {"id": 4, "nombre": "Gato hidráulico 3T",      "estado": "En uso",     "asignada_a": "Pedro Sánchez", "hora_retiro": "09:15"},
                {"id": 5, "nombre": "Torquímetro",             "estado": "Disponible", "asignada_a": None, "hora_retiro": None},
                {"id": 6, "nombre": "Extractor de rótulas",    "estado": "Disponible", "asignada_a": None, "hora_retiro": None},
                {"id": 7, "nombre": "Compresor de resortes",   "estado": "Disponible", "asignada_a": None, "hora_retiro": None},
                {"id": 8, "nombre": "Multímetro",              "estado": "Disponible", "asignada_a": None, "hora_retiro": None},
            ],
            "vehiculos": [
                {"placa": "TXA-123", "marca": "Hyundai", "modelo": "Accent", "año": 2018, "propietario": "Juan Rodríguez", "tel": "3101234567"},
                {"placa": "TXB-456", "marca": "Chevrolet", "modelo": "Spark", "año": 2020, "propietario": "María García", "tel": "3209876543"},
                {"placa": "TXC-789", "marca": "Renault", "modelo": "Logan", "año": 2019, "propietario": "Carlos López", "tel": "3154567890"},
            ],
            "historial": [
                {"placa": "TXA-123", "fecha": "2026-04-10", "trabajo": "Cambio amortiguadores delanteros", "repuestos": "2x Amortiguador delantero", "costo": 220000, "mecanico": "Carlos Méndez"},
                {"placa": "TXA-123", "fecha": "2026-02-15", "trabajo": "Alineación y balanceo", "repuestos": "N/A", "costo": 80000, "mecanico": "Pedro Sánchez"},
                {"placa": "TXB-456", "fecha": "2026-03-20", "trabajo": "Cambio pastillas de freno", "repuestos": "1x Pastillas de freno", "costo": 95000, "mecanico": "Carlos Méndez"},
            ],
            "tareas": [
                {"id": 1, "placa": "TXA-123", "trabajo": "Revisión suspensión completa", "estado": "Pendiente",   "mecanico": "Carlos Méndez", "prioridad": "Alta"},
                {"id": 2, "placa": "TXB-456", "trabajo": "Cambio aceite y filtros",       "estado": "En proceso", "mecanico": "Pedro Sánchez", "prioridad": "Media"},
                {"id": 3, "placa": "TXC-789", "trabajo": "Corrección dirección",          "estado": "Finalizado", "mecanico": "Luis Torres",   "prioridad": "Alta"},
                {"id": 4, "placa": "TXA-123", "trabajo": "Soldadura chasis",              "estado": "Pendiente",  "mecanico": "Carlos Méndez", "prioridad": "Baja"},
            ],
            "log": [],
            "transacciones": [
                {"tipo": "Ingreso", "concepto": "Reparación TXA-123", "monto": 220000, "fecha": "2026-05-01"},
                {"tipo": "Egreso",  "concepto": "Compra amortiguadores", "monto": 170000, "fecha": "2026-05-01"},
                {"tipo": "Ingreso", "concepto": "Cambio aceite TXB-456", "monto": 65000, "fecha": "2026-05-02"},
            ]
        }
    
    def guardar(self):
        """Guardar DB a JSON"""
        try:
            with open(DB_PATH, 'w', encoding='utf-8') as f:
                json.dump(self.db, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"❌ Error guardando DB: {e}")
    
    def get_usuarios(self) -> Dict:
        """Obtener diccionario de usuarios"""
        return self.db.get("usuarios", {})
    
    def get_usuario(self, username: str) -> Optional[Dict]:
        """Obtener usuario por nombre"""
        return self.db["usuarios"].get(username)
    
    def get_repuestos(self) -> List[Dict]:
        """Obtener lista de repuestos"""
        return self.db.get("repuestos", [])
    
    def get_repuesto(self, rid: int) -> Optional[Dict]:
        """Obtener repuesto por ID"""
        for r in self.db.get("repuestos", []):
            if r["id"] == rid:
                return r
        return None
    
    def agregar_repuesto(self, nombre: str, categoria: str, stock: int, minimo: int, precio: int) -> int:
        """Agregar nuevo repuesto y retornar ID"""
        repuestos = self.db.get("repuestos", [])
        nuevo_id = max(r["id"] for r in repuestos) + 1 if repuestos else 1
        repuestos.append({
            "id": nuevo_id, "nombre": nombre, "stock": stock,
            "minimo": minimo, "precio": precio, "categoria": categoria
        })
        return nuevo_id
    
    def update_repuesto_stock(self, rid: int, cantidad: int) -> bool:
        """Actualizar stock de repuesto"""
        r = self.get_repuesto(rid)
        if r:
            r["stock"] = max(0, r["stock"] + cantidad)
            return True
        return False
    
    def get_herramientas(self) -> List[Dict]:
        """Obtener lista de herramientas"""
        return self.db.get("herramientas", [])
    
    def get_herramienta(self, hid: int) -> Optional[Dict]:
        """Obtener herramienta por ID"""
        for h in self.db.get("herramientas", []):
            if h["id"] == hid:
                return h
        return None
    
    def get_vehiculos(self) -> List[Dict]:
        """Obtener lista de vehículos"""
        return self.db.get("vehiculos", [])
    
    def get_vehiculo(self, placa: str) -> Optional[Dict]:
        """Obtener vehículo por placa"""
        for v in self.db.get("vehiculos", []):
            if v["placa"] == placa.upper():
                return v
        return None
    
    def agregar_vehiculo(self, placa: str, marca: str, modelo: str, año: int, propietario: str, tel: str) -> bool:
        """Agregar nuevo vehículo"""
        if not self.get_vehiculo(placa):
            self.db.get("vehiculos", []).append({
                "placa": placa.upper(), "marca": marca, "modelo": modelo,
                "año": año, "propietario": propietario, "tel": tel
            })
            return True
        return False
    
    def get_historial(self, placa: str = None) -> List[Dict]:
        """Obtener historial, opcionalmente filtrado por placa"""
        historial = self.db.get("historial", [])
        if placa:
            return [h for h in historial if h["placa"] == placa.upper()]
        return historial
    
    def agregar_historial(self, placa: str, trabajo: str, repuestos: str, costo: int, mecanico: str):
        """Agregar entrada a historial"""
        self.db.get("historial", []).append({
            "placa": placa.upper(),
            "fecha": date.today().isoformat(),
            "trabajo": trabajo,
            "repuestos": repuestos,
            "costo": costo,
            "mecanico": mecanico
        })
    
    def get_tareas(self) -> List[Dict]:
        """Obtener lista de tareas"""
        return self.db.get("tareas", [])
    
    def get_tarea(self, tid: int) -> Optional[Dict]:
        """Obtener tarea por ID"""
        for t in self.db.get("tareas", []):
            if t["id"] == tid:
                return t
        return None
    
    def agregar_tarea(self, placa: str, trabajo: str, mecanico: str, prioridad: str) -> int:
        """Agregar nueva tarea"""
        tareas = self.db.get("tareas", [])
        nuevo_id = max(t["id"] for t in tareas) + 1 if tareas else 1
        tareas.append({
            "id": nuevo_id, "placa": placa.upper(), "trabajo": trabajo,
            "estado": "Pendiente", "mecanico": mecanico, "prioridad": prioridad
        })
        return nuevo_id
    
    def update_tarea_estado(self, tid: int, nuevo_estado: str) -> bool:
        """Actualizar estado de tarea"""
        t = self.get_tarea(tid)
        if t and nuevo_estado in ["Pendiente", "En proceso", "Finalizado"]:
            t["estado"] = nuevo_estado
            return True
        return False
    
    def get_log(self, limite: int = 100) -> List[Dict]:
        """Obtener log de auditoría (con límite para no crecer indefinidamente)"""
        log = self.db.get("log", [])
        return log[-limite:]
    
    def agregar_log(self, usuario: str, accion: str):
        """Agregar entrada a log de auditoría"""
        hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log = self.db.get("log", [])
        log.append({"hora": hora, "usuario": usuario, "accion": accion})
        # Limitar log a 500 entradas máximo
        if len(log) > 500:
            self.db["log"] = log[-500:]
    
    def get_transacciones(self) -> List[Dict]:
        """Obtener lista de transacciones"""
        return self.db.get("transacciones", [])
    
    def agregar_transaccion(self, tipo: str, concepto: str, monto: int):
        """Agregar nueva transacción"""
        if tipo not in ["Ingreso", "Egreso"]:
            raise ValueError("Tipo debe ser 'Ingreso' o 'Egreso'")
        self.db.get("transacciones", []).append({
            "tipo": tipo, "concepto": concepto,
            "monto": monto, "fecha": date.today().isoformat()
        })

# Instancia global de DB
db = Database()
