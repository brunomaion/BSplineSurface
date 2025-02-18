class malha {
  constructor(pontosdamalha, drawPontosControle) {
    //TRANSFORMACOES
    this.p1 = pontosdamalha[0];
    this.p2 = pontosdamalha[1];
    this.p3 = pontosdamalha[2];
    this.p4 = pontosdamalha[3];
    
    this.scl = 1.0;
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.translX = 0;
    this.translY = 0;
    this.translZ = 0;  

    this.mMalha = 5;
    this.nMalha = 5;

    this.pontosSRU = [this.p1, this.p2, this.p3, this.p4];
    this.gridControleSRU = this.matrizPontosControle(this.pontosSRU, this.mMalha , this.nMalha);
    this.gridControleSRT = this.pipelineMatrizSruSrt(this.gridControleSRU);
    this.gridBsplineSRU = createGridBspline(this.gridControleSRU);
    this.gridBsplineSRT = this.pipelineMatrizSruSrt(this.gridBsplineSRU);
    this.visibilidadeMalha = false;
    this.visibilidadePC = true;
  };

  debugPrint() {
  };


  updatePC() {
    this.gridControleSRU = this.matrizPontosControle(this.pontosSRU, this.mMalha , this.nMalha);
    this.gridControleSRT = this.pipelineMatrizSruSrt(this.gridControleSRU);
    this.updateMalha();
  };

  updateMalha() {
    this.gridControleSRT = this.pipelineMatrizSruSrt(this.gridControleSRU);
    this.gridBsplineSRU = createGridBspline(this.gridControleSRU);
    this.gridBsplineSRT = this.pipelineMatrizSruSrt(this.gridBsplineSRU);
    this.debugPrint();
  };
  
  escala(pontos) {
    let matrizS = [
      [this.scl, 0, 0, 0],
      [0, this.scl, 0, 0],
      [0, 0, this.scl, 0],
      [0, 0, 0, 1]
    ];
    let pontosEscalados = [];
    for (let i = 0; i < pontos.length; i++) {
      let ponto = pontos[i];
      let pontoEscalado = matriz44x41(matrizS, ponto);
      pontosEscalados.push(pontoEscalado);
    }
    return pontosEscalados;

  };

  rotacao(pontos) {
    let p1 = this.p1;
    let p2 = this.p2;
    let p3 = this.p3;
    let p4 = this.p4;
    
    let var_rotacaoX = this.rotX * (Math.PI / 180);
    let var_rotacaoY = this.rotY * (Math.PI / 180);
    let var_rotacaoZ = this.rotZ * (Math.PI / 180);
  
    let centroideX = (p1[0] + p2[0] + p3[0] + p4[0]) / 4;
    let centroideY = (p1[1] + p2[1] + p3[1] + p4[1]) / 4;
    let centroideZ = (p1[2] + p2[2] + p3[2] + p4[2]) / 4;

    function translN(pontoTN) {
      let matrizTranslado = [
        [1, 0, 0, -centroideX],
        [0, 1, 0, -centroideY],
        [0, 0, 1, -centroideZ],
        [0, 0, 0, 1]
      ];
      return matriz44x41(matrizTranslado, pontoTN);
    }
  
    function translP(pontoTP) {
      let matrizTranslado = [
        [1, 0, 0, centroideX],
        [0, 1, 0, centroideY],
        [0, 0, 1, centroideZ],
        [0, 0, 0, 1]
      ];
      return matriz44x41(matrizTranslado, pontoTP);
    }
    
    function rotacaoX(pontoY) {
      let angulo = var_rotacaoX;
      let matrizRotacao = [
        [1, 0, 0, 0],
        [0, Math.cos(angulo), -Math.sin(angulo), 0],
        [0, Math.sin(angulo), Math.cos(angulo), 0],
        [0, 0, 0, 1]
      ];
      return matriz44x41(matrizRotacao, pontoY);
    }
  
    function rotacaoY(pontoY) {
      let angulo = var_rotacaoY;
      let matrizRotacao = [
        [Math.cos(angulo), 0, Math.sin(angulo), 0],
        [0, 1, 0, 0],
        [-Math.sin(angulo), 0, Math.cos(angulo), 0],
        [0, 0, 0, 1]
      ];
      return matriz44x41(matrizRotacao, pontoY);
    }
  
    function rotacaoZ(pontoZ) {
      let angulo = var_rotacaoZ;
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
      ponto = rotacaoZ(ponto);
      ponto = rotacaoY(ponto);
      ponto = rotacaoX(ponto);
      ponto = translP(ponto);
      pontosRotacionado.push(ponto);
    }
    return pontosRotacionado; 
  };
  
  translacao(pontos) {
  
    let matrizT = [
      [1, 0, 0, this.translX],
      [0, 1, 0, this.translY],
      [0, 0, 1, this.translZ],
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

  matrizPontosControle(pontos, m, n) {
    function calculoTaxaPontos(p0, p1, x) {
        let taxaX = (p1[0] - p0[0]) / (x - 1);
        let taxaY = (p1[1] - p0[1]) / (x - 1);
        let taxaZ = (p1[2] - p0[2]) / (x - 1);
        return [taxaX, taxaY, taxaZ];
    }
    
    function calculoVetorPontos(p0, p1, x) {
        let vetor = [];
        let [taxaX, taxaY, taxaZ] = calculoTaxaPontos(p0, p1, x);
        vetor.push(p0);
        let y = x - 2;
        let pX = p0[0];
        let pY = p0[1];
        let pZ = p0[2];
        for (let i = 0; i < y; i++) {
            pX += taxaX;
            pY += taxaY;
            pZ += taxaZ;
            let ponto = [pX, pY, pZ];
            vetor.push(ponto);
        }
        vetor.push(p1);
        return vetor;
    }

    let p1 = pontos[0];
    let p2 = pontos[1];
    let p3 = pontos[2];
    let p4 = pontos[3];
    let vetM1 = calculoVetorPontos(p1, p2, m);
    let vetM2 = calculoVetorPontos(p4, p3, m);

    let matrizPontosControleControle = [];
    for (let i = 0; i < vetM1.length; i++) {
        let ponto = calculoVetorPontos(vetM1[i], vetM2[i], n);
        matrizPontosControleControle.push(ponto);
    }
    return matrizPontosControleControle;
  }
  
  pipelineSruSrt(pSRU) {
    pSRU = addFatH(pSRU);
    let pontosEscalados = this.escala(pSRU);
    let pontosRotacionados = this.rotacao(pontosEscalados);
    let pontosTransladados = this.translacao(pontosRotacionados);
    let pontosSRT = pontosSRUtoSRT(pontosTransladados);
    pontosSRT = removeFatH(pontosSRT);
    return pontosSRT;
  };

  pipelineMatrizSruSrt(matriz) {
    let novaMatriz = [];
    for (let i = 0; i < matriz.length; i++) {
      novaMatriz.push(this.pipelineSruSrt(matriz[i]));  
    };
    return novaMatriz;
  };
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
  
  var xVrp = document.getElementById('xVrp').value || 0;
  var yVrp = document.getElementById('yVrp').value || 0;
  var zVrp = document.getElementById('zVrp').value || 0;
  
  var vetVrp = [xVrp,yVrp,zVrp];
  
  var xP = document.getElementById('xP').value || 0;
  var yP = document.getElementById('yP').value || 0;
  var zP = document.getElementById('zP').value || 0;
  
  var vetP = [xP,yP,zP];
  var fatH = 1;
  
  //Tamanho dos pontos de controle
  var lenPontosControle = document.getElementById('tamPC').value || 4;
  
  //Index do ponto de controle selecionado
  var indicePCsele = [parseInt(document.getElementById('indexIPC').value) || 0,  
                      parseInt(document.getElementById('indexJPC').value) || 0]; 
    
  //eixo
  eixoBool = true;
  eixoPCverde = true;

  var numSegmentos = parseInt(document.getElementById('numSegmentos').value) || 1;

} ////////////////////////////////////////////////
  
{//////// FUNCOES BASICAS ////////////////////////////////////////////////

function addFatH(vetor) {
  let novoVetor = vetor.map((ponto) => [...ponto, this.fatH]);
  return novoVetor;
}

function removeFatH(vetor) {
  let novoVetor = vetor.map((ponto) => ponto.slice(0, -1));
  return novoVetor;
}

}/////////////////////////////////////////////////////////////////////

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
  let listaResultado = Array(4).fill(0);
  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          listaResultado[i] += matrix4x4[i][j] * ponto[j];
      }
  }
  return listaResultado; 
}

