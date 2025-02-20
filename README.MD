## Duvidas

## FEITO

retirar fator homogeneo - ok
criar os pontos de controle -OK
Alterar N e M em tempo de execução ok
ARRUMAR ROTACAO X - ok

## TO DO
VALORES 'ALTOS' DEFORMA A MALHA (PONTOS EXTREMOS) ?
Problema de precisao na transformação

Os updates estao ok mas os pontos editaveis deve ser separados

## O PROBELMA ESTA NA ROTAÇÂO OU TRANSALCAO

EXTERNELIZAR FUNCOES DE CONVERSAO

VALORES DA CLASSE 
- ESCALA
- ROT

E VALORES GERAIS
- VRP
- P 
- ILUMINACAO

3. Listagem de malhas e manipalçao de diversas malhas
Clean CVX ERRO!!! - OKK

Quando mudar axonometrica sim rotaçoes nao, mudar updates !!!


4. aplicar Bspline
0.zbuffer
5. cores e background
6. iluminação e manipulação
9. sombreamento?


Os pontos de controle são por interseções?



## horas gasta
?? - 4
22/1 - 3,5
23/1 - 4
24/1 - 3,5





##### INFORMAÇOES PERTINENTES

- Fator homogeneo -> adicionado depois e removido depois  
  - REMOVIDO na funcao 'pontosSRUtoSRT'

- Funcoes de projecoes CONVERTE APENAS 1 ponto!

- funçao 'pipelineSruSrt'
  - Escala, transformação, rotação, camera, projecao 
  - CONVERTE 1 vetor de pontos -> pipeline completo  
  - Entrada [[x, y z]...[x, y, z]]
  - FATOR HOMOGENIO é adicionado na função de multiplicação de matrizes 4x4 * 4x1 [x, y, z, fatH] 
  - Retorno [[x, y z]...[x, y, z]]

  - Por que é um método de classe?
    R: Apesar de acessar funções com variavéis globais, o pipeline é feito com pontos do OBJETO.

- Calculo Pontos de controle
  - função - > matriz pontos de controle
    Entrada (pontosEntradaInicias =[p1, p2, p3, p4], m , n)
    Saída matriz em que M (ou i) = horizontais, N (ou j) = verticais 


- Propriedade TIMER
  - Verificar escolhas de faces renderizadas
  - Executar a renderizção por face com um determinado sleep 
  - !! PROBLEMAS !!
    Continua executando mesmo com outro update da malha em tempo real, sobrepondo a renderização anterior




