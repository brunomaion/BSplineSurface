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

    this.kaR = 0.5;
    this.kaG = 0.5;
    this.kaB = 0.5;
    this.kdR = 0.5;
    this.kdG = 0.5;
    this.kdB = 0.5;
    this.ksR = 0.5;
    this.ksG = 0.5;
    this.ksB = 0.5;
    this.nIluminacao = 10;
    this.propIlu = [[this.kaR, this.kaG, this.kaB], 
                    [this.kdR, this.kdG, this.kdB], 
                    [this.ksR, this.ksG, this.ksB], 
                    this.nIluminacao];
    this.mMalha = 4;
    this.nMalha = 4;

    
    this.pontosSRU = [this.p1, this.p2, this.p3, this.p4];
    this.centroideMalha = [];
    this.recorte3d = this.recorte3D(this.centroideMalha);
    this.gridControleSRU = this.matrizPontosControle(this.pontosSRU, this.mMalha , this.nMalha);
    this.gridControleSRT = this.pipelineMatrizSruSrt(this.gridControleSRU);
    this.gridBsplineSRU = createGridBspline(this.gridControleSRU);
    this.facesBsplineSRU = this.createEstruturaFaces(this.gridBsplineSRU);
    //this.visibilidadeGridControle = false;
    this.visibilidadePC = false;
  };
  recorte3D(centroide) {
    if (centroide[2] > 200 || centroide[2] < -200) {
      this.pontos = [];
    };
  };
  debugPrint() {  

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
    this.centroideMalha = this.getCentroideMalha(this.gridBsplineSRU);
    this.facesBsplineSRU = this.createEstruturaFaces(this.gridBsplineSRU);
    this.debugPrint();
  };
  getCentroideMalha(grid) {
    let p00 = grid[0][0];
    let p01 = grid[0][grid[0].length - 1];
    let p10 = grid[grid.length - 1][0];
    let p11 = grid[grid.length - 1][grid[0].length - 1];
    let x = (p00[0] + p01[0] + p10[0] + p11[0]) / 4;
    let y = (p00[1] + p01[1] + p10[1] + p11[1]) / 4;
    let z = (p00[2] + p01[2] + p10[2] + p11[2]) / 4;
    return [x, y, z];
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
    };
    
    function rotacaoX(pontoY) {
      let angulo = var_rotacaoX;
      let matrizRotacao = [
        [1, 0, 0, 0],
        [0, Math.cos(angulo), -Math.sin(angulo), 0],
        [0, Math.sin(angulo), Math.cos(angulo), 0],
        [0, 0, 0, 1]
      ];
      return matriz44x41(matrizRotacao, pontoY);
    };
  
    function rotacaoY(pontoY) {
      let angulo = var_rotacaoY;
      let matrizRotacao = [
        [Math.cos(angulo), 0, Math.sin(angulo), 0],
        [0, 1, 0, 0],
        [-Math.sin(angulo), 0, Math.cos(angulo), 0],
        [0, 0, 0, 1]
      ];
      return matriz44x41(matrizRotacao, pontoY);
    };
  
    function rotacaoZ(pontoZ) {
      let angulo = var_rotacaoZ;
      let matrizRotacao = [
        [Math.cos(angulo), -Math.sin(angulo), 0, 0],
        [Math.sin(angulo), Math.cos(angulo), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ];
      return matriz44x41(matrizRotacao, pontoZ);
    };

    let pontosRotacionado = [];
    for (let i = 0; i < pontos.length; i++) {
      let ponto = pontos[i];
      ponto = translN(ponto);
      ponto = rotacaoZ(ponto);
      ponto = rotacaoY(ponto);
      ponto = rotacaoX(ponto);
      ponto = translP(ponto);
      pontosRotacionado.push(ponto);
    };
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
  };
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

    function calculaVetorMedioFaces(vetoresNormaisFace){ //FACES COMPARTILHADAS
      
      let somaX = 0;
      let somaY = 0;
      let somaZ = 0;
      let len = vetoresNormaisFace.length;
      for (let i = 0; i < len; i++) {
        let normalFace = vetoresNormaisFace[i];
        somaX += normalFace[0];
        somaY += normalFace[1];
        somaZ += normalFace[2];
      }
      let vetorNormalMedio = [somaX / len, somaY / len, somaZ / len];
      vetorNormalMedio = vetorUnitario(vetorNormalMedio);
      return vetorNormalMedio;
    }

    
    if (tipoSombreamento == 'Nenhum') {
      let vetFaces = getFaces(grid); 
      let newVetFacesObj = [];
      //CONSTROI AS FACES SRT 
      for (let i = 0; i < vetFaces.length; i++) {
        for (let j = 0; j < vetFaces[i].length; j++) {
          let objFace = new faceClassCor(vetFaces[i][j]);
          newVetFacesObj.push(objFace);
        }
      }
      //PINTOR
      newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
      return newVetFacesObj;
    };

    if (tipoSombreamento == 'Constante') {
      let vetFaces = getFaces(grid); 
      let newVetFacesObj = [];
      //CONSTROI AS FACES SRT 
      for (let i = 0; i < vetFaces.length; i++) {
        for (let j = 0; j < vetFaces[i].length; j++) {
          let objFace = new faceClassConstante(vetFaces[i][j], this.propIlu);
          newVetFacesObj.push(objFace);
        };
      };
      //PINTOR
      newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
      return newVetFacesObj;
    };

    if (tipoSombreamento == 'Gouraud') {
      let matrizFaces = getFaces(grid);
      let newVetFacesObj = []

      //PEGAR VIZINHOS
      for (let i = 0; i < matrizFaces.length; i++) {
        for (let j = 0; j < matrizFaces[i].length; j++) {
          let faceTestada = matrizFaces[i][j];
          let vetFacesVizinhas = obterVizinhos(i, j, matrizFaces); // Vetor dos vizinhos

          let vetorNormalMedioP1 = [];
          let vetorNormalMedioP2 = [];
          let vetorNormalMedioP3 = [];
          let vetorNormalMedioP4 = [];
          vetorNormalMedioP1.push(faceTestada.vetorNormalUnitario);
          vetorNormalMedioP2.push(faceTestada.vetorNormalUnitario);
          vetorNormalMedioP3.push(faceTestada.vetorNormalUnitario);
          vetorNormalMedioP4.push(faceTestada.vetorNormalUnitario);

          //Testar pontos
          let pontosFace = faceTestada.pontos;

          
          let p1 = pontosFace[0];
          let p2 = pontosFace[1];
          let p3 = pontosFace[2];
          let p4 = pontosFace[3];

          for (let l = 0; l < vetFacesVizinhas.length; l++) {
            let vertices = vetFacesVizinhas[l].pontos;
            let p1V = vertices[0];
            let p2V = vertices[1];
            let p3V = vertices[2];
            let p4V = vertices[3];

            if (p1 === p1V || p1 === p2V || p1 === p3V || p1 === p4V) {
              vetorNormalMedioP1.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
            if (p2 === p1V || p2 === p2V || p2 === p3V || p2 === p4V) {
              vetorNormalMedioP2.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
            if (p3 === p1V || p3 === p2V || p3 === p3V || p3 === p4V) {
              vetorNormalMedioP3.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
            if (p4 === p1V || p4 === p2V || p4 === p3V || p4 === p4V) {
              vetorNormalMedioP4.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
          };
          
          vetorNormalMedioP1 = calculaVetorMedioFaces(vetorNormalMedioP1);
          vetorNormalMedioP2 = calculaVetorMedioFaces(vetorNormalMedioP2);
          vetorNormalMedioP3 = calculaVetorMedioFaces(vetorNormalMedioP3);
          vetorNormalMedioP4 = calculaVetorMedioFaces(vetorNormalMedioP4);
          let vetorNormalMedio = [vetorNormalMedioP1, vetorNormalMedioP2, vetorNormalMedioP3, vetorNormalMedioP4];

          let face = new faceClassGourad(faceTestada, vetorNormalMedio, this.propIlu);
          newVetFacesObj.push(face);
        };
      };
      newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
      return newVetFacesObj;
    };

    if (tipoSombreamento == 'Phong') {
      let matrizFaces = getFaces(grid);
      let newVetFacesObj = []

      //PEGAR VIZINHOS
      for (let i = 0; i < matrizFaces.length; i++) {
        for (let j = 0; j < matrizFaces[i].length; j++) {
          let faceTestada = matrizFaces[i][j];
          let vetFacesVizinhas = obterVizinhos(i, j, matrizFaces); // Vetor dos vizinhos

          let vetorNormalMedioP1 = [];
          let vetorNormalMedioP2 = [];
          let vetorNormalMedioP3 = [];
          let vetorNormalMedioP4 = [];
          vetorNormalMedioP1.push(faceTestada.vetorNormalUnitario);
          vetorNormalMedioP2.push(faceTestada.vetorNormalUnitario);
          vetorNormalMedioP3.push(faceTestada.vetorNormalUnitario);
          vetorNormalMedioP4.push(faceTestada.vetorNormalUnitario);

          //Testar pontos
          let pontosFace = faceTestada.pontos;
          
          let p1 = pontosFace[0];
          let p2 = pontosFace[1];
          let p3 = pontosFace[2];
          let p4 = pontosFace[3];

          for (let l = 0; l < vetFacesVizinhas.length; l++) {
            let vertices = vetFacesVizinhas[l].pontos;
            let p1V = vertices[0];
            let p2V = vertices[1];
            let p3V = vertices[2];
            let p4V = vertices[3];

            if (p1 === p1V || p1 === p2V || p1 === p3V || p1 === p4V) {
              vetorNormalMedioP1.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
            if (p2 === p1V || p2 === p2V || p2 === p3V || p2 === p4V) {
              vetorNormalMedioP2.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
            if (p3 === p1V || p3 === p2V || p3 === p3V || p3 === p4V) {
              vetorNormalMedioP3.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
            if (p4 === p1V || p4 === p2V || p4 === p3V || p4 === p4V) {
              vetorNormalMedioP4.push(vetFacesVizinhas[l].vetorNormalUnitario);
            }
          };
          
          vetorNormalMedioP1 = calculaVetorMedioFaces(vetorNormalMedioP1);
          vetorNormalMedioP2 = calculaVetorMedioFaces(vetorNormalMedioP2);
          vetorNormalMedioP3 = calculaVetorMedioFaces(vetorNormalMedioP3);
          vetorNormalMedioP4 = calculaVetorMedioFaces(vetorNormalMedioP4);
          let vetorNormalMedio = [vetorNormalMedioP1, vetorNormalMedioP2, vetorNormalMedioP3, vetorNormalMedioP4];

          let face = new faceClassPhong(faceTestada, vetorNormalMedio, this.propIlu);
          newVetFacesObj.push(face);
        };
      };
      newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
      return newVetFacesObj;
    };
  };
};
class faceClass{
  constructor(pontos) {
    this.pontos = pontos; // [p1, p2, p3, p4] - pN = [x, y, z]
    this.centroide = calculaCentroide(this.pontos);
    this.distanciaPintor = this.calculaDistanciaPintor();
    this.vetorNormalDaFace = calculaVetorNormal(this.pontos);
    this.vetorNormalUnitario = vetorUnitario(this.vetorNormalDaFace);
    this.vetObservacao = calculoVetObservacaoUnitario(this.centroide);
    this.boolVisibilidadeNormal = this.calculaVisibilidadeNormal();
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

    let vetNormalInverso = calculaVetorNormalInverso(this.pontos);
    let vetorNormalUnitarioInverso = vetorUnitario(vetNormalInverso);
    this.vetorNormalDaFace = vetNormalInverso;
    this.vetorNormalUnitario = vetorNormalUnitarioInverso;
    return false;
  };
};
class faceClassCor{
  constructor(face) {
    this.distanciaPintor = face.distanciaPintor;
    this.boolVisibilidadeNormal = face.boolVisibilidadeNormal;
    this.pontosSRT = this.pontos2Srt(face.pontos) //armazenar as arestas ponto inicial e final
    this.arestasSRT = this.calculaArestasSRT();
    this.arestasCompletaSRT = this.createArestaCompleta(this.arestasSRT);//NO SRT
    [this.yMin, this.yMax] = getMinMax(this.arestasCompletaSRT);
    this.scanLinesFace = this.createScanlinesFace(this.arestasCompletaSRT);
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
  createArestaCompleta(arestasSRT) {
    let lenI = arestasSRT.length;
    let novasArestas = [];
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let novaAresta = [];
      let p0 = arestasSRT[i][0];
      let p1 = arestasSRT[i][1];


      if (p0[1] <= p1[1]) {
        let deltaX = p1[0] - p0[0];
        let deltaY = p1[1] - p0[1];
        let deltaZ = p1[2] - p0[2];
        let taxaXIncremento = deltaX / deltaY;
        let taxaZIncremento = deltaZ / deltaY;
        let npx = p0[0];
        let npy = p0[1];
        let npz = p0[2];
        for (let j = 0; j < deltaY; j++) {
            novaAresta.push([Math.round(npx), Math.round(npy), npz])   
            npx += taxaXIncremento;
            npz += taxaZIncremento;
            npy += 1; 
        }

      } else {
        let deltaX = p0[0] - p1[0];
        let deltaY = p0[1] - p1[1];
        let deltaZ = p0[2] - p1[2];
        let taxaXIncremento = deltaX / deltaY;
        let taxaZIncremento = deltaZ / deltaY;
        let npx = p1[0];
        let npy = p1[1];
        let npz = p1[2];
        for (let j = 0; j < deltaY; j++) {
            novaAresta.push([Math.round(npx), Math.round(npy), npz])  
            npx += taxaXIncremento;
            npz += taxaZIncremento;
            npy += 1; 
        }
      }
      novasArestas.push(novaAresta);      
    }

    return novasArestas;
  };
  createScanlinesFace(arestasCompletaSRT) {
    // INICIALIZAR SCANLINES [Y, [X...]]
    let vetScanLinesFace = [];
    let aux = this.yMin
    for (let i = this.yMin; i <= this.yMax; i++) {
      vetScanLinesFace.push([aux, []]);
      aux++;
    }
    let lenI = arestasCompletaSRT.length;
    // ADD Xs em SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = arestasCompletaSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let lenK = vetScanLinesFace.length;
        let pontoAresta = aresta[j];        
        for (let k = 0; k < lenK; k++) {
          if (pontoAresta[1] == vetScanLinesFace[k][0]) {
            vetScanLinesFace[k][1].push(pontoAresta);
          }
        }
      }
    }
    // ORDENAR VETOR Xs EM SCANLINES [Y, [[p1...pn]]]
    for (let i = 0; i < vetScanLinesFace.length; i++) {
      let scanline = vetScanLinesFace[i];
      let vetPontos = scanline[1];
      vetPontos = vetPontos.sort((a, b) => a[0] - b[0]);
      scanline[1] = vetPontos;
    }
    return vetScanLinesFace;
  };
};
class faceClassConstante{
  constructor(face, propIlu) {  

    this.distanciaPintor = face.distanciaPintor;
    this.boolVisibilidadeNormal = face.boolVisibilidadeNormal;    
    this.iluminacaoRGB = this.getIluminacaoRGB(propIlu, //[R,G,B]
                                              face.centroide,
                                              face.vetorNormalUnitario);
    this.pontosSRT = this.pontos2Srt(face.pontos) //armazenar as arestas ponto inicial e final
    this.arestasSRT = this.calculaArestasSRT();
    this.arestasCompletaSRT = this.createArestaCompleta(this.arestasSRT);//NO SRT
    [this.yMin, this.yMax] = getMinMax(this.arestasCompletaSRT);
    this.scanLinesFace = this.createScanlinesFace(this.arestasCompletaSRT);
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
  createArestaCompleta(arestasSRT) {
    let lenI = arestasSRT.length;
    let novasArestas = [];
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let novaAresta = [];
      let p0 = arestasSRT[i][0];
      let p1 = arestasSRT[i][1];


      if (p0[1] <= p1[1]) {
        let deltaX = p1[0] - p0[0];
        let deltaY = p1[1] - p0[1];
        let deltaZ = p1[2] - p0[2];
        let taxaXIncremento = deltaX / deltaY;
        let taxaZIncremento = deltaZ / deltaY;
        let npx = p0[0];
        let npy = p0[1];
        let npz = p0[2];
        for (let j = 0; j < deltaY; j++) {
            novaAresta.push([Math.round(npx), Math.round(npy), npz])   
            npx += taxaXIncremento;
            npz += taxaZIncremento;
            npy += 1; 
        }

      } else {
        let deltaX = p0[0] - p1[0];
        let deltaY = p0[1] - p1[1];
        let deltaZ = p0[2] - p1[2];
        let taxaXIncremento = deltaX / deltaY;
        let taxaZIncremento = deltaZ / deltaY;
        let npx = p1[0];
        let npy = p1[1];
        let npz = p1[2];
        for (let j = 0; j < deltaY; j++) {
            novaAresta.push([Math.round(npx), Math.round(npy), npz])  
            npx += taxaXIncremento;
            npz += taxaZIncremento;
            npy += 1; 
        }
      }
      novasArestas.push(novaAresta);      
    }

    return novasArestas;
  };
  createScanlinesFace(arestasCompletaSRT) {
    // INICIALIZAR SCANLINES [Y, [X...]]
    let vetScanLinesFace = [];
    let aux = this.yMin
    for (let i = this.yMin; i <= this.yMax; i++) {
      vetScanLinesFace.push([aux, []]);
      aux++;
    }
    let lenI = arestasCompletaSRT.length;
    // ADD Xs em SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = arestasCompletaSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let lenK = vetScanLinesFace.length;
        let pontoAresta = aresta[j];        
        for (let k = 0; k < lenK; k++) {
          if (pontoAresta[1] == vetScanLinesFace[k][0]) {
            vetScanLinesFace[k][1].push(pontoAresta);
          }
        }
      }
    }
    // ORDENAR VETOR Xs EM SCANLINES [Y, [[p1...pn]]]
    for (let i = 0; i < vetScanLinesFace.length; i++) {
      let scanline = vetScanLinesFace[i];
      let vetPontos = scanline[1];
      vetPontos = vetPontos.sort((a, b) => a[0] - b[0]);
      scanline[1] = vetPontos;
    }
    return vetScanLinesFace;
  };
  getIluminacaoRGB(propIlu, centroide, vetorNormal) {

    let kaRobj = propIlu[0][0];
    let kaGobj = propIlu[0][1];
    let kaBobj = propIlu[0][2];
    let kdRobj = propIlu[1][0];
    let kdGobj = propIlu[1][1];
    let kdBobj = propIlu[1][2];
    let ksRobj = propIlu[2][0];
    let ksGobj = propIlu[2][1];
    let ksBobj = propIlu[2][2];
    let iluNobj = propIlu[3];

    if(!rgbBool){
      let iluTotalR = calcularIluTotal([kaRobj, kdRobj, ksRobj, iluNobj], centroide, vetorNormal, iluAmbienteR, iluLampadaR);
      let iluminacaoRGB = [iluTotalR, iluTotalR, iluTotalR];
      return iluminacaoRGB;
    };

    let iluTotalR = calcularIluTotal([kaRobj, kdRobj, ksRobj, iluNobj], centroide, vetorNormal, iluAmbienteR, iluLampadaR);
    let iluTotalG = calcularIluTotal([kaGobj, kdGobj, ksGobj, iluNobj], centroide, vetorNormal, iluAmbienteG, iluLampadaG);
    let iluTotalB = calcularIluTotal([kaBobj, kdBobj, ksBobj, iluNobj], centroide, vetorNormal, iluAmbienteB, iluLampadaB);
    let iluminacaoRGB = [iluTotalR, iluTotalG, iluTotalB];
    
    return iluminacaoRGB;
  };
};
class faceClassGourad{
  constructor(face, vetorNormalMedio, propIlu) {  
    this.vetorNormalMedio = vetorNormalMedio; // [vetNormalP1, vetNormalP2, vetNormalP3, vetNormalP4]
    this.distanciaPintor = face.distanciaPintor;
    this.boolVisibilidadeNormal = face.boolVisibilidadeNormal;    
    this.iluminacaoPontos = this.calculaIluminacaoPontos(propIlu,
                                                          this.vetorNormalMedio,
                                                          face.pontos,
                                                          );
    this.pontosSrtIluminados = this.pontos2Srt(face.pontos, this.iluminacaoPontos) //armazenar as arestas ponto inicial e final
    this.arestasSrtIluminada = this.calculaArestasSRT(this.pontosSrtIluminados);
    this.arestasCompletaSRTiluminada = this.createArestaCompleta(this.arestasSrtIluminada); //NO SRT
    [this.yMin, this.yMax] = getMinMax(this.arestasCompletaSRTiluminada);
    this.scanLinesFace = this.createScanlinesFace(this.arestasCompletaSRTiluminada);
  };

  calculaIluminacaoPontos(propIlu, vetorNormalMedio, pontos) {
    let iluminacaoPontos = [];

    let kaRobj = propIlu[0][0];
    let kaGobj = propIlu[0][1];
    let kaBobj = propIlu[0][2];
    let kdRobj = propIlu[1][0];
    let kdGobj = propIlu[1][1];
    let kdBobj = propIlu[1][2];
    let ksRobj = propIlu[2][0];
    let ksGobj = propIlu[2][1];
    let ksBobj = propIlu[2][2];
    let iluNobj = propIlu[3];

    for (let i = 0; i < pontos.length; i++) {
      let ponto = pontos[i];
      let vetorNormal = vetorNormalMedio[i];
      let iluminacaoPontoR = calcularIluTotal([kaRobj, kdRobj, ksRobj, iluNobj], ponto, vetorNormal, iluAmbienteR, iluLampadaR);
      let iluminacaoPontoG = calcularIluTotal([kaGobj, kdGobj, ksGobj, iluNobj], ponto, vetorNormal, iluAmbienteG, iluLampadaG);
      let iluminacaoPontoB = calcularIluTotal([kaBobj, kdBobj, ksBobj, iluNobj], ponto, vetorNormal, iluAmbienteB, iluLampadaB);
      let iluminacaoPonto = [iluminacaoPontoR, iluminacaoPontoG, iluminacaoPontoB];     
      iluminacaoPontos.push(iluminacaoPonto); 
    }
    return iluminacaoPontos;
  }
  pontos2Srt(pontos, iluminacaoPontos) {
    let pontosSRT = addFatH(pontos);
    pontosSRT = pontoSRUtoSRT(pontosSRT);
    pontosSRT = removeFatH(pontosSRT);
    let pontosIluminadosSRT = [pontosSRT, iluminacaoPontos];
    pontosIluminadosSRT = recorte2DGourad(pontosIluminadosSRT) ;
    return pontosIluminadosSRT;
  };
  calculaArestasSRT(pontosSrtIluminados) {
    let arestasSrtIluminada = [];
    let len = pontosSrtIluminados[0].length;
    for (let i = 0; i < len; i++) {
      let p0 = pontosSrtIluminados[0][i];
      let p0ilu = pontosSrtIluminados[1][i];
      let p1 = pontosSrtIluminados[0][(i + 1) % len];
      let p1ilu = pontosSrtIluminados[1][(i + 1) % len];
      arestasSrtIluminada.push([[p0, p1], [p0ilu, p1ilu]]);
    }

    return arestasSrtIluminada;
  };
  createArestaCompleta(arestasSrtIluminada) {

    let lenI = arestasSrtIluminada.length;
    let novasArestas = [];
    
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let novaAresta = [];
      let aresta = arestasSrtIluminada[i][0];
      let arestaIlu = arestasSrtIluminada[i][1];

      let p0 = aresta[0];
      let p0Ilu = arestaIlu[0];
      let p1 = aresta[1];
      let p1Ilu = arestaIlu[1];

      let r0 = p0Ilu[0];
      let g0 = p0Ilu[1];
      let b0 = p0Ilu[2];

      let r1 = p1Ilu[0];
      let g1 = p1Ilu[1];
      let b1 = p1Ilu[2];

      if (p0[1] <= p1[1]) {
        let deltaY = p1[1] - p0[1];
        let taxaXIncremento = (p1[0] - p0[0]) / deltaY;
        let taxaZIncremento = (p1[2] - p0[2]) / deltaY;
        let taxaR = (r1 - r0) / deltaY;
        let taxaG = (g1 - g0) / deltaY;
        let taxaB = (b1 - b0) / deltaY;
        let npx = p0[0];
        let npy = p0[1];
        let npz = p0[2];
        let npR = r0;
        let npG = g0;
        let npB = b0;
        let npIlu = [npR, npG, npB]; 
        for (let j = 0; j < deltaY; j++) {
          novaAresta.push([Math.round(npx), Math.round(npy), npz, npIlu])  
          npx += taxaXIncremento;
          npz += taxaZIncremento;
          npy += 1; 
          npR += taxaR;
          npG += taxaG;
          npB += taxaB;
          npIlu = [npR, npG, npB];
        }

      } else {

        let deltaY = p0[1] - p1[1];
        let taxaR = (r0 - r1) / deltaY;
        let taxaG = (g0 - g1) / deltaY;
        let taxaB = (b0 - b1) / deltaY;
        let taxaXIncremento = (p0[0] - p1[0]) / deltaY;
        let taxaZIncremento = (p0[2] - p1[2]) / deltaY;
        let npx = p1[0];
        let npy = p1[1];
        let npz = p1[2];
        let npR = r1;
        let npG = g1;
        let npB = b1;
        let npIlu = [npR, npG, npB]; 
        for (let j = 0; j < deltaY; j++) {
          novaAresta.push([Math.round(npx), Math.round(npy), npz, npIlu])    
          npx += taxaXIncremento;
          npz += taxaZIncremento;
          npy += 1; 
          npR += taxaR;
          npG += taxaG;
          npB += taxaB;
          npIlu = [npR, npG, npB];
        }
      }
      novasArestas.push(novaAresta);      
    }

    return novasArestas;
  };
  createScanlinesFace(arestasCompletaSRT) {
    // INICIALIZAR SCANLINES [Y, [X...]]
    let vetScanLinesFace = [];
    let aux = this.yMin
    for (let i = this.yMin; i <= this.yMax; i++) {
      vetScanLinesFace.push([aux, []]);
      aux++;
    }
    let lenI = arestasCompletaSRT.length;
    // ADD Xs em SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = arestasCompletaSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let lenK = vetScanLinesFace.length;
        let pontoAresta = aresta[j];        
        for (let k = 0; k < lenK; k++) {
          if (pontoAresta[1] == vetScanLinesFace[k][0]) {
            vetScanLinesFace[k][1].push(pontoAresta);
          }
        }
      }
    }
    // ORDENAR VETOR Xs EM SCANLINES [Y, [[p1...pn]]]
    for (let i = 0; i < vetScanLinesFace.length; i++) {
      let scanline = vetScanLinesFace[i];
      let vetPontos = scanline[1];
      vetPontos = vetPontos.sort((a, b) => a[0] - b[0]);
      scanline[1] = vetPontos;
    }    
    return vetScanLinesFace;
  };
};
class faceClassPhong{
  constructor(face, vetorNormalMedio, propIlu) {  
    this.centroide = face.centroide;
    this.propIlu = propIlu;
    this.vetorNormalUnitario  = face.vetorNormalUnitario;
    this.vetorNormalMedio = vetorNormalMedio; // [vetNormalP1, vetNormalP2, vetNormalP3, vetNormalP4]
    this.vetObservacao = face.vetObservacao;
    this.distanciaPintor = face.distanciaPintor;
    this.boolVisibilidadeNormal = face.boolVisibilidadeNormal;    
    this.pontosSrt = this.pontos2Srt(face.pontos, this.vetorNormalMedio) //armazenar as arestas ponto inicial e final
    this.arestasSrt = this.calculaArestasSRT(this.pontosSrt);
    this.arestasCompletaSRT = this.createArestaCompleta(this.arestasSrt); //NO SRT
    [this.yMin, this.yMax] = getMinMax(this.arestasCompletaSRT);
    this.scanLinesFace = this.createScanlinesFace(this.arestasCompletaSRT);
  };
  pontos2Srt(pontos, vetoresNormaisPonto) {
    let pontosSRT = addFatH(pontos);
    pontosSRT = pontoSRUtoSRT(pontosSRT);
    pontosSRT = removeFatH(pontosSRT);
    let pontosSRTvetores = recorte2DPhong(pontosSRT, vetoresNormaisPonto) ;
    return pontosSRTvetores;
  };
  calculaArestasSRT(pontosSRTvetores) {
    let arestasSrt = [];
    let len = pontosSRTvetores[0].length;
    for (let i = 0; i < len; i++) {
      let p0 = pontosSRTvetores[0][i];
      let p0normal = pontosSRTvetores[1][i];
      let p1 = pontosSRTvetores[0][(i + 1) % len];
      let p1normal = pontosSRTvetores[1][(i + 1) % len];
      arestasSrt.push([[p0, p1], [p0normal, p1normal]]);
    }

    return arestasSrt;
  };
  createArestaCompleta(arestasSrt) {

    let lenI = arestasSrt.length;
    let novasArestas = [];
    
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let novaAresta = [];
      let aresta = arestasSrt[i][0];
      let vetNormal = arestasSrt[i][1];

      let p0 = aresta[0];
      let p0normal = vetNormal[0];
      let p1 = aresta[1];
      let p1normal = vetNormal[1];

      if (p0[1] <= p1[1]) {
        let deltaX = p1[0] - p0[0];
        let deltaY = p1[1] - p0[1];
        let deltaZ = p1[2] - p0[2];
        let deltaI = p1normal[0] - p0normal[0];
        let deltaJ = p1normal[1] - p0normal[1];
        let deltaK = p1normal[2] - p0normal[2];
        let taxaXIncremento = deltaX / deltaY;
        let taxaZIncremento = deltaZ / deltaY;
        let taxaIIncremento = deltaI / deltaY;
        let taxaJIncremento = deltaJ / deltaY;
        let taxaKIncremento = deltaK / deltaY;
        let npx = p0[0];
        let npy = p0[1];
        let npz = p0[2];
        let nI = p0normal[0];
        let nJ = p0normal[1];
        let nK = p0normal[2];
        let nVetNormal = [nI, nJ, nK];
        for (let j = 0; j < deltaY; j++) {
          novaAresta.push([Math.round(npx), Math.round(npy), npz, nVetNormal])  
          npx += taxaXIncremento;
          npz += taxaZIncremento;
          npy += 1; 
          nVetNormal[0] += taxaIIncremento;
          nVetNormal[1] += taxaJIncremento;
          nVetNormal[2] += taxaKIncremento;
          nVetNormal = vetorUnitario(nVetNormal);
        }

      } else {
        let deltaX = p0[0] - p1[0];
        let deltaY = p0[1] - p1[1];
        let deltaZ = p0[2] - p1[2];
        let deltaI = p0normal[0] - p1normal[0];
        let deltaJ = p0normal[1] - p1normal[1];
        let deltaK = p0normal[2] - p1normal[2];
        let taxaXIncremento = deltaX / deltaY;
        let taxaZIncremento = deltaZ / deltaY;
        let taxaIIncremento = deltaI / deltaY;
        let taxaJIncremento = deltaJ / deltaY;
        let taxaKIncremento = deltaK / deltaY;
        let npx = p1[0];
        let npy = p1[1];
        let npz = p1[2];
        let nI = p1normal[0];
        let nJ = p1normal[1];
        let nK = p1normal[2];
        let nVetNormal = [nI, nJ, nK];
        for (let j = 0; j < deltaY; j++) {
          novaAresta.push([Math.round(npx), Math.round(npy), npz, nVetNormal])    
          npx += taxaXIncremento;
          npz += taxaZIncremento;
          npy += 1; 
          nVetNormal[0] += taxaIIncremento;
          nVetNormal[1] += taxaJIncremento;
          nVetNormal[2] += taxaKIncremento;
          nVetNormal = vetorUnitario(nVetNormal);
        };
      };
      novasArestas.push(novaAresta);      
    };
    return novasArestas;
  };
  createScanlinesFace(arestasCompletaSRT) {
    // INICIALIZAR SCANLINES [Y, [X...]]
    let vetScanLinesFace = [];
    let aux = this.yMin
    for (let i = this.yMin; i <= this.yMax; i++) {
      vetScanLinesFace.push([aux, []]);
      aux++;
    };
    let lenI = arestasCompletaSRT.length;
    // ADD Xs em SCANLINES [Y, [X1, X2, ... Xn]]
    for (let i = 0; i < lenI; i++) { // PERCORRE AS ARESTAS
      let aresta = arestasCompletaSRT[i];
      let lenJ = aresta.length;
      for (let j = 0; j < lenJ; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
        let lenK = vetScanLinesFace.length;
        let pontoAresta = aresta[j];        
        for (let k = 0; k < lenK; k++) {
          if (pontoAresta[1] == vetScanLinesFace[k][0]) {
            vetScanLinesFace[k][1].push(pontoAresta);
          };
        };
      };
    };
    // ORDENAR VETOR Xs EM SCANLINES [Y, [[p1...pn]]]
    for (let i = 0; i < vetScanLinesFace.length; i++) {
      let scanline = vetScanLinesFace[i];
      let vetPontos = scanline[1];
      vetPontos = vetPontos.sort((a, b) => a[0] - b[0]);
      scanline[1] = vetPontos;
    };
    return vetScanLinesFace;
  };
};
class ZBuffer {
  constructor(u, v) {
    this.zBuffer = this.createZBuffer(u, v);
  }

