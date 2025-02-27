class malha {
  constructor(pontosdamalha) {
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

    this.ka = 0.5;
    this.kd = 0.5;
    this.ks = 0.5;
    this.nIluminacao = 10;

    this.mMalha = 4;
    this.nMalha = 4;

    this.pontosSRU = [this.p1, this.p2, this.p3, this.p4];
    this.gridControleSRU = this.matrizPontosControle(this.pontosSRU, this.mMalha , this.nMalha);
    this.gridControleSRT = this.pipelineMatrizSruSrt(this.gridControleSRU);
    this.gridBsplineSRU = createGridBspline(this.gridControleSRU);
    this.facesBsplineSRU = this.createEstruturaFaces(this.gridBsplineSRU);
    this.visibilidadeGridControle = false;
    this.visibilidadePC = true;
  };

  debugPrint() {  
    console.log('Update' );
  };
  updateReset() {
    this.pontosSRU = [this.p1, this.p2, this.p3, this.p4];
    this.gridControleSRU = this.matrizPontosControle(this.pontosSRU, this.mMalha , this.nMalha)
    this.update();
  };
  update() {
    this.gridControleSRUtransf = this.pipelineTransformacao(this.gridControleSRU);
    this.gridControleSRT = this.pipelineMatrizSruSrt(this.gridControleSRUtransf);
    this.gridBsplineSRU = createGridBspline(this.gridControleSRUtransf);
    this.facesBsplineSRU = this.createEstruturaFaces(this.gridBsplineSRU);
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
    let ponto1 = this.p1;
    let ponto2 = this.p2;
    let ponto3 = this.p3;
    let ponto4 = this.p4;
    
    let var_rotacaoX = this.rotX * (Math.PI / 180);
    let var_rotacaoY = this.rotY * (Math.PI / 180);
    let var_rotacaoZ = this.rotZ * (Math.PI / 180);
  
    let centroideX = (ponto1[0] + ponto2[0] + ponto3[0] + ponto4[0]) / 4;
    let centroideY = (ponto1[1] + ponto2[1] + ponto3[1] + ponto4[1]) / 4;
    let centroideZ = (ponto1[2] + ponto2[2] + ponto3[2] + ponto4[2]) / 4;

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
  pipelineTransformacao(matriz) {
    let novaMatriz = [];
    for (let i = 0; i < matriz.length; i++) {
      let novoPonto = addFatH(matriz[i]);
      novoPonto = this.rotacao(novoPonto);
      novoPonto = this.translacao(novoPonto);
      novoPonto = this.escala(novoPonto);
      novoPonto = removeFatH(novoPonto);
      novaMatriz.push(novoPonto);  
    };
    return novaMatriz;
  };
  pipelineMatrizSruSrt(matriz) {
    let novaMatriz = [];
    for (let i = 0; i < matriz.length; i++) {
      let novoPonto = addFatH(matriz[i]);
      novoPonto = pontoSRUtoSRT(novoPonto);
      novoPonto = removeFatH(novoPonto);
      novaMatriz.push(novoPonto);  
    };
    return novaMatriz;
  };
  createEstruturaFaces(grid) {

    function calculaVetorMedioFaces(vFacesNormal){ //FACES COMPARTILHADAS
      let somaX = 0;
      let somaY = 0;
      let somaZ = 0;
      for (let i = 0; i < vFacesNormal.length; i++) {
        let normalUniFace = vFacesNormal[i].vetorNormalUnitario;
        somaX += normalUniFace[0];
        somaY += normalUniFace[1];
        somaZ += normalUniFace[2];
      }
      let vetorNormalMedio = [somaX / vFacesNormal.length, somaY / vFacesNormal.length, somaZ / vFacesNormal.length];

      return vetorNormalMedio;
    }

    function compararPontosFace(ponto, matriz) {
      let vetFacesCompartilhadas = [];
      for (let m = 0; m < matriz.length; i++) {
        for (let n = 0; n < matriz[m].length; n++) {
          if (ponto == matriz[m][n]) {
            vetFacesCompartilhadas.push(matriz[m][n]);
          }
        }
      }
      return vetFacesCompartilhadas;
    }

    let vetFaces = getFaces(grid);  
    let lenI = vetFaces.length;
    let vetFacesObj = [];

    // CONSTROI AS FACES SRU
    for (let i = 0; i < lenI; i++) {
        let faceObj = new faceClass(vetFaces[i]);
        vetFacesObj.push(faceObj);
    }    

    
    if (tipoSombreamento == 'Nenhum') {
      let newVetFacesObj = [];
      //CONSTROI AS FACES SRT 
      let lenArray = vetFacesObj.length;
      for (let i = 0; i < lenArray; i++) {
        let objFace = new faceClassCor(vetFacesObj[i]);
        newVetFacesObj.push(objFace);
      }
      //PINTOR
      newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
      return newVetFacesObj;
    };

    if (tipoSombreamento == 'Constante') {
      //CONSTROI AS FACES - NAO IMPORTA ORDEM
      let newVetFacesObj = [];
      //CONSTROI AS FACES SRT 
      let lenArray = vetFacesObj.length;
      for (let i = 0; i < lenArray; i++) {
        let objFace = new faceClassConstante(vetFacesObj[i], [this.ka, this.kd, this.ks, this.nIluminacao]);
        newVetFacesObj.push(objFace);
      }
      //PINTOR
      newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
      return newVetFacesObj;
    };

    if (tipoSombreamento == 'Gouraud') {
      let newVetFacesObj = []
      // FOR PARA CADA FACE testar os pontos e criar nova face
      for (let i = 0; i < lenI; i++) {
        let faceTestada = vetFacesObj[i];    
        let vetorNormalMedio = [];
        let pontosFaceTestada = faceTestada.pontos;
  
        //FOR PARA CADA PONTO DA FACE TESTADA
        for (let j = 0; j < pontosFaceTestada.length; j++) {
          let vetorNormalMedioPonto = [];
          let vetFacesCompartilhadas = [];
          let pontoTestado = pontosFaceTestada[j];
  
          //ADD a face em que o ponto está
          vetFacesCompartilhadas.push(faceTestada);
  
          //COMPARAR PONTO COM TODAS AS FACES
          for (let k = 0; k < vetFacesObj.length; k++) {
            let faceComparada = vetFacesObj[k];
            let pontosFaceComparada = faceComparada.pontos;
  
            if (faceTestada != faceComparada) {
              for (let l = 0; l < pontosFaceComparada.length; l++) {
                let pontoComparado = pontosFaceComparada[l];
                if (pontoTestado == pontoComparado) {
                  vetFacesCompartilhadas.push(faceComparada);
                }
              }
            }
          }
          vetorNormalMedioPonto = calculaVetorMedioFaces(vetFacesCompartilhadas);
          vetorNormalMedioPonto = vetorUnitario(vetorNormalMedioPonto);
          vetorNormalMedio.push(vetorNormalMedioPonto);
        }
        let faceObj = new faceClassGourad(faceTestada, vetorNormalMedio, [this.ka, this.kd, this.ks, this.nIluminacao]);
        newVetFacesObj.push(faceObj);
      }
  
      newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
      return newVetFacesObj;
    };
  }
}

class faceClass{
  constructor(pontos) {
    this.pontos = pontos; // [p1, p2, p3, p4] - pN = [x, y, z]
    this.centroide = this.calculaCentroide();
    this.distanciaPintor = this.calculaDistanciaPintor();
    this.vetorNormalDaFace = calculaVetorNormal(this.pontos);
    this.vetorNormalUnitario = vetorUnitario(this.vetorNormalDaFace);
    this.vetObservacao = calculoVetObservacaoUnitario(this.centroide);
    this.boolVisibilidadeNormal = this.calculaVisibilidadeNormal();
  };
  calculaCentroide() {
    let somaX = 0;
    let somaY = 0;
    let somaZ = 0;
    for (let i = 0; i < this.pontos.length; i++) {
      somaX += this.pontos[i][0];
      somaY += this.pontos[i][1];
      somaZ += this.pontos[i][2];
    }
    return [somaX / 4, somaY / 4, somaZ / 4];
  };
  calculaDistanciaPintor() {
    let distancia = Math.sqrt((vetVrp[0] - this.centroide[0]) ** 2 + (vetVrp[1] - this.centroide[1]) ** 2 + (vetVrp[2] - this.centroide[2]) ** 2);
    return distancia;
  };
  calculaVisibilidadeNormal(){
    let produtoEscalarVar = produtoEscalar(this.vetObservacao, this.vetorNormalUnitario);
    if (produtoEscalarVar >= 0) {
      return true;
    }
    return false;
  }
}
class faceClassCor{
  constructor(face) {
    this.distanciaPintor = face.distanciaPintor;
    this.boolVisibilidadeNormal = face.boolVisibilidadeNormal;
    this.iluminacaoTotal = 255;
    this.pontosSRT = this.pontos2Srt(face.pontos) //armazenar as arestas ponto inicial e final
    this.arestasSRT = this.calculaArestasSRT();
    [this.arestasCompletaSRT, this.yMin, this.yMax] = this.createArestaCompleta(); //NO SRT
    this.scanLinesFace = this.createScanlinesFace();
  };
  pontos2Srt(pontos) {
    let pontosSRT = addFatH(pontos);
    pontosSRT = pontoSRUtoSRT(pontosSRT);
    pontosSRT = removeFatH(pontosSRT);
    pontosSRT = recorte2D(pontosSRT) ;
    return pontosSRT;
  };
  calculaArestasSRT() {
    let arestasSRT = [];
    let len = this.pontosSRT.length;
    for (let i = 0; i < len; i++) {
      let p0 = this.pontosSRT[i];
      let p1 = this.pontosSRT[(i + 1) % len];
      arestasSRT.push([p0, p1]);
    }
    return arestasSRT;
  };
  createArestaCompleta() {
    let lenI = this.arestasSRT.length;
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = this.arestasSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let ytestado = aresta[j][1];
        if (ytestado < yMin) {
          yMin = ytestado;
        }
        if (ytestado > yMax) {
          yMax = ytestado;
        }
      }
    }

    let novasArestas = [];
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let novaAresta = [];
      let p0 = this.arestasSRT[i][0];
      let p1 = this.arestasSRT[i][1];


      if (p0[1] < p1[1]) {
        let deltaX = p1[0] - p0[0];
        let deltaY = p1[1] - p0[1];
        novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])
        let taxaXIncremento = deltaX / deltaY;
        let npx = p0[0];
        let npy = p0[1];
        for (let j = 1; j < deltaY; j++) {
            npx += taxaXIncremento;
            npy += 1; 
            novaAresta.push([Math.round(npx), Math.round(npy)])  
        }
        //novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])
      } else {
        let deltaX = p0[0] - p1[0];
        let deltaY = p0[1] - p1[1];
        novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])
        let taxaXIncremento = deltaX / deltaY;
        let npx = p1[0];
        let npy = p1[1];
        for (let j = 1; j < deltaY; j++) {
            npx += taxaXIncremento;
            npy += 1; 
            novaAresta.push([Math.round(npx), Math.round(npy)])  
        }
        novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])
      }
      novasArestas.push(novaAresta);      
    }
    return [novasArestas, Math.round(yMin), Math.round(yMax)];
  };
  createScanlinesFace() {

    // INICIALIZAR SCANLINES [Y, [X...]]
    let vetScanLinesFace = [];
    let aux = this.yMin
    for (let i = this.yMin; i <= this.yMax; i++) {
      vetScanLinesFace.push([aux, []]);
      aux++;
    }
    
    let lenI = this.arestasCompletaSRT.length;

    // ADD Xs em SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = this.arestasCompletaSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let lenK = vetScanLinesFace.length;
        let pontoAresta = aresta[j];        
        
        for (let k = 0; k < lenK; k++) {
          if (pontoAresta[1] == vetScanLinesFace[k][0]) {
            vetScanLinesFace[k][1].push(pontoAresta[0]);
          }
        }
      }
    }
    // ORDENAR VETOR Xs EM SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < vetScanLinesFace.length; i++) {
      let scanline = vetScanLinesFace[i];
      let vetXs = scanline[1];
      vetXs = vetXs.sort((a, b) => a - b);
      scanline[1] = vetXs;
    }

    return vetScanLinesFace;
  };
}
class faceClassConstante{
  constructor(face, [iluminacaoKa, iluminacaoKd, iluminacaoKs, iluminacaoN]) {  

    this.distanciaPintor = face.distanciaPintor;
    this.boolVisibilidadeNormal = face.boolVisibilidadeNormal;    
    this.iluminacaoTotal = calcularIluTotal(iluminacaoKa,
                                            iluminacaoKd, 
                                            iluminacaoKs, 
                                            iluminacaoN,
                                            face.centroide,
                                            face.vetorNormalUnitario,
                                            face.vetObservacao);
    this.pontosSRT = this.pontos2Srt(face.pontos) //armazenar as arestas ponto inicial e final
    this.arestasSRT = this.calculaArestasSRT();
    [this.arestasCompletaSRT, this.yMin, this.yMax] = this.createArestaCompleta(); //NO SRT
    this.scanLinesFace = this.createScanlinesFace();
  };
  pontos2Srt(pontos) {
    let pontosSRT = addFatH(pontos);
    pontosSRT = pontoSRUtoSRT(pontosSRT);
    pontosSRT = removeFatH(pontosSRT);
    pontosSRT = recorte2D(pontosSRT) ;
    return pontosSRT;
  };
  calculaArestasSRT() {
    let arestasSRT = [];
    let len = this.pontosSRT.length;
    for (let i = 0; i < len; i++) {
      let p0 = this.pontosSRT[i];
      let p1 = this.pontosSRT[(i + 1) % len];
      arestasSRT.push([p0, p1]);
    }
    return arestasSRT;
  };
  createArestaCompleta() {
    let lenI = this.arestasSRT.length;
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = this.arestasSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let ytestado = aresta[j][1];
        if (ytestado < yMin) {
          yMin = ytestado;
        }
        if (ytestado > yMax) {
          yMax = ytestado;
        }
      }
    }

    let novasArestas = [];
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let novaAresta = [];
      let p0 = this.arestasSRT[i][0];
      let p1 = this.arestasSRT[i][1];


      if (p0[1] < p1[1]) {
        let deltaX = p1[0] - p0[0];
        let deltaY = p1[1] - p0[1];
        novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])
        let taxaXIncremento = deltaX / deltaY;
        let npx = p0[0];
        let npy = p0[1];
        for (let j = 1; j < deltaY; j++) {
            npx += taxaXIncremento;
            npy += 1; 
            novaAresta.push([Math.round(npx), Math.round(npy)])  
        }
        //novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])
      } else {
        let deltaX = p0[0] - p1[0];
        let deltaY = p0[1] - p1[1];
        novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])
        let taxaXIncremento = deltaX / deltaY;
        let npx = p1[0];
        let npy = p1[1];
        for (let j = 1; j < deltaY; j++) {
            npx += taxaXIncremento;
            npy += 1; 
            novaAresta.push([Math.round(npx), Math.round(npy)])  
        }
        novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])
      }
      novasArestas.push(novaAresta);      
    }
    return [novasArestas, Math.round(yMin), Math.round(yMax)];
  };
  createScanlinesFace() {

    // INICIALIZAR SCANLINES [Y, [X...]]
    let vetScanLinesFace = [];
    let aux = this.yMin
    for (let i = this.yMin; i <= this.yMax; i++) {
      vetScanLinesFace.push([aux, []]);
      aux++;
    }
    
    let lenI = this.arestasCompletaSRT.length;

    // ADD Xs em SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = this.arestasCompletaSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let lenK = vetScanLinesFace.length;
        let pontoAresta = aresta[j];        
        
        for (let k = 0; k < lenK; k++) {
          if (pontoAresta[1] == vetScanLinesFace[k][0]) {
            vetScanLinesFace[k][1].push(pontoAresta[0]);
          }
        }
      }
    }
    // ORDENAR VETOR Xs EM SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < vetScanLinesFace.length; i++) {
      let scanline = vetScanLinesFace[i];
      let vetXs = scanline[1];
      vetXs = vetXs.sort((a, b) => a - b);
      scanline[1] = vetXs;
    }

    return vetScanLinesFace;
  };
}