function fatorHomogeneo(vetor) {
  return novoVetor = [vetor[0]/vetor[3], vetor[1]/vetor[3], vetor[2], vetor[3]];
}

}/////////////////////////////////////////////////////////////////////

{/// FUNCOES /////////////////////////////////////////

function closedBspline(pontosDeControle) {
  // Repete os primeiros pontos no final para fechar a curva
  let extendedpontosDeControle = [
      ...pontosDeControle,
      pontosDeControle[0], // Repete o primeiro ponto no final
      pontosDeControle[1], // Repete o segundo ponto no final
      pontosDeControle[2]  // Repete o terceiro ponto no final (dependendo do grau da B-spline)
  ];
  return extendedpontosDeControle;
}

function clampingBspline(pontosDeControle) {
    let extendedpontosDeControle = [
        pontosDeControle[0], pontosDeControle[0], // Repete o primeiro ponto
        ...pontosDeControle,
        pontosDeControle[pontosDeControle.length - 1], pontosDeControle[pontosDeControle.length - 1] // Repete o último ponto
    ];
    return extendedpontosDeControle;
}

function calculateBspline(pontosDeControle) {
  //pontosDeControle = clampingBspline(pontosDeControle);
  /*
  if (document.getElementById('clamped').checked) {
      pontosDeControle = clampingBspline(pontosDeControle);
  }

  if (document.getElementById('closed').checked) {
      pontosDeControle = closedBspline(pontosDeControle);
  }*/


  let nSegmentos = 1;
  let pontosDaCurva = [];

  for (let i = 1; i < pontosDeControle.length - 2; i++) {
      let [xA, xB, xC, xD] = [
          pontosDeControle[i - 1][0], 
          pontosDeControle[i][0], 
          pontosDeControle[i + 1][0], 
          pontosDeControle[i + 2][0]
      ];
      let [yA, yB, yC, yD] = [
          pontosDeControle[i - 1][1], 
          pontosDeControle[i][1], 
          pontosDeControle[i + 1][1], 
          pontosDeControle[i + 2][1]
      ];
      let [zA, zB, zC, zD] = [
          pontosDeControle[i - 1][2], 
          pontosDeControle[i][2], 
          pontosDeControle[i + 1][2], 
          pontosDeControle[i + 2][2]
      ];
      
      let a3 = (-xA + 3 * (xB - xC) + xD) / 6; 
      let b3 = (-yA + 3 * (yB - yC) + yD) / 6;
      let c3 = (-zA + 3 * (zB - zC) + zD) / 6;

      let a2 = (xA - 2 * xB + xC) / 2;
      let b2 = (yA - 2 * yB + yC) / 2;
      let c2 = (zA - 2 * zB + zC) / 2;
      
      let a1 = (xC - xA) / 2;
      let b1 = (yC - yA) / 2;
      let c1 = (zC - zA) / 2;

      let a0 = (zA + 4 * xB + xC) / 6;
      let b0 = (yA + 4 * yB + yC) / 6;
      let c0 = (zA + 4 * zB + zC) / 6;
      
      

      for (let j = 0; j <= nSegmentos; j++) {
          let t = j / nSegmentos;
          let x = ((a3 * t + a2) * t + a1) * t + a0;
          let y = ((b3 * t + b2) * t + b1) * t + b0;
          let z = ((c3 * t + c2) * t + c1) * t + c0;
          pontosDaCurva.push([x, y, z]);
      }
  }

  return pontosDaCurva;
}


function createGridBspline(gridSRUPontosControle){
  let gridBspline = [];
  let auxPontosDeControle = [];
  let lengthI = gridSRUPontosControle.length;
  let lengthJ = gridSRUPontosControle[0].length;
  //PARA N
  // PEGAR OS INDICES PARA LINHAS
  for (let i = 1; i < lengthI-1; i++) {
      auxPontosDeControle = [];
      for (let j = 0; j < lengthJ; j++) {
          auxPontosDeControle.push(gridSRUPontosControle[i][j]);
      }
      console.log('Pontos de controle',auxPontosDeControle);

      let pontosCurva = calculateBspline(auxPontosDeControle);
      console.log('Pontos da curva',pontosCurva);
      
      gridBspline.push(calculateBspline(auxPontosDeControle));
  }
  console.log("grid ",gridBspline);
  
  return gridBspline;
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

function printEixo3d(){
  let eixoXSRU = [[0, 0, 0, 1], [10, 0, 0, 1]];
  let eixoYSRU = [[0, 0, 0, 1], [0, 10, 0, 1]];
  let eixoZSRU = [[0, 0, 0, 1], [0, 0, 10, 1]];
  
  eixoXSRT = eixopontosSRUtoSRT(eixoXSRU);
  eixoYSRT = eixopontosSRUtoSRT(eixoYSRU);
  eixoZSRT = eixopontosSRUtoSRT(eixoZSRU);
  
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



function matrizPontosControle(pontos, m, n) {
  function calculoTaxaPontos(p0, p1, x) {
      let taxaX = (p1[0] - p0[0]) / (x - 1);
      let taxaY = (p1[1] - p0[1]) / (x - 1);
      let taxaZ = (p1[2] - p0[2]) / (x - 1);
      return [taxaX, taxaY, taxaZ];
  }
  
  function calculoVetorPontos(p0, p1, x) {
      let vetor = [];
      let [taxaX, taxaY, taxaZ] = calculoTaxaPontos(p0, p1, x);
      vetor.push(p0);
      let y = x - 2;
      let pX = p0[0];
      let pY = p0[1];
      let pZ = p0[2];
      for (let i = 0; i < y; i++) {
          pX += taxaX;
          pY += taxaY;
          pZ += taxaZ;
          let ponto = [pX, pY, pZ];
          vetor.push(ponto);
      }
      vetor.push(p1);
      return vetor;
  }

  let p1 = pontos[0];
  let p2 = pontos[1];
  let p3 = pontos[2];
  let p4 = pontos[3];
  let vetM1 = calculoVetorPontos(p1, p2, m);
  let vetM2 = calculoVetorPontos(p4, p3, m);

  let matrizPontosControleControle = [];
  for (let i = 0; i < vetM1.length; i++) {
      let ponto = calculoVetorPontos(vetM1[i], vetM2[i], n);
      matrizPontosControleControle.push(ponto);
  }
  return matrizPontosControleControle;
}

function drawMalha(gridControle) {
  for (let i = 0; i < gridControle.length; i++) {
      for (let j = 0; j < gridControle[i].length - 1; j++) {
          drawLine(gridControle[i][j][0], gridControle[i][j][1], gridControle[i][j + 1][0], gridControle[i][j + 1][1]);
      }
  }
  for (let j = 0; j < gridControle[0].length; j++) {
      for (let i = 0; i < gridControle.length - 1; i++) {
          drawLine(gridControle[i][j][0], gridControle[i][j][1], gridControle[i + 1][j][0], gridControle[i + 1][j][1]);
      }
  }


}

function drawGridBspline(gridBspline) {
  for (let i = 0; i < gridBspline.length; i++) {
    for (let j = 0; j < gridBspline[i].length - 1; j++) {
      // Conecta horizontalmente
      drawLine(gridBspline[i][j][0], gridBspline[i][j][1], gridBspline[i][j + 1][0], gridBspline[i][j + 1][1], 'red');
    }
  }

  for (let j = 0; j < gridBspline[0].length; j++) {
    for (let i = 0; i < gridBspline.length - 1; i++) {
      // Conecta verticalmente
      drawLine(gridBspline[i][j][0], gridBspline[i][j][1], gridBspline[i + 1][j][0], gridBspline[i + 1][j][1], 'red');
    }
  }
}

function drawPontosControle(gridControle) {
  for (let i = 0; i < gridControle.length; i++) {
    for (let j = 0; j < gridControle[i].length; j++) {
        drawCircle(gridControle[i][j][0], gridControle[i][j][1], lenPontosControle, 'red');
    }
  }
}

function drawCircle(x, y, radius, color) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawMalhas(vetMalha) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  printEixo3d();
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];

    if (malha.visibilidadeMalha) {
      drawMalha(malha.gridControleSRT);
    }
    if (malha.visibilidadePC) {
      drawPontosControle(malha.gridControleSRT);
    }
    drawGridBspline(malha.gridBsplineSRT);
  }
}