  createZBuffer(u, v) {
    let zBuffer = [];
    for (let i = 0; i < u; i++) {
      zBuffer.push([]);
      for (let j = 0; j < v; j++) {
        zBuffer[i].push(-Infinity);
      }
    }
    return zBuffer;
  }

  getZBuffer(x, y) {
    if (x >= 0 && x < this.zBuffer.length && y >= 0 && y < this.zBuffer[0].length) {
      return this.zBuffer[x][y];
    } else {
      return -Infinity; // Retorna um valor padrão se os índices estiverem fora dos limites
    }
  }

  updateZBuffer(x, y, z) {
    if (x >= 0 && x < this.zBuffer.length && y >= 0 && y < this.zBuffer[0].length) {
      this.zBuffer[x][y] = z;
    }
  }
}

{//////// VARIRAVEIS GLOBAIS ////////////////
var visao = document.getElementById('visao').value || 'axonometrica';
var vetMalha = []

/// camera 
var xMin = document.getElementById('xMinSRU').value || -20;
var xMax = document.getElementById('xMaxSRU').value || 20;
var yMin = document.getElementById('yMinSRU').value || -15;
var yMax = document.getElementById('yMaxSRU').value || 15;

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
  
//BOOLs
var eixoBool = true;
var eixoPCverde = true;
var rgbBool = true;

//ILUMINACAO
var colorHexAmbiente = document.getElementById('rgbAmbiente')?.value || '#000000';
var iluAmbienteR = parseInt(colorHexAmbiente.substring(1, 3), 16);
var iluAmbienteG = parseInt(colorHexAmbiente.substring(3, 5), 16);
var iluAmbienteB = parseInt(colorHexAmbiente.substring(5, 7), 16);

var colorHexLampada = document.getElementById('rgbLampada')?.value || '#000000';
var iluLampadaR = parseInt(colorHexLampada.substring(1, 3), 16);
var iluLampadaG = parseInt(colorHexLampada.substring(3, 5), 16);
var iluLampadaB = parseInt(colorHexLampada.substring(5, 7), 16);

var xLampada = parseInt(document.getElementById('xLampada').value) || 0;
var yLampada = parseInt(document.getElementById('yLampada').value) || 0;
var zLampada = parseInt(document.getElementById('zLampada').value) || 0;
} ////////////////////////////////////////////////
  
