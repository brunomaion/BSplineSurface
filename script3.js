



var m = 6;
var n = 0;
var totalFaces = (m+1)*(n+1);

p1 = [100, 100, 10, 1];
p2 = [100, 500, -10, 1];
p3 = [500, 500, -10, 1];
p4 = [500, 100, 10, 1];

pontosMalha = [p1, p2, p3, p4];

var totalM = m + 2; 
var totalN = n + 2;
var totalArestas = totalM + totalN;

var tamanhoTotalArestaM1x = (p2[0] - p1[0]);
var incrPontosInternosM1x = tamanhoTotalArestaM1x / (m+1);
var tamanhoTotalArestaM1y = (p2[1] - p1[1]);
var incrPontosInternosM1y = tamanhoTotalArestaM1y / (m+1);


var tamanhoTotalArestam2x = (p3[0] - p4[0]);
var incrPontosInternosm2x = tamanhoTotalArestam2x / (m+1);
var tamanhoTotalArestam2y = (p3[1] - p4[1]);
var incrPontosInternosm2y = tamanhoTotalArestam2y / (m+1);

var tamanhoTotalArestaN1x = (p3[0] - p2[0]);
var incrPontosInternosN1x = tamanhoTotalArestaN1x / (n+1);
var tamanhoTotalArestaN1y = (p3[1] - p2[1]);
var incrPontosInternosN1y = tamanhoTotalArestaN1y / (n+1);


var tamanhoTotalArestaN2x = (p4[0] - p1[0]);
var incrPontosInternosN2x = tamanhoTotalArestaN2x / (n+1);
var tamanhoTotalArestaN2y = (p4[1] - p4[1]);
var incrPontosInternosN2y = tamanhoTotalArestaN2y / (n+1);





pontosM1 = []
pontosM1.push(p1);
pontosM2 = []
pontosM2.push(p4);

pontosN1 = []
pontosN1.push(p2);
pontosN2 = []
pontosN2.push(p1);

pontoX1m = p1[0];
pontoY1m = p1[1];
pontoX2m = p4[0];
pontoY2m = p4[1];

pontoX1n = p2[0];
pontoY1n = p2[1];
pontoX2n = p1[0];
pontoY2n = p1[1];



for (let i = 1; i <= m; i++) {
    pontoX1m += incrPontosInternosM1x;
    pontoY1m += incrPontosInternosM1y;
    pontosM1.push([pontoX1m, pontoY1m]);

    pontoX2m += incrPontosInternosm2x;
    pontoY2m += incrPontosInternosm2y;
    pontosM2.push([pontoX2m, pontoY2m]);

    pontoX1n += incrPontosInternosN1x;
    pontoY1n += incrPontosInternosN1y;
    pontosN1.push([pontoX1n, pontoY1n]);

    pontoX2n += incrPontosInternosN2x;
    pontoY2n += incrPontosInternosN2y;
    pontosN2.push([pontoX2n, pontoY2n]);
}

pontosM1.push(p2);
pontosM2.push(p3);

pontosM1.push(p2);
pontosM2.push(p1);





function drawLine(x1, y1, x2, y2) {
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');

    ctx.beginPath(); // Inicia o caminho
    ctx.moveTo(x1, y1); // Move para o ponto inicial
    ctx.lineTo(x2, y2); // Desenha até o ponto final
    ctx.stroke(); // Renderiza a linha
}

drawLine(p1[0], p1[1], p2[0], p2[1]); // Linha de p1 para p2
//drawLine(p2[0], p2[1], p3[0], p3[1]); // Linha de p2 para p3
//drawLine(p4[0], p4[1], p1[0], p1[1]); 
drawLine(p3[0], p3[1], p4[0], p4[1]); // Linha de p3 para p4


for (let i = 0; i < totalM; i++) {
    pontom1 = pontosM1[i];
    pontom2 = pontosM2[i];

    ponton1 = pontosN1[i];
    ponton2 = pontosN2[i];

    drawLine(pontom1[0], pontom1[1], pontom2[0], pontom2[1]);
    //drawLine(ponton2[0], ponton2[1], ponton1[0], ponton1[1]);
}