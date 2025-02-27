function getFaces(grid) {
  let lenI = grid.length - 1;
  let lenJ = grid[0].length - 1;
  let faces = [];
  for (let i = 0; i < lenI; i++) {
    for (let j = 0; j < lenJ; j++) {
      let face = [grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]];
      faces.push(face);
    }
  }
  return faces;
}

let grid = [['00','01','02','03'],
        ['10','11','12','13'],
        ['20','21','22','23'],
  ];

let faces = getFaces(grid);
console.log(faces.length);