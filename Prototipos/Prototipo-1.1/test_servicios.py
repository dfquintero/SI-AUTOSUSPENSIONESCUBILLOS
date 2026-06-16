"""
============================================================
 Script de Prueba - Validar servicios sin GUI
 Ejecutar: python test_servicios.py
============================================================
"""

import sys
from models_database import db
from services_backend import (
    AuthService, RepuestosService, CuentasService,
    TareasService, AuditoriaService
)

def test_autenticacion():
    print("\n✓ TEST 1: Autenticación")
    print("─" * 50)
    ok, rol, nombre = AuthService.validar_credenciales("gustavo", "1234")
    assert ok == True, "Login debería ser exitoso"
    assert rol == "propietario", "Rol debería ser propietario"
    print(f"✓ Login exitoso: {nombre} ({rol})")
    
    ok, _, _ = AuthService.validar_credenciales("gustavo", "wrongpass")
    assert ok == False, "Login con contraseña incorrecta debería fallar"
    print("✓ Login rechazado con contraseña incorrecta")

def test_repuestos():
    print("\n✓ TEST 2: Servicio Repuestos")
    print("─" * 50)
    
    # Buscar
    repuestos = RepuestosService.buscar_repuestos("amort")
    print(f"✓ Búsqueda encontró {len(repuestos)} repuesto(s)")
    
    # Stock bajo
    bajos = RepuestosService.obtener_repuestos_bajo_stock()
    print(f"✓ Repuestos con stock bajo: {len(bajos)}")
    
    # Actualizar stock
    ok, msg = RepuestosService.actualizar_stock(1, 5, "+")
    assert ok == True, "Debería agregar stock exitosamente"
    print(f"✓ Stock actualizado: {msg}")

def test_transacciones():
    print("\n✓ TEST 3: Servicio Cuentas")
    print("─" * 50)
    
    resumen_antes = CuentasService.obtener_resumen()
    print(f"✓ Resumen antes: Ingresos=${resumen_antes['ingresos']:,}, Egresos=${resumen_antes['egresos']:,}")
    
    ok, msg = CuentasService.registrar_transaccion("Ingreso", "Test ingreso", 50000)
    assert ok == True, "Debería registrar ingreso"
    print(f"✓ Transacción registrada: {msg}")
    
    resumen_despues = CuentasService.obtener_resumen()
    assert resumen_despues['ingresos'] > resumen_antes['ingresos'], "Ingresos deberían aumentar"
    print(f"✓ Resumen después: Ingresos=${resumen_despues['ingresos']:,}")

def test_validaciones():
    print("\n✓ TEST 4: Validaciones de Backend")
    print("─" * 50)
    
    # Validar repuesto con nombre muy corto
    try:
        RepuestosService.crear_repuesto("XX", "Test", 0, 0, 0)
        assert False, "Debería rechazar nombre corto"
    except ValueError as e:
        print(f"✓ Rechazó nombre corto: {e}")
    
    # Validar transacción con monto negativo
    ok, msg = CuentasService.registrar_transaccion("Ingreso", "Test", -1000)
    assert ok == False, "Debería rechazar monto negativo"
    print(f"✓ Rechazó monto negativo: {msg}")

def test_auditoria():
    print("\n✓ TEST 5: Auditoría")
    print("─" * 50)
    
    log_antes = len(db.get_log(999))
    AuditoriaService.registrar_accion("Test Usuario", "Acción de prueba")
    log_despues = len(db.get_log(999))
    
    assert log_despues > log_antes, "Log debería tener entrada nueva"
    print(f"✓ Log registrado - Total: {log_despues} entradas")

def test_persistencia():
    print("\n✓ TEST 6: Persistencia JSON")
    print("─" * 50)
    
    db.guardar()
    print("✓ Base de datos guardada en database.json")
    
    import os
    test_db_path = os.path.join(os.path.dirname(__file__), "database.json")
    assert os.path.exists(test_db_path), "Archivo JSON debería existir"
    print(f"✓ Archivo database.json existe en {test_db_path}")

def main():
    print("╔" + "="*58 + "╗")
    print("║  PRUEBAS DE SERVICIOS - Autosuspensiones Cubillos v2.0  ║")
    print("╚" + "="*58 + "╝")
    
    try:
        test_autenticacion()
        test_repuestos()
        test_transacciones()
        test_validaciones()
        test_auditoria()
        test_persistencia()
        
        print("\n" + "╔" + "="*58 + "╗")
        print("║  ✓ TODOS LOS TESTS PASARON EXITOSAMENTE            ║")
        print("╚" + "="*58 + "╝\n")
        return 0
        
    except AssertionError as e:
        print(f"\n❌ TEST FALLIDO: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