{//////// FUNCOES BASICAS ////////////////////////////////////////////////

function addFatH(vetor) {
  let novoVetor = vetor.map((ponto) => [...ponto, this.fatH]);
  return novoVetor;
};
function removeFatH(vetor) {
  let novoVetor = vetor.map((ponto) => ponto.slice(0, -1));
  return novoVetor;
};

}/////////////////////////////////////////////////////////////////////

{//////// FUNCOES MATEMATICAS ////////////////////////////////////////////////

function getMinMax(arestas) {
  let yMin = Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < arestas.length; i++) { // PERCORRE AS ARESTAS
    let aresta = arestas[i];
    for (let j = 0; j < aresta.length; j++) { // PERCORRE OS PONTOS DA ARESTA P0 E P1
      let ytestado = aresta[j][1];
      if (ytestado < yMin) {
        yMin = ytestado;
      }
      if (ytestado > yMax) {
        yMax = ytestado;
      }
    }
  }
  return [yMin, yMax];
} ;
function vetorUnitario(vetor) {
  let magnitude = Math.sqrt(vetor.reduce((sum, val) => sum + val * val, 0));
  return vetor.map(val => val / magnitude);
};
function produtoEscalar(vetorA, vetorB) {
  if (vetorA.length !== vetorB.length) {
    throw new Error("Os vetores devem ter o mesmo tamanho");
  }
  return vetorA.reduce((sum, val, index) => sum + val * vetorB[index], 0);
};
function produtoVetorial(vetorA, vetorB) {
  if (vetorA.length !== 3 || vetorB.length !== 3) {
    throw new Error("Os vetores devem ter tamanho 3");
  }
  return [
    vetorA[1] * vetorB[2] - vetorA[2] * vetorB[1],
    vetorA[2] * vetorB[0] - vetorA[0] * vetorB[2],
    vetorA[0] * vetorB[1] - vetorA[1] * vetorB[0]
  ];
};
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
};
function matriz44x41(matrix4x4, ponto) {
  let listaResultado = Array(4).fill(0);
  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          listaResultado[i] += matrix4x4[i][j] * ponto[j];
      }
  }
  return listaResultado; 
};
function fatorHomogeneo(vetor) {
  return novoVetor = [vetor[0]/vetor[3], vetor[1]/vetor[3], vetor[2], vetor[3]];
};

