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
    context.lineWidth = 1;
    context.stroke();
}

let p1 = [150, 100];
let p2 = [400, 150];
let p3 = [250, 350];
let p4 = [100, 200];

let pontos = [p1, p2, p3, p4];
let mObj = new Malha(pontos);

function drawPolygon(mObj, color = 'red') {
    var canvas = document.getElementById('viewport');
    var context = canvas.getContext('2d');

    context.beginPath();
    context.moveTo(mObj.pontos[0][0], mObj.pontos[0][1]);

    for (let i = 1; i < mObj.pontos.length; i++) {
        context.lineTo(mObj.pontos[i][0], mObj.pontos[i][1]);
    }

    context.closePath();
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
}

function recorte2D(pontos, uMinViewport, uMaxViewport, vMinViewport, vMaxViewport) {

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
        let x1 = p1[0], y1 = p1[1];
        let x2 = p2[0], y2 = p2[1];

        if (eixo === "x") {
            let x = limite;
            let y = y1 + (y2 - y1) * (limite - x1) / (x2 - x1);
            return [x, y];
        } else {
            let y = limite;
            let x = x1 + (x2 - x1) * (limite - y1) / (y2 - y1);
            return [x, y];
        }
    }

    function recorteContraBorda(pontos, testeDentro, limite, eixo) {
        let novosPontos = [];

        for (let i = 0; i < pontos.length; i++) {
            let p0 = pontos[i];
            let p1 = pontos[(i + 1) % pontos.length]; // Fechando o polígono

            let dentro0 = testeDentro(p0);
            let dentro1 = testeDentro(p1);

            if (dentro0 && dentro1) {
                novosPontos.push(p1);
            } else if (dentro0 && !dentro1) {
                novosPontos.push(intersecao(p0, p1, limite, eixo));
            } else if (!dentro0 && dentro1) {
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

drawPolygon(mObj, 'azul');
mObj.pontos = recorte2D(mObj.pontos, uMinViewport, uMaxViewport, vMinViewport, vMaxViewport);
drawViewport();
drawPolygon(mObj, 'red');
drawPolygon(clippedObj, 'blue');
