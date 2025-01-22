
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
  return [
    [vetor[0]/vetor[3]], 
    [vetor[1]/vetor[3]], 
    vetor[2], 
    [1]];
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

var eixo = '';
var rotX = 0;
var rotY = 0;
var rotZ = 0;

var ponto1 = [[-10], [-20], [10], [1]];
var ponto2 = [[10], [-20], [10], [1]];
var ponto3 = [[7], [20], [10], [1]];
var ponto4 = [[-7], [20], [10], [1]];
var ponto5 = [[-10], [-20], [-10], [1]];
var ponto6 = [[10], [-20], [-10], [1]];
var ponto7 = [[7], [20], [-10], [1]];
var ponto8 = [[-7], [20], [-10], [1]];



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
  
  function grausParaRadianos(angulo) {
    return angulo * (Math.PI / 180);
  }



  function rotacaoX(ponto, angulo) {
    angulo = grausParaRadianos(angulo);  // ✅ Converte para radianos
    var matrizRotacao = [
      [1, 0, 0, 0],
      [0, Math.cos(angulo), -Math.sin(angulo), 0],
      [0, Math.sin(angulo), Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];
    return matriz44x41(matrizRotacao, ponto);
  }

  function rotacaoY(ponto, angulo) {
    angulo = grausParaRadianos(angulo);  // ✅ Converte para radianos
    var matrizRotacao = [
      [Math.cos(angulo), 0, Math.sin(angulo), 0],
      [0, 1, 0, 0],
      [-Math.sin(angulo), 0, Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];
    return matriz44x41(matrizRotacao, ponto);
  }

  function rotacaoZ(ponto, angulo) {
    angulo = grausParaRadianos(angulo);  // ✅ Converte para radianos
    var matrizRotacao = [
      [Math.cos(angulo), -Math.sin(angulo), 0, 0],
      [Math.sin(angulo), Math.cos(angulo), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
    return matriz44x41(matrizRotacao, ponto);
  }

  let pontoRotacionado = ponto;
  if (eixo === 'X') {
    pontoRotacionado = rotacaoX(ponto, rotX);
  } else if (eixo === 'Y') {
    pontoRotacionado = rotacaoY(ponto, rotY);
  } else if (eixo === 'Z') {
    pontoRotacionado = rotacaoZ(ponto, rotZ);
  }

  return pontoRotacionado;
}



// INTERFACE /////////////////////////////////////////////////////////////////////



function drawSquare() {
  var canvas = document.getElementById('viewport');
  var context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Antes de começar a desenhar qualquer coisa no canvas
  context.beginPath();  

  ponto1 = rotacao(ponto1, eixo);
  ponto2 = rotacao(ponto2, eixo);
  ponto3 = rotacao(ponto3, eixo);
  ponto4 = rotacao(ponto4, eixo);
  ponto5 = rotacao(ponto5, eixo);
  ponto6 = rotacao(ponto6, eixo);
  ponto7 = rotacao(ponto7, eixo);
  ponto8 = rotacao(ponto8, eixo);


  ponto1 = visao(ponto1);
  ponto2 = visao(ponto2);
  ponto3 = visao(ponto3);
  ponto4 = visao(ponto4);
  ponto5 = visao(ponto5);
  ponto6 = visao(ponto6);
  ponto7 = visao(ponto7);
  ponto8 = visao(ponto8);
  //*/

  console.log((ponto1));
  


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


  // Frente
  context.moveTo(pontos[0][0], pontos[0][1]);
  context.lineTo(pontos[1][0], pontos[1][1]);
  context.lineTo(pontos[2][0], pontos[2][1]);
  context.lineTo(pontos[3][0], pontos[3][1]);
  context.lineTo(pontos[0][0], pontos[0][1]);

  // Traseira
  context.moveTo(pontos[4][0], pontos[4][1]);
  context.lineTo(pontos[5][0], pontos[5][1]);
  context.lineTo(pontos[6][0], pontos[6][1]);
  context.lineTo(pontos[7][0], pontos[7][1]);
  context.lineTo(pontos[4][0], pontos[4][1]);

  // Conectar frente e trás
  for (let i = 0; i < 4; i++) {
    context.moveTo(pontos[i][0], pontos[i][1]);
    context.lineTo(pontos[i + 4][0], pontos[i + 4][1]);
  }
  
  context.stroke();
}






document.addEventListener('DOMContentLoaded', () => {

  // Seleciona os inputs existentes pelo ID
  const inputs = {

    xRot: document.getElementById('xRot'),
    yRot: document.getElementById('yRot'),
    zRot: document.getElementById('zRot')
  };

  // Armazena os valores anteriores
  const previousValues = {};
  Object.keys(inputs).forEach(key => {
    previousValues[key] = parseInt(inputs[key].value);
  });

  // Função de atualizar valores
  const updateValues = (event) => {
    const changedInput = event.target.id;
    const newValue = parseInt(event.target.value);
    const oldValue = previousValues[changedInput];

    // Verifica se houve mudança
    if (newValue !== oldValue) {
      console.log(`O valor de ${changedInput} foi alterado de ${oldValue} para ${newValue}`);
      previousValues[changedInput] = newValue; // Atualiza o valor antigo
      
      if (changedInput === 'xRot') {
        eixo = 'X';
        //console.log(eixo);
      } else if (changedInput === 'yRot') {
        eixo = 'Y';
        //console.log(eixo);
      } else if (changedInput === 'zRot') {
        eixo = 'Z';
        //console.log(eixo);
      }

    }

    // Atualiza os vetores e valores


    drawSquare();
    

  };

  // Adiciona o evento de input para todos os campos
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', updateValues);
  });

  // Desenha o quadrado inicialmente
  drawSquare();
});