// VETOR o OU s
function calculaCentroide(pontos) {
  let somaX = 0;
  let somaY = 0;
  let somaZ = 0;
  for (let i = 0; i < pontos.length; i++) {
    somaX += pontos[i][0];
    somaY += pontos[i][1];
    somaZ += pontos[i][2];
  }
  return [somaX / 4, somaY / 4, somaZ / 4];
};
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

function calculaVetorNormalInverso(pontos) {

  let vetP2P3 = [pontos[2][0] - pontos[1][0],
                  pontos[2][1] - pontos[1][1],
                  pontos[2][2] - pontos[1][2]];
                  
  let vetP2P1 = [pontos[0][0] - pontos[1][0], 
                  pontos[0][1] - pontos[1][1], 
                  pontos[0][2] - pontos[1][2]];
  let vetorNormal = produtoVetorial(vetP2P3, vetP2P1);
  //let vetorNormal = produtoVetorial(vetP2P1, vetP2P3);
  return vetorNormal;    
}

}/////////////////////////////////////////////////////////////////////

{//////// FUNCOES DE DESENHO ////////////////////////////////////////////////
function renderiza() {

  zBuffer = new ZBuffer(uMaxViewport, vMaxViewport);
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  printEixo3d();
  drawViewport();
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    drawGridBspline(malha, malha.centroideMalha);
    if (malha.visibilidadePC) {
      drawPontosControle(malha.gridControleSRT);
    }
  }
  drawPCselecionado();
};
function drawLine(x1, y1, x2, y2, color = 'black') {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.beginPath(); // Inicia o caminho
  ctx.moveTo(x1, y1); // Move para o ponto inicial
  ctx.lineTo(x2, y2); // Desenha até o ponto final
  ctx.strokeStyle = color; // Define a cor da linha
  ctx.stroke(); // Renderiza a linha
};
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
};
function drawViewport() { 
  var canvas = document.getElementById('viewport');
  var context = canvas.getContext('2d');
  context.beginPath();
  context.rect(uMinViewport, vMinViewport, uMaxViewport - uMinViewport, vMaxViewport - vMinViewport);
  context.strokeStyle = 'black';
  context.lineWidth = 0.5;
  context.stroke();
};
function getFaces(grid) {
  let lenI = grid.length - 1;
  let lenJ = grid[0].length - 1;
  let matrizFaces = [];
  for (let i = 0; i < lenI; i++) {
    let faces = [];
    for (let j = 0; j < lenJ; j++) {
      let face = [grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]];
      faces.push(new faceClass(face));
    }
    matrizFaces.push(faces);
  }  
  return matrizFaces;
};
function paintFace(scanLines, color) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  let lenScanline = scanLines.length;
  for (let i = 0; i < lenScanline; i++) {
    let pontoY = scanLines[i][0];
    let vetPontos = scanLines[i][1];
    let lenPontos = vetPontos.length;
    let p0 = vetPontos[0];
    let p1 = vetPontos[lenPontos - 1];
    let x0 = p0[0];
    let x1 = p1[0];
    let z0 = p0[2];
    let z1 = p1[2];
    let deltaX = x1 - x0;
    if (deltaX === 0) deltaX = 1e-6;
    let taxaZ = (z1 - z0) / deltaX;
    let pontoZ = z0;
   
    for (let pontoX = x0; pontoX < x1; pontoX++) {
      if (zBuffer.getZBuffer(pontoX, pontoY) <= pontoZ) {
        ctx.fillStyle = color;
        ctx.fillRect(pontoX, pontoY, 1, 1);
        zBuffer.updateZBuffer(pontoX, pontoY, pontoZ);
      };
      pontoZ += taxaZ;    
    };

  };
};
function paintFaceGouraud(scanLines) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  let lenScanline = scanLines.length;
  for (let i = 0; i < lenScanline; i++) {
    let scanline = scanLines[i];
    let pontoY = scanline[0];
    let pontos = scanline[1];
    let lenPontos = pontos.length;
    let p0 = pontos[0];
    let p1 = pontos[lenPontos - 1];
    let x0 = p0[0];
    let x1 = p1[0];
    let z0 = p0[2];
    let z1 = p1[2];
    let deltaX = x1 - x0;
    if (deltaX === 0) deltaX = 1e-6;
    let taxaZ = (z1 - z0) / deltaX;
    let pontoZ = z0;
    let cor0 = p0[3];
    let cor1 = p1[3];

    

    let taxaR = (cor1[0] - cor0[0]) / deltaX;
    let taxaG = (cor1[1] - cor0[1]) / deltaX;
    let taxaB = (cor1[2] - cor0[2]) / deltaX;

    let corR = cor0[0];
    let corG = cor0[1];
    let corB = cor0[2];

    for (let pontoX = x0; pontoX < x1; pontoX++) {
      if (zBuffer.getZBuffer(pontoX, pontoY) <= pontoZ) {
        if (rgbBool) {
          ctx.fillStyle = `rgb(${corR},${corG},${corB})`;
        } else {
          ctx.fillStyle = `rgb(${corR},${corR},${corR})`;
        };
        ctx.fillRect(pontoX, pontoY, 1, 1);
        zBuffer.updateZBuffer(pontoX, pontoY, pontoZ);
      };
      corR += taxaR;
      corG += taxaG;
      corB += taxaB;
      pontoZ += taxaZ;
    };
  };
};
function paintFacePhong(scanLines, vetorLuz, vetH, propIlu) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  let lenScanline = scanLines.length;

  

  let kaRobj = propIlu[0][0];
  let kaGobj = propIlu[0][1];
  let kaBobj = propIlu[0][2];
  let kdRobj = propIlu[1][0];
  let kdGobj = propIlu[1][1];
  let kdBobj = propIlu[1][2];
  let ksRobj = propIlu[2][0];
  let ksGobj = propIlu[2][1];
  let ksBobj = propIlu[2][2];
  let iluNobj = propIlu[3];

  
  for (let i = 0; i < lenScanline; i++) {
    let scanline = scanLines[i];

    let pontoY = scanline[0];
    let pontos = scanline[1];
    let lenPontos = pontos.length;
    let p0 = pontos[0];
    let x0 = p0[0];
    let z0 = p0[2];
    let p1 = pontos[lenPontos - 1];
    let x1 = p1[0];
    let z1 = p1[2];
    let vetNormalPonto0 = p0[3];
    
    let vetNormalPonto1 = p1[3];
    let deltaX = x1 - x0;
    if (deltaX === 0) deltaX = 1e-6;
    let taxaIIncremento = (vetNormalPonto1[0] - vetNormalPonto0[0]) / deltaX;
    let taxaJIncremento = (vetNormalPonto1[1] - vetNormalPonto0[1]) / deltaX;
    let taxaKIncremento = (vetNormalPonto1[2] - vetNormalPonto0[2]) / deltaX;

    let taxaZ = (z1 - z0) / deltaX;
    let pontoZ = z0;
    let vetNormalPonto = vetNormalPonto0;



    for (let pontoX = x0; pontoX < x1; pontoX++) {
      if (zBuffer.getZBuffer(pontoX, pontoY) <= pontoZ) {

        if (rgbBool) {
          let iluTotalR = calcularIluTotalPhong([kaRobj, kdRobj, ksRobj, iluNobj], vetNormalPonto, vetorLuz, vetH, iluAmbienteR, iluLampadaR);
          let iluTotalG = calcularIluTotalPhong([kaGobj, kdGobj, ksGobj, iluNobj], vetNormalPonto, vetorLuz, vetH, iluAmbienteG, iluLampadaG);
          let iluTotalB = calcularIluTotalPhong([kaBobj, kdBobj, ksBobj, iluNobj], vetNormalPonto, vetorLuz, vetH, iluAmbienteB, iluLampadaB);
          ctx.fillStyle = `rgb(${iluTotalR},${iluTotalG},${iluTotalB})`;
        } else {
          let iluTotalR = calcularIluTotalPhong([kaRobj, kdRobj, ksRobj, iluNobj], vetNormalPonto, vetorLuz, vetH, iluAmbienteR, iluLampadaR);
          ctx.fillStyle = `rgb(${iluTotalR},${iluTotalR},${iluTotalR})`;
        };
        ctx.fillRect(pontoX, pontoY, 1, 1);
        zBuffer.updateZBuffer(pontoX, pontoY, pontoZ);
      }
      pontoZ += taxaZ;
      vetNormalPonto[0] += taxaIIncremento;
      vetNormalPonto[1] += taxaJIncremento;
      vetNormalPonto[2] += taxaKIncremento;
      vetNormalPonto = vetorUnitario(vetNormalPonto);
    }
  }
};
function paintAresta(scanLines, color) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  let lenScanline = scanLines.length;
  for (let i = 0; i < lenScanline; i++) {
    let pontoY = scanLines[i][0];
    let pontos = scanLines[i][1];
    let lenPontos = pontos.length;
    for (let j = 0; j < lenPontos; j++) {
      let pontoX = pontos[j][0];
      let pontoZ = pontos[j][2];
      if (zBuffer.getZBuffer(pontoX, pontoY) <= pontoZ) {
        ctx.fillRect(pontoX, pontoY, 1, 1);
        zBuffer.updateZBuffer(pontoX, pontoY, pontoZ);
      };
    };
  };
};
function drawGridBspline(malha, centroideMalha) {
  let faces = malha.facesBsplineSRU;
  let facesLenght = faces.length;

  if (tipoSombreamento === 'Nenhum') {
    for (let i = 0; i < facesLenght; i++) { // PERCORRE TODAS AS FACES
      let face = faces[i];
      let cor = 'white';
      
      if (boolPintarFaces) {
        paintFace(face.scanLinesFace, cor);
      };

      if (boolArestasVerdeVermelha) {
        if (face.boolVisibilidadeNormal) {
          paintAresta(face.scanLinesFace, 'green');
        } else {
          paintAresta(face.scanLinesFace, 'red');
        };
      };
    };
  };

  if (tipoSombreamento === 'Constante') {
    for (let i = 0; i < facesLenght; i++) { // PERCORRE TODAS AS FACES
      let face = faces[i];
      let iluminacaoRGB = face.iluminacaoRGB;
      let cor = `rgb(${iluminacaoRGB[0]},${iluminacaoRGB[1]},${iluminacaoRGB[2]})`;

      if (boolPintarFaces) {
        paintFace(face.scanLinesFace, cor);
      };

      if (boolArestasVerdeVermelha) {
        if (face.boolVisibilidadeNormal) {
          paintAresta(face.scanLinesFace, 'green');
        } else {
          paintAresta(face.scanLinesFace, 'red');
        };
      };
    };
  };

  if (tipoSombreamento === 'Gouraud') {
    for (let i = 0; i < facesLenght; i++) { // PERCORRE TODAS AS FACES
      let face = faces[i];
      
      if (boolPintarFaces) {
        paintFaceGouraud(face.scanLinesFace);
      };
      
      if (boolArestasVerdeVermelha) {
        if (face.boolVisibilidadeNormal) {
          paintAresta(face.scanLinesFace, 'green');
        } else {
          paintAresta(face.scanLinesFace, 'red');
        } 
      };
    };
  };

  if (tipoSombreamento === 'Phong') {
    
    let vetorLuz = [xLampada - centroideMalha[0],
                    yLampada - centroideMalha[1], 
                    zLampada - centroideMalha[2]];
    vetorLuz = vetorUnitario(vetorLuz);
    let vetorS = [vetVrp[0] - centroideMalha[0],
                  vetVrp[1] - centroideMalha[1],
                  vetVrp[2] - centroideMalha[2]];
    vetorS = vetorUnitario(vetorS);
    let vetH = [vetorLuz[0] + vetorS[0],
                vetorLuz[1] + vetorS[1],
                vetorLuz[2] + vetorS[2]];
    vetH = vetorUnitario(vetH);

    for (let i = 0; i < facesLenght; i++) { // PERCORRE TODAS AS FACES
      let face = faces[i];  
      if (boolPintarFaces) {
        paintFacePhong(face.scanLinesFace, vetorLuz, vetH, face.propIlu);
      };

      if (boolArestasVerdeVermelha) {
        if (face.boolVisibilidadeNormal) {
          paintAresta(face.scanLinesFace, 'green');
        } else {
          paintAresta(face.scanLinesFace, 'red');
        } 
      }
    };
  };
};
function drawPontosControle(gridControle) {
  for (let i = 0; i < gridControle.length; i++) {
    for (let j = 0; j < gridControle[i].length; j++) {
        drawCircle(gridControle[i][j][0], gridControle[i][j][1], lenPontosControle, 'red');
    }
  }
};
function drawCircle(x, y, radius, color) {
  var canvas = document.getElementById('viewport');
  var ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
};
function drawPCselecionado() {
  try {
    if (eixoPCverde) {
      let i = indicePCsele[0];
      let j = indicePCsele[1];
      gridObjeto = selectedMalha.gridControleSRT;
      try {
        drawCircle(gridObjeto[i][j][0], gridObjeto[i][j][1], lenPontosControle, 'rgb(145, 255, 0)');
      } catch (error) {
        console.log('Ponto de controle selecionado fora do grid');
      }
    }
  } catch (error) {
    console.log('Erro ao desenhar ponto de controle selecionado:', error);
  };
};
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
};
function recorte2DGourad(pontosIluminados) {
  let pontos = pontosIluminados[0];
  let iluminacao = pontosIluminados[1];
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

  function intersecao(p1, p2, i1, i2, limite, eixo) {
    let x1 = p1[0], y1 = p1[1], z1 = p1[2];
    let x2 = p2[0], y2 = p2[1], z2 = p2[2];
    
    let fator = eixo === "x" ? (limite - x1) / (x2 - x1) : (limite - y1) / (y2 - y1);
    let x = eixo === "x" ? limite : x1 + (x2 - x1) * fator;
    let y = eixo === "y" ? limite : y1 + (y2 - y1) * fator;
    let z = z1 + (z2 - z1) * fator;
    
    let novaIlum = i1.map((val, idx) => val + (i2[idx] - val) * fator);
    
    return [[x, y, z], novaIlum];
  }

  function recorteContraBorda(pontos, iluminacao, testeDentro, limite, eixo) {
      let novosPontos = [];
      let novaIluminacao = [];

      for (let i = 0; i < pontos.length; i++) {
          let p0 = pontos[i];
          let p1 = pontos[(i + 1) % pontos.length];
          let i0 = iluminacao[i];
          let i1 = iluminacao[(i + 1) % iluminacao.length];

          let dentro0 = testeDentro(p0);
          let dentro1 = testeDentro(p1);

          if (dentro0 && dentro1) {
              novosPontos.push(p1);
              novaIluminacao.push(i1);
          } else if (dentro0 && !dentro1) {
              let [pInt, iInt] = intersecao(p0, p1, i0, i1, limite, eixo);
              novosPontos.push(pInt);
              novaIluminacao.push(iInt);
          } else if (!dentro0 && dentro1) {
              let [pInt, iInt] = intersecao(p0, p1, i0, i1, limite, eixo);
              novosPontos.push(pInt);
              novaIluminacao.push(iInt);
              novosPontos.push(p1);
              novaIluminacao.push(i1);
          }
      }
      return [novosPontos, novaIluminacao];
  }

  let resultado = [pontos, iluminacao];
  resultado = recorteContraBorda(...resultado, testeDentroEsquerda, uMinViewport, "x");
  resultado = recorteContraBorda(...resultado, testeDentroDireita, uMaxViewport, "x");
  resultado = recorteContraBorda(...resultado, testeDentroAbaixo, vMaxViewport, "y");
  resultado = recorteContraBorda(...resultado, testeDentroAcima, vMinViewport, "y");

  return resultado;
};
function recorte2DPhong(pontos, vetMedios) {
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

  function intersecao(p1, p2, n1, n2, limite, eixo) {
      let x1 = p1[0], y1 = p1[1], z1 = p1[2];
      let x2 = p2[0], y2 = p2[1], z2 = p2[2];
      
      let fator = eixo === "x" ? (limite - x1) / (x2 - x1) : (limite - y1) / (y2 - y1);
      let x = eixo === "x" ? limite : x1 + (x2 - x1) * fator;
      let y = eixo === "y" ? limite : y1 + (y2 - y1) * fator;
      let z = z1 + (z2 - z1) * fator;
      let novaNormal = [
          n1[0] + (n2[0] - n1[0]) * fator,
          n1[1] + (n2[1] - n1[1]) * fator,
          n1[2] + (n2[2] - n1[2]) * fator
      ];

      return [[x, y, z], novaNormal];
  }

  function recorteContraBorda(pontos, vetMedios, testeDentro, limite, eixo) {
          let novosPontos = [];
          let novasNormais = [];

          for (let i = 0; i < pontos.length; i++) {
                  let p0 = pontos[i];
                  let p1 = pontos[(i + 1) % pontos.length];
                  let n0 = vetMedios[i];
                  let n1 = vetMedios[(i + 1) % vetMedios.length];

                  let dentro0 = testeDentro(p0);
                  let dentro1 = testeDentro(p1);

                  if (dentro0 && dentro1) {
                          novosPontos.push(p1);
                          novasNormais.push(n1);
                  } else if (dentro0 && !dentro1) {
                          let [pInt, nInt] = intersecao(p0, p1, n0, n1, limite, eixo);
                          novosPontos.push(pInt);
                          novasNormais.push(nInt);
                  } else if (!dentro0 && dentro1) {
                          let [pInt, nInt] = intersecao(p0, p1, n0, n1, limite, eixo);
                          novosPontos.push(pInt);
                          novasNormais.push(nInt);
                          novosPontos.push(p1);
                          novasNormais.push(n1);
                  }
          }
          return [novosPontos, novasNormais];
  }

  let resultado = [pontos, vetMedios];
  resultado = recorteContraBorda(...resultado, testeDentroEsquerda, uMinViewport, "x");
  resultado = recorteContraBorda(...resultado, testeDentroDireita, uMaxViewport, "x");
  resultado = recorteContraBorda(...resultado, testeDentroAbaixo, vMaxViewport, "y");
  resultado = recorteContraBorda(...resultado, testeDentroAcima, vMinViewport, "y");

  return resultado;
};
}/////////////////////////////////////////////////////////////////////

