function calcularIluTotal(propIlu, centroide, vetorNormalUnitario, vetorS) {

let ka = propIlu[0];
let kd = propIlu[1];
let ks = propIlu[2];
let iluN = propIlu[3];

let iluTotal = iluAmbiente*ka;
if (iluTotal>=255){
        return 255;
};
let vetorLuz = [xLampada - centroide[0],
                yLampada - centroide[1],
                zLampada - centroide[2]];

let vetorLuzUnitario = vetorUnitario(vetorLuz);
// Iluminação difusa (Id = Il . Kd . (N^ . L^))
let escalarNL = produtoEscalar(vetorNormalUnitario,vetorLuzUnitario)
let iluDifusa = iluLampada * kd * escalarNL;
if (iluDifusa <= 0) {
        return iluTotal;
}
iluTotal += iluDifusa;
// Iluminação especular (Is = Il . Ks . (R^.S^)^n)
//R^ = (2 . L^ . N^).N^ - L^ // s == o ; vetor de observação
let vetorR = [2*escalarNL*vetorNormalUnitario[0] - vetorLuzUnitario[0],
                2*escalarNL*vetorNormalUnitario[1] - vetorLuzUnitario[1],
                2*escalarNL*vetorNormalUnitario[2] - vetorLuzUnitario[2]];    
let iluEspecular = iluLampada * ks * (produtoEscalar(vetorR, vetorUnitario(vetorS)) ** iluN);
if (iluEspecular <= 0) {
        return iluTotal;
}
iluTotal += iluEspecular;
return iluTotal
};