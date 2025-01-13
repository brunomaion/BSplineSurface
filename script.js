
class Poligono {
  constructor(ArrayVertices) {
    this.vertices = [];
    this.addVertice(ArrayVertices);
  }

  addVertice(array){
    let tam = array.length;
    for (let i = 0; i < tam; i++) {
      this.vertices.push(array[i]);
    }
  }
}


const arrayVertice = [ //[x,y,z]
[1, 2, 3], 
[4, 5, 6], 
[7, 8, 9],
[1, 2, 3], 
[4, 5, 6], 
[7, 8, 9]];

const poligono1teste = new Poligono(arrayVertice);
console.log(poligono1teste);

dp = 40

/*

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

xMin = -4
xMax = 4
yMin = -3
yMax = 3

uMin = 0
uMax = 399
vMin = 0
vMax = 299



// Example usage:
const matrixA = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16]
];

const matrixPersp = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, ((-(1))/dp), 0]
];

const matrixJP = [
  [((uMax-uMin)/(xMax-xMin)), 0, 0, ((-(xMin) + ((uMax-uMin)/(xMax-xMin))) + uMin)],
  [0, ((vMax-vMin)/(yMax-yMin)), 0, ((-(yMin) + ((vMax-vMin)/(yMax-yMin))) + vMin)],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];

const matrixC = [
  [17],
  [18],
  [19],
  [20]
];


var resultMatrixA = matriz44(matrixA, matrixB);
console.log(resultMatrixA);

resultMatrix = matriz44x41(matrixA, matrixC);
console.log(resultMatrix);

*/