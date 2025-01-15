
class Poligono {
  varructor(ArrayVertices) {
    this.vertices = [];
    this.addVertice(ArrayVertices);
  }

  addVertice(array){ // //[[x,y,z][x,y,z]]
    let tam = array.length;
    for (let i = 0; i < tam; i++) {
      this.vertices.push(array[i]);
    }
  }

  draw(context) {
    context.beginPath();
    context.moveTo(this.vertices[0][0], this.vertices[0][1]);
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i][0], this.vertices[i][1]);
    }
    context.closePath();
    context.stroke();
  }

}

//////////// FUNCOES

function vetorUnitario(vetor) {
  let magnitude = Math.sqrt(vetor.reduce((sum, val) => sum + val * val, 0));
  return vetor.map(val => val / magnitude);
}

function produtoEscalar(vetorA, vetorB) {
  if (vetorA.length !== vetorB.length) {
    throw new Error("Os vetores devem ter o mesmo tamanho");
  }
  return vetorA.reduce((sum, val, index) => sum + val * vetorB[index], 0);
}

function produtoVetorial(vetorA, vetorB) {
  if (vetorA.length !== 3 || vetorB.length !== 3) {
    throw new Error("Os vetores devem ter tamanho 3");
  }
  return [
    vetorA[1] * vetorB[2] - vetorA[2] * vetorB[1],
    vetorA[2] * vetorB[0] - vetorA[0] * vetorB[2],
    vetorA[0] * vetorB[1] - vetorA[1] * vetorB[0]
  ];
}

function matriz44(a, b) {
  let result = [];
  for (let i = 0; i < 4; i++) {
    result[i] = [];
    for (let j = 0; j < 4; j++) {
      result[i][j] = 0;
      for (let k = 0; k < 4; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

function matriz44x41(a, b) {
  let result = [];
  for (let i = 0; i < 4; i++) {
    result[i] = [0];
    for (let j = 0; j < 4; j++) {
      result[i][0] += a[i][j] * b[j][0];
    }
  }
  return result;
}

function fatorHomogeneo(vetor) {
  return [vetor[0]/vetor[3], vetor[1]/vetor[3], vetor[2]*1, vetor[3]*1];
}


// INFO ///////////////////////////////////////////////////////////////////////////

let xMin = -8;
let xMax = 8;
let yMin = -6;
let yMax = 6;

let uMin = 0;
let uMax = 319;
let vMin = 0;
let vMax = 239;
let dp = 40;
let viewUp = [0, 1, 0];
let vetVrp = [25, 15, 80];
let vetP = [20, 10, 25];


//////////////////////////////////////////// PADRAO

let vetN = [
    vetVrp[0] - vetP[0],
    vetVrp[1] - vetP[1],
    vetVrp[2] - vetP[2]
];
let vetNunitario = vetorUnitario(vetN);
let yn = produtoEscalar(viewUp, vetNunitario);
let vetV = [
    viewUp[0] - (yn * vetNunitario[0]),
    viewUp[1] - (yn * vetNunitario[1]),
    viewUp[2] - (yn * vetNunitario[2])
];
let vetVunitario = vetorUnitario(vetV);
let vetU = produtoVetorial(vetVunitario, vetNunitario);

/*-
console.log('Vetor N unitário:', vetNunitario);
console.log('Vetor V unitário:', vetVunitario);
console.log('Vetor U:', vetU);
*/


///////////////////////////////////////////////////////////////////////////


// Example usage:
var matrizR = [
  [vetU[0], vetU[1], vetU[2], 0,],
  [vetVunitario[0], vetVunitario[1], vetVunitario[2], 0],
  [vetNunitario[0], vetNunitario[1], vetNunitario[2], 0],
  [0, 0, 0, 1]
];

var matrizT = 
[
  [1, 0, 0, -vetVrp[0]],
  [0, 1, 0, -vetVrp[1]],
  [0, 0, 1, -vetVrp[2]],
  [0, 0, 0, 1]
]


var matrizPersp = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, ((-(1))/dp), 0]
];

var matrizJP = [
  [((uMax-uMin)/(xMax-xMin)), 0, 0, ((-(xMin) * ((uMax-uMin)/(xMax-xMin))) + uMin)],
  [0, ((vMin-vMax)/(yMax-yMin)), 0, (((yMin) * ((vMax-vMin)/(yMax-yMin))) + vMax)],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];

pontoA = [[21.2], [0.7], [42.3], [1]];

var matrizSruSrc = matriz44(matrizR, matrizT);
/*
console.log('SRUSRC', matrizSruSrc);
console.log('JP', matrizJP);
console.log('PROJ', matrizPersp);
*/
var matrizSruSrt = matriz44(matriz44(matrizJP, matrizPersp), matrizSruSrc);

console.log(matrizSruSrt);


pontoASRT = matriz44x41(matrizSruSrt,pontoA);

console.log(pontoASRT);
console.log(fatorHomogeneo(pontoASRT));


//M M M M SRU SRT jp proj SRU SRC




var arrayVertice = [
  [0, -10, -10],  // Inferior esquerdo
  [0,  10, -10],  // Inferior direito
  [0,  10,  10],  // Superior direito
  [0, -10,  10]   // Superior esquerdo
];











