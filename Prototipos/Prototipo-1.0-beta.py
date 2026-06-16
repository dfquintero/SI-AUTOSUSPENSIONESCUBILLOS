"""
============================================================
 AUTOSUSPENSIONES CUBILLOS - Sistema de Información v1.0
 Prototipo para evaluación de heurísticas de Nielsen
 Universidad Nacional de Colombia - 2026
============================================================
 Ejecutar: python app.py
 Requiere: pip install Pillow
============================================================
"""

import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import json
from datetime import datetime, date
import math

# ──────────────────────────────────────────────
#  CONSTANTES DE ESTILO  (colores empresa)
# ──────────────────────────────────────────────
AMARILLO   = "#FFD600"
AMARILLO_H = "#FFC200"
AZUL       = "#1A237E"
AZUL_MED   = "#1565C0"
AZUL_CLARO = "#1E88E5"
BLANCO     = "#FFFFFF"
GRIS_BG    = "#F5F5F5"
GRIS_CARD  = "#EEEEEE"
ROJO       = "#D32F2F"
VERDE      = "#2E7D32"
VERDE_CLARO= "#43A047"
NARANJA    = "#E65100"
TEXTO_DARK = "#212121"
TEXTO_MED  = "#616161"
SOMBRA     = "#BDBDBD"

FONT_TITULO  = ("Segoe UI", 20, "bold")
FONT_SUBTIT  = ("Segoe UI", 14, "bold")
FONT_BOTON   = ("Segoe UI", 13, "bold")
FONT_BOTON_G = ("Segoe UI", 15, "bold")
FONT_BODY    = ("Segoe UI", 12)
FONT_SMALL   = ("Segoe UI", 10)
FONT_BADGE   = ("Segoe UI", 9, "bold")

# ──────────────────────────────────────────────
#  BASE DE DATOS SIMULADA (en memoria)
# ──────────────────────────────────────────────
DB = {
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
    "log": []
}

USUARIO_ACTUAL = {"usuario": None, "rol": None, "nombre": None}


def log_accion(accion):
    hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    DB["log"].append({"hora": hora, "usuario": USUARIO_ACTUAL["nombre"], "accion": accion})


# ──────────────────────────────────────────────
#  WIDGETS UTILITARIOS  (estilo Material/Android)
# ──────────────────────────────────────────────

def make_btn(parent, text, cmd, color=AZUL_MED, fg=BLANCO, size=FONT_BOTON, emoji="", width=None, height=2):
    label = f"{emoji}  {text}" if emoji else text
    b = tk.Button(parent, text=label, command=cmd, bg=color, fg=fg,
                  font=size, relief="flat", bd=0, cursor="hand2",
                  activebackground=AZUL_CLARO, activeforeground=BLANCO,
                  padx=16, pady=10, height=height)
    if width:
        b.config(width=width)
    b.bind("<Enter>", lambda e: b.config(bg=AZUL_CLARO if color==AZUL_MED else AMARILLO_H if color==AMARILLO else color))
    b.bind("<Leave>", lambda e: b.config(bg=color))
    return b


def make_card(parent, title="", color_top=AZUL, **grid_kwargs):
    frame = tk.Frame(parent, bg=BLANCO, bd=0, relief="flat",
                     highlightbackground=SOMBRA, highlightthickness=1)
    if title:
        top = tk.Frame(frame, bg=color_top, pady=8)
        top.pack(fill="x")
        tk.Label(top, text=title, font=FONT_SUBTIT, bg=color_top, fg=BLANCO, padx=14).pack(side="left")
    body = tk.Frame(frame, bg=BLANCO, padx=12, pady=10)
    body.pack(fill="both", expand=True)
    return frame, body


def badge(parent, text, color=AZUL_MED):
    f = tk.Frame(parent, bg=color, padx=6, pady=2)
    tk.Label(f, text=text, font=FONT_BADGE, bg=color, fg=BLANCO).pack()
    return f


def separator(parent):
    tk.Frame(parent, bg=SOMBRA, height=1).pack(fill="x", pady=4)


# ──────────────────────────────────────────────
#  PANTALLA: LOGIN
# ──────────────────────────────────────────────

class PantallaLogin(tk.Frame):
    def __init__(self, master, on_login):
        super().__init__(master, bg=AZUL)
        self.on_login = on_login
        self._build()

    def _build(self):
        # Fondo dividido
        top = tk.Frame(self, bg=AZUL, pady=30)
        top.pack(fill="x")

        # Logo simulado (canvas dibujado)
        canvas = tk.Canvas(top, width=100, height=100, bg=AZUL, highlightthickness=0)
        canvas.pack()
        # Círculo amarillo
        canvas.create_oval(5, 5, 95, 95, fill=AMARILLO, outline="")
        # Letras AC
        canvas.create_text(50, 50, text="ASC", font=("Segoe UI", 22, "bold"), fill=AZUL)

        tk.Label(top, text="Autosuspensiones Cubillos",
                 font=("Segoe UI", 18, "bold"), bg=AZUL, fg=BLANCO).pack(pady=(8,2))
        tk.Label(top, text="Sistema de Información v1.0",
                 font=FONT_SMALL, bg=AZUL, fg="#90CAF9").pack()

        # Tarjeta blanca
        card = tk.Frame(self, bg=BLANCO, padx=28, pady=28)
        card.pack(fill="both", expand=True, padx=0, pady=0)

        tk.Label(card, text="Iniciar sesión", font=FONT_SUBTIT, bg=BLANCO, fg=TEXTO_DARK).pack(pady=(0,18))

        # Usuario
        tk.Label(card, text="👤  Usuario", font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, anchor="w").pack(fill="x")
        self.entry_user = tk.Entry(card, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK, insertbackground=AZUL_MED)
        self.entry_user.pack(fill="x", ipady=10, pady=(4,14))
        self.entry_user.insert(0, "gustavo")

        # Contraseña
        tk.Label(card, text="🔒  Contraseña", font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, anchor="w").pack(fill="x")
        self.entry_pass = tk.Entry(card, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK, show="•", insertbackground=AZUL_MED)
        self.entry_pass.pack(fill="x", ipady=10, pady=(4,6))
        self.entry_pass.insert(0, "1234")

        # Hint usuarios
        tk.Label(card, text="Usuarios demo: gustavo / mec1 / mec2 / mec3  (pass: 1234)",
                 font=("Segoe UI", 9), bg=BLANCO, fg=TEXTO_MED).pack(pady=(2,18))

        btn = make_btn(card, "INGRESAR", self._login, color=AMARILLO, fg=AZUL,
                       size=FONT_BOTON_G, emoji="▶", height=2)
        btn.pack(fill="x")

        self.lbl_error = tk.Label(card, text="", font=FONT_BODY, bg=BLANCO, fg=ROJO)
        self.lbl_error.pack(pady=8)

        self.entry_pass.bind("<Return>", lambda e: self._login())

    def _login(self):
        u = self.entry_user.get().strip().lower()
        p = self.entry_pass.get().strip()
        if u in DB["usuarios"] and DB["usuarios"][u]["pass"] == p:
            info = DB["usuarios"][u]
            USUARIO_ACTUAL["usuario"] = u
            USUARIO_ACTUAL["rol"]     = info["rol"]
            USUARIO_ACTUAL["nombre"]  = info["nombre"]
            log_accion("Inicio de sesión")
            self.on_login()
        else:
            self.lbl_error.config(text="⚠ Usuario o contraseña incorrectos")
            self.entry_pass.delete(0, "end")


