import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from datetime import datetime, date
import math

# Importar capas
from models_database import db
from services_backend import (
    AuthService, RepuestosService, HerramientasService,
    VehiculosService, TareasService, CuentasService,
    AuditoriaService, DashboardService
)
from ui_constants import *
from ui_components import *

# ──────────────────────────────────────────────
#  ESTADO GLOBAL DE USUARIO (Usuario por defecto: propietario)
# ──────────────────────────────────────────────
USUARIO_ACTUAL = {"usuario": "gustavo", "rol": "propietario", "nombre": "Gustavo Cubillos"}


# ──────────────────────────────────────────────
#  PANTALLA: MENÚ PRINCIPAL
# ──────────────────────────────────────────────

class MenuPrincipal(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        # Top bar
        bar = tk.Frame(self, bg=AZUL, pady=12)
        bar.pack(fill="x")
        tk.Label(bar, text="Autosuspensiones Cubillos", font=FONT_SUBTIT, bg=AZUL, fg=BLANCO, padx=14).pack(side="left")
        
        self.bell_lbl = tk.Label(bar, text=f"🔔  {USUARIO_ACTUAL['nombre']}", font=FONT_SMALL, bg=AZUL, fg="#90CAF9", padx=14, cursor="hand2")
        self.bell_lbl.pack(side="right")
        self.bell_lbl.bind("<Button-1>", self._show_notifications)

        # Info usuario y rol
        info = tk.Frame(self, bg=AZUL_MED, pady=14, padx=16)
        info.pack(fill="x")
        rol_texto = "Propietario 👑" if USUARIO_ACTUAL["rol"] == "propietario" else "Mecánico 🔧"
        tk.Label(info, text=f"Hola, {USUARIO_ACTUAL['nombre']}!", font=FONT_SUBTIT, bg=AZUL_MED, fg=BLANCO).pack(anchor="w")
        tk.Label(info, text=f"Rol: {rol_texto}  •  {date.today().strftime('%d/%m/%Y')}", 
                 font=FONT_SMALL, bg=AZUL_MED, fg="#BBDEFB").pack(anchor="w")

        # Contenedor principal sin scroll para evitar el espacio blanco
        main_frame = tk.Frame(self, bg=GRIS_BG)
        main_frame.pack(fill="both", expand=True)

        # Menú de opciones
        tk.Label(main_frame, text="¿Qué necesitas hacer?", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, pady=10).pack(pady=(20, 0))

        grid = tk.Frame(main_frame, bg=GRIS_BG, padx=10)
        grid.pack(fill="x", pady=4)

        MENUS = [
            ("🔧", "Inventario\nRepuestos", AZUL_MED, "repuestos", ["propietario", "mecanico"]),
            ("🛠", "Inventario\nHerramientas", AZUL_CLARO, "herramientas", ["propietario", "mecanico"]),
            ("🚗", "Historial\nVehículos", "#6A1B9A", "historial", ["propietario", "mecanico"]),
            ("📋", "Gestor\nde Tareas", "#00695C", "tareas", ["propietario", "mecanico"]),
            ("💰", "Cuentas\nRápidas", NARANJA, "cuentas", ["propietario"]),
            ("📊", "Panel\nPropietario", ROJO, "panel", ["propietario"]),
        ]

        rol = USUARIO_ACTUAL["rol"]
        col, row = 0, 0
        for emoji, txt, color, pant, roles in MENUS:
            if rol not in roles:
                continue
            btn = tk.Button(grid, text=f"{emoji}\n{txt}", font=FONT_BOTON,
                           bg=color, fg=BLANCO, relief="flat", cursor="hand2",
                           width=10, height=5, command=lambda p=pant: self.nav(p))
            btn.grid(row=row, column=col, padx=8, pady=8, sticky="nsew")
            col += 1
            if col == 2:
                col = 0
                row += 1

        grid.columnconfigure(0, weight=1)
        grid.columnconfigure(1, weight=1)

    def _show_notifications(self, event):
        bajos = RepuestosService.obtener_repuestos_bajo_stock()
        
        popup = tk.Menu(self, tearoff=0, bg=BLANCO, fg=TEXTO_DARK, font=FONT_BODY)
        
        if bajos:
            popup.add_command(label=f"⚠ {len(bajos)} repuesto(s) con stock bajo", background="#FFF9C4", foreground=NARANJA)
        else:
            popup.add_command(label="✓ Todo bajo control", background=BLANCO, foreground=VERDE)
            
        try:
            popup.tk_popup(event.x_root, event.y_root)
        finally:
            popup.grab_release()
            # Destruir el root del menú después de usarlo para evitar que queden ventanas fantasmas
            popup.destroy()


# ──────────────────────────────────────────────
#  PANTALLA: REPUESTOS (HU-003, HU-008)
# ──────────────────────────────────────────────

class PantallaRepuestos(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        make_topbar(self, "🔧 Inventario de Repuestos", back_cmd=lambda: self.nav("menu"), bg_color=AZUL_MED)

        # Buscador
        bar = tk.Frame(self, bg=AZUL_MED, padx=10, pady=8)
        bar.pack(fill="x")
        tk.Label(bar, text="🔍", font=FONT_BODY, bg=AZUL_MED, fg=BLANCO).pack(side="left")
        self.var_search = tk.StringVar()
        self.var_search.trace("w", lambda *a: self._render())
        e = tk.Entry(bar, textvariable=self.var_search, font=FONT_BODY, bd=0,
                     bg=BLANCO, fg=TEXTO_DARK, insertbackground=AZUL_MED)
        e.pack(side="left", fill="x", expand=True, ipady=6, padx=8)

        # Botones de acción
        btn_row = tk.Frame(self, bg=GRIS_BG, padx=10, pady=8)
        btn_row.pack(fill="x")
        if USUARIO_ACTUAL["rol"] == "propietario":
            make_button(btn_row, "Agregar repuesto", self._agregar, emoji="➕",
                       color=VERDE_CLARO, height=1).pack(side="left", padx=4)
        make_button(btn_row, "Ver stock bajo ⚠", self._ver_bajos, emoji="",
                   color=NARANJA, height=1).pack(side="left", padx=4)

        # Contenedor scrollable
        self.lista_frame = tk.Frame(self, bg=GRIS_BG)
        self.lista_frame.pack(fill="both", expand=True, padx=6, pady=4)

        canvas, vsb, self.scroll_inner = make_scrollable_container(self.lista_frame)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)

        self._render()

    def _render(self):
        for w in self.scroll_inner.winfo_children():
            w.destroy()

        q = self.var_search.get().lower()
        repuestos = RepuestosService.buscar_repuestos(q)

        for r in repuestos:
            color_stock = VERDE if r["stock"] > r["minimo"] else (NARANJA if r["stock"] > 0 else ROJO)
            card = tk.Frame(self.scroll_inner, bg=BLANCO, padx=12, pady=10,
                           highlightbackground=SOMBRA, highlightthickness=1)
            card.pack(fill="x", padx=8, pady=4)

            h = tk.Frame(card, bg=BLANCO)
            h.pack(fill="x")
            tk.Label(h, text=r["nombre"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(side="left")
            make_badge(h, f"  {r['stock']} uds  ", color_stock).pack(side="right")

            d = tk.Frame(card, bg=BLANCO)
            d.pack(fill="x", pady=2)
            tk.Label(d, text=f"📦 {r['categoria']}  •  Min: {r['minimo']}  •  Precio: ${r['precio']:,}",
                     font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(side="left")

            if r["stock"] <= r["minimo"]:
                alerta = "⚠ STOCK BAJO" if r["stock"] > 0 else "🚫 AGOTADO"
                tk.Label(card, text=alerta, font=FONT_BADGE,
                         bg="#FFF3E0" if r["stock"] > 0 else "#FFEBEE",
                         fg=NARANJA if r["stock"] > 0 else ROJO, padx=4).pack(anchor="w", pady=(2, 0))

            bf = tk.Frame(card, bg=BLANCO)
            bf.pack(fill="x", pady=(6, 0))

            if USUARIO_ACTUAL["rol"] == "propietario":
                make_button(bf, "Agregar unidades", lambda rid=r["id"]: self._agregar_stock(rid),
                           color=VERDE_CLARO, emoji="➕", height=1, size=FONT_SMALL).pack(side="left", padx=(0, 4))
            else:
                make_button(bf, "Usar en reparación", lambda rid=r["id"]: self._usar_repuesto(rid),
                           color=AZUL_MED, emoji="🔧", height=1, size=FONT_SMALL).pack(side="left")

    def _ver_bajos(self):
        for w in self.scroll_inner.winfo_children():
            w.destroy()
        
        bajos = RepuestosService.obtener_repuestos_bajo_stock()
        for r in bajos:
            color_stock = NARANJA if r["stock"] > 0 else ROJO
            card = tk.Frame(self.scroll_inner, bg=BLANCO, padx=12, pady=10,
                           highlightbackground=color_stock, highlightthickness=2)
            card.pack(fill="x", padx=8, pady=4)
            
            tk.Label(card, text=r["nombre"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(anchor="w")
            tk.Label(card, text=f"Stock: {r['stock']} / Mínimo: {r['minimo']}",
                     font=FONT_BADGE, bg=color_stock, fg=BLANCO, padx=4).pack(anchor="w", pady=2)

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
            e.pack(fill="x", padx=20, ipady=8, pady=(2, 8))
            entries[lbl] = e

        def guardar():
            try:
                RepuestosService.crear_repuesto(
                    entries["Nombre"].get(),
                    entries["Categoría"].get(),
                    int(entries["Stock inicial"].get()),
                    int(entries["Stock mínimo"].get()),
                    int(entries["Precio unitario"].get())
                )
                AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Nuevo repuesto: {entries['Nombre'].get()}")
                show_message_box("Guardado", "Repuesto agregado exitosamente.", parent=win, msg_type="success")
                win.destroy()
                self._render()
            except ValueError as e:
                show_message_box("Error", str(e), parent=win, msg_type="error")

        make_button(win, "GUARDAR", guardar, emoji="💾", color=VERDE_CLARO).pack(fill="x", padx=20, pady=10)

    def _agregar_stock(self, rid):
        cantidad = ask_integer("Agregar stock", "¿Cuántas unidades agregar?", parent=self, min_val=1, max_val=500)
        if cantidad:
            ok, msg = RepuestosService.actualizar_stock(rid, cantidad, "+")
            if ok:
                r = db.get_repuesto(rid)
                AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Stock +{cantidad}: {r['nombre']}")
                show_message_box("Stock actualizado", msg, parent=self, msg_type="success")
                self._render()
            else:
                show_message_box("Error", msg, parent=self, msg_type="error")

    def _usar_repuesto(self, rid):
        cantidad = 1
        ok, msg = RepuestosService.actualizar_stock(rid, cantidad, "-")
        if ok:
            r = db.get_repuesto(rid)
            AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Repuesto usado: {r['nombre']}")
            show_message_box("Uso de Repuesto", f"Registrado: {r['nombre']}\nStock actual: {r['stock']}", parent=self, msg_type="success")
            self._render()
        else:
            show_message_box("Sin stock", msg, parent=self, msg_type="warning")


# ──────────────────────────────────────────────
#  PANTALLA: HERRAMIENTAS (HU-004, HU-005, HU-006)
# ──────────────────────────────────────────────

class PantallaHerramientas(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        make_topbar(self, "🛠 Control de Herramientas", back_cmd=lambda: self.nav("menu"), bg_color=AZUL_CLARO)

        # Estadísticas
        stats = tk.Frame(self, bg=AZUL_CLARO, padx=14, pady=6)
        stats.pack(fill="x")
        metricas = HerramientasService.obtener_estadisticas()
        tk.Label(stats, text=f"✅ Disponibles: {metricas['disponibles']}   🔴 En uso: {metricas['en_uso']}", 
                 font=FONT_BODY, bg=AZUL_CLARO, fg=BLANCO).pack(anchor="w")

        # Contenedor scrollable
        canvas, vsb, self.inner = make_scrollable_container(self)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)

        self._render()

    def _render(self):
        for w in self.inner.winfo_children():
            w.destroy()

        for h in db.get_herramientas():
            disponible = h["estado"] == "Disponible"
            color_card = "#E8F5E9" if disponible else "#FFEBEE"
            color_badge = VERDE if disponible else ROJO
            badge_txt = "✅ Disponible" if disponible else "🔴 En uso"

            card = tk.Frame(self.inner, bg=color_card, padx=14, pady=12,
                           highlightbackground=SOMBRA, highlightthickness=1)
            card.pack(fill="x", padx=8, pady=4)

            top = tk.Frame(card, bg=color_card)
            top.pack(fill="x")
            tk.Label(top, text=h["nombre"], font=FONT_BOTON, bg=color_card, fg=TEXTO_DARK).pack(side="left")
            make_badge(top, f"  {badge_txt}  ", color_badge).pack(side="right")

            if h["asignada_a"]:
                tk.Label(card, text=f"👤 {h['asignada_a']}  •  Desde: {h['hora_retiro']}",
                         font=FONT_SMALL, bg=color_card, fg=TEXTO_MED).pack(anchor="w", pady=(2, 6))

            bf = tk.Frame(card, bg=color_card)
            bf.pack(fill="x", pady=(4, 0))

            if disponible:
                make_button(bf, "RETIRAR", lambda hid=h["id"]: self._retirar(hid),
                           color=AZUL_MED, emoji="📤", height=1, size=FONT_SMALL).pack(side="left")
            else:
                es_mia = h["asignada_a"] == USUARIO_ACTUAL["nombre"] or USUARIO_ACTUAL["rol"] == "propietario"
                if es_mia:
                    make_button(bf, "DEVOLVER", lambda hid=h["id"]: self._devolver(hid),
                               color=VERDE_CLARO, emoji="📥", height=1, size=FONT_SMALL).pack(side="left")

    def _retirar(self, hid):
        ok, msg = HerramientasService.retirar_herramienta(hid, USUARIO_ACTUAL["nombre"])
        if ok:
            h = db.get_herramienta(hid)
            AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Retiro: {h['nombre']}")
            show_message_box("Retiro Exitoso", msg, parent=self, msg_type="success")
            self._render()
        else:
            show_message_box("Error", msg, parent=self, msg_type="warning")

    def _devolver(self, hid):
        ok, msg = HerramientasService.devolver_herramienta(hid, USUARIO_ACTUAL["nombre"], USUARIO_ACTUAL["rol"] == "propietario")
        if ok:
            AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Devolución herramienta ID {hid}")
            show_message_box("Devolución Exitosa", msg, parent=self, msg_type="success")
            self._render()
        else:
            show_message_box("Aviso", msg, parent=self, msg_type="warning")


# ──────────────────────────────────────────────
#  PANTALLA: HISTORIAL VEHÍCULOS (HU-001)
# ──────────────────────────────────────────────

class PantallaHistorial(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        make_topbar(self, "🚗 Historial de Vehículos", back_cmd=lambda: self.nav("menu"), bg_color="#6A1B9A")

        # Buscador
        sf = tk.Frame(self, bg="#6A1B9A", padx=10, pady=10)
        sf.pack(fill="x")
        tk.Label(sf, text="Placa:", font=FONT_BOTON, bg="#6A1B9A", fg=BLANCO).pack(side="left")
        self.var_placa = tk.StringVar(value="TXA-123")
        e = tk.Entry(sf, textvariable=self.var_placa, font=FONT_BOTON, bd=0, bg=BLANCO, fg=TEXTO_DARK, width=12)
        e.pack(side="left", ipady=8, padx=8)
        make_button(sf, "BUSCAR", self._buscar, color=AMARILLO, fg=AZUL, emoji="🔍", height=1).pack(side="left", padx=4)

        self.result_container = tk.Frame(self, bg=GRIS_BG)
        self.result_container.pack(fill="both", expand=True, padx=4, pady=4)
        
        canvas, vsb, self.result_frame = make_scrollable_container(self.result_container)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)

    def _buscar(self):
        for w in self.result_frame.winfo_children():
            w.destroy()
        placa = self.var_placa.get().strip().upper()

        vehiculo = VehiculosService.buscar_vehiculo(placa)
        if vehiculo:
            card = tk.Frame(self.result_frame, bg=BLANCO, padx=14, pady=10,
                           highlightbackground="#6A1B9A", highlightthickness=2)
            card.pack(fill="x", pady=6)
            tk.Label(card, text=f"🚗  {placa} — {vehiculo['marca']} {vehiculo['modelo']} {vehiculo['año']}",
                     font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(anchor="w")
            tk.Label(card, text=f"👤 {vehiculo['propietario']}  •  📞 {vehiculo['tel']}",
                     font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w", pady=2)

        registros = VehiculosService.obtener_historial_vehiculo(placa)
        if registros:
            tk.Label(self.result_frame, text="📋 Historial de reparaciones", font=FONT_SUBTIT,
                     bg=GRIS_BG, fg=TEXTO_DARK, pady=6).pack(anchor="w")
            for reg in registros:
                c = tk.Frame(self.result_frame, bg=BLANCO, padx=12, pady=10,
                            highlightbackground=SOMBRA, highlightthickness=1)
                c.pack(fill="x", pady=3)
                tk.Label(c, text=f"📅 {reg['fecha']}  •  Placa: {placa}  •  🔧 {reg['mecanico']}",
                         font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w")
                tk.Label(c, text=reg["trabajo"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(anchor="w")
                tk.Label(c, text=f"🔩 {reg['repuestos']}  •  💵 ${reg['costo']:,}",
                         font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w")
        elif vehiculo:
            tk.Label(self.result_frame, text="Sin reparaciones registradas.\nLas reparaciones se registran automáticamente\nal finalizar tareas en el Gestor.", font=FONT_BODY,
                     bg=GRIS_BG, fg=TEXTO_MED).pack(pady=10)
        else:
            tk.Label(self.result_frame, text=f"⚠ Vehículo no encontrado: {placa}",
                     font=FONT_BODY, bg=GRIS_BG, fg=ROJO).pack(pady=10)


# ──────────────────────────────────────────────
#  PANTALLA: TAREAS KANBAN (HU-007)
# ──────────────────────────────────────────────

class PantallaTareas(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        bar = make_topbar(self, "📋 Gestor de Tareas", back_cmd=lambda: self.nav("menu"), bg_color="#00695C")
        
        if USUARIO_ACTUAL["rol"] == "propietario":
            make_button(bar, "Nueva tarea", self._nueva_tarea, color=AMARILLO, fg=AZUL, size=FONT_SMALL, height=1, emoji="➕").pack(side="right", padx=10)

        # Kanban contenedor scroll vertical principal
        canvas, vsb, self.main_kanban = make_scrollable_container(self)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)
        
        self.cols_frame = tk.Frame(self.main_kanban, bg=GRIS_BG)
        self.cols_frame.pack(fill="both", expand=True, padx=6, pady=8)
        
        self._current_layout = None
        self.bind("<Configure>", self._check_kanban_layout)
        
        self._render_kanban()

    def _check_kanban_layout(self, event):
        if event.widget == self:
            ancho = event.width
            # Si el ancho es mayor a 600px -> PC (3 columnas), sino Celular (1 columna apilada)
            nuevo_layout = "PC" if ancho > 600 else "CELULAR"
            if self._current_layout != nuevo_layout:
                self._current_layout = nuevo_layout
                self._render_kanban()

    def _render_kanban(self):
        for w in self.cols_frame.winfo_children():
            w.destroy()

        COLUMNAS = [
            ("Pendiente", "#EF9A9A", ROJO),
            ("En proceso", "#FFF59D", NARANJA),
            ("Finalizado", "#A5D6A7", VERDE),
        ]
        
        is_mobile = (self._current_layout == "CELULAR")

        if not is_mobile:
            for i in range(3):
                self.cols_frame.columnconfigure(i, weight=1, uniform="kanban_col")
            self.cols_frame.rowconfigure(0, weight=1)

        for i, (estado, bg_col, color_hdr) in enumerate(COLUMNAS):
            col = tk.Frame(self.cols_frame, bg=bg_col, bd=0, padx=6, pady=6,
                          highlightbackground=SOMBRA, highlightthickness=1)
            
            if is_mobile:
                col.pack(side="top", fill="both", expand=True, padx=4, pady=4)
            else:
                col.grid(row=0, column=i, padx=4, pady=0, sticky="nsew")
            
            # Header del estado
            hdr = tk.Label(col, text=estado, font=FONT_BOTON, bg=color_hdr, fg=BLANCO, pady=8)
            hdr.pack(fill="x")

            # Contenedor interior para que puedan añadirse las tarjetas libremente
            inner_col = tk.Frame(col, bg=bg_col)
            inner_col.pack(fill="both", expand=True)

            tareas = TareasService.obtener_tareas_por_estado(estado)
            if USUARIO_ACTUAL["rol"] == "mecanico":
                tareas = TareasService.obtener_tareas_por_estado(estado, USUARIO_ACTUAL["nombre"])

            for t in tareas:
                self._tarjeta(inner_col, t, bg_col, estado)

    def _tarjeta(self, parent, t, bg_col, estado_actual):
        card = tk.Frame(parent, bg=BLANCO, padx=10, pady=8,
                       highlightbackground=SOMBRA, highlightthickness=1)
        card.pack(fill="x", pady=4)

        pri_color = PRIORIDAD_COLORES.get(t["prioridad"], NARANJA)
        tk.Label(card, text=f"🚗 {t['placa']}", font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(anchor="w")
        tk.Label(card, text=t["trabajo"], font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, wraplength=160, justify="left").pack(anchor="w")
        tk.Label(card, text=f"👤 {t['mecanico']}", font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w")

        pf = tk.Frame(card, bg=BLANCO)
        pf.pack(fill="x", pady=(4, 0))
        make_badge(pf, f"  {t['prioridad']}  ", pri_color).pack(side="left")

        bf = tk.Frame(card, bg=BLANCO)
        bf.pack(fill="x", pady=(6, 0))
        if estado_actual == "Pendiente":
            make_button(bf, "▶ Iniciar", lambda tid=t["id"]: self._mover(tid, "En proceso"),
                       color=NARANJA, size=FONT_SMALL, height=1).pack(fill="x")
        elif estado_actual == "En proceso":
            make_button(bf, "✅ Finalizar", lambda task=t: self._finalizar_y_registrar(task),
                       color=VERDE, size=FONT_SMALL, height=1).pack(fill="x")

    def _mover(self, tid, nuevo_estado):
        ok, msg = TareasService.cambiar_estado_tarea(tid, nuevo_estado, USUARIO_ACTUAL["nombre"], USUARIO_ACTUAL["rol"] == "propietario")
        if ok:
            AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Tarea #{tid} → {nuevo_estado}")
            self._render_kanban()
        else:
            show_message_box("Advertencia", msg, parent=self, msg_type="warning")

    def _finalizar_y_registrar(self, t):
        win = tk.Toplevel(self)
        win.title("Finalizar Tarea")
        win.geometry("360x380")
        win.configure(bg=BLANCO)
        win.grab_set()

        tk.Label(win, text="✅ Finalizar Tarea", font=FONT_SUBTIT, bg=BLANCO, fg=VERDE, pady=10).pack()
        tk.Label(win, text=f"Registrando historial para: {t['placa']}", font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(pady=(0, 10))
        
        campos = [
            ("Repuestos utilizados", "N/A"),
            ("Costo total (COP)", "0")
        ]
        entries = {}
        for lbl, default in campos:
            tk.Label(win, text=lbl, font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, anchor="w").pack(fill="x", padx=20)
            e = tk.Entry(win, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK)
            e.insert(0, default)
            e.pack(fill="x", padx=20, ipady=8, pady=(2, 8))
            entries[lbl] = e

        def guardar():
            try:
                # 1. Registrar en historial vehicular
                ok_hist, msg_hist = VehiculosService.crear_registro_reparacion(
                    t["placa"],
                    t["trabajo"],
                    entries["Repuestos utilizados"].get(),
                    int(entries["Costo total (COP)"].get()),
                    USUARIO_ACTUAL["nombre"]
                )
                if not ok_hist:
                    show_message_box("Error", msg_hist, parent=win, msg_type="error")
                    return

                # 2. Mover la tarea a finalizado
                ok_mov, msg_mov = TareasService.cambiar_estado_tarea(t["id"], "Finalizado", USUARIO_ACTUAL["nombre"], USUARIO_ACTUAL["rol"] == "propietario")
                if ok_mov:
                    AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Tarea #{t['id']} completada y guardada en historial")
                    
                    # Si hubo costo, preguntar si quiere registrar el ingreso en cuentas
                    costo_int = int(entries["Costo total (COP)"].get())
                    if costo_int > 0:
                        ingreso_ok = show_message_box("Ingreso Generado", f"¿Desea registrar automáticamente el ingreso de ${costo_int:,} en 'Cuentas Rápidas'?", parent=win, msg_type="yesno")
                        if ingreso_ok:
                            CuentasService.registrar_transaccion("Ingreso", f"Reparación {t['placa']}", costo_int)
                    
                    win.destroy()
                    self._render_kanban()
                else:
                    show_message_box("Error", msg_mov, parent=win, msg_type="error")
            except ValueError as e:
                show_message_box("Error", "Asegúrese de ingresar un costo numérico válido.", parent=win, msg_type="error")

        make_button(win, "COMPLETAR Y GUARDAR", guardar, emoji="💾", color=VERDE_CLARO).pack(fill="x", padx=20, pady=12)

    def _nueva_tarea(self):
        win = tk.Toplevel(self)
        win.title("Nueva Tarea")
        win.geometry("360x380")
        win.configure(bg=BLANCO)
        win.grab_set()
        tk.Label(win, text="📋 Nueva Tarea", font=FONT_SUBTIT, bg=BLANCO, fg="#00695C", pady=10).pack()

        campos = [("Placa", ""), ("Trabajo", "")]
        entries = {}
        for lbl, default in campos:
            tk.Label(win, text=lbl, font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED, anchor="w").pack(fill="x", padx=20)
            e = tk.Entry(win, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK)
            e.insert(0, default)
            e.pack(fill="x", padx=20, ipady=8, pady=(2, 8))
            entries[lbl] = e

        tk.Label(win, text="Mecánico", font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w", padx=20)
        mecanicos = [v["nombre"] for k, v in db.get_usuarios().items() if v["rol"] == "mecanico"]
        var_mec = tk.StringVar(value=mecanicos[0] if mecanicos else "")
        ttk.Combobox(win, textvariable=var_mec, values=mecanicos, state="readonly", font=FONT_BODY).pack(fill="x", padx=20, pady=(2, 8))

        tk.Label(win, text="Prioridad", font=FONT_BODY, bg=BLANCO, fg=TEXTO_MED).pack(anchor="w", padx=20)
        var_pri = tk.StringVar(value="Media")
        ttk.Combobox(win, textvariable=var_pri, values=["Alta", "Media", "Baja"], state="readonly", font=FONT_BODY).pack(fill="x", padx=20, pady=(2, 8))

        def guardar():
            ok, msg = TareasService.crear_tarea(entries["Placa"].get(), entries["Trabajo"].get(), var_mec.get(), var_pri.get())
            if ok:
                AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"Nueva tarea: {entries['Trabajo'].get()}")
                show_message_box("Tarea Creada", msg, parent=win, msg_type="success")
                win.destroy()
                self._render_kanban()
            else:
                show_message_box("Error", msg, parent=win, msg_type="error")

        make_button(win, "CREAR", guardar, emoji="✅", color=VERDE_CLARO).pack(fill="x", padx=20, pady=10)


# ──────────────────────────────────────────────
#  PANTALLA: CUENTAS (HU-002)
# ──────────────────────────────────────────────

class PantallaCuentas(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        make_topbar(self, "💰 Cuentas Rápidas", back_cmd=lambda: self.nav("menu"), bg_color=NARANJA)

        canvas, vsb, main_container = make_scrollable_container(self)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)

        # Contenedor de resumen
        self.sum_frame = tk.Frame(main_container, bg=NARANJA, padx=14, pady=10)
        self.sum_frame.pack(fill="x")
        self._render_resumen()

        # Botones registros (3 toques - HU-002)
        btn_frame = tk.Frame(main_container, bg=GRIS_BG, padx=10, pady=10)
        btn_frame.pack(fill="x")
        tk.Label(btn_frame, text="Registrar en 3 toques:", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK).pack(anchor="w", pady=(0, 8))

        for emoji, txt, tipo in [
            ("💵", "Ingreso reparación", "Ingreso"),
            ("🔩", "Compra repuesto", "Egreso"),
            ("🛠", "Servicio", "Egreso"),
            ("💸", "Otro egreso", "Egreso"),
        ]:
            make_button(btn_frame, f"{emoji}  {txt}", lambda t=tipo, tx=txt: self._registrar(t, tx),
                       color=VERDE if tipo == "Ingreso" else ROJO, size=FONT_BOTON, height=2).pack(fill="x", pady=4)

        # Historial
        make_separator(main_container, height=1).pack(fill="x", padx=8, pady=4)
        tk.Label(main_container, text="Últimas transacciones:", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, pady=4).pack(anchor="w", padx=10)

        self.hist_frame = tk.Frame(main_container, bg=GRIS_BG)
        self.hist_frame.pack(fill="both", expand=True, padx=4, pady=4)

        self._render_hist()

    def _render_resumen(self):
        for w in self.sum_frame.winfo_children():
            w.destroy()
        
        resumen = CuentasService.obtener_resumen()
        for txt, val, color in [("💵 Ingresos", resumen["ingresos"], VERDE_CLARO),
                                 ("💸 Egresos", resumen["egresos"], ROJO),
                                 ("📊 Saldo", resumen["saldo"], AZUL_MED)]:
            f = tk.Frame(self.sum_frame, bg=color, padx=12, pady=8)
            f.pack(side="left", expand=True, fill="x", padx=4)
            tk.Label(f, text=txt, font=FONT_SMALL, bg=color, fg=BLANCO).pack()
            tk.Label(f, text=f"${val:,}", font=FONT_BOTON, bg=color, fg=BLANCO).pack()

    def _render_hist(self):
        for w in self.hist_frame.winfo_children():
            w.destroy()
        for t in CuentasService.obtener_ultimas_transacciones():
            color = "#E8F5E9" if t["tipo"] == "Ingreso" else "#FFEBEE"
            ico = "📗" if t["tipo"] == "Ingreso" else "📕"
            c = tk.Frame(self.hist_frame, bg=color, padx=10, pady=8,
                        highlightbackground=SOMBRA, highlightthickness=1)
            c.pack(fill="x", pady=2)
            tk.Label(c, text=f"{ico} {t['concepto']}", font=FONT_BODY, bg=color, fg=TEXTO_DARK).pack(side="left")
            tk.Label(c, text=f"${t['monto']:,}", font=FONT_BOTON, bg=color,
                     fg=VERDE if t["tipo"] == "Ingreso" else ROJO).pack(side="right")

    def _registrar(self, tipo, concepto):
        monto = ask_integer("Monto", f"¿Cuánto por '{concepto}'? (COP)", parent=self, min_val=0, max_val=999999999)
        if monto is not None and monto > 0:
            ok, msg = CuentasService.registrar_transaccion(tipo, concepto, monto)
            if ok:
                AuditoriaService.registrar_accion(USUARIO_ACTUAL["nombre"], f"{tipo}: {concepto} ${monto:,}")
                show_message_box("Transacción Registrada", msg, parent=self, msg_type="success")
                self._render_resumen()
                self._render_hist()
            else:
                show_message_box("Error", msg, parent=self, msg_type="error")


# ──────────────────────────────────────────────
#  PANTALLA: PANEL PROPIETARIO (HU-006)
# ──────────────────────────────────────────────

class PantallaPanel(tk.Frame):
    def __init__(self, master, nav):
        super().__init__(master, bg=GRIS_BG)
        self.nav = nav
        self._build()

    def _build(self):
        make_topbar(self, "📊 Panel del Propietario", back_cmd=lambda: self.nav("menu"), bg_color=ROJO)

        canvas, vsb, inner = make_scrollable_container(self)
        vsb.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)

        # Métricas
        tk.Label(inner, text="Resumen de hoy", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, pady=8).pack(anchor="w", padx=10)
        
        metricas = DashboardService.obtener_metricas_hoy()
        sg = tk.Frame(inner, bg=GRIS_BG, padx=10)
        sg.pack(fill="x")

        for txt, val, color, ico in [
            ("Tareas activas", metricas["tareas_activas"], AZUL_MED, "📋"),
            ("Herramientas en uso", metricas["herramientas_en_uso"], NARANJA, "🛠"),
            ("Stock bajo", metricas["repuestos_stock_bajo"], ROJO, "⚠"),
        ]:
            f = tk.Frame(sg, bg=color, padx=14, pady=12)
            f.pack(side="top", expand=True, fill="x", padx=4, pady=4)
            # Reorganizar tarjetas para que no colisionen verticalmente
            tk.Label(f, text=f"{ico} {val}", font=("Segoe UI", 24, "bold"), bg=color, fg=BLANCO).pack(side="left", padx=10)
            tk.Label(f, text=txt, font=FONT_BODY, bg=color, fg=BLANCO, wraplength=200).pack(side="left", anchor="w")

        # Herramientas en uso
        make_separator(inner).pack(fill="x", padx=8, pady=4)
        tk.Label(inner, text="🛠 Herramientas asignadas", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, padx=10).pack(anchor="w")
        for h in DashboardService.obtener_herramientas_en_uso():
            c = tk.Frame(inner, bg=BLANCO, padx=12, pady=8,
                        highlightbackground=SOMBRA, highlightthickness=1)
            c.pack(fill="x", padx=10, pady=2)
            tk.Label(c, text=h["nombre"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(side="left")
            tk.Label(c, text=f"👤 {h['asignada_a']}  ⏰ {h['hora_retiro']}", font=FONT_SMALL, bg=BLANCO, fg=TEXTO_MED).pack(side="right")

        # Repuestos bajo stock
        make_separator(inner).pack(fill="x", padx=8, pady=4)
        tk.Label(inner, text="⚠ Repuestos con stock bajo", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, padx=10).pack(anchor="w")
        for r in DashboardService.obtener_repuestos_bajo_stock():
            color = ROJO if r["stock"] == 0 else NARANJA
            c = tk.Frame(inner, bg=BLANCO, padx=12, pady=8,
                        highlightbackground=color, highlightthickness=1)
            c.pack(fill="x", padx=10, pady=2)
            tk.Label(c, text=r["nombre"], font=FONT_BOTON, bg=BLANCO, fg=TEXTO_DARK).pack(side="left")
            tk.Label(c, text=f"Stock: {r['stock']} / Min: {r['minimo']}", font=FONT_BADGE, bg=color, fg=BLANCO, padx=4).pack(side="right")

        # Log
        make_separator(inner).pack(fill="x", padx=8, pady=4)
        tk.Label(inner, text="🔍 Actividad reciente", font=FONT_SUBTIT, bg=GRIS_BG, fg=TEXTO_DARK, padx=10).pack(anchor="w")
        log_frame = tk.Frame(inner, bg=TEXTO_DARK, padx=10, pady=8)
        log_frame.pack(fill="x", padx=10, pady=4)
        for entry in AuditoriaService.obtener_log(10):
            tk.Label(log_frame, text=f"[{entry['hora']}] {entry['usuario']}: {entry['accion']}",
                     font=FONT_MONOSPACE, bg=TEXTO_DARK, fg="#00E676", anchor="w").pack(fill="x")

        make_separator(inner).pack(fill="x", padx=8, pady=4)
        make_button(inner, "📤 Exportar reporte", lambda: messagebox.showinfo("✅", "En producción: PDF/Excel"),
                   color=AZUL_MED).pack(fill="x", padx=10, pady=10)


# ──────────────────────────────────────────────
#  APP PRINCIPAL
# ──────────────────────────────────────────────

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Autosuspensiones Cubillos – Sistema v2.0")
        self.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
        self.resizable(True, True)
        self.configure(bg=AZUL)
        self.minsize(WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT)

        self._set_icon()
        self._pantalla_actual = None
        self._mostrar("menu")

    def _set_icon(self):
        try:
            img = tk.PhotoImage(width=32, height=32)
            for x in range(32):
                for y in range(32):
                    d = math.sqrt((x - 16) ** 2 + (y - 16) ** 2)
                    img.put("#FFD600" if d < 14 else "#1A237E", (x, y))
            self.iconphoto(True, img)
        except Exception:
            pass

    def _mostrar(self, pantalla):
        if self._pantalla_actual:
            self._pantalla_actual.destroy()

        pantallas = {
            "menu": lambda: MenuPrincipal(self, self._mostrar),
            "repuestos": lambda: PantallaRepuestos(self, self._mostrar),
            "herramientas": lambda: PantallaHerramientas(self, self._mostrar),
            "historial": lambda: PantallaHistorial(self, self._mostrar),
            "tareas": lambda: PantallaTareas(self, self._mostrar),
            "cuentas": lambda: PantallaCuentas(self, self._mostrar),
            "panel": lambda: PantallaPanel(self, self._mostrar),
        }

        p = pantallas.get(pantalla, lambda: MenuPrincipal(self, self._mostrar))()

        p.pack(fill="both", expand=True)
        self._pantalla_actual = p


# ──────────────────────────────────────────────
#  ENTRADA PRINCIPAL
# ──────────────────────────────────────────────

if __name__ == "__main__":
    app = App()
    app.mainloop()