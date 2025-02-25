var uMinViewport = 200;
var uMaxViewport = 400;
var vMinViewport = 200;
var vMaxViewport = 400;

class Malha {
    constructor(pontos) {
        this.pontos = pontos;
    }
}

function drawViewport() {
    var canvas = document.getElementById('viewport');
    var context = canvas.getContext('2d');

    context.beginPath();
    context.rect(uMinViewport, vMinViewport, uMaxViewport - uMinViewport, vMaxViewport - vMinViewport);
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.stroke();
}

let p1 = [150, 100, 50];
let p2 = [400, 150, 50];
let p3 = [250, 350, 50];
let p4 = [100, 200, 50];

let pontos = [p1, p2, p3, p4];
let mObj = new Malha(pontos);

function drawPolygon(mObj) {
    var canvas = document.getElementById('viewport');
    var context = canvas.getContext('2d');

    context.beginPath();
    context.moveTo(mObj.pontos[0][0], mObj.pontos[0][1]);

    for (let i = 1; i < mObj.pontos.length; i++) {
        context.lineTo(mObj.pontos[i][0], mObj.pontos[i][1]);
    }

    context.closePath(); // Fecha o polígono
    context.strokeStyle = 'red'; // Cor do traço
    context.lineWidth = 2; // Largura do traço
    context.stroke(); // Desenha as linhas
}

drawViewport();
drawPolygon(mObj);