{/// FUNCOES /////////////////////////////////////////
function obterVizinhos(i, j, matrizFaces) { // Retorna os vizinhos de uma face
  let vizinhos = [];
  let linhas = matrizFaces.length;
  let colunas = matrizFaces[i].length;
  // Verifica o vizinho à esquerda
  if (j > 0) {
    vizinhos.push(matrizFaces[i][j - 1]);
  };
  
  // Verifica o vizinho à direita
  if (j < colunas - 1) {
    vizinhos.push(matrizFaces[i][j + 1]);
  };
  
  // Verifica o vizinho acima
  if (i > 0) {
    vizinhos.push(matrizFaces[i - 1][j]);
  };
  
  // Verifica o vizinho abaixo
  if (i < linhas - 1) {
    vizinhos.push(matrizFaces[i + 1][j]);
  };

  // Verifica o vizinho diagonal superior esquerda
  if (i > 0 && j > 0) {
    vizinhos.push(matrizFaces[i - 1][j - 1]);
  };
  
  // Verifica o vizinho diagonal superior direita
  if (i > 0 && j < colunas - 1) {
    vizinhos.push(matrizFaces[i - 1][j + 1]);
  };
  
  // Verifica o vizinho diagonal inferior esquerda
  if (i < linhas - 1 && j > 0) {
    vizinhos.push(matrizFaces[i + 1][j - 1]);
  };

  // Verifica o vizinho diagonal inferior direita
  if (i < linhas - 1 && j < colunas - 1) {
    vizinhos.push(matrizFaces[i + 1][j + 1]);
  };
  return vizinhos;
}
// ILUMINAÇÃO
function calcularIluTotal([kaObj, kdObj, ksObj, iluNObj], centroide_vertice, vetNormal, iluAmbiente, iluLampada) { // Calcula a iluminação total de um ponto

  // Iluminacao ambiente (Ia = Il . Ka)
  let iluTotal = iluAmbiente*kaObj;
  if (iluTotal>=255){
    return 255;
  };

  // Iluminação difusa (Id = Il . Kd . (N^ . L^))
  let vetorLuz = [xLampada - centroide_vertice[0],
                  yLampada - centroide_vertice[1],
                  zLampada - centroide_vertice[2]];
  vetorLuz = vetorUnitario(vetorLuz);
  let escalarNL = produtoEscalar(vetNormal,vetorLuz)
  let iluDifusa = iluLampada * kdObj * escalarNL;
  if (escalarNL <= 0 || iluDifusa <= 0) {
    return iluTotal;
  };
  iluTotal += iluDifusa;

  // Iluminação especular (Is = Il . Ks . (R^.S^)^n)
  let vetorS = [vetVrp[0] - centroide_vertice[0],
                vetVrp[1] - centroide_vertice[1],
                vetVrp[2] - centroide_vertice[2]];
                vetorS = vetorUnitario(vetorS);
  //R^ = (2 . L^ . N^).N^ - L^ // s == o ; vetor de observação
  let vetorR = [2*escalarNL*vetNormal[0] - vetorLuz[0],
                2*escalarNL*vetNormal[1] - vetorLuz[1],
                2*escalarNL*vetNormal[2] - vetorLuz[2]];  
  let escalarRS = produtoEscalar(vetorUnitario(vetorR), vetorS);
  let iluEspecular = iluLampada * ksObj * (escalarRS ** iluNObj);
  if (escalarRS <=0 || iluEspecular <= 0) {
    return iluTotal;
  }
  iluTotal += iluEspecular;
  return iluTotal
};
function calcularIluTotalPhong([kaObj, kdObj, ksObj, iluNObj], vetNormalPonto, vetorLuz, vetorH, iluAmbiente, iluLampada) { // Calcula a iluminação total de um ponto PHONG
  // Iluminacao ambiente (Ia = Il . Ka)
  let iluTotal = iluAmbiente * kaObj;
  if (iluTotal >= 255) {
    return 255;
  }

  // Iluminação difusa (Id = Il . Kd . (N^ . L^))
  let escalarNL = produtoEscalar(vetNormalPonto,vetorLuz)
  let iluDifusa = iluLampada * kdObj * escalarNL;
  if (escalarNL <= 0 || iluDifusa <= 0) {
    return iluTotal;
  };
  
  // Iluminação especular (Is = Il . Ks . (N^.H^)^n)
  let escalarNH = produtoEscalar(vetNormalPonto, vetorH);
  let iluEspecular = iluLampada * ksObj * (escalarNH ** iluNObj);
  if (escalarNH <=0 || iluEspecular <= 0) {
    return iluTotal
  }
  iluTotal += iluEspecular;
  return iluTotal;
};

// BSPLINES
function transporUmaMatriz(matriz) {
  let matrizTransposta = [];
  for (let i = 0; i < matriz[0].length; i++) {
    matrizTransposta[i] = [];
    for (let j = 0; j < matriz.length; j++) {
      matrizTransposta[i][j] = matriz[j][i];
    }
  }
  return matrizTransposta;
};
function calculateBspline(pontosDeControle, nSegmentos) { // Calcula os pontos da curva BSpline
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
      
      if (i==1){
        for (let j = 0; j <= nSegmentos; j++) {
          let t = j / nSegmentos;
          let x = ((a3 * t + a2) * t + a1) * t + a0;
          let y = ((b3 * t + b2) * t + b1) * t + b0;
          let z = ((c3 * t + c2) * t + c1) * t + c0;
  
          pontosDaCurva.push([x, y, z]);
        }
      } else {
        for (let j = 1; j <= nSegmentos; j++) {
          let t = j / nSegmentos;
          let x = ((a3 * t + a2) * t + a1) * t + a0;
          let y = ((b3 * t + b2) * t + b1) * t + b0;
          let z = ((c3 * t + c2) * t + c1) * t + c0;
  
          pontosDaCurva.push([x, y, z]);
        }
      }

  }

  return pontosDaCurva;
};
function createGridBspline(gridSRUPontosControle){ // Cria GRID
  let gridBspline = [];
  let lengthI = gridSRUPontosControle.length;
  // PEGAR OS INDICES PARA LINHAS
  for (let i = 0; i < lengthI; i++) {
    gridBspline.push(calculateBspline(gridSRUPontosControle[i], nSegmentosU));
  }
  gridBspline = transporUmaMatriz(gridBspline);
  lengthI = gridBspline.length;
  let gridBsplineFinal = [];
  for (let i = 0; i < lengthI; i++) {
    gridBsplineFinal.push(calculateBspline(gridBspline[i], nSegmentosV));
  }
  return gridBsplineFinal;
};

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
};
function updateProgramaTotal() {  
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    malha.updateReset();
  }
  renderiza();
};
function updatePrograma() {  
  for (let i = 0; i < vetMalha.length; i++) {
    let malha = vetMalha[i];
    malha.update();
  }
  renderiza();
};

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
let ponto2 = [0,-15,0];
let ponto3 = [10,-15,0];
let ponto4 = [10,15,0];

