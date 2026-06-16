"""
============================================================
 AUTOSUSPENSIONES CUBILLOS - Componentes UI Comunes
 Widgets reutilizables y utilidades de interfaz
============================================================
"""

import tkinter as tk
from tkinter import ttk
from ui_constants import *

# ──────────────────────────────────────────────
#  COMPONENTES REUTILIZABLES
# ──────────────────────────────────────────────

def make_button(parent, text, cmd, color=AZUL_MED, fg=BLANCO, size=FONT_BOTON, emoji="", width=None, height=2):
    """Crear botón redondeado simulado con Canvas"""
    label = f"{emoji}  {text}" if emoji else text
    
    # Calcular dimensiones estimadas
    btn_width = 120 if not width else width * 10
    btn_height = 40 if height <= 2 else height * 20
    
    cv = tk.Canvas(parent, bg=parent.cget("bg"), highlightthickness=0, height=btn_height)
    # No establecemos width fijo si no se envía, para dejar que se expanda si usa pack(fill="x")
    if width:
        cv.config(width=btn_width)
    
    def draw_bg(c, bg_color):
        c.delete("all")
        w_curr = c.winfo_width() if c.winfo_width() > 10 else (btn_width if width else 150)
        h_curr = c.winfo_height() if c.winfo_height() > 10 else btn_height
        
        radius = 15
        x1, y1, x2, y2 = 2, 2, w_curr-2, h_curr-2
        points = [
            x1+radius, y1,  x1+radius, y1,  x2-radius, y1,  x2-radius, y1,
            x2, y1,  x2, y1+radius,  x2, y1+radius,  x2, y2-radius,  x2, y2-radius,
            x2, y2,  x2-radius, y2,  x2-radius, y2,  x1+radius, y2,  x1+radius, y2,
            x1, y2,  x1, y2-radius,  x1, y2-radius,  x1, y1+radius,  x1, y1+radius,
            x1, y1
        ]
        c.create_polygon(points, outline=bg_color, fill=bg_color, smooth=True, tags="btn")
        c.create_text(w_curr/2, h_curr/2, text=label, font=size, fill=fg, justify="center", tags="btn")
        
    def on_enter(e):
        new_color = AZUL_CLARO if color == AZUL_MED else AMARILLO_H if color == AMARILLO else color
        draw_bg(cv, new_color)
        
    def on_leave(e):
        draw_bg(cv, color)

    cv.bind("<Configure>", lambda e: draw_bg(cv, color))
    cv.bind("<Enter>", on_enter)
    cv.bind("<Leave>", on_leave)
    cv.bind("<Button-1>", lambda e: cmd())
    
    return cv


def make_card(parent, title="", color_top=AZUL, **grid_kwargs):
    """Crear tarjeta/card con encabezado opcional"""
    frame = tk.Frame(parent, bg=BLANCO, bd=0, relief="flat",
                     highlightbackground=SOMBRA, highlightthickness=1)
    if title:
        top = tk.Frame(frame, bg=color_top, pady=8)
        top.pack(fill="x")
        tk.Label(top, text=title, font=FONT_SUBTIT, bg=color_top, fg=BLANCO, padx=14).pack(side="left")
    
    body = tk.Frame(frame, bg=BLANCO, padx=12, pady=10)
    body.pack(fill="both", expand=True)
    return frame, body


def make_badge(parent, text, color=AZUL_MED):
    """Crear badge/etiqueta"""
    f = tk.Frame(parent, bg=color, padx=6, pady=2)
    tk.Label(f, text=text, font=FONT_BADGE, bg=color, fg=BLANCO).pack()
    return f


def make_separator(parent, color=SOMBRA, height=1):
    """Crear separador horizontal"""
    return tk.Frame(parent, bg=color, height=height)


def make_scrollable_container(parent):
    """Crear contenedor scrollable (canvas + scrollbar)"""
    canvas = tk.Canvas(parent, bg=GRIS_BG, highlightthickness=0)
    vsb = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
    canvas.configure(yscrollcommand=vsb.set)
    
    inner = tk.Frame(canvas, bg=GRIS_BG)
    win_id = canvas.create_window((0, 0), window=inner, anchor="nw")
    
    def on_configure(e):
        canvas.itemconfig(win_id, width=e.width)
    
    def on_inner_configure(e):
        canvas.configure(scrollregion=canvas.bbox("all"))
    
    canvas.bind("<Configure>", on_configure)
    inner.bind("<Configure>", on_inner_configure)
    
    # Mouse wheel support
    def on_mousewheel(e):
        canvas.yview_scroll(int(-1*(e.delta/120)), "units")
    
    canvas.bind_all("<MouseWheel>", on_mousewheel)
    
    return canvas, vsb, inner


