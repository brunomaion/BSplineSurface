import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import splprep, splev

def on_click(event):
    if event.button == 1:  # Botão esquerdo do mouse
        points.append((event.xdata, event.ydata))
        redraw()

def redraw():
    ax.clear()
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    
    if len(points) > 1:
        draw_bspline()
    
    x_vals, y_vals = zip(*points)
    ax.plot(x_vals, y_vals, 'ro')  # Pontos de controle
    fig.canvas.draw()

def draw_bspline():
    if len(points) < 4:
        return  # Evita erro se houver menos de 4 pontos
    
    x_vals, y_vals = zip(*points)
    tck, u = splprep([x_vals, y_vals], s=0, k=3)
    u_fine = np.linspace(0, 1, 100)
    bspline = splev(u_fine, tck)
    ax.plot(bspline[0], bspline[1], 'b-')  # Curva B-Spline


points = []
fig, ax = plt.subplots()
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
fig.canvas.mpl_connect('button_press_event', on_click)
plt.show()