ponto1 = [0,10,0];
ponto2 = [0,0,0];
ponto3 = [10, 0, 0];
ponto4 = [10, 10, 0];

let pontosMalha = [ponto1, ponto2, ponto3, ponto4]

malha1 = new malha(pontosMalha);
vetMalha.push(malha1);


ponto1 = [0,0,0];
ponto2 = [0,0,10];
ponto3 = [10, 0, 10];
ponto4 = [10, 0, 0];
pontosMalha = [ponto1, ponto2, ponto3, ponto4]

malha2 = new malha(pontosMalha);
vetMalha.push(malha2);


//// OUTRAS VARIAVEIS GLOBAIS
var selectedMalha = vetMalha[0];
var pcSelecionado = selectedMalha.gridControleSRU[indicePCsele[0]][indicePCsele[1]];

var tipoSombreamento = document.getElementById('tipoSombreamento').value;
var boolArestasVerdeVermelha = document.getElementById('boolArestasVerdeVermelha').checked;
var boolPintarFaces = document.getElementById('boolPintarFaces').checked;

var zBuffer = new ZBuffer(uMaxViewport, vMaxViewport);

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
  
  //BOOLS
  eixoBool = document.getElementById('eixo3d').checked;
  eixoPCverde = document.getElementById('pcVerde').checked;
  rgbBool = document.getElementById('rgbBool').checked;

  lenPontosControle = document.getElementById('tamPC').value || 4; 
  nSegmentosU = parseInt(document.getElementById('nSegmentosU').value) || 1;
  nSegmentosV = parseInt(document.getElementById('nSegmentosV').value) || 1;
  //selectedMalha.visibilidadeGridControle = document.getElementById('visibilidadeGridControle').checked;
  selectedMalha.visibilidadePC = document.getElementById('visibilidadePC').checked;


  colorHexAmbiente = document.getElementById('rgbAmbiente')?.value || '#000000';
  iluAmbienteR = parseInt(colorHexAmbiente.substring(1, 3), 16);
  iluAmbienteG = parseInt(colorHexAmbiente.substring(3, 5), 16);
  iluAmbienteB = parseInt(colorHexAmbiente.substring(5, 7), 16);

  colorHexLampada = document.getElementById('rgbLampada')?.value || '#000000';
  iluLampadaR = parseInt(colorHexLampada.substring(1, 3), 16);
  iluLampadaG = parseInt(colorHexLampada.substring(3, 5), 16);
  iluLampadaB = parseInt(colorHexLampada.substring(5, 7), 16);
  
  xLampada = parseInt(document.getElementById('xLampada').value) || 0;
  yLampada = parseInt(document.getElementById('yLampada').value) || 0;
  zLampada = parseInt(document.getElementById('zLampada').value) || 0;

  selectedMalha.kaR = parseFloat(document.getElementById('kaR').value) || 0;
  selectedMalha.kaG = parseFloat(document.getElementById('kaG').value) || 0;
  selectedMalha.kaB = parseFloat(document.getElementById('kaB').value) || 0;
  selectedMalha.kdR = parseFloat(document.getElementById('kdR').value) || 0;
  selectedMalha.kdG = parseFloat(document.getElementById('kdG').value) || 0;
  selectedMalha.kdB = parseFloat(document.getElementById('kdB').value) || 0;
  selectedMalha.ksR = parseFloat(document.getElementById('ksR').value) || 0;
  selectedMalha.ksG = parseFloat(document.getElementById('ksG').value) || 0;
  selectedMalha.ksB = parseFloat(document.getElementById('ksB').value) || 0;
  selectedMalha.nIluminacao = parseInt(document.getElementById('nIluminacao').value) || 10;
  selectedMalha.propIlu = [[selectedMalha.kaR, selectedMalha.kaG, selectedMalha.kaB], 
                          [selectedMalha.kdR, selectedMalha.kdG, selectedMalha.kdB], 
                          [selectedMalha.ksR, selectedMalha.ksG, selectedMalha.ksB], 
                          selectedMalha.nIluminacao];


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

