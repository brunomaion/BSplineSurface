
class malha {

  constructor(pontosdamalha) {
    this.pontosSru = pontosdamalha;
    this.pontosSRT = this.pontosSRUtoSRT(this.pontosSru);
    this.listaArestas = 1;
    this.arestas = this.calcArestasIncremental(this.pontosSRT);
  }
  
  printPoligono() {
    //console.log(this.pontosSRT);
    //console.log(vetVrp);
    //console.log(vetP);
    //console.log(dp);
    
  }

  pontosSRUtoSRT(pontos) {
    let novosPontosSRT = [];

    pontos = rotacao(pontos);

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

  updateValores() {
    //console.log('atualizando valores');
    this.pontosSRT = this.pontosSRUtoSRT(this.pontosSru);
    this.printPoligono();
    this.draw();
  }

  calcArestasIncremental(pontos) {
    /////
  }

  draw() {
    const canvas = document.getElementById('viewport'); // Corrigido para o ID correto
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for (let i = 0; i < this.pontosSRT.length; i++) {
        let startPoint = this.pontosSRT[i];
        let endPoint = this.pontosSRT[(i + 1) % this.pontosSRT.length];
        ctx.moveTo(startPoint[0], startPoint[1]);
        ctx.lineTo(endPoint[0], endPoint[1]);
    }
    ctx.stroke();
}

}




//////// variaveis globais ////////////////////////////////////////
var visao = 'axonometrica';
var vetMalha = []

function drawVetMalhas() {
  for (let i = 0; i < vetMalha.length; i++) {
    vetMalha[i].draw();
  }
}

function updateVetMalhas() {
  for (let i = 0; i < vetMalha.length; i++) {
    vetMalha[i].updateValores();
  }
}

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



//////////// FUNCOES ////////////////////////////////////////////////
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
  //console.log(ponto);
  let matrix4x1 = [ponto[0], ponto[1], ponto[2], fatH];
  //console.log(matrix4x1);
  // Inicializa o vetor resultado 4x1
  const result = Array(4).fill(0);
  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          result[i] += matrix4x4[i][j] * matrix4x1[j];
      }
  }
  //console.log(result);
  return result; 
}
function fatorHomogeneo(vetor) {
  return novoVetor = [vetor[0]/vetor[3], vetor[1]/vetor[3], vetor[2], vetor[3]];
}
/////////////////////////////////////////////////////////////////////




//////// PROJECAO /////////////////////////////////////////////////
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
  //console.log(novoPonto);

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
  //console.log(pontoASRT);

  return pontoASRT;
};

//////// ROT ////////////////////////////////////////////////

function rotacao(pontos) {
  
  function rotacaoX(pontoX, angulo) {
    console.log('rotX: ', rotX);
    //angulo = grausParaRadianos(angulo);  // ✅ Converte para radianos
    console.log('angulo', angulo);
    console.log(Math.cos(angulo));
    console.log('pointX', pontoX);
    
    
    let matrizRotacao = [
      [1, 0, 0, 0],
      [0, Math.cos(angulo), -Math.sin(angulo), 0],
      [0, Math.sin(angulo), Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];
    console.log(matriz44x41(matrizRotacao, pontoX));
    
    return matriz44x41(matrizRotacao, pontoX);
  }

  function rotacaoY(pontoY, angulo) {
    angulo = grausParaRadianos(angulo);  // ✅ Converte para radianos
    let matrizRotacao = [
      [Math.cos(angulo), 0, Math.sin(angulo), 0],
      [0, 1, 0, 0],
      [-Math.sin(angulo), 0, Math.cos(angulo), 0],
      [0, 0, 0, 1]
    ];
    return matriz44x41(matrizRotacao, pontoY);
  }

  function rotacaoZ(pontoZ, angulo) {
    angulo = grausParaRadianos(angulo);  // ✅ Converte para radianos
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
    let x = pontos[i][0];
    let y = pontos[i][1];
    let z = pontos[i][2];
    //let ponto = [x, y, z, 1];
    let ponto = [rotacaoX(x, rotX), 
                  rotacaoY(y, rotY), 
                  rotacaoZ(z, rotZ), 1];

    pontosRotacionado.push(ponto);
  }

  return pontosRotacionado; 
}

/////////////////////////////////////////////////////////////////////

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
malha1 = new malha(pontosMalha);
vetMalha.push(malha1);
drawVetMalhas();


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

  xRot = parseInt(document.getElementById('xRot').value) || 0;
  console.log(xRot);
  
  yRot = parseInt(document.getElementById('yRot').value) || 0;
  zRot = parseInt(document.getElementById('zRot').value) || 0;

  //console.log('vetVrp:', vetVrp, 'vetP:', vetP, 'dp:', dp);
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
