
function paintFace(face, color) {
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(face[0][0], face[0][1]);
    for (let i = 1; i < face.length; i++) {
        ctx.lineTo(face[i][0], face[i][1]);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}
function createMalha (pontosMalha, m, n){ // pontos = [p1, p2 ] 

    let p1 = pontosMalha[0];
    let p2 = pontosMalha[1];
    let p3 = pontosMalha[2];
    let p4 = pontosMalha[3];

    let tamanhoTotalArestaM1x = (p2[0] - p1[0]);
    let incrPontosInternosM1x = tamanhoTotalArestaM1x / (m+1);
    let tamanhoTotalArestaM1y = (p2[1] - p1[1]);
    let incrPontosInternosM1y = tamanhoTotalArestaM1y / (m+1);
    let tamanhoTotalArestaM1z = (p2[1] - p1[1]);
    let incrPontosInternosM1z = tamanhoTotalArestaM1z / (m+1);

    let tamanhoTotalArestam2x = (p3[0] - p4[0]);
    let incrPontosInternosm2x = tamanhoTotalArestam2x / (m+1);
    let tamanhoTotalArestam2y = (p3[1] - p4[1]);
    let incrPontosInternosm2y = tamanhoTotalArestam2y / (m+1);
    let tamanhoTotalArestam2z = (p3[1] - p4[1]);
    let incrPontosInternosm2z = tamanhoTotalArestam2z / (m+1);


    let tamanhoTotalArestaN1x = (p3[0] - p2[0]);
    let incrPontosInternosN1x = tamanhoTotalArestaN1x / (n+1);
    let tamanhoTotalArestaN1y = (p3[1] - p2[1]);
    let incrPontosInternosN1y = tamanhoTotalArestaN1y / (n+1);
    let tamanhoTotalArestaN1z = (p3[1] - p2[1]);
    let incrPontosInternosN1z = tamanhoTotalArestaN1z / (n+1);

    let tamanhoTotalArestaN2x = (p4[0] - p1[0]);
    let incrPontosInternosN2x = tamanhoTotalArestaN2x / (n+1);
    let tamanhoTotalArestaN2y = (p4[1] - p1[1]);
    let incrPontosInternosN2y = tamanhoTotalArestaN2y / (n+1);
    let tamanhoTotalArestaN2z = (p4[1] - p1[1]);
    let incrPontosInternosN2z = tamanhoTotalArestaN2z / (n+1);

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
    pontoZ1m = p1[2];

    pontoX2m = p4[0];
    pontoY2m = p4[1];
    pontoZ2m = p4[2];

    pontoX1n = p2[0];
    pontoY1n = p2[1];
    pontoZ1n = p2[2];

    pontoX2n = p1[0];
    pontoY2n = p1[1];
    pontoZ2n = p1[2];

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
function getFaces(gridMalha, m, n) {
    let pontosM1 = gridMalha[0];
    let pontosM2 = gridMalha[1];
    let faces = [];
    for (let i = 0; i < m + 1; i++) {
        for (let j = 0; j < n + 1; j++) {
            let p1 = [pontosM1[i][0] + (pontosM2[i][0] - pontosM1[i][0]) * (j / (n + 1)), pontosM1[i][1] + (pontosM2[i][1] - pontosM1[i][1]) * (j / (n + 1)), pontosM1[i][2] + (pontosM2[i][2] - pontosM1[i][2]) * (j / (n + 1))];
            let p2 = [pontosM1[i][0] + (pontosM2[i][0] - pontosM1[i][0]) * ((j + 1) / (n + 1)), pontosM1[i][1] + (pontosM2[i][1] - pontosM1[i][1]) * ((j + 1) / (n + 1)), pontosM1[i][2] + (pontosM2[i][2] - pontosM1[i][2]) * ((j + 1) / (n + 1))];
            let p3 = [pontosM1[i + 1][0] + (pontosM2[i + 1][0] - pontosM1[i + 1][0]) * ((j + 1) / (n + 1)), pontosM1[i + 1][1] + (pontosM2[i + 1][1] - pontosM1[i + 1][1]) * ((j + 1) / (n + 1)), pontosM1[i + 1][2] + (pontosM2[i + 1][2] - pontosM1[i + 1][2]) * ((j + 1) / (n + 1))];
            let p4 = [pontosM1[i + 1][0] + (pontosM2[i + 1][0] - pontosM1[i + 1][0]) * (j / (n + 1)), pontosM1[i + 1][1] + (pontosM2[i + 1][1] - pontosM1[i + 1][1]) * (j / (n + 1)), pontosM1[i + 1][2] + (pontosM2[i + 1][2] - pontosM1[i + 1][2]) * (j / (n + 1))];
            faces.push([p1, p2, p3, p4]);
        }
    }
    return faces;
}
function drawLine(x1, y1, x2, y2) {
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');

    ctx.beginPath(); // Inicia o caminho
    ctx.moveTo(x1, y1); // Move para o ponto inicial
    ctx.lineTo(x2, y2); // Desenha até o ponto final
    ctx.stroke(); // Renderiza a linha
}
function drawMalha (gridMalha, m, n) {

    let pontosM1 = gridMalha[0];
    let pontosM2 = gridMalha[1];
    let pontosN1 = gridMalha[2];
    let pontosN2 = gridMalha[3];

    for (let i = 0; i < m+2; i++) {
        pontom1 = pontosM1[i];
        pontom2 = pontosM2[i];
        drawLine(pontom1[0], pontom1[1], pontom2[0], pontom2[1]);
    }

    for (let i = 0; i < (n+2); i++) {
        ponton1 = pontosN1[i];
        ponton2 = pontosN2[i];
        drawLine(ponton1[0], ponton1[1], ponton2[0], ponton2[1]);
    }

    for (let i = 0; i < m+2; i++) {
        for (let j = 0; j < n+2; j++) {
            let x = pontosM1[i][0] + (pontosM2[i][0] - pontosM1[i][0]) * (j / (n+1));
            let y = pontosM1[i][1] + (pontosM2[i][1] - pontosM1[i][1]) * (j / (n+1));
            drawCircle(x, y, 1, 'red');
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

let m = 10;
let n = 10;

let p1 = [100, 100, 10];
let p2 = [100, 400, -10];
let p3 = [500, 400, -10];
let p4 = [500, 100, 10];

pontosEntrada = [p1, p2, p3, p4];
let gridMalha = createMalha(pontosEntrada, m, n);
console.log(gridMalha);
let faces = getFaces(gridMalha, m, n)
paintFace(faces[20], 'blue');
drawMalha(gridMalha, m, n);