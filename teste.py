import math

def vetor_unitario(vetor):
    magnitude = math.sqrt(sum(val ** 2 for val in vetor))
    if magnitude == 0:
        raise ValueError("O vetor não pode ser nulo para normalização.")
    return [val / magnitude for val in vetor]

def produto_escalar(vetor_a, vetor_b):
    if len(vetor_a) != len(vetor_b):
        raise ValueError("Os vetores devem ter o mesmo tamanho")
    return sum(a * b for a, b in zip(vetor_a, vetor_b))

def produto_vetorial(vetor_a, vetor_b):
    if len(vetor_a) != 3 or len(vetor_b) != 3:
        raise ValueError("Os vetores devem ter tamanho 3")
    return [
        vetor_a[1] * vetor_b[2] - vetor_a[2] * vetor_b[1],
        (vetor_a[2] * vetor_b[0] - vetor_a[0] * vetor_b[2]),
        vetor_a[0] * vetor_b[1] - vetor_a[1] * vetor_b[0]
    ]

# INFO ///////////////////////////////////////////////////////////////////////////

x_min = -4
x_max = 4
y_min = -3
y_max = 3

u_min = 0
u_max = 399
v_min = 0
v_max = 299

dp = 40

view_up = [0, 1, 0]

vet_vrp = [25, 15, 80]
vet_p = [20, 10, 25]
vet_n = [
    vet_vrp[0] - vet_p[0],
    vet_vrp[1] - vet_p[1],
    vet_vrp[2] - vet_p[2]
]
vet_n_unitario = vetor_unitario(vet_n)

y_n = produto_escalar(view_up, vet_n_unitario)
vet_v = [
    view_up[0] - (y_n * vet_n_unitario[0]),
    view_up[1] - (y_n * vet_n_unitario[1]),
    view_up[2] - (y_n * vet_n_unitario[2])
]
vet_v_unitario = vetor_unitario(vet_v)
vet_u = produto_vetorial(vet_v_unitario, vet_n_unitario)

print('Vetor N unitário:', vet_n_unitario)
print('Vetor V unitário:', vet_v_unitario)
print('Vetor U:', vet_u)
