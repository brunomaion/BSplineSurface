
class Poligono {
  varructor(ArrayVertices) {
    this.vertices = [];
    this.addVertice(ArrayVertices);
  }

  addVertice(array){ // //[[x,y,z][x,y,z]]
    var tam = array.length;
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
function projPersp(mSruSrt, ponto) {
  let pontoSRT = matriz44x41(mSruSrt, ponto);
  return fatorHomogeneo(pontoSRT);
}


// INFO ///////////////////////////////////////////////////////////////////////////

var xMin = -8;
var xMax = 8;
var yMin = -6;
var yMax = 6;

var uMin = 0;
var uMax = 319;
var vMin = 0;
var vMax = 239;

var dp = 40;
var viewUp = [0, 1, 0];
var vetVrp = [25, 15, 80];


function visao(ponto) {


  var vetP = [20, 10, 25];
  var vetN = [
    vetVrp[0] - vetP[0],
    vetVrp[1] - vetP[1],
    vetVrp[2] - vetP[2]
  ];

  var vetNunitario = vetorUnitario(vetN);
  var yn = produtoEscalar(viewUp, vetNunitario);
  var vetV = [
      viewUp[0] - (yn * vetNunitario[0]),
      viewUp[1] - (yn * vetNunitario[1]),
      viewUp[2] - (yn * vetNunitario[2])
  ];
  var vetVunitario = vetorUnitario(vetV);
  var vetU = produtoVetorial(vetVunitario, vetNunitario);

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
  
  var matrizSruSrc = matriz44(matrizR, matrizT);
  /*
  console.log('SRUSRC', matrizSruSrc);
  console.log('JP', matrizJP);
  console.log('PROJ', matrizPersp);
  */
  var matrizSruSrt = matriz44(matriz44(matrizJP, matrizPersp), matrizSruSrc);
  
  pontoASRT = matriz44x41(matrizSruSrt,ponto);
  //console.log(pontoASRT)
  //console.log(fatorHomogeneo(pontoASRT));
  novoPonto = fatorHomogeneo(pontoASRT);
  
  return novoPonto;
};






var arrayVertice = [
  [0, -10, -10],  // Inferior esquerdo
  [0,  10, -10],  // Inferior direito
  [0,  10,  10],  // Superior direito
  [0, -10,  10]   // Superior esquerdo
];



// INTERFACE /////////////////////////////////////////////////////////////////////




document.addEventListener('DOMContentLoaded', () => {
  
  
  // Seleciona os inputs existentes pelo ID
  const xVrp = document.getElementById('xVrp');
  const yVrp = document.getElementById('yVrp');
  const zVrp = document.getElementById('zVrp');
  const xP = document.getElementById('xP');
  const yP = document.getElementById('yP');
  const zP = document.getElementById('zP');
  const dpValue = document.getElementById('dpValue');




  // Função para imprimir o valor no console
  const printValue = (event) => {
    //console.log(`Valor de ${event.target.id}: ${event.target.value}`);
  };///
  // Adiciona o evento de mudança de valor para cada input
  xVrp.addEventListener('input', printValue);
  yVrp.addEventListener('input', printValue);
  zVrp.addEventListener('input', printValue);
  xP.addEventListener('input', printValue);
  yP.addEventListener('input', printValue);
  zP.addEventListener('input', printValue);
  dpValue.addEventListener('input', printValue);

  //*/



  //função de atualizar valores
  const updateValues = () => {
    vetVrp = [parseInt(xVrp.value), parseInt(yVrp.value), parseInt(zVrp.value)];
    vetP = [parseInt(xP.value), parseInt(yP.value), parseInt(zP.value)];
    dp = parseInt(dpValue.value);
    //console.log(vetVrp, vetP, dp);
    pontoA = [[21.2], [0.7], [42.3], [1]];
    console.log(visao(pontoA));
  };

  // Adiciona o evento de mudança de valor para cada input
  xVrp.addEventListener('input', updateValues);
  yVrp.addEventListener('input', updateValues);
  zVrp.addEventListener('input', updateValues);
  xP.addEventListener('input', updateValues);
  yP.addEventListener('input', updateValues);
  zP.addEventListener('input', updateValues);
  dpValue.addEventListener('input', updateValues);

});






