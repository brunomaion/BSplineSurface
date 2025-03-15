if (tipoSombreamento == 'Gouraud') {
  let matrizFaces = getFaces(grid);
  let newVetFacesObj = []
  // FOR PARA CADA FACE testar os pontos e criar nova face

  
  for (let i = 0; i < matrizFaces.length; i++) {
    for (let j = 0; j < matrizFaces[i].length; j++) {
      let faceTestada = matrizFaces[i][j];
      let vetFacesVizinhas = obterVizinhos(i, j, matrizFaces); // Vetor dos vizinhos
      vetFacesVizinhas.push(faceTestada); //Propia Face
      console.log(vetFacesVizinhas);

      let vetorNormalMedio = []
      //Testar pontos
      let pontosFace = faceTestada.pontos;
      for (let k = 0; k < pontosFace.length; k++) {
        let pontoTestado = pontosFace[k];
        let facesCompatilhadas = [];

        for (let l = 0; l < vetFacesVizinhas.length; l++) { // PERCORRE AS FACES VIZINHAS
          
          let faceVizinha = vetFacesVizinhas[l];
          let pontosFaceCompartilhada = faceVizinha.pontos;
           //AS Q TEM O MESMO PONTO
          
          for (let m = 0; m < pontosFaceCompartilhada.length; m++) {
            let pontoFaceVizinha = pontosFaceCompartilhada[m];
            if (pontoTestado === pontoFaceVizinha) {
              facesCompatilhadas.push(faceVizinha);
            };
          };
        };
        console.log(facesCompatilhadas);
        vetorNormalMedio.push(calculaVetorMedioFaces(facesCompatilhadas));            

      };

      let face = new faceClassGourad(faceTestada, vetorNormalMedio, this.propIlu);
      newVetFacesObj.push(face);
    };
  };
  newVetFacesObj = newVetFacesObj.sort((a, b) => b.distanciaPintor - a.distanciaPintor);
  return newVetFacesObj;
};