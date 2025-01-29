class malha {

  constructor(pontosdamalha, m, n, desc) {
    this.pontosSru = pontosdamalha;
    this.pontosSRT = pontosSRUtoSRT(this.pontosSru);
    this.mMalha = m;
    this.nMalha = n;
    this.gridMalha = this.createMalha(this.pontosSRT, this.mMalha, this.nMalha);
    this.desc = desc;
    
    //TRANSFORMACOES
    this.scl_malha = 1.0;
    this.rotX_malha = 0;
    this.rotY_malha = 0;
    this.rotZ_malha = 0;
  }
  
  updateValores() {
    //this.scl_malha = scl;
    this.rotX_malharotX = rotX;
    this.rotY_malharotY = rotY;
    this.rotZ_malharotZ = rotZ;
    this.escala();

    //console.log('atualizando valores');
    this.pontosSRT = pontosSRUtoSRT(this.pontosSru);
    this.gridMalha = this.createMalha(this.pontosSRT, this.mMalha, this.nMalha);
  }



  createMalha (pontosMalha, m, n){ // pontos = [p1, p2 ] 

      let p1 = pontosMalha[0];
      let p2 = pontosMalha[1];
      let p3 = pontosMalha[2];
      let p4 = pontosMalha[3];

      let tamanhoTotalArestaM1x = (p2[0] - p1[0]);
      let incrPontosInternosM1x = tamanhoTotalArestaM1x / (m+1);
      let tamanhoTotalArestaM1y = (p2[1] - p1[1]);
      let incrPontosInternosM1y = tamanhoTotalArestaM1y / (m+1);
      let tamanhoTotalArestaM1z = (p2[2] - p1[2]);
      let incrPontosInternosM1z = tamanhoTotalArestaM1z / (m+1);

      let tamanhoTotalArestam2x = (p3[0] - p4[0]);
      let incrPontosInternosm2x = tamanhoTotalArestam2x / (m+1);
      let tamanhoTotalArestam2y = (p3[1] - p4[1]);
      let incrPontosInternosm2y = tamanhoTotalArestam2y / (m+1);
      let tamanhoTotalArestam2z = (p3[2] - p4[2]);
      let incrPontosInternosm2z = tamanhoTotalArestam2z / (m+1);


      let tamanhoTotalArestaN1x = (p3[0] - p2[0]);
      let incrPontosInternosN1x = tamanhoTotalArestaN1x / (n+1);
      let tamanhoTotalArestaN1y = (p3[1] - p2[1]);
      let incrPontosInternosN1y = tamanhoTotalArestaN1y / (n+1);
      let tamanhoTotalArestaN1z = (p3[2] - p2[2]);
      let incrPontosInternosN1z = tamanhoTotalArestaN1z / (n+1);

      let tamanhoTotalArestaN2x = (p4[0] - p1[0]);
      let incrPontosInternosN2x = tamanhoTotalArestaN2x / (n+1);
      let tamanhoTotalArestaN2y = (p4[1] - p1[1]);
      let incrPontosInternosN2y = tamanhoTotalArestaN2y / (n+1);
      let tamanhoTotalArestaN2z = (p4[2] - p1[2]);
      let incrPontosInternosN2z = tamanhoTotalArestaN2z / (n+1);

      let pontosM1 = []
      pontosM1.push(p1);
      let pontosM2 = []
      pontosM2.push(p4);

      let pontosN1 = []
      pontosN1.push(p2);
      let pontosN2 = []
      pontosN2.push(p1);

      let pontoX1m = p1[0];
      let pontoY1m = p1[1];
      let pontoZ1m = p1[2];

      let pontoX2m = p4[0];
      let pontoY2m = p4[1];
      let pontoZ2m = p4[2];

      let pontoX1n = p2[0];
      let pontoY1n = p2[1];
      let pontoZ1n = p2[2];

      let pontoX2n = p1[0];
      let pontoY2n = p1[1];
      let pontoZ2n = p1[2];

      for (let i = 0; i < m; i++) {
          pontoX1m += incrPontosInternosM1x;
          pontoY1m += incrPontosInternosM1y;
          pontoZ1m += incrPontosInternosM1z;
          pontosM1.push([pontoX1m, pontoY1m, pontoZ1m]);

          pontoX2m += incrPontosInternosm2x;
          pontoY2m += incrPontosInternosm2y;
          pontoZ2m += incrPontosInternosm2z;
          pontosM2.push([pontoX2m, pontoY2m, pontoZ2m]);

      }

      for (let i = 0; i < n; i++) {
          pontoX1n += incrPontosInternosN1x;
          pontoY1n += incrPontosInternosN1y;
          pontoZ1n += incrPontosInternosN1z;
          pontosN1.push([pontoX1n, pontoY1n, pontoZ1n]);

          pontoX2n += incrPontosInternosN2x;
          pontoY2n += incrPontosInternosN2y;
          pontoZ2n += incrPontosInternosN2z;
          pontosN2.push([pontoX2n, pontoY2n, pontoZ2n]);
      }

      pontosM1.push(p2);
      pontosM2.push(p3);

      pontosN1.push(p3);
      pontosN2.push(p4);

  return [pontosM1, pontosM2, pontosN1, pontosN2];
  }

  escala() {
    let pontos = this.pontosSru;
    let matrizS = [
      [this.scl_malha, 0, 0, 0],
      [0, this.scl_malha, 0, 0],
      [0, 0, this.scl_malha, 0],
      [0, 0, 0, 1]
    ];
    let pontosEscalados = [];
    for (let i = 0; i < pontos.length; i++) {
      let ponto = pontos[i];
      let pontoEscalado = matriz44x41(matrizS, ponto);
      pontosEscalados.push(pontoEscalado);
    }
    this.pontosSru = pontosEscalados;
  };

}