document.getElementById('tamPC').addEventListener('input', onFieldChange);
document.getElementById('pcVerde').addEventListener('input', onFieldChange);
//document.getElementById('visibilidadeGridControle').addEventListener('input', onFieldChange);
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

document.getElementById('rgbAmbiente').addEventListener('input', onFieldChange);
document.getElementById('rgbLampada').addEventListener('input', onFieldChange);

document.getElementById('kaR').addEventListener('input', onFieldChange);
document.getElementById('kaG').addEventListener('input', onFieldChange);
document.getElementById('kaB').addEventListener('input', onFieldChange);
document.getElementById('kdR').addEventListener('input', onFieldChange);
document.getElementById('kdG').addEventListener('input', onFieldChange);
document.getElementById('kdB').addEventListener('input', onFieldChange);
document.getElementById('ksR').addEventListener('input', onFieldChange);
document.getElementById('ksG').addEventListener('input', onFieldChange);
document.getElementById('ksB').addEventListener('input', onFieldChange);
document.getElementById('nIluminacao').addEventListener('input', onFieldChange);

document.getElementById('eixo3d').addEventListener('input', onFieldChange);
document.getElementById('boolArestasVerdeVermelha').addEventListener('input', onFieldChange);
document.getElementById('boolPintarFaces').addEventListener('input', onFieldChange);
document.getElementById('rgbBool').addEventListener('input', onFieldChange);


