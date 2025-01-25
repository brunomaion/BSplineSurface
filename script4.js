function drawBSpline(ctx, X, Y) {
  let TotMarks = X.length;
  let i = 0;
  
  ctx.beginPath();
  
  while (i + 3 < TotMarks) {
      let RangeX = Math.abs(X[i + 2] - X[i + 1]);
      let RangeY = Math.abs(Y[i + 2] - Y[i + 1]);
      let Step = RangeX > RangeY ? 1.0 / RangeX : 1.0 / RangeY;
      
      for (let t = 0; t <= 1; t += Step) {
          let x = ((-1 * Math.pow(t, 3) + 3 * Math.pow(t, 2) - 3 * t + 1) * X[i] +
                   ( 3 * Math.pow(t, 3) - 6 * Math.pow(t, 2) + 4) * X[i + 1] +
                   (-3 * Math.pow(t, 3) + 3 * Math.pow(t, 2) + 3 * t + 1) * X[i + 2] +
                   ( 1 * Math.pow(t, 3)) * X[i + 3]) / 6;

          let y = ((-1 * Math.pow(t, 3) + 3 * Math.pow(t, 2) - 3 * t + 1) * Y[i] +
                   ( 3 * Math.pow(t, 3) - 6 * Math.pow(t, 2) + 4) * Y[i + 1] +
                   (-3 * Math.pow(t, 3) + 3 * Math.pow(t, 2) + 3 * t + 1) * Y[i + 2] +
                   ( 1 * Math.pow(t, 3)) * Y[i + 3]) / 6;
          
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
      }
      i++;
  }
  
  ctx.stroke();
}

function drawCanvas() {
  let canvas = document.getElementById('viewport');
  let ctx = canvas.getContext('2d');
  
  let X = [50, 100, 150, 200, 250, 300, 350, 400];
  let Y = [200, 150, 100, 50, 100, 150, 200, 250];
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  
  drawBSpline(ctx, X, Y);
}
