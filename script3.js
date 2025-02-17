
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

function getFaces(gridMalha, m) {
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

function drawCircle(x, y, radius, color) {
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
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

function drawMalha(gridMalha) {
    for (let i = 0; i < gridMalha.length; i++) {
        for (let j = 0; j < gridMalha[i].length - 1; j++) {
            drawLine(gridMalha[i][j][0], gridMalha[i][j][1], gridMalha[i][j + 1][0], gridMalha[i][j + 1][1]);
        }
    }
    for (let j = 0; j < gridMalha[0].length; j++) {
        for (let i = 0; i < gridMalha.length - 1; i++) {
            drawLine(gridMalha[i][j][0], gridMalha[i][j][1], gridMalha[i + 1][j][0], gridMalha[i + 1][j][1]);
        }
    }

    for (let i = 0; i < gridMalha.length; i++) {
        for (let j = 0; j < gridMalha[i].length; j++) {
            drawCircle(gridMalha[i][j][0], gridMalha[i][j][1], lenPontosControle, 'red');
        }
    }
}


let m = 10;
let n = 2;

let p1 = [100, 100, 10];
let p2 = [100, 400, -10];
let p3 = [500, 400, -10];
let p4 = [500, 100, 10];


/*
let p1 = [0, 0, 0];
let p2 = [0, 10, 0];
let p3 = [10, 10, 0];
let p4 = [10, 0, 0];
*/

const lenPontosControle = 4;
pontosEntrada = [p1, p2, p3, p4];
let gridMalha = matrizPontosControle(pontosEntrada, m, n);
console.log(gridMalha);
drawMalha(gridMalha);