function drawLine(x1, y1, x2, y2, color = 'black') {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.beginPath(); // Inicia o caminho
  ctx.moveTo(x1, y1); // Move para o ponto inicial
  ctx.lineTo(x2, y2); // Desenha até o ponto final
  ctx.strokeStyle = color; // Define a cor da linha
  ctx.stroke(); // Renderiza a linha
}
function pontosSRUtoSRT(pontos) {
  let novosPontosSRT = [];
  pontos = rotacao(pontos);
  pontos = translacao(pontos);

  if (visao == 'perspectiva') {
    for (let i = 0; i < pontos.length; i++) {
      let pontoSRU = pontos[i];
      let pontoSRT = projPersp(pontoSRU);
      novosPontosSRT.push(pontoSRT);
    }
    return novosPontosSRT;

  } else if (visao == 'axonometrica') {
    for (let i = 0; i < pontos.length; i++) {
      let pontoSRU = pontos[i];
      let pontoSRT = projAxonometrica(pontoSRU);
      novosPontosSRT.push(pontoSRT);
    }
    return novosPontosSRT
  }
}
function eixoPontosSRUtoSRT(pontos) {
  let novosPontosSRT = [];
  if (visao == 'perspectiva') {
    for (let i = 0; i < pontos.length; i++) {
      let pontoSRU = pontos[i];
      let pontoSRT = projPersp(pontoSRU);
      novosPontosSRT.push(pontoSRT);
    }
    return novosPontosSRT;

  } else if (visao == 'axonometrica') {
    for (let i = 0; i < pontos.length; i++) {
      let pontoSRU = pontos[i];
      let pontoSRT = projAxonometrica(pontoSRU);
      novosPontosSRT.push(pontoSRT);
    }
    return novosPontosSRT
  }
}
function printEixo3d(){
  let eixoXSRU = [[0, 0, 0, 1], [10, 0, 0, 1]];
  let eixoYSRU = [[0, 0, 0, 1], [0, 10, 0, 1]];
  let eixoZSRU = [[0, 0, 0, 1], [0, 0, 10, 1]];
  
  eixoXSRT = eixoPontosSRUtoSRT(eixoXSRU);
  eixoYSRT = eixoPontosSRUtoSRT(eixoYSRU);
  eixoZSRT = eixoPontosSRUtoSRT(eixoZSRU);
  
  if (eixoBool) {
    drawLine(eixoXSRT[0][0], eixoXSRT[0][1], eixoXSRT[1][0], eixoXSRT[1][1], color='blue');
    drawLine(eixoYSRT[0][0], eixoYSRT[0][1], eixoYSRT[1][0], eixoYSRT[1][1], color='blue');
    drawLine(eixoZSRT[0][0], eixoZSRT[0][1], eixoZSRT[1][0], eixoZSRT[1][1], color='blue');
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('X', eixoXSRT[1][0], eixoXSRT[1][1]);
    ctx.fillText('Y', eixoYSRT[1][0], eixoYSRT[1][1]);
    ctx.fillText('Z', eixoZSRT[1][0], eixoZSRT[1][1]);
  } 
}

