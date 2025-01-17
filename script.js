
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


/// camera 
var xMin = -8;
var xMax = 8;
var yMin = -15;
var yMax = 15;

var uMin = 0;
var uMax = 1100;
var vMin = 0;
var vMax = 700;

var dp = 40;
var viewUp = [0, 1, 0];
var vetVrp = [25, 15, 80];
var vetP = [20, 10, 25];


/// rotacao

var rotX = 0;
var rotY = 0;
var rotZ = 0;







function visao(ponto) {

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



function rotacao(ponto, eixo) {
  
  function rotacaoX(ponto, angulo) {
    var matrizRotacao = [
      [1, 0, 0, 0],
      [0, Math.cos(angulo), -Math.sin(angulo), 0],
      [0, Math.sin(angulo), Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];
  
    pontoRotacionado = matriz44x41(matrizRotacao, ponto);
    return pontoRotacionado;
  }
  
  function rotacaoY(ponto, angulo) {
    var matrizRotacao = [
      [Math.cos(angulo), 0, Math.sin(angulo), 0],
      [0, 1, 0, 0],
      [-Math.sin(angulo), 0, Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];
  
    pontoRotacionado = matriz44x41(matrizRotacao, ponto);
    return pontoRotacionado;
  }
  
  function rotacaoZ(ponto, angulo) {
    var matrizRotacao = [
      [Math.cos(angulo), -Math.sin(angulo), 0, 0],
      [Math.sin(angulo), Math.cos(angulo), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  
    pontoRotacionado = matriz44x41(matrizRotacao, ponto);
    return pontoRotacionado;
  }
  
  let pontoRotacionado = ponto;
  if (eixo == 'x') {
    pontoRotacionado = rotacaoX(ponto, rotX);
  } else if (eixo == 'y') {
    pontoRotacionado = rotacaoY(ponto, rotY);
  } else if (eixo == 'z') {
    pontoRotacionado = rotacaoZ(ponto, rotZ);
  }
  return pontoRotacionado;
}



// INTERFACE /////////////////////////////////////////////////////////////////////



function drawSquare() {
  var canvas = document.getElementById('viewport');
  var context = canvas.getContext('2d');

  // 4 pontos do quadrado (X, Y)
  var pontos = [
    [550, 50],  // Ponto 1
    [50, 350],  // Ponto 2
    [550, 650],  // Ponto 3
    [1050, 350]   // Ponto 4
  ];

  ponto1 = [[10], [0], [10], [1]];
  ponto2 = [[0], [10], [0], [1]];
  ponto3 = [[0], [20], [0], [1]];
  ponto4 = [[20], [10], [50], [1]];

  ponto1 = [[-10], [-20], [10], [1]];
  ponto2 = [[10], [-20], [10], [1]];
  ponto3 = [[7], [20], [10], [1]];
  ponto4 = [[-7], [20], [10], [1]];
  ponto5 = [[-10], [-20], [-10], [1]];
  ponto6 = [[10], [-20], [-10], [1]];
  ponto7 = [[7], [20], [-10], [1]];
  ponto8 = [[-7], [20], [-10], [1]];

  ponto1 = visao(ponto1);
  ponto2 = visao(ponto2);
  ponto3 = visao(ponto3);
  ponto4 = visao(ponto4);
  ponto5 = visao(ponto5);
  ponto6 = visao(ponto6);
  ponto7 = visao(ponto7);
  ponto8 = visao(ponto8);




  var pontos = [
    [ponto1[0], ponto1[1]],  // Ponto 1
    [ponto2[0], ponto2[1]],  // Ponto 2
    [ponto3[0], ponto3[1]],  // Ponto 3
    [ponto4[0], ponto4[1]],   // Ponto 4
    [ponto5[0], ponto5[1]],  // Ponto 1
    [ponto6[0], ponto6[1]],  // Ponto 2
    [ponto7[0], ponto7[1]],  // Ponto 3
    [ponto8[0], ponto8[1]]   // Ponto 4
  ];

  console.log(ponto1);
  
  // Desenhando o quadrado
  context.beginPath();
  context.moveTo(pontos[0][0], pontos[0][1]);  // Inicia no primeiro ponto

  for (let i = 1; i < pontos.length; i++) {
    context.lineTo(pontos[i][0], pontos[i][1]);  // Liga os pontos
  }

  context.closePath();  // Fecha o caminho (volta ao ponto inicial)
  context.stroke();     // Desenha o contorno
}


function drawViewport() {
  var canvas = document.getElementById('viewport');
  var context = canvas.getContext('2d');

  // Desenha a viewport
  context.beginPath();
  context.rect(uMin, vMin, uMax - uMin, vMax- vMin);
  context.stroke();
}

drawViewport();



document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o canvas e o contexto
  const canvas = document.getElementById('viewport');
  const context = canvas.getContext('2d');

  // Seleciona os inputs existentes pelo ID
  const xVrp = document.getElementById('xVrp');
  const yVrp = document.getElementById('yVrp');
  const zVrp = document.getElementById('zVrp');
  const xP = document.getElementById('xP');
  const yP = document.getElementById('yP');
  const zP = document.getElementById('zP');
  const dpValue = document.getElementById('dpValue');
  const xRotValue = document.getElementById('xRot');
  const yRotValue = document.getElementById('yRot');
  const zRotValue = document.getElementById('zRot');

  // Função de atualizar valores
  const updateValues = () => {
    let currentRotX = parseInt(xRotValue.value);
    let currentRotY = parseInt(yRotValue.value);
    let currentRotZ = parseInt(zRotValue.value);
    
    vetVrp = [parseInt(xVrp.value), parseInt(yVrp.value), parseInt(zVrp.value)];
    vetP = [parseInt(xP.value), parseInt(yP.value), parseInt(zP.value)];
    dp = parseInt(dpValue.value);


    rotX = parseInt(xRotValue.value) //* Math.PI / 180;
    rotY = parseInt(yRotValue.value) //* Math.PI / 180;
    rotZ = parseInt(zRotValue.value) //* Math.PI / 180;

    // LIMPAR O CANVAS ANTES DE DESENHAR
    context.clearRect(0, 0, canvas.width, canvas.height);

    // DESENHAR O QUADRADO ATUALIZADO
    drawSquare();
  };

  // Adiciona o evento de mudança de valor para cada input
  xVrp.addEventListener('input', updateValues);
  yVrp.addEventListener('input', updateValues);
  zVrp.addEventListener('input', updateValues);
  xP.addEventListener('input', updateValues);
  yP.addEventListener('input', updateValues);
  zP.addEventListener('input', updateValues);
  dpValue.addEventListener('input', updateValues);
  xRotValue.addEventListener('input', updateValues);
  yRotValue.addEventListener('input', updateValues);
  zRotValue.addEventListener('input', updateValues);



  // Desenha o quadrado inicialmente
  drawSquare();
});