const selectMalha = document.getElementById("malhaSelecionada");
const sclInput = document.getElementById("scl");
const rotXInput = document.getElementById("xRot");
const rotYInput = document.getElementById("yRot");
const rotZInput = document.getElementById("zRot");
const translXInput = document.getElementById("translX");
const translYInput = document.getElementById("translY");
const translZInput = document.getElementById("translZ");
//const visibilidadeGridControleInput = document.getElementById("visibilidadeGridControle");
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

const kaRInput = document.getElementById("kaR");
const kaGInput = document.getElementById("kaG");
const kaBInput = document.getElementById("kaB");

const kdRInput = document.getElementById("kdR");
const kdGInput = document.getElementById("kdG");
const kdBInput = document.getElementById("kdB");

const ksRInput = document.getElementById("ksR");
const ksGInput = document.getElementById("ksG");
const ksBInput = document.getElementById("ksB");

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
  //visibilidadeGridControleInput.checked = malha.visibilidadeGridControle;
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
  kaRInput.value = malha.kaR;
  kaGInput.value = malha.kaG;
  kaBInput.value = malha.kaB;
  kdRInput.value = malha.kdR;
  kdGInput.value = malha.kdG;
  kdBInput.value = malha.kdB;
  ksRInput.value = malha.ksR;
  ksGInput.value = malha.ksG;
  ksBInput.value = malha.ksB;
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


///////////// ADD MALHA /////////////
var modal = document.getElementById("modalAdicionarMalha");
var btn = document.getElementById("adicionarMalha");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function updateMalhaSelector() {
  const selectMalha = document.getElementById("malhaSelecionada");
  selectMalha.innerHTML = "";
  vetMalha.forEach((malha, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.textContent = `Malha ${index + 1}`;
    selectMalha.appendChild(option);
  });
  if (vetMalha.length > 0) {
    selectMalha.selectedIndex = vetMalha.length - 1;
    selectedMalha = vetMalha[vetMalha.length - 1];
    atualizarInputsMalha(selectedMalha);
  } else {
    selectedMalha = null;
    // Limpar os inputs se não houver malhas
    atualizarInputsMalha({
      scl: '',
      rotX: '',
      rotY: '',
      rotZ: '',
      translX: '',
      translY: '',
      translZ: '',
      visibilidadePC: false,
      p1: ['', '', ''],
      p2: ['', '', ''],
      p3: ['', '', ''],
      p4: ['', '', ''],
      mMalha: '',
      nMalha: '',
      ka: '',
      kd: '',
      ks: '',
      nIluminacao: ''
    });
  }
}
// Adicionar evento ao botão "Excluir Malha"
document.getElementById('excluirMalha').addEventListener('click', function() {
  const selectMalha = document.getElementById("malhaSelecionada");
  const selectedIndex = selectMalha.selectedIndex;
  if (selectedIndex >= 0) {
    vetMalha.splice(selectedIndex, 1);
    updateMalhaSelector();
    updatePrograma();
  }
});

// Atualizar o seletor de malhas ao carregar a página
updateMalhaSelector();

document.getElementById('salvarMalha').addEventListener('click', function() {
  const p1 = [
    parseFloat(document.getElementById('p1xAdd').value),
    parseFloat(document.getElementById('p1yAdd').value),
    parseFloat(document.getElementById('p1zAdd').value)
  ];
  const p2 = [
    parseFloat(document.getElementById('p2xAdd').value),
    parseFloat(document.getElementById('p2yAdd').value),
    parseFloat(document.getElementById('p2zAdd').value)
  ];
  const p3 = [
    parseFloat(document.getElementById('p3xAdd').value),
    parseFloat(document.getElementById('p3yAdd').value),
    parseFloat(document.getElementById('p3zAdd').value)
  ];
  const p4 = [
    parseFloat(document.getElementById('p4xAdd').value),
    parseFloat(document.getElementById('p4yAdd').value),
    parseFloat(document.getElementById('p4zAdd').value)
  ];
  const novaMalha = new malha([p1, p2, p3, p4]);
  vetMalha.push(novaMalha);
  modal.style.display = "none";
  updateMalhaSelector();
  updatePrograma();
});



// Adicionar o botão "Salvar Malha" no HTML
// <button id="salvarMalhaArquivo">Salvar Malha</button>

// Função para salvar a malha em um arquivo JSON
// Função para salvar a malha em um arquivo JSON
function salvarMalhaEmArquivo(malha) {
  const malhaData = {
    p1: malha.p1,
    p2: malha.p2,
    p3: malha.p3,
    p4: malha.p4,
    scl: malha.scl,
    rotX: malha.rotX,
    rotY: malha.rotY,
    rotZ: malha.rotZ,
    translX: malha.translX,
    translY: malha.translY,
    translZ: malha.translZ,
    kaR: malha.kaR,
    kaG: malha.kaG,
    kaB: malha.kaB,
    kdR: malha.kdR,
    kdG: malha.kdG,
    kdB: malha.kdB,
    ksR: malha.ksR,
    ksG: malha.ksG,
    ksB: malha.ksB,
    nIluminacao: malha.nIluminacao,
    mMalha: malha.mMalha,
    nMalha: malha.nMalha,
    visibilidadePC: malha.visibilidadePC,
    pontosControleTransformados: malha.gridControleSRU
  };

  const blob = new Blob([JSON.stringify(malhaData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'malha.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Adicionar evento ao botão "Salvar Malha"
document.getElementById('salvarMalhaArquivo').addEventListener('click', function() {
  if (selectedMalha) {
    salvarMalhaEmArquivo(selectedMalha);
  } else {
    alert('Nenhuma malha selecionada para salvar.');
  }
});

// Função para carregar a malha de um arquivo JSON
function carregarMalhaDeArquivo(event) {
  const file = event.target.files[0];
  if (!file) {
    alert('Nenhum arquivo selecionado.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const malhaData = JSON.parse(e.target.result);
      const novaMalha = new malha([
        malhaData.p1,
        malhaData.p2,
        malhaData.p3,
        malhaData.p4
      ]);
      novaMalha.scl = malhaData.scl;
      novaMalha.rotX = malhaData.rotX;
      novaMalha.rotY = malhaData.rotY;
      novaMalha.rotZ = malhaData.rotZ;
      novaMalha.translX = malhaData.translX;
      novaMalha.translY = malhaData.translY;
      novaMalha.translZ = malhaData.translZ;
      novaMalha.kaR = malhaData.kaR;
      novaMalha.kaG = malhaData.kaG;
      novaMalha.kaB = malhaData.kaB;
      novaMalha.kdR = malhaData.kdR;
      novaMalha.kdG = malhaData.kdG;
      novaMalha.kdB = malhaData.kdB;
      novaMalha.ksR = malhaData.ksR;
      novaMalha.ksG = malhaData.ksG;
      novaMalha.ksB = malhaData.ksB;
      novaMalha.nIluminacao = malhaData.nIluminacao;
      novaMalha.mMalha = malhaData.mMalha;
      novaMalha.nMalha = malhaData.nMalha;
      novaMalha.visibilidadePC = malhaData.visibilidadePC;
      novaMalha.gridControleSRU = malhaData.pontosControleTransformados;

      // Atualizar a malha com as novas propriedades
      novaMalha.update();

      vetMalha.push(novaMalha);
      updateMalhaSelector();
      updatePrograma();

    } catch (error) {
      alert('Erro ao carregar o arquivo: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Adicionar evento ao input de arquivo e ao botão "Carregar Malha"
document.getElementById('carregarMalhaArquivo').addEventListener('change', carregarMalhaDeArquivo);
document.getElementById('uploadMalha').addEventListener('click', function() {
  document.getElementById('carregarMalhaArquivo').click();
});



}/////////////////////////////////////////////////////////////////////////////////////////