# ──────────────────────────────────────────────
#  PANTALLA: MENÚ PRINCIPAL
# ──────────────────────────────────────────────

class MenuPrincipal(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        # Top bar estilo Android
        bar = tk.Frame(self, bg=AZUL, pady=12)
        bar.pack(fill="x")
        tk.Label(bar, text="≡", font=("Segoe UI", 20), bg=AZUL, fg=BLANCO, padx=14).pack(side="left")
        tk.Label(bar, text="Autosuspensiones Cubillos", font=FONT_SUBTIT, bg=AZUL, fg=BLANCO).pack(side="left")
        tk.Label(bar, text=f"🔔  {USUARIO_ACTUAL['nombre']}", font=FONT_SMALL, bg=AZUL, fg="#90CAF9", padx=14).pack(side="right")

        # Bienvenida + rol
        info = tk.Frame(self, bg=AZUL_MED, pady=14, padx=16)
        info.pack(fill="x")
        rol_texto = "Propietario 👑" if USUARIO_ACTUAL["rol"] == "propietario" else "Mecánico 🔧"
        tk.Label(info, text=f"Hola, {USUARIO_ACTUAL['nombre']}!", font=FONT_SUBTIT, bg=AZUL_MED, fg=BLANCO).pack(anchor="w")
        tk.Label(info, text=f"Rol: {rol_texto}  •  {date.today().strftime('%d/%m/%Y')}", font=FONT_SMALL, bg=AZUL_MED, fg="#BBDEFB").pack(anchor="w")

        # Alertas rápidas
        alertas_frame = tk.Frame(self, bg=GRIS_BG, padx=10, pady=6)
        alertas_frame.pack(fill="x")
        bajos = [r for r in DB["repuestos"] if r["stock"] <= r["minimo"]]
        if bajos:
            a = tk.Frame(alertas_frame, bg="#FFF9C4", padx=10, pady=6, highlightbackground=AMARILLO, highlightthickness=1)
            a.pack(fill="x", pady=2)
            tk.Label(a, text=f"⚠  {len(bajos)} repuesto(s) con stock bajo o agotado", font=FONT_BODY, bg="#FFF9C4", fg=NARANJA).pack(anchor="w")

        # Scroll container para los botones
        scroll_frame = tk.Frame(self, bg=GRIS_BG)
        scroll_frame.pack(fill="both", expand=True)

        canvas = tk.Canvas(scroll_frame, bg=GRIS_BG, highlightthickness=0)
        vsb = ttk.Scrollbar(scroll_frame, orient="vertical", command=canvas.yview)
        canvas.configure(yscrollcommand=vsb.set)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)

        inner = tk.Frame(canvas, bg=GRIS_BG)
        win_id = canvas.create_window((0, 0), window=inner, anchor="nw")

        def _resize(e):
            canvas.itemconfig(win_id, width=e.width)
        canvas.bind("<Configure>", _resize)
        inner.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

        # Grid de botones grandes (estilo Android)
        tk.Label(inner, text="¿Qué necesitas hacer?", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, pady=10).pack()

        grid = tk.Frame(inner, bg=GRIS_BG, padx=10)
        grid.pack(fill="x", pady=4)

        MENUS = [
            # (emoji, texto, color, pantalla, roles)
            ("🔧", "Inventario\nRepuestos",    AZUL_MED,     "repuestos",    ["propietario","mecanico"]),
            ("🛠", "Inventario\nHerramientas", AZUL_CLARO,   "herramientas", ["propietario","mecanico"]),
            ("🚗", "Historial\nVehículos",     "#6A1B9A",    "historial",    ["propietario","mecanico"]),
            ("📋", "Gestor\nde Tareas",        "#00695C",    "tareas",       ["propietario","mecanico"]),
            ("💰", "Cuentas\nRápidas",         NARANJA,      "cuentas",      ["propietario"]),
            ("📊", "Panel\nPropietario",       ROJO,         "panel",        ["propietario"]),
        ]

        rol = USUARIO_ACTUAL["rol"]
        col, row = 0, 0
        for emoji, txt, color, pant, roles in MENUS:
            if rol not in roles:
                continue
            btn = tk.Button(grid, text=f"{emoji}\n{txt}", font=FONT_BOTON,
                            bg=color, fg=BLANCO, relief="flat", cursor="hand2",
                            width=10, height=5,
                            command=lambda p=pant: self.nav(p))
            btn.grid(row=row, column=col, padx=8, pady=8, sticky="nsew")
            col += 1
            if col == 2:
                col = 0
                row += 1

        grid.columnconfigure(0, weight=1)
        grid.columnconfigure(1, weight=1)

        # Botón cerrar sesión
        sep_f = tk.Frame(inner, bg=GRIS_BG, pady=4)
        sep_f.pack(fill="x", padx=10)
        make_btn(sep_f, "Cerrar sesión", lambda: self.nav("logout"),
                 color=ROJO, emoji="🚪", height=1).pack(fill="x", pady=8)


# ──────────────────────────────────────────────
#  PANTALLA: INVENTARIO REPUESTOS  (HU-003 / HU-008)
# ──────────────────────────────────────────────

