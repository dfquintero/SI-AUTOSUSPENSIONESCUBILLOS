"""
============================================================
 AUTOSUSPENSIONES CUBILLOS - Constantes de Estilo
 Colores, fuentes y configuración visual
============================================================
"""

# ──────────────────────────────────────────────
#  COLORES CORPORATIVOS
# ──────────────────────────────────────────────
AMARILLO    = "#FFD600"
AMARILLO_H  = "#FFC200"
AZUL        = "#1A237E"
AZUL_MED    = "#1565C0"
AZUL_CLARO  = "#1E88E5"
BLANCO      = "#FFFFFF"
GRIS_BG     = "#F5F5F5"
GRIS_CARD   = "#EEEEEE"
ROJO        = "#D32F2F"
VERDE       = "#2E7D32"
VERDE_CLARO = "#43A047"
NARANJA     = "#E65100"
TEXTO_DARK  = "#212121"
TEXTO_MED   = "#616161"
SOMBRA      = "#BDBDBD"

# ──────────────────────────────────────────────
#  TIPOGRAFÍA
# ──────────────────────────────────────────────
FONT_TITULO   = ("Segoe UI", 20, "bold")
FONT_SUBTIT   = ("Segoe UI", 14, "bold")
FONT_BOTON    = ("Segoe UI", 13, "bold")
FONT_BOTON_G  = ("Segoe UI", 15, "bold")
FONT_BODY     = ("Segoe UI", 12)
FONT_SMALL    = ("Segoe UI", 10)
FONT_BADGE    = ("Segoe UI", 9, "bold")
FONT_MONOSPACE = ("Courier New", 9)

# ──────────────────────────────────────────────
#  CONFIGURACIÓN DE INTERFAZ
# ──────────────────────────────────────────────
WINDOW_WIDTH = 420
WINDOW_HEIGHT = 780
WINDOW_MIN_WIDTH = 380
WINDOW_MIN_HEIGHT = 600

# ──────────────────────────────────────────────
#  ESTADOS Y COLORES ASOCIADOS
# ──────────────────────────────────────────────
ESTADO_COLORES = {
    "Pendiente": ROJO,
    "En proceso": NARANJA,
    "Finalizado": VERDE,
    "Disponible": VERDE,
    "En uso": ROJO,
}

PRIORIDAD_COLORES = {
    "Alta": ROJO,
    "Media": NARANJA,
    "Baja": VERDE,
}
