function setup() {
    createCanvas(700, 700);
  }
  
  function myTranslation(x, y, tx, ty) {
    let newX = x + tx;
    let newY = y + ty;
    return [newX, newY];
  }
  
  function myRotation(x, y, theta) {
    let cosT = cos(theta);
    let sinT = sin(theta);
    let newX = x * cosT - y * sinT;
    let newY = x * sinT + y * cosT;
    
    return [newX, newY];
  }
  
  function myPivRotation(x, y, pivX, pivY, theta) {
    let cosT = cos(theta);
    let sinT = sin(theta);
    x -= pivX;
    y -= pivY;
    let newX = pivX + x * cosT - y * sinT;
    let newY = pivY + x * sinT + y * cosT;
    
    return [newX, newY];
  }
  
  function myScalation(x, y, pivX, pivY, mult) {
    let dx = x - pivX;
    let dy = y - pivY;
    return [pivX + mult*dx, pivY + mult*dy];
  }
  
  function draw() {
    background(102);
    fill(255);
    polygon(width / 2, height / 2, 50, 6, null);
    fill(1);
    polygon(width / 2, height / 2, 50, 6, myTranslation, 50, 50);
    fill(255, 0, 0);
    polygon(width / 2, height / 2, 50, 6, myRotation, PI/25);
    fill(0, 0, 200);
    polygon(width / 2, height / 2, 50, 6, myPivRotation, width / 2, height / 2, PI/2);
    fill(0, 200, 0);
    polygon(width / 2, height / 2, 50, 6, myScalation, width / 2, height / 2, 2);
  }
  
  function polygon(x, y, radius, npoints, transform, ...params) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      if (transform) {
        [sx, sy] = transform(sx, sy, ...params);
      }
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }