import pygame
import numpy as np


# Inicializa o Pygame
pygame.init()

# Configurações da tela
screen_size = (800, 600)
screen = pygame.display.set_mode(screen_size)
pygame.display.set_caption("Malha B-Spline Editável")

# Cores
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)

# Pontos de controle da B-Spline
control_points = np.array([[100, 100], [200, 200], [300, 100], [400, 300], [500, 200]])

def draw_bspline(points, n=100):
  t = np.linspace(0, 1, n)
  curve = np.zeros((n, 2))
  for i in range(n):
    curve[i] = de_boor(points, t[i])
  return curve

def de_boor(points, t, k=3):
  n = len(points) - 1
  d = [points[j] for j in range(n + 1)]
  for r in range(1, k + 1):
    for j in range(n, r - 1, -1):
      alpha = (t - j) / (k - r + 1)
      d[j] = (1.0 - alpha) * d[j - 1] + alpha * d[j]
  return d[n]

def draw_control_points(points):
  for point in points:
    pygame.draw.circle(screen, RED, point, 5)

def main():
  running = True
  selected_point = None

  while running:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        running = False
      elif event.type == pygame.MOUSEBUTTONDOWN:
        for i, point in enumerate(control_points):
          if np.linalg.norm(point - event.pos) < 10:
            selected_point = i
            break
      elif event.type == pygame.MOUSEBUTTONUP:
        selected_point = None
      elif event.type == pygame.MOUSEMOTION and selected_point is not None:
        control_points[selected_point] = event.pos

    screen.fill(WHITE)
    curve = draw_bspline(control_points)
    pygame.draw.lines(screen, BLACK, False, curve, 2)
    draw_control_points(control_points)
    pygame.display.flip()

  pygame.quit()

if __name__ == "__main__":
  main()