class PantallaRepuestos(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        self._topbar("🔧 Inventario de Repuestos")
        # Buscador
        bar = tk.Frame(self, bg=AZUL_MED, padx=10, pady=8)
        bar.pack(fill="x")
        tk.Label(bar, text="🔍", font=FONT_BODY, bg=AZUL_MED, fg=BLANCO).pack(side="left")
        self.var_search = tk.StringVar()
        self.var_search.trace("w", lambda *a: self._render())
        e = tk.Entry(bar, textvariable=self.var_search, font=FONT_BODY, bd=0,
                     bg=BLANCO, fg=TEXTO_DARK, insertbackground=AZUL_MED)
        e.pack(side="left", fill="x", expand=True, ipady=6, padx=8)

        # Botones acción
        btn_row = tk.Frame(self, bg=GRIS_BG, padx=10, pady=8)
        btn_row.pack(fill="x")
        if USUARIO_ACTUAL["rol"] == "propietario":
            make_btn(btn_row, "Agregar repuesto", self._agregar, emoji="➕",
                     color=VERDE_CLARO, height=1).pack(side="left", padx=4)
        make_btn(btn_row, "Ver stock bajo ⚠", self._ver_bajos, emoji="",
                 color=NARANJA, height=1).pack(side="left", padx=4)

        # Lista
        self.lista_frame = tk.Frame(self, bg=GRIS_BG)
        self.lista_frame.pack(fill="both", expand=True, padx=6, pady=4)

        canvas = tk.Canvas(self.lista_frame, bg=GRIS_BG, highlightthickness=0)
        vsb = ttk.Scrollbar(self.lista_frame, orient="vertical", command=canvas.yview)
        canvas.configure(yscrollcommand=vsb.set)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)
        self.scroll_inner = tk.Frame(canvas, bg=GRIS_BG)
        self._win = canvas.create_window((0,0), window=self.scroll_inner, anchor="nw")
        canvas.bind("<Configure>", lambda e: canvas.itemconfig(self._win, width=e.width))
        self.scroll_inner.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        self._canvas = canvas

        self._render()

    def _topbar(self, titulo):
        bar = tk.Frame(self, bg=AZUL, pady=12)
        bar.pack(fill="x")
        make_btn(bar, "", lambda: self.nav("menu"), color=AZUL, fg=BLANCO,
                 emoji="◀", height=1).pack(side="left", padx=4)
        tk.Label(bar, text=titulo, font=FONT_SUBTIT, bg=AZUL, fg=BLANCO).pack(side="left")

    def _render(self, mostrar=None):
        for w in self.scroll_inner.winfo_children():
            w.destroy()
        q = self.var_search.get().lower() if hasattr(self, "var_search") else ""
        data = mostrar if mostrar else DB["repuestos"]
        data = [r for r in data if q in r["nombre"].lower() or q in r["categoria"].lower()]

        for r in data:
            color_stock = VERDE if r["stock"] > r["minimo"] else (NARANJA if r["stock"] > 0 else ROJO)
            card = tk.Frame(self.scroll_inner, bg=BLANCO, padx=12, pady=10,
                            highlightbackground=SOMBRA, highlightthickness=1)
            card.pack(fill="x", padx=8, pady=4)

            # Header fila
            h = tk.Frame(card, bg=BLANCO)
            h.pack(fill="x")
            tk.Label(h, text=r["nombre"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(side="left")
            stk = tk.Label(h, text=f"  {r['stock']} uds  ", font=FONT_BADGE, bg=color_stock, fg=BLANCO, padx=4, pady=2)
            stk.pack(side="right")

            # Detalles
            d = tk.Frame(card, bg=BLANCO)
            d.pack(fill="x", pady=2)
            tk.Label(d, text=f"📦 {r['categoria']}  •  Min: {r['minimo']}  •  Precio: ${r['precio']:,}", font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(side="left")

            if r["stock"] <= r["minimo"]:
                alerta = "⚠ STOCK BAJO" if r["stock"] > 0 else "🚫 AGOTADO"
                tk.Label(card, text=alerta, font=FONT_BADGE, bg="#FFF3E0" if r["stock"]>0 else "#FFEBEE",
                         fg=NARANJA if r["stock"]>0 else ROJO, padx=4).pack(anchor="w", pady=(2,0))

            # Botones acción por fila
            bf = tk.Frame(card, bg=BLANCO)
            bf.pack(fill="x", pady=(6,0))

            if USUARIO_ACTUAL["rol"] == "propietario":
                make_btn(bf, "Agregar unidades", lambda rid=r["id"]: self._agregar_stock(rid),
                         color=VERDE_CLARO, emoji="➕", height=1, size=FONT_SMALL).pack(side="left", padx=(0,4))
                make_btn(bf, "Solicitar a proveedor", lambda nom=r["nombre"]: self._solicitar(nom),
                         color=AZUL_CLARO, emoji="📤", height=1, size=FONT_SMALL).pack(side="left", padx=4)
            else:
                make_btn(bf, "Usar en reparación", lambda rid=r["id"]: self._usar_repuesto(rid),
                         color=AZUL_MED, emoji="🔧", height=1, size=FONT_SMALL).pack(side="left")

    def _ver_bajos(self):
        bajos = [r for r in DB["repuestos"] if r["stock"] <= r["minimo"]]
        self._render(mostrar=bajos)

    def _agregar(self):
        win = tk.Toplevel(self)
        win.title("Agregar Repuesto")
        win.geometry("360x400")
        win.configure(bg=BLANCO)
        win.grab_set()

        tk.Label(win, text="Nuevo Repuesto", font=FONT_SUBTIT, bg=BLANCO, fg=AZUL, pady=12).pack()
        campos = [("Nombre", ""), ("Categoría", "Suspensión"), ("Stock inicial", "0"),
                  ("Stock mínimo", "2"), ("Precio unitario", "0")]
        entries = {}
        for lbl, default in campos:
            tk.Label(win, text=lbl, font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, anchor="w").pack(fill="x", padx=20)
            e = tk.Entry(win, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK)
            e.insert(0, default)
            e.pack(fill="x", padx=20, ipady=8, pady=(2,8))
            entries[lbl] = e

        def guardar():
            nuevo_id = max(r["id"] for r in DB["repuestos"]) + 1
            DB["repuestos"].append({
                "id": nuevo_id,
                "nombre":    entries["Nombre"].get(),
                "stock":     int(entries["Stock inicial"].get() or 0),
                "minimo":    int(entries["Stock mínimo"].get() or 0),
                "precio":    int(entries["Precio unitario"].get() or 0),
                "categoria": entries["Categoría"].get(),
            })
            log_accion(f"Nuevo repuesto: {entries['Nombre'].get()}")
            messagebox.showinfo("✅ Guardado", "Repuesto agregado exitosamente.", parent=win)
            win.destroy()
            self._render()

        make_btn(win, "GUARDAR", guardar, emoji="💾").pack(fill="x", padx=20, pady=10)

    def _agregar_stock(self, rid):
        cantidad = simpledialog.askinteger("Agregar stock", "¿Cuántas unidades agregar?", minvalue=1, maxvalue=500)
        if cantidad:
            for r in DB["repuestos"]:
                if r["id"] == rid:
                    r["stock"] += cantidad
                    log_accion(f"Stock +{cantidad}: {r['nombre']}")
                    messagebox.showinfo("✅", f"Se agregaron {cantidad} unidades de {r['nombre']}.")
                    break
            self._render()

    def _solicitar(self, nombre):
        log_accion(f"Solicitud proveedor: {nombre}")
        messagebox.showinfo("📤 Solicitud enviada",
                            f"Se envió solicitud de cotización al distribuidor\npara: {nombre}\n\n"
                            "✅ El proveedor fue notificado por WhatsApp/correo.")

    def _usar_repuesto(self, rid):
        for r in DB["repuestos"]:
            if r["id"] == rid and r["stock"] > 0:
                r["stock"] -= 1
                log_accion(f"Repuesto usado: {r['nombre']}")
                messagebox.showinfo("✅", f"Se registró uso de: {r['nombre']}\nStock actual: {r['stock']}")
                self._render()
                return
        messagebox.showwarning("Sin stock", "Este repuesto no tiene stock disponible.")


# ──────────────────────────────────────────────
#  PANTALLA: INVENTARIO HERRAMIENTAS (HU-004/005/006)
# ──────────────────────────────────────────────

class PantallaHerramientas(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        bar = tk.Frame(self, bg=AZUL_CLARO, pady=12)
        bar.pack(fill="x")
        make_btn(bar, "", lambda: self.nav("menu"), color=AZUL_CLARO, fg=BLANCO, emoji="◀", height=1).pack(side="left", padx=4)
        tk.Label(bar, text="🛠 Control de Herramientas", font=FONT_SUBTIT, bg=AZUL_CLARO, fg=BLANCO).pack(side="left")

        # Stats rápidas
        stats = tk.Frame(self, bg=AZUL_CLARO, padx=14, pady=6)
        stats.pack(fill="x")
        disp = sum(1 for h in DB["herramientas"] if h["estado"] == "Disponible")
        uso  = sum(1 for h in DB["herramientas"] if h["estado"] == "En uso")
        tk.Label(stats, text=f"✅ Disponibles: {disp}   🔴 En uso: {uso}", font=FONT_BODY, bg=AZUL_CLARO, fg=BLANCO).pack(anchor="w")

        canvas = tk.Canvas(self, bg=GRIS_BG, highlightthickness=0)
        vsb = ttk.Scrollbar(self, orient="vertical", command=canvas.yview)
        canvas.configure(yscrollcommand=vsb.set)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)
        self.inner = tk.Frame(canvas, bg=GRIS_BG)
        win = canvas.create_window((0,0), window=self.inner, anchor="nw")
        canvas.bind("<Configure>", lambda e: canvas.itemconfig(win, width=e.width))
        self.inner.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        self._canvas = canvas
        self._render()

    def _render(self):
        for w in self.inner.winfo_children():
            w.destroy()

        for h in DB["herramientas"]:
            disponible = h["estado"] == "Disponible"
            color_card  = "#E8F5E9" if disponible else "#FFEBEE"
            color_badge = VERDE if disponible else ROJO
            badge_txt   = "✅ Disponible" if disponible else "🔴 En uso"

            card = tk.Frame(self.inner, bg=color_card, padx=14, pady=12,
                            highlightbackground=SOMBRA, highlightthickness=1)
            card.pack(fill="x", padx=8, pady=4)

            top = tk.Frame(card, bg=color_card)
            top.pack(fill="x")
            tk.Label(top, text=h["nombre"], font=FONT_BOTON, bg=color_card, fg=TEXTO_DARK).pack(side="left")
            tk.Label(top, text=f"  {badge_txt}  ", font=FONT_BADGE, bg=color_badge, fg=BLANCO, padx=4, pady=2).pack(side="right")

            if h["asignada_a"]:
                tk.Label(card, text=f"👤 {h['asignada_a']}  •  Desde: {h['hora_retiro']}",
                         font=FONT_SMALL, bg=color_card, fg=TEXTO_MED).pack(anchor="w", pady=(2,6))

            bf = tk.Frame(card, bg=color_card)
            bf.pack(fill="x", pady=(4,0))

            if disponible:
                make_btn(bf, "RETIRAR", lambda hid=h["id"]: self._retirar(hid),
                         color=AZUL_MED, emoji="📤", height=1, size=FONT_SMALL).pack(side="left")
            else:
                mi_nombre = USUARIO_ACTUAL["nombre"]
                es_mia = h["asignada_a"] == mi_nombre or USUARIO_ACTUAL["rol"] == "propietario"
                if es_mia:
                    make_btn(bf, "DEVOLVER", lambda hid=h["id"]: self._devolver(hid),
                             color=VERDE_CLARO, emoji="📥", height=1, size=FONT_SMALL).pack(side="left")
                else:
                    tk.Label(bf, text="Asignada a otro mecánico", font=FONT_SMALL, bg=color_card, fg=TEXTO_MED).pack(side="left")

    def _retirar(self, hid):
        for h in DB["herramientas"]:
            if h["id"] == hid:
                if h["estado"] == "En uso":
                    messagebox.showwarning("⚠ No disponible", f"Esta herramienta ya está en uso por: {h['asignada_a']}")
                    return
                hora = datetime.now().strftime("%H:%M")
                h["estado"]     = "En uso"
                h["asignada_a"] = USUARIO_ACTUAL["nombre"]
                h["hora_retiro"] = hora
                log_accion(f"Retiro herramienta: {h['nombre']}")
                messagebox.showinfo("✅ Registrado",
                                    f"Herramienta asignada a ti:\n{h['nombre']}\nHora: {hora}\n\nQueda bajo tu responsabilidad.")
                break
        self._render_stats()
        self._render()

    def _devolver(self, hid):
        for h in DB["herramientas"]:
            if h["id"] == hid:
                if USUARIO_ACTUAL["rol"] != "propietario" and h["asignada_a"] != USUARIO_ACTUAL["nombre"]:
                    messagebox.showwarning("⚠", "Solo puedes devolver herramientas asignadas a ti.")
                    return
                nombre = h["nombre"]
                h["estado"]     = "Disponible"
                h["asignada_a"] = None
                h["hora_retiro"] = None
                log_accion(f"Devolución herramienta: {nombre}")
                messagebox.showinfo("✅ Devuelta", f"Herramienta devuelta correctamente:\n{nombre}\n\nInventario actualizado.")
                break
        self._render()

    def _render_stats(self):
        pass  # stats se recalculan en _build completo


# ──────────────────────────────────────────────
#  PANTALLA: HISTORIAL VEHÍCULOS  (HU-001)
# ──────────────────────────────────────────────

class PantallaHistorial(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        bar = tk.Frame(self, bg="#6A1B9A", pady=12)
        bar.pack(fill="x")
        make_btn(bar, "", lambda: self.nav("menu"), color="#6A1B9A", fg=BLANCO, emoji="◀", height=1).pack(side="left", padx=4)
        tk.Label(bar, text="🚗 Historial de Vehículos", font=FONT_SUBTIT, bg="#6A1B9A", fg=BLANCO).pack(side="left")

        # Búsqueda por placa
        sf = tk.Frame(self, bg="#6A1B9A", padx=10, pady=10)
        sf.pack(fill="x")
        tk.Label(sf, text="Placa:", font=FONT_BOTON, bg="#6A1B9A", fg=BLANCO).pack(side="left")
        self.var_placa = tk.StringVar()
        e = tk.Entry(sf, textvariable=self.var_placa, font=FONT_BOTON, bd=0, bg=BLANCO, fg=TEXTO_DARK, width=12)
        e.pack(side="left", ipady=8, padx=8)
        e.insert(0, "TXA-123")
        make_btn(sf, "BUSCAR", self._buscar, color=AMARILLO, fg=AZUL, emoji="🔍", height=1).pack(side="left", padx=4)
        make_btn(sf, "NUEVO REGISTRO", self._nuevo_registro, color=VERDE_CLARO, fg=BLANCO, emoji="➕", height=1).pack(side="left", padx=4)

        self.result_frame = tk.Frame(self, bg=GRIS_BG)
        self.result_frame.pack(fill="both", expand=True, padx=8, pady=8)

    def _buscar(self):
        for w in self.result_frame.winfo_children():
            w.destroy()
        placa = self.var_placa.get().strip().upper()

        # Datos del vehículo
        vehiculo = next((v for v in DB["vehiculos"] if v["placa"] == placa), None)
        if vehiculo:
            card = tk.Frame(self.result_frame, bg=BLANCO, padx=14, pady=10,
                            highlightbackground="#6A1B9A", highlightthickness=2)
            card.pack(fill="x", pady=6)
            tk.Label(card, text=f"🚗  {placa} — {vehiculo['marca']} {vehiculo['modelo']} {vehiculo['año']}",
                     font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(anchor="w")
            tk.Label(card, text=f"👤 Propietario: {vehiculo['propietario']}  •  📞 {vehiculo['tel']}",
                     font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w", pady=2)

        # Historial de reparaciones
        registros = [h for h in DB["historial"] if h["placa"] == placa]
        if registros:
            tk.Label(self.result_frame, text="📋 Historial de reparaciones", font=FONT_SUBTIT,
                     bg=GRIS_BG, fg=TEXTO_DARK, pady=6).pack(anchor="w")
            for reg in sorted(registros, key=lambda x: x["fecha"], reverse=True):
                c = tk.Frame(self.result_frame, bg=BLANCO, padx=12, pady=10,
                             highlightbackground=SOMBRA, highlightthickness=1)
                c.pack(fill="x", pady=3)
                tk.Label(c, text=f"📅 {reg['fecha']}  •  🔧 {reg['mecanico']}",
                         font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w")
                tk.Label(c, text=reg["trabajo"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(anchor="w")
                tk.Label(c, text=f"🔩 Repuestos: {reg['repuestos']}  •  💵 ${reg['costo']:,}",
                         font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w")
        elif vehiculo:
            tk.Label(self.result_frame, text="Sin reparaciones registradas.", font=FONT_BODY,
                     bg=GRIS_BG, fg=TEXTO_MED).pack(pady=10)
        else:
            tk.Label(self.result_frame, text=f"⚠ No se encontró el vehículo {placa}\nPuede agregar un nuevo registro.",
                     font=FONT_BODY, bg=GRIS_BG, fg=ROJO).pack(pady=10)

    def _nuevo_registro(self):
        win = tk.Toplevel(self)
        win.title("Nuevo Registro de Reparación")
        win.geometry("380x480")
        win.configure(bg=BLANCO)
        win.grab_set()

        tk.Label(win, text="📝 Nuevo Registro", font=FONT_SUBTIT, bg=BLANCO, fg="#6A1B9A", pady=10).pack()
        campos = [("Placa del vehículo", self.var_placa.get()),
                  ("Trabajo realizado", ""),
                  ("Repuestos utilizados", ""),
                  ("Costo total (COP)", "0")]
        entries = {}
        for lbl, default in campos:
            tk.Label(win, text=lbl, font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, anchor="w").pack(fill="x", padx=20)
            e = tk.Entry(win, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK)
            e.insert(0, default)
            e.pack(fill="x", padx=20, ipady=8, pady=(2,8))
            entries[lbl] = e

        def guardar():
            placa = entries["Placa del vehículo"].get().strip().upper()
            # Agregar vehículo si no existe
            if not any(v["placa"] == placa for v in DB["vehiculos"]):
                DB["vehiculos"].append({"placa": placa, "marca": "—", "modelo": "—", "año": date.today().year,
                                        "propietario": "Nuevo cliente", "tel": "—"})
            DB["historial"].append({
                "placa":     placa,
                "fecha":     date.today().isoformat(),
                "trabajo":   entries["Trabajo realizado"].get(),
                "repuestos": entries["Repuestos utilizados"].get(),
                "costo":     int(entries["Costo total (COP)"].get() or 0),
                "mecanico":  USUARIO_ACTUAL["nombre"]
            })
            log_accion(f"Nuevo historial: {placa} - {entries['Trabajo realizado'].get()}")
            messagebox.showinfo("✅ Guardado", "Registro guardado correctamente.", parent=win)
            win.destroy()
            self.var_placa.set(placa)
            self._buscar()

        make_btn(win, "GUARDAR REGISTRO", guardar, emoji="💾").pack(fill="x", padx=20, pady=12)


# ──────────────────────────────────────────────
#  PANTALLA: GESTOR DE TAREAS KANBAN  (HU-007)
# ──────────────────────────────────────────────

class PantallaTareas(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        bar = tk.Frame(self, bg="#00695C", pady=12)
        bar.pack(fill="x")
        make_btn(bar, "", lambda: self.nav("menu"), color="#00695C", fg=BLANCO, emoji="◀", height=1).pack(side="left", padx=4)
        tk.Label(bar, text="📋 Gestor de Tareas", font=FONT_SUBTIT, bg="#00695C", fg=BLANCO).pack(side="left")
        if USUARIO_ACTUAL["rol"] == "propietario":
            make_btn(bar, "Nueva tarea ➕", self._nueva_tarea, color=AMARILLO, fg=AZUL, size=FONT_SMALL, height=1).pack(side="right", padx=10)

        # Kanban 3 columnas
        cols_frame = tk.Frame(self, bg=GRIS_BG)
        cols_frame.pack(fill="both", expand=True, padx=6, pady=8)

        COLUMNAS = [
            ("Pendiente",   "#EF9A9A", ROJO),
            ("En proceso",  "#FFF59D", NARANJA),
            ("Finalizado",  "#A5D6A7", VERDE),
        ]

        for i, (estado, bg_col, color_hdr) in enumerate(COLUMNAS):
            cols_frame.columnconfigure(i, weight=1)
            col = tk.Frame(cols_frame, bg=bg_col, bd=0, padx=6, pady=6,
                           highlightbackground=SOMBRA, highlightthickness=1)
            col.grid(row=0, column=i, padx=4, pady=0, sticky="nsew")
            cols_frame.rowconfigure(0, weight=1)

            tk.Label(col, text=estado, font=FONT_BOTON, bg=color_hdr, fg=BLANCO, pady=8).pack(fill="x")

            tareas = [t for t in DB["tareas"] if t["estado"] == estado]
            if USUARIO_ACTUAL["rol"] == "mecanico":
                tareas = [t for t in tareas if t["mecanico"] == USUARIO_ACTUAL["nombre"]]

            for t in tareas:
                self._tarjeta(col, t, bg_col, estado)

    def _tarjeta(self, parent, t, bg_col, estado_actual):
        card = tk.Frame(parent, bg=BLANCO, padx=10, pady=8,
                        highlightbackground=SOMBRA, highlightthickness=1)
        card.pack(fill="x", pady=4)

        pri_color = ROJO if t["prioridad"]=="Alta" else NARANJA if t["prioridad"]=="Media" else VERDE
        tk.Label(card, text=f"🚗 {t['placa']}", font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(anchor="w")
        tk.Label(card, text=t["trabajo"], font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, wraplength=160, justify="left").pack(anchor="w")
        tk.Label(card, text=f"👤 {t['mecanico']}", font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w")

        pf = tk.Frame(card, bg=BLANCO)
        pf.pack(fill="x", pady=(4,0))
        tk.Label(pf, text=f"  {t['prioridad']}  ", font=FONT_BADGE, bg=pri_color, fg=BLANCO, padx=2, pady=1).pack(side="left")

        # Botones mover estado
        bf = tk.Frame(card, bg=BLANCO)
        bf.pack(fill="x", pady=(6,0))
        if estado_actual == "Pendiente":
            make_btn(bf, "▶ Iniciar", lambda tid=t["id"]: self._mover(tid, "En proceso"),
                     color=NARANJA, size=FONT_SMALL, height=1).pack(fill="x")
        elif estado_actual == "En proceso":
            make_btn(bf, "✅ Finalizar", lambda tid=t["id"]: self._mover(tid, "Finalizado"),
                     color=VERDE, size=FONT_SMALL, height=1).pack(fill="x")

    def _mover(self, tid, nuevo_estado):
        for t in DB["tareas"]:
            if t["id"] == tid:
                if USUARIO_ACTUAL["rol"] == "mecanico" and t["mecanico"] != USUARIO_ACTUAL["nombre"]:
                    messagebox.showwarning("⚠", "Solo puedes mover tareas asignadas a ti.")
                    return
                t["estado"] = nuevo_estado
                log_accion(f"Tarea #{tid} → {nuevo_estado}")
                break
        # Refrescar kanban
        for w in self.winfo_children():
            if isinstance(w, tk.Frame) and w != self.winfo_children()[0]:
                w.destroy()
        self._build_kanban()

    def _build_kanban(self):
        # Re-render completo desde _build (salvo topbar)
        for w in self.winfo_children():
            if not isinstance(w, tk.Frame) or w == self.winfo_children()[0]:
                continue
            w.destroy()
        self._build()

    def _nueva_tarea(self):
        win = tk.Toplevel(self)
        win.title("Nueva Tarea")
        win.geometry("360x380")
        win.configure(bg=BLANCO)
        win.grab_set()
        tk.Label(win, text="📋 Nueva Tarea", font=FONT_SUBTIT, bg=BLANCO, fg="#00695C", pady=10).pack()

        campos = [("Placa del vehículo", ""), ("Descripción del trabajo", "")]
        entries = {}
        for lbl, default in campos:
            tk.Label(win, text=lbl, font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, anchor="w").pack(fill="x", padx=20)
            e = tk.Entry(win, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK)
            e.insert(0, default)
            e.pack(fill="x", padx=20, ipady=8, pady=(2,8))
            entries[lbl] = e

        tk.Label(win, text="Mecánico asignado", font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w", padx=20)
        mecanicos = [v["nombre"] for k,v in DB["usuarios"].items() if v["rol"]=="mecanico"]
        var_mec = tk.StringVar(value=mecanicos[0])
        cb = ttk.Combobox(win, textvariable=var_mec, values=mecanicos, state="readonly", font=FONT_BODY)
        cb.pack(fill="x", padx=20, pady=(2,8))

        tk.Label(win, text="Prioridad", font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w", padx=20)
        var_pri = tk.StringVar(value="Media")
        cb2 = ttk.Combobox(win, textvariable=var_pri, values=["Alta","Media","Baja"], state="readonly", font=FONT_BODY)
        cb2.pack(fill="x", padx=20, pady=(2,8))

        def guardar():
            nuevo_id = max(t["id"] for t in DB["tareas"]) + 1
            DB["tareas"].append({
                "id": nuevo_id,
                "placa":     entries["Placa del vehículo"].get().upper(),
                "trabajo":   entries["Descripción del trabajo"].get(),
                "estado":    "Pendiente",
                "mecanico":  var_mec.get(),
                "prioridad": var_pri.get()
            })
            log_accion(f"Nueva tarea #{nuevo_id}: {entries['Descripción del trabajo'].get()}")
            messagebox.showinfo("✅", "Tarea creada.", parent=win)
            win.destroy()

        make_btn(win, "CREAR TAREA", guardar, emoji="✅").pack(fill="x", padx=20, pady=10)


# ──────────────────────────────────────────────
#  PANTALLA: CUENTAS RÁPIDAS  (HU-002)
# ──────────────────────────────────────────────

class PantallaCuentas(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self.transacciones = [
            {"tipo": "Ingreso", "concepto": "Reparación TXA-123", "monto": 220000, "fecha": "2026-05-01"},
            {"tipo": "Egreso",  "concepto": "Compra amortiguadores", "monto": 170000, "fecha": "2026-05-01"},
            {"tipo": "Ingreso", "concepto": "Cambio aceite TXB-456", "monto": 65000, "fecha": "2026-05-02"},
        ]
        self._build()

    def _build(self):
        bar = tk.Frame(self, bg=NARANJA, pady=12)
        bar.pack(fill="x")
        make_btn(bar, "", lambda: self.nav("menu"), color=NARANJA, fg=BLANCO, emoji="◀", height=1).pack(side="left", padx=4)
        tk.Label(bar, text="💰 Cuentas Rápidas", font=FONT_SUBTIT, bg=NARANJA, fg=BLANCO).pack(side="left")

        # Resumen
        ingresos = sum(t["monto"] for t in self.transacciones if t["tipo"]=="Ingreso")
        egresos  = sum(t["monto"] for t in self.transacciones if t["tipo"]=="Egreso")
        saldo    = ingresos - egresos

        sum_frame = tk.Frame(self, bg=NARANJA, padx=14, pady=10)
        sum_frame.pack(fill="x")
        for txt, val, color in [("💵 Ingresos", ingresos, VERDE_CLARO),
                                  ("💸 Egresos",  egresos,  ROJO),
                                  ("📊 Saldo",    saldo,    AZUL_MED)]:
            f = tk.Frame(sum_frame, bg=color, padx=12, pady=8)
            f.pack(side="left", expand=True, fill="x", padx=4)
            tk.Label(f, text=txt, font=FONT_SMALL, bg=color, fg=BLANCO).pack()
            tk.Label(f, text=f"${val:,}", font=FONT_BOTON, bg=color, fg=BLANCO).pack()

        # Botones 3 toques (HU-002: máx 3 toques)
        btn_frame = tk.Frame(self, bg=GRIS_BG, padx=10, pady=10)
        btn_frame.pack(fill="x")
        tk.Label(btn_frame, text="Registrar en 3 toques:", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK).pack(anchor="w", pady=(0,8))

        for emoji, txt, tipo, color in [
            ("💵","Ingreso por reparación", "Ingreso", VERDE),
            ("🔩","Compra de repuesto",     "Egreso",  ROJO),
            ("🛠","Pago de servicio",        "Egreso",  AZUL_MED),
            ("💸","Otro egreso",             "Egreso",  NARANJA),
        ]:
            make_btn(btn_frame, f"{emoji}  {txt}", lambda t=tipo, c=txt: self._registrar(t, c),
                     color=color, size=FONT_BOTON, height=2).pack(fill="x", pady=4)

        # Historial
        sep = tk.Frame(self, bg=SOMBRA, height=1)
        sep.pack(fill="x", padx=8, pady=4)
        tk.Label(self, text="Últimas transacciones:", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, pady=4).pack(anchor="w", padx=10)

        self.hist_frame = tk.Frame(self, bg=GRIS_BG)
        self.hist_frame.pack(fill="both", expand=True, padx=8)
        self._render_hist()

    def _render_hist(self):
        for w in self.hist_frame.winfo_children():
            w.destroy()
        for t in reversed(self.transacciones[-8:]):
            color = "#E8F5E9" if t["tipo"]=="Ingreso" else "#FFEBEE"
            ico   = "📗" if t["tipo"]=="Ingreso" else "📕"
            c = tk.Frame(self.hist_frame, bg=color, padx=10, pady=8,
                         highlightbackground=SOMBRA, highlightthickness=1)
            c.pack(fill="x", pady=2)
            tk.Label(c, text=f"{ico} {t['concepto']}", font=FONT_BODY, bg=color, fg=TEXTO_DARK).pack(side="left")
            tk.Label(c, text=f"${t['monto']:,}", font=FONT_BOTON, bg=color,
                     fg=VERDE if t["tipo"]=="Ingreso" else ROJO).pack(side="right")

    def _registrar(self, tipo, concepto_base):
        monto = simpledialog.askinteger("💰 Monto", f"¿Cuánto cobró/pagó por '{concepto_base}'?\n(en pesos COP):", minvalue=0)
        if monto is None:
            return
        self.transacciones.append({
            "tipo": tipo, "concepto": concepto_base,
            "monto": monto, "fecha": date.today().isoformat()
        })
        log_accion(f"Transacción {tipo}: {concepto_base} ${monto:,}")
        messagebox.showinfo("✅ Registrado", f"Transacción guardada:\n{concepto_base}\n${monto:,}")
        # Refrescar
        for w in self.winfo_children():
            w.destroy()
        self._build()


# ──────────────────────────────────────────────
#  PANTALLA: PANEL PROPIETARIO  (HU-006)
# ──────────────────────────────────────────────

class PantallaPanel(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        bar = tk.Frame(self, bg=ROJO, pady=12)
        bar.pack(fill="x")
        make_btn(bar, "", lambda: self.nav("menu"), color=ROJO, fg=BLANCO, emoji="◀", height=1).pack(side="left", padx=4)
        tk.Label(bar, text="📊 Panel del Propietario", font=FONT_SUBTIT, bg=ROJO, fg=BLANCO).pack(side="left")

        canvas = tk.Canvas(self, bg=GRIS_BG, highlightthickness=0)
        vsb = ttk.Scrollbar(self, orient="vertical", command=canvas.yview)
        canvas.configure(yscrollcommand=vsb.set)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)
        inner = tk.Frame(canvas, bg=GRIS_BG)
        win = canvas.create_window((0,0), window=inner, anchor="nw")
        canvas.bind("<Configure>", lambda e: canvas.itemconfig(win, width=e.width))
        inner.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

        # ─ Stats tarjetas ─
        tk.Label(inner, text="Resumen de hoy", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, pady=8).pack(anchor="w", padx=10)
        sg = tk.Frame(inner, bg=GRIS_BG, padx=10)
        sg.pack(fill="x")

        tareas_hoy = len([t for t in DB["tareas"] if t["estado"] != "Finalizado"])
        herr_uso   = len([h for h in DB["herramientas"] if h["estado"] == "En uso"])
        rep_bajos  = len([r for r in DB["repuestos"] if r["stock"] <= r["minimo"]])

        for txt, val, color, ico in [
            ("Tareas activas",       tareas_hoy, AZUL_MED,   "📋"),
            ("Herramientas en uso",  herr_uso,   NARANJA,    "🛠"),
            ("Repuestos stock bajo", rep_bajos,  ROJO,       "⚠"),
        ]:
            f = tk.Frame(sg, bg=color, padx=14, pady=14)
            f.pack(side="left", expand=True, fill="x", padx=4, pady=4)
            tk.Label(f, text=f"{ico}", font=("Segoe UI", 22), bg=color, fg=BLANCO).pack()
            tk.Label(f, text=str(val), font=("Segoe UI", 28, "bold"), bg=color, fg=BLANCO).pack()
            tk.Label(f, text=txt, font=FONT_SMALL, bg=color, fg=BLANCO, wraplength=90).pack()

        # ─ Herramientas en uso ─
        separator(inner)
        tk.Label(inner, text="🛠 Herramientas asignadas", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, padx=10).pack(anchor="w")
        for h in DB["herramientas"]:
            if h["estado"] == "En uso":
                c = tk.Frame(inner, bg=BLANCO, padx=12, pady=8,
                             highlightbackground=SOMBRA, highlightthickness=1)
                c.pack(fill="x", padx=10, pady=2)
                tk.Label(c, text=h["nombre"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(side="left")
                tk.Label(c, text=f"👤 {h['asignada_a']}  ⏰ {h['hora_retiro']}",
                         font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(side="right")

        # ─ Repuestos con stock bajo ─
        separator(inner)
        tk.Label(inner, text="⚠ Repuestos con stock bajo", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, padx=10).pack(anchor="w")
        bajos = [r for r in DB["repuestos"] if r["stock"] <= r["minimo"]]
        for r in bajos:
            color = ROJO if r["stock"]==0 else NARANJA
            c = tk.Frame(inner, bg=BLANCO, padx=12, pady=8,
                         highlightbackground=color, highlightthickness=1)
            c.pack(fill="x", padx=10, pady=2)
            tk.Label(c, text=r["nombre"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(side="left")
            tk.Label(c, text=f"Stock: {r['stock']} / Min: {r['minimo']}",
                     font=FONT_BADGE, bg=color, fg=BLANCO, padx=4).pack(side="right")

        # ─ Log de auditoría ─
        separator(inner)
        tk.Label(inner, text="🔍 Registro de actividad (Log)", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, padx=10).pack(anchor="w")
        log_frame = tk.Frame(inner, bg=TEXTO_DARK, padx=10, pady=8)
        log_frame.pack(fill="x", padx=10, pady=4)
        entradas = DB["log"][-10:] if DB["log"] else [{"hora":"—","usuario":"—","accion":"Sin actividad registrada"}]
        for entry in reversed(entradas):
            tk.Label(log_frame, text=f"[{entry['hora']}] {entry['usuario']}: {entry['accion']}",
                     font=("Courier New", 9), bg=TEXTO_DARK, fg="#00E676", anchor="w").pack(fill="x")

        # ─ Botón exportar (simulado) ─
        separator(inner)
        make_btn(inner, "📤 Exportar reporte del día", lambda: messagebox.showinfo("✅","Reporte generado y listo para compartir.\n(En producción: PDF o Excel)"),
                 color=AZUL_MED, emoji="").pack(fill="x", padx=10, pady=10)


# ──────────────────────────────────────────────
#  APP PRINCIPAL  – Navegador de pantallas
# ──────────────────────────────────────────────

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Autosuspensiones Cubillos – Sistema de Información")
        # Tamaño tipo smartphone en PC
        self.geometry("420x780")
        self.resizable(True, True)
        self.configure(bg=AZUL)
        self.minsize(380, 600)

        # Icono en barra de tareas (dibujado con canvas, no archivo externo)
        self._set_icon()

        self._pantalla_actual = None
        self._mostrar("login")

    def _set_icon(self):
        try:
            img = tk.PhotoImage(width=32, height=32)
            # Dibujar píxeles amarillo/azul
            for x in range(32):
                for y in range(32):
                    d = math.sqrt((x-16)**2 + (y-16)**2)
                    if d < 14:
                        img.put("#FFD600", (x, y))
                    else:
                        img.put("#1A237E", (x, y))
            self.iconphoto(True, img)
        except Exception:
            pass

    def _mostrar(self, pantalla):
        if self._pantalla_actual:
            self._pantalla_actual.destroy()

        if pantalla == "login":
            p = PantallaLogin(self, lambda: self._mostrar("menu"))
        elif pantalla == "menu":
            p = MenuPrincipal(self, self._mostrar)
        elif pantalla == "repuestos":
            p = PantallaRepuestos(self, self._mostrar)
        elif pantalla == "herramientas":
            p = PantallaHerramientas(self, self._mostrar)
        elif pantalla == "historial":
            p = PantallaHistorial(self, self._mostrar)
        elif pantalla == "tareas":
            p = PantallaTareas(self, self._mostrar)
        elif pantalla == "cuentas":
            p = PantallaCuentas(self, self._mostrar)
        elif pantalla == "panel":
            p = PantallaPanel(self, self._mostrar)
        elif pantalla == "logout":
            if messagebox.askyesno("Cerrar sesión", "¿Deseas cerrar sesión?"):
                log_accion("Cierre de sesión")
                USUARIO_ACTUAL.update({"usuario":None,"rol":None,"nombre":None})
                p = PantallaLogin(self, lambda: self._mostrar("menu"))
            else:
                return
        else:
            p = MenuPrincipal(self, self._mostrar)

        p.pack(fill="both", expand=True)
        self._pantalla_actual = p


# ──────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  Autosuspensiones Cubillos – Sistema de Información")
    print("  Prototipo heurísticas de Nielsen – v1.0  2026")
    print("=" * 55)
    print("\n  Usuarios demo:")
    print("  gustavo / 1234  → Propietario (acceso total)")
    print("  mec1    / 1234  → Carlos Méndez (Mecánico)")
    print("  mec2    / 1234  → Pedro Sánchez (Mecánico)")
    print("  mec3    / 1234  → Luis Torres   (Mecánico)")
    print()
    app = App()
    app.mainloop()