class faceClassGourad{
  constructor(face, vetorNormalMedio, [iluminacaoKa, iluminacaoKd, iluminacaoKs, iluminacaoN]) {  

    this.vetorNormalMedio = vetorNormalMedio; // [vetNormalP1, vetNormalP2, vetNormalP3, vetNormalP4]
    this.distanciaPintor = face.distanciaPintor;
    this.boolVisibilidadeNormal = face.boolVisibilidadeNormal;    
    this.iluminacaoPontos = this.calculaIluminacaoPontos(iluminacaoKa, 
                                                          iluminacaoKd, 
                                                          iluminacaoKs, 
                                                          iluminacaoN,
                                                          this.vetorNormalMedio,
                                                          face.pontos,
                                                          face.vetObservacao);
    
    this.iluminacaoTotal = calcularIluTotal(iluminacaoKa,iluminacaoKd, iluminacaoKs, iluminacaoN,face.centroide,face.vetorNormalUnitario,face.vetObservacao);
    this.pontosIluminados = this.createPontosIluminados(face.pontos, this.iluminacaoPontos); // [ [p1, iluP1], [p2, iluP2], [p3, iluP3], [p4, iluP4] ]
    this.pontosSRT = this.pontos2Srt(face.pontos) //armazenar as arestas ponto inicial e final
    this.arestasSRT = this.calculaArestasSRT();
    [this.arestasCompletaSRT, this.yMin, this.yMax] = this.createArestaCompleta(); //NO SRT
    this.scanLinesFace = this.createScanlinesFace();
  };