def make_topbar(parent, titulo, emoji="", back_cmd=None, bg_color=AZUL):
    """Crear barra superior estándar"""
    bar = tk.Frame(parent, bg=bg_color, pady=12)
    bar.pack(fill="x")
    
    if back_cmd:
        make_button(bar, "", back_cmd, color=bg_color, fg=BLANCO,
                   emoji="◀", height=1, width=3).pack(side="left", padx=4)
    
    title_text = f"{emoji} {titulo}" if emoji else titulo
    tk.Label(bar, text=title_text, font=FONT_SUBTIT, bg=bg_color, fg=BLANCO).pack(side="left")
    
    return bar


def make_input_field(parent, label, default="", width=None, is_password=False):
    """Crear campo de entrada con etiqueta"""
    tk.Label(parent, text=label, font=FONT_BODY, bg=BLANCO if parent.cget("bg") != BLANCO else BLANCO,
             fg=TEXTO_MED, anchor="w").pack(fill="x")
    
    entry = tk.Entry(parent, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK,
                     insertbackground=AZUL_MED, show="•" if is_password else "")
    if default:
        entry.insert(0, default)
    if width:
        entry.config(width=width)
    
    entry.pack(fill="x", ipady=8, pady=(2, 8))
    return entry


def show_message_box(title, message, parent=None, msg_type="info"):
    """Mostrar mensaje con diseño personalizado e integrado"""
    win = tk.Toplevel(parent)
    win.title(title)
    win.geometry("380x200")
    win.configure(bg=BLANCO)
    if parent:
        win.transient(parent)
    win.grab_set()

    # Centrar la ventana
    if parent:
        win.update_idletasks()
        x = parent.winfo_rootx() + (parent.winfo_width() // 2) - 190
        y = parent.winfo_rooty() + (parent.winfo_height() // 2) - 100
        win.geometry(f"+{x}+{y}")

    # Configuración de colores e iconos según el tipo de mensaje
    color_hdr = AZUL_MED
    icon = "ℹ"
    if msg_type == "warning":
        color_hdr = NARANJA
        icon = "⚠"
    elif msg_type == "error":
        color_hdr = ROJO
        icon = "❌"
    elif msg_type == "success":
        color_hdr = VERDE_CLARO
        icon = "✅"
    elif msg_type == "yesno":
        color_hdr = AZUL_CLARO
        icon = "❓"

    # Header
    top = tk.Frame(win, bg=color_hdr, pady=8)
    top.pack(fill="x")
    tk.Label(top, text=f"{icon}  {title}", font=FONT_SUBTIT, bg=color_hdr, fg=BLANCO).pack()

    # Body
    body = tk.Frame(win, bg=BLANCO, pady=20, padx=20)
    body.pack(fill="both", expand=True)
    tk.Label(body, text=message, font=FONT_BODY, bg=BLANCO, fg=TEXTO_DARK, wraplength=320, justify="center").pack()

    # Buttons
    btn_frame = tk.Frame(win, bg=BLANCO, pady=10)
    btn_frame.pack(fill="x")

    resultado = [None]
    
    def close(val=None):
        resultado[0] = val
        win.destroy()

    if msg_type == "yesno":
        make_button(btn_frame, "No", lambda: close(False), color=ROJO, size=FONT_SMALL, height=1, width=10).pack(side="left", padx=20)
        make_button(btn_frame, "Sí", lambda: close(True), color=VERDE_CLARO, size=FONT_SMALL, height=1, width=10).pack(side="right", padx=20)
    else:
        make_button(btn_frame, "Aceptar", lambda: close(True), color=color_hdr, size=FONT_SMALL, height=1, width=15).pack()

    win.bind("<Return>", lambda e: close(True))
    if msg_type == "yesno":
        win.bind("<Escape>", lambda e: close(False))
    else:
        win.bind("<Escape>", lambda e: close(True))

    parent.wait_window(win) if parent else win.wait_window(win)
    return resultado[0]


def ask_integer(title, message, parent=None, min_val=0, max_val=1000):
    """Pedir entrada numérica al usuario con diseño personalizado"""
    win = tk.Toplevel(parent)
    win.title(title)
    win.geometry("340x220")
    win.configure(bg=BLANCO)
    win.transient(parent)
    win.grab_set()

    # Centrar la ventana
    if parent:
        win.update_idletasks()
        x = parent.winfo_rootx() + (parent.winfo_width() // 2) - (170)
        y = parent.winfo_rooty() + (parent.winfo_height() // 2) - (110)
        win.geometry(f"+{x}+{y}")

    tk.Label(win, text=title, font=FONT_SUBTIT, bg=BLANCO, fg=AZUL_MED, pady=10).pack()
    tk.Label(win, text=message, font=FONT_BODY, bg=BLANCO, fg=TEXTO_DARK, wraplength=300).pack(pady=5)

    entry = tk.Entry(win, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK, justify="center")
    entry.pack(fill="x", padx=40, ipady=8, pady=10)
    entry.focus()

    resultado = [None]

    def on_ok(event=None):
        val = entry.get()
        if val.isdigit():
            v = int(val)
            if min_val <= v <= max_val:
                resultado[0] = v
                win.destroy()
            else:
                show_message_box("Error", f"El valor debe estar entre {min_val} y {max_val}", parent=win, msg_type="error")
        else:
            show_message_box("Error", "Debe ingresar un número válido", parent=win, msg_type="error")

    def on_cancel(event=None):
        win.destroy()

    btn_frame = tk.Frame(win, bg=BLANCO)
    btn_frame.pack(pady=10)
    
    make_button(btn_frame, "Cancelar", on_cancel, color=ROJO, size=FONT_SMALL, height=1, width=10).pack(side="left", padx=10)
    make_button(btn_frame, "Aceptar", on_ok, color=VERDE_CLARO, size=FONT_SMALL, height=1, width=10).pack(side="right", padx=10)
    
    win.bind("<Return>", on_ok)
    win.bind("<Escape>", on_cancel)
    
    parent.wait_window(win) if parent else win.wait_window(win)
    return resultado[0]


def ask_string(title, message, default="", parent=None):
    """Pedir entrada de texto al usuario con diseño personalizado"""
    win = tk.Toplevel(parent)
    win.title(title)
    win.geometry("340x220")
    win.configure(bg=BLANCO)
    if parent:
        win.transient(parent)
    win.grab_set()

    # Centrar la ventana
    if parent:
        win.update_idletasks()
        x = parent.winfo_rootx() + (parent.winfo_width() // 2) - 170
        y = parent.winfo_rooty() + (parent.winfo_height() // 2) - 110
        win.geometry(f"+{x}+{y}")

    tk.Label(win, text=title, font=FONT_SUBTIT, bg=BLANCO, fg=AZUL_MED, pady=12).pack()
    tk.Label(win, text=message, font=FONT_BODY, bg=BLANCO, fg=TEXTO_DARK, wraplength=300).pack(pady=(0, 10))

    e = tk.Entry(win, font=FONT_BODY, bd=0, bg=GRIS_CARD, fg=TEXTO_DARK, justify="center")
    if default:
        e.insert(0, default)
    e.pack(fill="x", padx=30, ipady=8)
    e.focus()

    resultado = [None]
    
    def on_ok(event=None):
        val = e.get()
        if val is not None:
            resultado[0] = val
            win.destroy()

    def on_cancel(event=None):
        win.destroy()

    btn_frame = tk.Frame(win, bg=BLANCO, pady=15)
    btn_frame.pack(fill="x")
    
    make_button(btn_frame, "Cancelar", on_cancel, color=ROJO, size=FONT_SMALL, height=1, width=10).pack(side="left", padx=10)
    make_button(btn_frame, "Aceptar", on_ok, color=VERDE_CLARO, size=FONT_SMALL, height=1, width=10).pack(side="right", padx=10)
    
    win.bind("<Return>", on_ok)
    win.bind("<Escape>", on_cancel)
    
    parent.wait_window(win) if parent else win.wait_window(win)
    return resultado[0]
