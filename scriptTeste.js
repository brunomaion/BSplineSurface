class Celula {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }
}

function criarMatriz(n, m) {
  let matriz = [];
  for (let i = 0; i < n; i++) {
    let linha = [];
    for (let j = 0; j < m; j++) {
      linha.push(new Celula(i, j, `face${i}${j}`));
    }
    matriz.push(linha);
  }
  return matriz;
}



function obterFronteira(matriz, celula) {
  let n = matriz.length;
  let m = matriz[0].length;
  let fronteira = [];

  for (let [dx, dy] of direcoes) {
    let nx = celula.i + dx, ny = celula.j + dy;
    if (nx >= 0 && nx < n && ny >= 0 && ny < m) {
      fronteira.push(matriz[nx][ny]);
    }
  }
  return fronteira;
}

function mostrarFronteira(fronteira) {
  console.log(fronteira.map(c => c.id).join(", "));
}

let N = 4, M = 5;
let matriz = criarMatriz(N, M);

console.log("Matriz Original:");
matriz.forEach(linha => console.log(linha.map(c => c.id).join(" ")));

// Exemplo de obtenção da fronteira para um objeto específico
let celulaExemplo = matriz[1][2];
console.log(`\nFronteira para a célula ${celulaExemplo.id}:`);
mostrarFronteira(obterFronteira(matriz, celulaExemplo));