  calculaIluminacaoPontos(iluminacaoKa, iluminacaoKd, iluminacaoKs, iluminacaoN,vetorNormalMedio, pontos, vetObservacao) {
    let iluminacaoPontos = [];
    for (let i = 0; i < pontos.length; i++) {
      let ponto = pontos[i];
      let vetorNormal = vetorNormalMedio[i];
      let iluminacaoPonto = calcularIluTotal(iluminacaoKa,     // [iluP1, iluP2, iluP3, iluP4]
                                              iluminacaoKd, 
                                              iluminacaoKs, 
                                              iluminacaoN,
                                              ponto, // Gourad, NO PONTO !
                                              vetorNormal,
                                              vetObservacao);      
      iluminacaoPontos.push(iluminacaoPonto); 
    }
    return iluminacaoPontos;
  }
  createPontosIluminados(pontos, iluminacaoPontos) {
    let pontosIluminados = [];
    for (let i = 0; i < pontos.length; i++) {
      pontosIluminados.push([pontos[i], iluminacaoPontos[i]]);
    }

    return pontosIluminados;
  };
  pontos2Srt(pontos) {
    let pontosSRT = addFatH(pontos);
    pontosSRT = pontoSRUtoSRT(pontosSRT);
    pontosSRT = removeFatH(pontosSRT);
    pontosSRT = recorte2D(pontosSRT) ;
    return pontosSRT;
  };
  calculaArestasSRT() {
    let arestasSRT = [];
    let len = this.pontosSRT.length;
    for (let i = 0; i < len; i++) {
      let p0 = this.pontosSRT[i];
      let p1 = this.pontosSRT[(i + 1) % len];
      arestasSRT.push([p0, p1]);
    }
    return arestasSRT;
  };
  createArestaCompleta() {
    let lenI = this.arestasSRT.length;
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = this.arestasSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let ytestado = aresta[j][1];
        if (ytestado < yMin) {
          yMin = ytestado;
        }
        if (ytestado > yMax) {
          yMax = ytestado;
        }
      }
    }

    let novasArestas = [];
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let novaAresta = [];
      let p0 = this.arestasSRT[i][0];
      let p1 = this.arestasSRT[i][1];


      if (p0[1] < p1[1]) {
        let deltaX = p1[0] - p0[0];
        let deltaY = p1[1] - p0[1];
        novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])
        let taxaXIncremento = deltaX / deltaY;
        let npx = p0[0];
        let npy = p0[1];
        for (let j = 1; j < deltaY; j++) {
            npx += taxaXIncremento;
            npy += 1; 
            novaAresta.push([Math.round(npx), Math.round(npy)])  
        }
        //novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])
      } else {
        let deltaX = p0[0] - p1[0];
        let deltaY = p0[1] - p1[1];
        novaAresta.push([Math.round(p0[0]), Math.round(p0[1])])
        let taxaXIncremento = deltaX / deltaY;
        let npx = p1[0];
        let npy = p1[1];
        for (let j = 1; j < deltaY; j++) {
            npx += taxaXIncremento;
            npy += 1; 
            novaAresta.push([Math.round(npx), Math.round(npy)])  
        }
        novaAresta.push([Math.round(p1[0]), Math.round(p1[1])])
      }
      novasArestas.push(novaAresta);      
    }
    return [novasArestas, Math.round(yMin), Math.round(yMax)];
  };
  createScanlinesFace() {

    // INICIALIZAR SCANLINES [Y, [X...]]
    let vetScanLinesFace = [];
    let aux = this.yMin
    for (let i = this.yMin; i <= this.yMax; i++) {
      vetScanLinesFace.push([aux, []]);
      aux++;
    }
    
    let lenI = this.arestasCompletaSRT.length;

    // ADD Xs em SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = this.arestasCompletaSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let lenK = vetScanLinesFace.length;
        let pontoAresta = aresta[j];        
        
        for (let k = 0; k < lenK; k++) {
          if (pontoAresta[1] == vetScanLinesFace[k][0]) {
            vetScanLinesFace[k][1].push(pontoAresta[0]);
          }
        }
      }
    }
    // ORDENAR VETOR Xs EM SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < vetScanLinesFace.length; i++) {
      let scanline = vetScanLinesFace[i];
      let vetXs = scanline[1];
      vetXs = vetXs.sort((a, b) => a - b);
      scanline[1] = vetXs;
    }

    return vetScanLinesFace;
  };
}

