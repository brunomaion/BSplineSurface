// ORDENACAO
let vetScanLinesFace = [[12, [[251, 12, 50],[100, 12, 51]]]]
for (let i = 0; i < vetScanLinesFace.length; i++) {
  let scanline = vetScanLinesFace[i];
  let vetXs = scanline[1];
  vetXs = vetXs.sort((a, b) => a[0] - b[0]);
  scanline[1] = vetXs;
}
console.log(vetScanLinesFace);
//