function maximoPCdaMalha([i, j]){
  if (i > selectedMalha.mMalha || j > selectedMalha.nMalha) {
    return [0, 0];
  }
  return [i, j];
}

function drawPCselecionado() {
  if (eixoPCverde) {
    indicePCsele = maximoPCdaMalha(indicePCsele);
    let i = indicePCsele[0];
    let j = indicePCsele[1];
    gridObjeto = selectedMalha.gridControleSRT;
    drawCircle(gridObjeto[i][j][0], gridObjeto[i][j][1], lenPontosControle, 'green');
  }
}

function updateVetMalha() {
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    malha.updateMalha();
  }
}

function atualizarPCSelecionado(click){
  let matriz = selectedMalha.gridControleSRT;
  let menorDistancia = Infinity;
  let pontoMaisPerto = [];
  // CACAR PONTO MAIS PERTO NO SRT
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      let ponto = matriz[i][j];
      let distancia = Math.sqrt((click[0] - ponto[0]) ** 2 + (click[1] - ponto[1]) ** 2);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        pontoMaisPerto = ponto;
        indicePCsele = [i, j];
      }
    }
  }
  let pontoMaisPertoSRU = selectedMalha.gridControleSRU[indicePCsele[0]][indicePCsele[1]];
  return pontoMaisPertoSRU;
}