/// FUNCOES GERAIS (FOR EM VETOR DE MALHAS)
function updateVetMalhas() {
  /*
  for (let i = 0; i < vetMalha.length; i++) {
    vetMalha[i].updateValores();
  }//*/
  drawMalhas(vetMalha);
}

function drawMalhas(vetMalha) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  printEixo3d();
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    let gridMalha = malha.gridMalha;
    for (let j = 0; j < gridMalha.length; j++) {
      let pontos = gridMalha[j];
      for (let k = 0; k < pontos.length - 1; k++) {
        let ponto1 = pontos[k];
        let ponto2 = pontos[k + 1];
        drawLine(ponto1[0], ponto1[1], ponto2[0], ponto2[1], color='black');
      }
    }
  }
}

{//////// VARIRAVEIS GLOBAIS ////////////////
var visao = 'axonometrica';
var vetMalha = []

/// camera 
var xMin = -20;
var xMax = 20;
var yMin = -15;
var yMax = 15;
var uMin = 0;
var uMax = 1099;
var vMin = 0;
var vMax = 699;
var dp = 40;
var viewUp = [0, 1, 0];
var vetVrp = [25, 15, 80];
var vetP = [20, 10, 25];

// transformaçoes
var rotX = 0;
var rotY = 0;
var rotZ = 0;

var scl = 1.0;

var translX = 0;
var translY = 0;
var translZ = 0;

//eixo
eixoBool = true;
} ////////////////////////////////////////////////

{//////// FUNCOES MATEMATICAS ////////////////////////////////////////////////
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
function matriz44x41(matrix4x4, ponto) {
  let matrix4x1 = [ponto[0], ponto[1], ponto[2], fatH];
  const result = Array(4).fill(0);
  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          result[i] += matrix4x4[i][j] * matrix4x1[j];
      }
  }
  return result; 
}
function fatorHomogeneo(vetor) {
  return novoVetor = [vetor[0]/vetor[3], vetor[1]/vetor[3], vetor[2], vetor[3]];
}
}/////////////////////////////////////////////////////////////////////

{//////// PROJECAO /////////////////////////////////////////////////
// PONTO = [x, y, z, 1] 

function projPersp(ponto) { 
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

  let matrizR = [
    [vetU[0], vetU[1], vetU[2], 0,],
    [vetVunitario[0], vetVunitario[1], vetVunitario[2], 0],
    [vetNunitario[0], vetNunitario[1], vetNunitario[2], 0],
    [0, 0, 0, 1]
  ];
  
  let matrizT = 
  [
    [1, 0, 0, -vetVrp[0]],
    [0, 1, 0, -vetVrp[1]],
    [0, 0, 1, -vetVrp[2]],
    [0, 0, 0, 1]
  ]
  
  let matrizPersp = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, ((-(1))/dp), 0]
  ];
  
  let matrizJP = [
    [((uMax-uMin)/(xMax-xMin)), 0, 0, ((-(xMin) * ((uMax-uMin)/(xMax-xMin))) + uMin)],
    [0, ((vMin-vMax)/(yMax-yMin)), 0, (((yMin) * ((vMax-vMin)/(yMax-yMin))) + vMax)],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  
  let matrizSruSrc = matriz44(matrizR, matrizT);
  let matrizSruSrt = matriz44(matriz44(matrizJP, matrizPersp), matrizSruSrc);
  pontoASRT = matriz44x41(matrizSruSrt,ponto);
  novoPonto = fatorHomogeneo(pontoASRT);
  return novoPonto;
};
function projAxonometrica(ponto) {
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

  let matrizR = [
    [vetU[0], vetU[1], vetU[2], 0,],
    [vetVunitario[0], vetVunitario[1], vetVunitario[2], 0],
    [vetNunitario[0], vetNunitario[1], vetNunitario[2], 0],
    [0, 0, 0, 1]
  ];
  
  let matrizT = 
  [
    [1, 0, 0, -vetVrp[0]],
    [0, 1, 0, -vetVrp[1]],
    [0, 0, 1, -vetVrp[2]],
    [0, 0, 0, 1]
  ]
  
  let matrizAxono = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];

  let matrizJP = [
    [((uMax-uMin)/(xMax-xMin)), 0, 0, ((-(xMin) * ((uMax-uMin)/(xMax-xMin))) + uMin)],
    [0, ((vMin-vMax)/(yMax-yMin)), 0, (((yMin) * ((vMax-vMin)/(yMax-yMin))) + vMax)],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  
  let matrizSruSrc = matriz44(matrizR, matrizT);
  let matrizSruSrt = matriz44(matriz44(matrizJP, matrizAxono), matrizSruSrc);
  pontoASRT = matriz44x41(matrizSruSrt,ponto);

  return pontoASRT;
};

}/////////////////////////////////////////////////////////////////////