{//////// VARIRAVEIS GLOBAIS ////////////////
var visao = 'axonometrica';
var vetMalha = []

/// camera 
var xMin = document.getElementById('xMinSRU').value || -20;
var xMax = document.getElementById('xMaxSRU').value || 20;
var yMin = document.getElementById('yMinSRU').value || -15;
var yMax = document.getElementById('yMaxSRU').value || 15;

/*
var uMin = 0;
var uMax = 1099;
var vMin = 0;
var vMax = 699;
*/
var uMin = parseInt(document.getElementById('uMinW').value) || 0;
var uMax = parseInt(document.getElementById('uMaxW').value) || 1299;
var vMin = parseInt(document.getElementById('vMinW').value) || 0;
var vMax = parseInt(document.getElementById('vMaxW').value) || 699;

var dp = 40;
var viewUp = [0, 1, 0];

var uMinViewport = document.getElementById('uMin').value || 0;
var uMaxViewport = document.getElementById('uMax').value || 1299;
var vMinViewport = document.getElementById('vMin').value || 0;
var vMaxViewport = document.getElementById('vMax').value || 699;

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


var nSegmentosU = parseInt(document.getElementById('nSegmentosU').value) || 1;
var nSegmentosV = parseInt(document.getElementById('nSegmentosV').value) || 1;
  
//eixo
var eixoBool = true;
var eixoPCverde = true;
//ILUMINACAO

var iluAmbiente = parseInt(document.getElementById('iluAmbiente').value) || 0;
var iluLampada = parseInt(document.getElementById('iluLampada').value) || 0;
var xLampada = parseInt(document.getElementById('xLampada').value) || 0;
var yLampada = parseInt(document.getElementById('yLampada').value) || 0;
var zLampada = parseInt(document.getElementById('zLampada').value) || 0;

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

function transporUmaMatriz(matriz) {
  let transposta = [];
  for (let i = 0; i < matriz[0].length; i++) {
    transposta[i] = [];
    for (let j = 0; j < matriz.length; j++) {
      transposta[i][j] = matriz[j][i];
    }
  }
  return transposta;
}

// VETOR o OU s
function calculoVetObservacaoUnitario(centroide) {
  let vetObservacao = [vetVrp[0] - centroide[0], 
                       vetVrp[1] - centroide[1], 
                       vetVrp[2] - centroide[2]];
  return vetorUnitario(vetObservacao);
}

function calculaVetorNormal(pontos) {

  let vetP2P3 = [pontos[2][0] - pontos[1][0],
                  pontos[2][1] - pontos[1][1],
                  pontos[2][2] - pontos[1][2]];
                  
  let vetP2P1 = [pontos[0][0] - pontos[1][0], 
                  pontos[0][1] - pontos[1][1], 
                  pontos[0][2] - pontos[1][2]];
  //let vetorNormal = produtoVetorial(vetP2P3, vetP2P1);
  let vetorNormal = produtoVetorial(vetP2P1, vetP2P3);
  return vetorNormal;    
}

}/////////////////////////////////////////////////////////////////////