function updateVetMalhaPC() {
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    malha.updatePC();
  }
}

function updateProgramaTotal() {  
  drawMalhas(vetMalha); //renderizar 
  drawPCselecionado();
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

{//////// TRANSFORMACAO DE TELA////////////////////////////////////////////////

function pontosSRUtoSRT(pontos) {
  let novosPontosSRT = [];
  if (visao == 'perspectiva') {
    for (let i = 0; i < pontos.length; i++) {
      let pontoSRU = pontos[i];
      let pontoSRT = projPersp(pontoSRU);
      novosPontosSRT.push(pontoSRT);
    }
    novosPontosSRT = removeFatH(novosPontosSRT);
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

function eixopontosSRUtoSRT(pontos) {
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


}/////////////////////////////////////////////////////////////////////

/*
let fatH= 1;
let ponto1 = [0,0,4, fatH];
let ponto2 = [-1,0,3, fatH];
let ponto3 = [0,0,1, fatH];
let ponto4 = [1,0,3, fatH];
//*/

///// teste 

let m = 4
let n = 4

var vetMalha = [];

let ponto1 = [0,10,0];
let ponto2 = [0,15,0];
let ponto3 = [10,15,0];
let ponto4 = [10,10,0];
let pontosMalha = [ponto1, ponto2, ponto3, ponto4]
malha1 = new malha(pontosMalha, m, n, 1111);
vetMalha.push(malha1);

ponto1 = [0,0,0];
ponto2 = [0,0,10];
ponto3 = [10, 0, 10];
ponto4 = [10, 0, 0];
pontosMalha = [ponto1, ponto2, ponto3, ponto4]

malha2 = new malha(pontosMalha, m, n, 2222);
vetMalha.push(malha2);


//// OUTRAS VARIAVEIS GLOBAIS
var selectedMalha = vetMalha[0];
var pcSelecionado = selectedMalha.gridControleSRU[indicePCsele[0]][indicePCsele[1]];


/// ATUALIZAÇAO /////////////////


updateProgramaTotal();

{////////////////////////////////////////// HTML //////////////////////////////////////////

document.getElementById('aplicarBtn').addEventListener('click', function () {
  visao = document.getElementById('visao').value;
  updateVetMalha();
  drawMalhas(vetMalha);
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

  selectedMalha.rotX = parseInt(document.getElementById('xRot').value) || 0;
  selectedMalha.rotY = parseInt(document.getElementById('yRot').value) || 0;
  selectedMalha.rotZ = parseInt(document.getElementById('zRot').value) || 0;

  selectedMalha.scl = parseFloat(document.getElementById('scl').value) || 0;
  selectedMalha.translX = parseFloat(document.getElementById('translX').value) || 0;
  selectedMalha.translY = parseFloat(document.getElementById('translY').value) || 0;
  selectedMalha.translZ = parseFloat(document.getElementById('translZ').value) || 0;

  eixoBool = document.getElementById('eixo3d').checked;
  eixoPCverde = document.getElementById('pcVerde').checked;
  lenPontosControle = document.getElementById('tamPC').value || 4;

  selectedMalha.visibilidadeMalha = document.getElementById('visibilidadeMalha').checked;
  selectedMalha.visibilidadePC = document.getElementById('visibilidadePC').checked;


  selectedMalha.gridControleSRU[indicePCsele[0]][indicePCsele[1]] = 
                    [parseFloat(document.getElementById('xPC').value) || 0,
                    parseFloat(document.getElementById('yPC').value) || 0,
                    parseFloat(document.getElementById('zPC').value) || 0];


  numSegmentos = parseInt(document.getElementById('numSegmentos').value) || 1;
  
  updateVetMalha();
  updateProgramaTotal();
}

function onFieldChangePC() {
  // AQUI SO A MALHA INICIAL
  selectedMalha.p1[0] = parseFloat(document.getElementById('p1X').value) || 0;
  selectedMalha.p1[1] = parseFloat(document.getElementById('p1Y').value) || 0;
  selectedMalha.p1[2] = parseFloat(document.getElementById('p1Z').value) || 0;
  selectedMalha.p2[0] = parseFloat(document.getElementById('p2X').value) || 0;
  selectedMalha.p2[1] = parseFloat(document.getElementById('p2Y').value) || 0;
  selectedMalha.p2[2] = parseFloat(document.getElementById('p2Z').value) || 0;
  selectedMalha.p3[0] = parseFloat(document.getElementById('p3X').value) || 0;
  selectedMalha.p3[1] = parseFloat(document.getElementById('p3Y').value) || 0;
  selectedMalha.p3[2] = parseFloat(document.getElementById('p3Z').value) || 0;
  selectedMalha.p4[0] = parseFloat(document.getElementById('p4X').value) || 0;
  selectedMalha.p4[1] = parseFloat(document.getElementById('p4Y').value) || 0;
  selectedMalha.p4[2] = parseFloat(document.getElementById('p4Z').value) || 0;

  selectedMalha.mMalha = parseInt(document.getElementById('mPontos').value) || 0;
  selectedMalha.nMalha = parseInt(document.getElementById('nPontos').value) || 0;

  updateVetMalhaPC();
  updateProgramaTotal();
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
document.getElementById('tamPC').addEventListener('input', onFieldChange);
document.getElementById('pcVerde').addEventListener('input', onFieldChange);

document.getElementById('visibilidadeMalha').addEventListener('input', onFieldChange);
document.getElementById('visibilidadePC').addEventListener('input', onFieldChange);

document.getElementById('p1X').addEventListener('input', onFieldChangePC);
document.getElementById('p1Y').addEventListener('input', onFieldChangePC);
document.getElementById('p1Z').addEventListener('input', onFieldChangePC);
document.getElementById('p2X').addEventListener('input', onFieldChangePC);
document.getElementById('p2Y').addEventListener('input', onFieldChangePC);
document.getElementById('p2Z').addEventListener('input', onFieldChangePC);
document.getElementById('p3X').addEventListener('input', onFieldChangePC);
document.getElementById('p3Y').addEventListener('input', onFieldChangePC);
document.getElementById('p3Z').addEventListener('input', onFieldChangePC);
document.getElementById('p4X').addEventListener('input', onFieldChangePC);
document.getElementById('p4Y').addEventListener('input', onFieldChangePC);
document.getElementById('p4Z').addEventListener('input', onFieldChangePC);

document.getElementById('mPontos').addEventListener('input', onFieldChangePC);
document.getElementById('nPontos').addEventListener('input', onFieldChangePC);

document.getElementById('indexIPC').addEventListener('input', onFieldChange);
document.getElementById('indexJPC').addEventListener('input', onFieldChange);

document.getElementById('xPC').addEventListener('input', onFieldChange);
document.getElementById('yPC').addEventListener('input', onFieldChange);
document.getElementById('zPC').addEventListener('input', onFieldChange);

document.getElementById('numSegmentos').addEventListener('input', onFieldChange); 

// Seleciona o elemento <select> e o elemento para exibir a drawPontosControlerição
const selectMalha = document.getElementById("malhaSelecionada");
// Seleciona os inputs de rotação
const sclInput = document.getElementById("scl");

const rotXInput = document.getElementById("xRot");
const rotYInput = document.getElementById("yRot");
const rotZInput = document.getElementById("zRot");

const translXInput = document.getElementById("translX");
const translYInput = document.getElementById("translY");
const translZInput = document.getElementById("translZ");
const visibilidadeMalhaInput = document.getElementById("visibilidadeMalha");
const visibilidadePCInput = document.getElementById("visibilidadePC");

const p1InputX = document.getElementById("p1X");
const p1InputY = document.getElementById("p1Y");
const p1InputZ = document.getElementById("p1Z");
const p2InputX = document.getElementById("p2X");
const p2InputY = document.getElementById("p2Y");
const p2InputZ = document.getElementById("p2Z");
const p3InputX = document.getElementById("p3X");
const p3InputY = document.getElementById("p3Y");
const p3InputZ = document.getElementById("p3Z");
const p4InputX = document.getElementById("p4X");
const p4InputY = document.getElementById("p4Y");
const p4InputZ = document.getElementById("p4Z");

const mPontosInput = document.getElementById("mPontos");
const nPontosInput = document.getElementById("nPontos");

const indexIPCinput = document.getElementById("indexIPC");
const indexJPCinput = document.getElementById("indexJPC");

const xPCInput = document.getElementById("xPC");
const yPCInput = document.getElementById("yPC");
const zPCInput = document.getElementById("zPC");

// Função para atualizar os valores de rotação nos inputs
function atualizarInputsMalha(malha) {
  sclInput.value = malha.scl;
  rotXInput.value = malha.rotX;
  rotYInput.value = malha.rotY;
  rotZInput.value = malha.rotZ;
  translXInput.value = malha.translX;
  translYInput.value = malha.translY;
  translZInput.value = malha.translZ;
  visibilidadeMalhaInput.checked = malha.visibilidadeMalha;
  visibilidadePCInput.checked = malha.visibilidadePC;
  p1InputX.value = malha.p1[0];
  p1InputY.value = malha.p1[1];
  p1InputZ.value = malha.p1[2];
  p2InputX.value = malha.p2[0];
  p2InputY.value = malha.p2[1];
  p2InputZ.value = malha.p2[2];
  p3InputX.value = malha.p3[0];
  p3InputY.value = malha.p3[1];
  p3InputZ.value = malha.p3[2];
  p4InputX.value = malha.p4[0];
  p4InputY.value = malha.p4[1];
  p4InputZ.value = malha.p4[2];
  mPontosInput.value = malha.mMalha;
  nPontosInput.value = malha.nMalha;

  indexIPCinput.value = indicePCsele[0];
  indexJPCinput.value = indicePCsele[1];
  
  xPCInput.value = pcSelecionado[0];
  yPCInput.value = pcSelecionado[1];
  zPCInput.value = pcSelecionado[2];
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
atualizarInputsMalha(vetMalha[0]); // Atualiza os inputs de rotação com os valores da primeira malha
selectMalha.addEventListener("change", () => {
  const selectedIndex = selectMalha.value; // Índice da malha selecionada
  selectedMalha = vetMalha[selectedIndex]; // Atualiza a variável global
  atualizarInputsMalha(selectedMalha); // Atualiza os inputs de rotação
});

var clickPosition = [0, 0];

document.getElementById('viewport').addEventListener('click', function(event) {
  var canvas = document.getElementById('viewport');
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var clickPosition = [x, y];
  pcSelecionado = atualizarPCSelecionado(clickPosition);
  updateProgramaTotal();
  atualizarInputsMalha(selectedMalha);
});





}/////////////////////////////////////////////////////////////////////////////////////////