{//////// TRANSFORMACAO ////////////////////////////////////////////////

function rotacao(pontos) {
  let centrX = 0;
  let centrY = 0;
  let centrZ = 0;
  for (let i = 0; i < pontos.length; i++) {
    centrX += pontos[i][0];
    centrY += pontos[i][1];
    centrZ += pontos[i][2]; 
  };
  centrX = centrX / pontos.length;
  centrY = centrY / pontos.length;
  centrZ = centrZ / pontos.length;
  centroide = [centrX, centrY, centrZ, 1];

  function translN(pontoN) {
    let pontoTranslado = [
      [1, 0, 0, -centroide[0]],
      [0, 1, 0, -centroide[1]],
      [0, 0, 1, -centroide[2]],
      [0, 0, 0, 1]
    ];
    return matriz44x41(pontoTranslado, pontoN);
  }

  function translP(pontoN) {
    let pontoTranslado = [
      [1, 0, 0, centroide[0]],
      [0, 1, 0, centroide[1]],
      [0, 0, 1, centroide[2]],
      [0, 0, 0, 1]
    ];
    return matriz44x41(pontoTranslado, pontoN);
  }
  
  function rotacaoX(pontoX) {
    let angulo = rotX  * (Math.PI / 180);   
    let matrizRotacao = [
      [1, 0, 0, 0],
      [0, Math.cos(angulo), -Math.sin(angulo), 0],
      [0, Math.sin(angulo), Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];

    return matriz44x41(matrizRotacao, pontoX);
  }

  function rotacaoY(pontoY) {
    let angulo = rotY * (Math.PI / 180);
    let matrizRotacao = [
      [Math.cos(angulo), 0, Math.sin(angulo), 0],
      [0, 1, 0, 0],
      [-Math.sin(angulo), 0, Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];
    return matriz44x41(matrizRotacao, pontoY);
  }

  function rotacaoZ(pontoZ) {
    let angulo = rotZ * (Math.PI / 180);;
    let matrizRotacao = [
      [Math.cos(angulo), -Math.sin(angulo), 0, 0],
      [Math.sin(angulo), Math.cos(angulo), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
    return matriz44x41(matrizRotacao, pontoZ);
  }
  let pontosRotacionado = [];
  for (let i = 0; i < pontos.length; i++) {
    let ponto = pontos[i];
    ponto = translN(ponto);
    ponto = rotacaoX(ponto);
    ponto = rotacaoY(ponto);
    ponto = rotacaoZ(ponto);
    ponto = translP(ponto);
    pontosRotacionado.push(ponto);
  }
  return pontosRotacionado; 
};

function translacao(pontos) {

  let matrizT = [
    [1, 0, 0, translX],
    [0, 1, 0, translY],
    [0, 0, 1, translZ],
    [0, 0, 0, 1]
  ];

  let pontosTransladados = [];
  for (let i = 0; i < pontos.length; i++) {
    let ponto = pontos[i];
    let pontoTransladado = matriz44x41(matrizT, ponto);
    pontosTransladados.push(pontoTransladado);
  }

  return pontosTransladados;
};

}/////////////////////////////////////////////////////////////////////

/*
let fatH= 1;
let ponto1 = [0,0,4, fatH];
let ponto2 = [-1,0,3, fatH];
let ponto3 = [0,0,1, fatH];
let ponto4 = [1,0,3, fatH];
//*/


///// teste 
let fatH = 1;
let ponto1 = [21.2, 0.7, 42.3, 1];
let ponto2 = [34.1, 3.4, 27.2, 1];
let ponto3 = [18.8, 5.6, 14.6, 1];
let ponto4 = [5.9, 2.9, 29.7, 1];
let pontosMalha = [ponto1, ponto2, ponto3, ponto4]
malha1 = new malha(pontosMalha, 10, 4, 2222);
vetMalha.push(malha1);

ponto1 = [15.2, 0.7, 42.3, 1];
ponto2 = [40.1, 3.4, 27.2, 1];
ponto3 = [20.8, 5.6, 14.6, 1];
ponto4 = [10, 2.9, 29.7, 1];
pontosMalha = [ponto1, ponto2, ponto3, ponto4]


malha2 = new malha(pontosMalha, 10, 8, 1111);
vetMalha.push(malha2);

drawMalhas(vetMalha);

{////////////////////////////////////////// HTML //////////////////////////////////////////

document.getElementById('aplicarBtn').addEventListener('click', function () {
  visao = document.getElementById('visao').value;
  updateVetMalhas();
});

function onFieldChange() {
  xVrp = parseInt(document.getElementById('xVrp').value) || 0;
  yVrp = parseInt(document.getElementById('yVrp').value) || 0;
  zVrp = parseInt(document.getElementById('zVrp').value) || 0;
  vetVrp = [xVrp, yVrp, zVrp];

  xP = parseInt(document.getElementById('xP').value) || 0;
  yP = parseInt(document.getElementById('yP').value) || 0;
  zP = parseInt(document.getElementById('zP').value) || 0;
  vetP = [xP, yP, zP];

  dp = parseInt(document.getElementById('dpValue').value) || 0;

  rotX = parseInt(document.getElementById('xRot').value) || 0;
  rotY = parseInt(document.getElementById('yRot').value) || 0;
  rotZ = parseInt(document.getElementById('zRot').value) || 0;

  selectedMalha.scl_malha = parseFloat(document.getElementById('scl').value) || 0;
  console.log(selectedMalha.scl_malha);
  

  translX = parseFloat(document.getElementById('translX').value) || 0;
  translY = parseFloat(document.getElementById('translY').value) || 0;
  translZ = parseFloat(document.getElementById('translZ').value) || 0;

  eixoBool = document.getElementById('eixo3d').checked;
  updateVetMalhas();
}

// Adicionando os listeners para os campos
document.getElementById('xVrp').addEventListener('input', onFieldChange);
document.getElementById('yVrp').addEventListener('input', onFieldChange);
document.getElementById('zVrp').addEventListener('input', onFieldChange);
document.getElementById('xP').addEventListener('input', onFieldChange);
document.getElementById('yP').addEventListener('input', onFieldChange);
document.getElementById('zP').addEventListener('input', onFieldChange);
document.getElementById('dpValue').addEventListener('input', onFieldChange);

document.getElementById('xRot').addEventListener('input', onFieldChange);
document.getElementById('yRot').addEventListener('input', onFieldChange);
document.getElementById('zRot').addEventListener('input', onFieldChange);

document.getElementById('scl').addEventListener('input', onFieldChange);

document.getElementById('translX').addEventListener('input', onFieldChange);
document.getElementById('translY').addEventListener('input', onFieldChange);
document.getElementById('translZ').addEventListener('input', onFieldChange);

document.getElementById('eixo3d').addEventListener('input', onFieldChange);


// Seleciona o elemento <select> e o elemento para exibir a descrição
const selectMalha = document.getElementById("malhaSelecionada");
const malhaDescricao = document.getElementById("malhaDescricao");

// Seleciona os inputs de rotação
const xRotInput = document.getElementById("xRot");
const yRotInput = document.getElementById("yRot");
const zRotInput = document.getElementById("zRot");
const sclInput = document.getElementById("scl");

// Função para atualizar os valores de rotação nos inputs
function atualizarInputsMalha(malha) {
  xRotInput.value = malha.rotX_malha;
  yRotInput.value = malha.rotY_malha;
  zRotInput.value = malha.rotZ_malha;
  sclInput.value = malha.scl_malha;
}

// Preenche o seletor com as opções de malha
vetMalha.forEach((malha, index) => {
  let option = document.createElement("option");
  option.value = index;  // O valor pode ser um índice ou outro identificador único
  option.textContent = `Malha ${index + 1}`;  // Exibe o nome da malha
  selectMalha.appendChild(option);
});

// Define a primeira malha (vetMalha[0]) como selecionada por padrão
selectMalha.selectedIndex = 0; // Seleciona a primeira opção
var selectedMalha = vetMalha[0];
malhaDescricao.textContent = vetMalha[0].desc; // Exibe a descrição da primeira malha
atualizarInputsMalha(vetMalha[0]); // Atualiza os inputs de rotação com os valores da primeira malha

// Adiciona um evento para exibir a descrição e atualizar os inputs de rotação
selectMalha.addEventListener("change", () => {
  const selectedIndex = selectMalha.value; // Índice da malha selecionada
  var selectedMalha = vetMalha[selectedIndex]; // Malha selecionada
  malhaDescricao.textContent = selectedMalha.desc; // Exibe a descrição
  atualizarInputsMalha(selectedMalha); // Atualiza os inputs de rotação
});

}/////////////////////////////////////////////////////////////////////////////////////////