{//////// FUNCOES DE DESENHO ////////////////////////////////////////////////
function renderiza() {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  printEixo3d();
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    drawGridBspline(malha);
    if (malha.visibilidadePC) {
      drawPontosControle(malha.gridControleSRT);
    }

  drawViewport();
}
  
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

function drawViewport() { 
  var canvas = document.getElementById('viewport');
  var context = canvas.getContext('2d');
  context.beginPath();
  context.rect(uMinViewport, vMinViewport, uMaxViewport - uMinViewport, vMaxViewport - vMinViewport);
  context.strokeStyle = 'black';
  context.lineWidth = 0.5;
  context.stroke();
}

function getFaces(grid) {
  let lenI = grid.length - 1;
  let lenJ = grid[0].length - 1;
  let faces = [];
  for (let i = 0; i < lenI; i++) {
    for (let j = 0; j < lenJ; j++) {
      let face = [grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]];
      faces.push(face);
    }
  }
  return faces;
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
function paintFace(scanLines, color) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  let lenScanline = scanLines.length;
  for (let i = 0; i < lenScanline; i++) {
    let pontoY = scanLines[i][0];
    let pontosX = scanLines[i][1];
    let lenPontosX = pontosX.length;
    let x0 = pontosX[0];
    let x1 = pontosX[lenPontosX - 1];
    if (x0 == x1) {
      ctx.fillRect(x0, pontoY, 1, 1);
    } else {
      for (let x = x0+1; x < x1; x++) {
        ctx.fillRect(x, pontoY, 1, 1);
      }
    }
  }
}
function paintAresta(scanLines, color) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  let lenScanline = scanLines.length;
  for (let i = 0; i < lenScanline; i++) {
    let pontoY = scanLines[i][0];
    let pontosX = scanLines[i][1];
    let lenPontosX = pontosX.length;
    for (let j = 0; j < lenPontosX; j++) {
      ctx.fillRect(pontosX[j], pontoY, 1, 1);
    }
  }
}

