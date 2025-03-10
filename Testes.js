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
