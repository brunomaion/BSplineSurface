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

function drawPolygon(mObj, color = 'red') {
    var canvas = document.getElementById('viewport');
    var context = canvas.getContext('2d');

    context.beginPath();
    if (mObj.pontos.length === 0) {
        return;
    }
    context.moveTo(mObj.pontos[0][0], mObj.pontos[0][1]);
    for (let i = 1; i < mObj.pontos.length; i++) {
        context.lineTo(mObj.pontos[i][0], mObj.pontos[i][1]);
    }

    context.closePath();
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
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

var uMinViewport = 200;
var uMaxViewport = 500;
var vMinViewport = 200;
var vMaxViewport = 500;

let p1 = [150, 100];
let p2 = [400, 200];
let p3 = [250, 350];
let p4 = [100, 200];
let pontos = [p1, p2, p3, p4];

drawViewport();
/*

let mObj = new Malha(pontos);
drawPolygon(mObj, 'red');
//console.log('ANTES DO RECORTE', mObj.pontos);
mObj.pontos = recorte2D(mObj.pontos, uMinViewport, uMaxViewport, vMinViewport, vMaxViewport);
drawPolygon(mObj, 'blue');
//console.log('DPS DO RECORTE',mObj.pontos);

p1 = [300, 600];
p2 = [300, 410];
p3 = [250, 210];
p4 = [250, 300];

pontos = [p1, p2, p3, p4];
let mObj2 = new Malha(pontos);

drawPolygon(mObj2, 'red');
mObj2.pontos = recorte2D(mObj2.pontos, uMinViewport, uMaxViewport, vMinViewport, vMaxViewport);
drawPolygon(mObj2, 'blue');
*/

p1 = [150, 550];
p2 = [150, 600];
p3 = [180, 600];
p4 = [180, 550];

pontos = [p1, p2, p3, p4];
let mObj3 = new Malha(pontos);

drawPolygon(mObj3, 'red');
console.log('ANTES DO RECORTE OBJ3', mObj3.pontos);
mObj3.pontos = recorte2D(mObj3.pontos);
drawPolygon(mObj3, 'blue');
console.log('DPS DO RECORT OBJ3',mObj3.pontos);