function drawGridBspline(malha) {
  let faces = malha.facesBsplineSRU;
  let facesLenght = faces.length;
  for (let i = 0; i < facesLenght; i++) { // PERCORRE TODAS AS FACES
    let face = faces[i];
    let iluTotal = Math.round(face.iluminacaoTotal);
    let cor = `rgb(${iluTotal},${iluTotal},${iluTotal})`;
  
    if (boolArestasVerdeVermelha) {
      if (face.boolVisibilidadeNormal) {
        paintAresta(face.scanLinesFace, 'green');
      } else {
        paintAresta(face.scanLinesFace, 'red');
      } 
    } else {
      paintAresta(face.scanLinesFace, cor);
    }

    if (boolPintarFaces) {
      paintFace(face.scanLinesFace, cor);
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
function drawPCselecionado() {
  if (eixoPCverde) {
    let i = indicePCsele[0];
    let j = indicePCsele[1];
    gridObjeto = selectedMalha.gridControleSRT;
    drawCircle(gridObjeto[i][j][0], gridObjeto[i][j][1], lenPontosControle, 'rgb(145, 255, 0)');
  }
}
function recorte2D(pontos) {

  function testeDentroEsquerda(p) {
      return p[0] >= uMinViewport;
  }
  function testeDentroDireita(p) {
      return p[0] <= uMaxViewport;
  }
  function testeDentroAbaixo(p) {
      return p[1] <= vMaxViewport;
  }
  function testeDentroAcima(p) {
      return p[1] >= vMinViewport;
  }

  function intersecao(p1, p2, limite, eixo) {
    let x1 = p1[0], y1 = p1[1], z1 = p1[2];
    let x2 = p2[0], y2 = p2[1], z2 = p2[2];

    if (eixo === "x") {
        let x = limite;
        let y = y1 + (y2 - y1) * (limite - x1) / (x2 - x1);
        let z = z1 + (z2 - z1) * (limite - x1) / (x2 - x1);
        return [x, y, z];
    } else if (eixo === "y") {
        let y = limite;
        let x = x1 + (x2 - x1) * (limite - y1) / (y2 - y1);
        let z = z1 + (z2 - z1) * (limite - y1) / (y2 - y1);
        return [x, y, z];
    } 
  }

  function recorteContraBorda(pontos, testeDentro, limite, eixo) {
      let novosPontos = [];

      for (let i = 0; i < pontos.length; i++) {
          let p0 = pontos[i];
          let p1 = pontos[(i + 1) % pontos.length]; // Fechando o polígono

          let dentro0 = testeDentro(p0);
          let dentro1 = testeDentro(p1);

          // dentro dentro -> adiciona p1
          if (dentro0 && dentro1) {
              novosPontos.push(p1);
          } 
          // dentro fora -> adiciona p1'
          else if (dentro0 && !dentro1) {
              novosPontos.push(intersecao(p0, p1, limite, eixo));
          } 
          // fora dentro -> adiciona p0' e p1
          else if (!dentro0 && dentro1) {
              novosPontos.push(intersecao(p0, p1, limite, eixo));
              novosPontos.push(p1);
          }
      }
      return novosPontos;
  }

  let recortado = pontos;
  recortado = recorteContraBorda(recortado, testeDentroEsquerda, uMinViewport, "x");
  recortado = recorteContraBorda(recortado, testeDentroDireita, uMaxViewport, "x");
  recortado = recorteContraBorda(recortado, testeDentroAbaixo, vMaxViewport, "y");
  recortado = recorteContraBorda(recortado, testeDentroAcima, vMinViewport, "y");
  

  return recortado;
}

}/////////////////////////////////////////////////////////////////////

{/// FUNCOES /////////////////////////////////////////

// ILUMINAÇÃO
function calcularIluTotal(iluminacaoKa, iluminacaoKd, iluminacaoKs, iluminacaoN, centroide, vetorNormalUnitario, vetorS) {
  
  if (tipoSombreamento == 'Nenhum') {
    return 255;
  };

  let iluTotal = iluAmbiente*iluminacaoKa;

  if (iluTotal>=255){
    return 255;
  }

  let vetorLuz = [xLampada - centroide[0],
                  yLampada - centroide[1],
                  zLampada - centroide[2]];

  let vetorLuzUnitario = vetorUnitario(vetorLuz);

  // Iluminação difusa (Id = Il . Kd . (N^ . L^))

  let escalarNL = produtoEscalar(vetorNormalUnitario,vetorLuzUnitario)
  let iluDifusa = iluLampada * iluminacaoKd * escalarNL;
  
  if (iluDifusa <= 0) {
    return iluTotal;
  }
  iluTotal += iluDifusa;

  // Iluminação especular (Is = Il . Ks . (R^.S^)^n)

  //R^ = (2 . L^ . N^).N^ - L^ // s == o ; vetor de observação

  let vetorR = [2*escalarNL*vetorNormalUnitario[0] - vetorLuzUnitario[0],
                2*escalarNL*vetorNormalUnitario[1] - vetorLuzUnitario[1],
                2*escalarNL*vetorNormalUnitario[2] - vetorLuzUnitario[2]];    
  let iluEspecular = iluLampada * iluminacaoKs * (produtoEscalar(vetorR, vetorUnitario(vetorS)) ** iluminacaoN);
  if (iluEspecular <= 0) {
    return iluTotal;
  }
  iluTotal += iluEspecular;
  return iluTotal
}
// BSPLINES
function closedBspline(pontosDeControle) {
  let n = pontosDeControle.length;
  let pontosDeControleFechado = [
      pontosDeControle[n - 2],
      pontosDeControle[n - 1],
      ...pontosDeControle,
      pontosDeControle[0],
      pontosDeControle[1]
  ];
  return pontosDeControleFechado;
}
function calculateBspline(pontosDeControle, nSegmentos) {
  //pontosDeControle = clampingBspline(pontosDeControle);
  /*
  if (document.getElementById('clamped').checked) {
      pontosDeControle = clampingBspline(pontosDeControle);
  }

  if (document.getElementById('closed').checked) {
      pontosDeControle = closedBspline(pontosDeControle);
  }*/
  //pontosDeControle = closedBspline(pontosDeControle);

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

      let a0 = (xA + 4 * xB + xC) / 6;
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
  let lengthI = gridSRUPontosControle.length;
  // PEGAR OS INDICES PARA LINHAS


  for (let i = 0; i < lengthI; i++) {
    gridBspline.push(calculateBspline(gridSRUPontosControle[i], nSegmentosU));
  }
  gridBspline = transporUmaMatriz(gridBspline);
  lengthI = gridBspline.length;
  for (let i = 0; i < lengthI; i++) {
    gridBspline.push(calculateBspline(gridSRUPontosControle[i], nSegmentosU));
  }
  return gridBspline;
}

// GRID PONTOS DE CONTROLE
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


// ATUALIZAR PONTOS CONTROLE E PROGRAMA
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
function updateProgramaTotal() {  
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    malha.updateReset();
  }
  renderiza();
  drawPCselecionado();
}
function updatePrograma() {  
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    malha.update();
  }
  renderiza();
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

function pontoSRUtoSRT(pontos) {
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

let m = 4;
let n = 4;

var vetMalha = [];

let ponto1 = [0,15,0];
let ponto2 = [0,10,0];
let ponto3 = [10,10,0];
let ponto4 = [10,15,0];
let pontosMalha = [ponto1, ponto2, ponto3, ponto4]

//malha1 = new malha(pontosMalha, m, n, 1111);
//vetMalha.push(malha1);


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

var tipoSombreamento = document.getElementById('tipoSombreamento').value;
var boolArestasVerdeVermelha = document.getElementById('boolArestasVerdeVermelha').checked;
var boolPintarFaces = document.getElementById('boolPintarFaces').checked;

/// ATUALIZAÇAO /////////////////

//inicializaPrograma();
updateProgramaTotal();

{////////////////////////////////////////// HTML //////////////////////////////////////////

function onFieldChange() {
  visao = document.getElementById('visao').value
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
  nSegmentosU = parseInt(document.getElementById('nSegmentosU').value) || 1;
  nSegmentosV = parseInt(document.getElementById('nSegmentosV').value) || 1;
  selectedMalha.visibilidadeGridControle = document.getElementById('visibilidadeGridControle').checked;
  selectedMalha.visibilidadePC = document.getElementById('visibilidadePC').checked;


  iluAmbiente = parseInt(document.getElementById('iluAmbiente').value) || 0;
  iluLampada = parseInt(document.getElementById('iluLampada').value) || 0;
  xLampada = parseInt(document.getElementById('xLampada').value) || 0;
  yLampada = parseInt(document.getElementById('yLampada').value) || 0;
  zLampada = parseInt(document.getElementById('zLampada').value) || 0;

  selectedMalha.ka = parseFloat(document.getElementById('ka').value) || 0;
  selectedMalha.kd = parseFloat(document.getElementById('kd').value) || 0;
  selectedMalha.ks = parseFloat(document.getElementById('ks').value) || 0;
  selectedMalha.nIluminacao = parseFloat(document.getElementById('nIluminacao').value) || 0;

  tipoSombreamento = document.getElementById('tipoSombreamento').value;
  boolArestasVerdeVermelha = document.getElementById('boolArestasVerdeVermelha').checked;
  boolPintarFaces = document.getElementById('boolPintarFaces').checked;

  uMinViewport = parseInt(document.getElementById('uMin').value) || 0;
  uMaxViewport = parseInt(document.getElementById('uMax').value) || 0;
  vMinViewport = parseInt(document.getElementById('vMin').value) || 0;
  vMaxViewport = parseInt(document.getElementById('vMax').value) || 0;

  updatePrograma();
}

function onFieldChangeReset(){
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

  xMin = parseInt(document.getElementById('xMinSRU').value) || 0;
  xMax = parseInt(document.getElementById('xMaxSRU').value) || 0;
  yMin = parseInt(document.getElementById('yMinSRU').value) || 0;
  yMax = parseInt(document.getElementById('yMaxSRU').value) || 0;

  uMin = parseInt(document.getElementById('uMinW').value) || 0;
  uMax = parseInt(document.getElementById('uMaxW').value) || 0;
  vMin = parseInt(document.getElementById('vMinW').value) || 0;
  vMax = parseInt(document.getElementById('vMaxW').value) || 0;
  


  updateProgramaTotal();
}

function onFieldChangePCselecionado() {
  selectedMalha.gridControleSRU[indicePCsele[0]][indicePCsele[1]] = 
                    [parseFloat(document.getElementById('xPC').value) || 0,
                    parseFloat(document.getElementById('yPC').value) || 0,
                    parseFloat(document.getElementById('zPC').value) || 0];
  updatePrograma();
}



// Adicionando os listeners para os campos

document.getElementById('xMinSRU').addEventListener('input', onFieldChangeReset);
document.getElementById('xMaxSRU').addEventListener('input', onFieldChangeReset);
document.getElementById('yMinSRU').addEventListener('input', onFieldChangeReset);
document.getElementById('yMaxSRU').addEventListener('input', onFieldChangeReset);

document.getElementById('uMinW').addEventListener('input', onFieldChangeReset);
document.getElementById('uMaxW').addEventListener('input', onFieldChangeReset);
document.getElementById('vMinW').addEventListener('input', onFieldChangeReset);
document.getElementById('vMaxW').addEventListener('input', onFieldChangeReset);

document.getElementById('uMin').addEventListener('input', onFieldChange);
document.getElementById('uMax').addEventListener('input', onFieldChange);
document.getElementById('vMin').addEventListener('input', onFieldChange);
document.getElementById('vMax').addEventListener('input', onFieldChange);

document.getElementById('visao').addEventListener('input', onFieldChange);
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
document.getElementById('visibilidadeGridControle').addEventListener('input', onFieldChange);
document.getElementById('visibilidadePC').addEventListener('input', onFieldChange);
document.getElementById('tipoSombreamento').addEventListener('input', onFieldChange);

document.getElementById('indexIPC').addEventListener('input', onFieldChange);
document.getElementById('indexJPC').addEventListener('input', onFieldChange);
document.getElementById('xPC').addEventListener('input', onFieldChangePCselecionado);
document.getElementById('yPC').addEventListener('input', onFieldChangePCselecionado);
document.getElementById('zPC').addEventListener('input', onFieldChangePCselecionado);
document.getElementById('nSegmentosU').addEventListener('input', onFieldChange);
document.getElementById('nSegmentosV').addEventListener('input', onFieldChange);

//RESETA MALHA
document.getElementById('p1X').addEventListener('input', onFieldChangeReset);
document.getElementById('p1Y').addEventListener('input', onFieldChangeReset);
document.getElementById('p1Z').addEventListener('input', onFieldChangeReset);
document.getElementById('p2X').addEventListener('input', onFieldChangeReset);
document.getElementById('p2Y').addEventListener('input', onFieldChangeReset);
document.getElementById('p2Z').addEventListener('input', onFieldChangeReset);
document.getElementById('p3X').addEventListener('input', onFieldChangeReset);
document.getElementById('p3Y').addEventListener('input', onFieldChangeReset);
document.getElementById('p3Z').addEventListener('input', onFieldChangeReset);
document.getElementById('p4X').addEventListener('input', onFieldChangeReset);
document.getElementById('p4Y').addEventListener('input', onFieldChangeReset);
document.getElementById('p4Z').addEventListener('input', onFieldChangeReset);
document.getElementById('mPontos').addEventListener('input', onFieldChangeReset);
document.getElementById('nPontos').addEventListener('input', onFieldChangeReset);

document.getElementById('iluAmbiente').addEventListener('input', onFieldChange);
document.getElementById('iluLampada').addEventListener('input', onFieldChange);
document.getElementById('xLampada').addEventListener('input', onFieldChange);
document.getElementById('yLampada').addEventListener('input', onFieldChange);
document.getElementById('zLampada').addEventListener('input', onFieldChange);

document.getElementById('ka').addEventListener('input', onFieldChange);
document.getElementById('kd').addEventListener('input', onFieldChange);
document.getElementById('ks').addEventListener('input', onFieldChange);
document.getElementById('nIluminacao').addEventListener('input', onFieldChange);

document.getElementById('boolArestasVerdeVermelha').addEventListener('input', onFieldChange);
document.getElementById('boolPintarFaces').addEventListener('input', onFieldChange);


const selectMalha = document.getElementById("malhaSelecionada");
const sclInput = document.getElementById("scl");
const rotXInput = document.getElementById("xRot");
const rotYInput = document.getElementById("yRot");
const rotZInput = document.getElementById("zRot");
const translXInput = document.getElementById("translX");
const translYInput = document.getElementById("translY");
const translZInput = document.getElementById("translZ");
const visibilidadeGridControleInput = document.getElementById("visibilidadeGridControle");
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

const kaInput = document.getElementById("ka");
const kdInput = document.getElementById("kd");
const ksInput = document.getElementById("ks");
const nIluminacaoInput = document.getElementById("nIluminacao");

// Função para atualizar os valores de rotação nos inputs
function atualizarInputsMalha(malha) {
  sclInput.value = malha.scl;
  rotXInput.value = malha.rotX;
  rotYInput.value = malha.rotY;
  rotZInput.value = malha.rotZ;
  translXInput.value = malha.translX;
  translYInput.value = malha.translY;
  translZInput.value = malha.translZ;
  visibilidadeGridControleInput.checked = malha.visibilidadeGridControle;
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
  kaInput.value = malha.ka;
  kdInput.value = malha.kd;
  ksInput.value = malha.ks;
  nIluminacaoInput.value = malha.nIluminacao;
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
  updatePrograma();
  atualizarInputsMalha(selectedMalha);
});


}/////////////////////////////////////////////////////////////////////////////////////////
