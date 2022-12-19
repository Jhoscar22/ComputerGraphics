// Author: Oscar Valdés

function setup() {
    createCanvas(640, 480);
}

function myTranslate(x, y, tx, ty) {
    newX = x + tx;
    newY = y + ty;
    return [newX, newY];
}

// TODO: Fix it
function myRotate(x, y, theta) {
    theta *= PI / 180;
    let cosT = cos(theta);
    let sinT = sin(theta);
    let newX = x * cosT - y * sinT;
    let newY = x * sinT + y * cosT;

    return [newX, newY];
}

// TODO: Fix it
function myRotatePiv(x, y, theta, pivX, pivY) {
    theta *= PI / 180;
    let cosT = cos(theta);
    let sinT = sin(theta);
    x -= pivX;
    y -= pivY;
    let newX = pivX + x * cosT - y * sinT;
    let newY = pivY + x * sinT + y * cosT;

    return [newX, newY];
}

function myScale(x, y, sX, sY) {
    nX = x * sX; //- (width / 2)
    nY = y * sY; //- (height / 2)
    return [nX, nY];
}

function myScalePiv(x, y, sX, sY, pivX, pivY) {
    let dx = x - pivX;
    let dy = y - pivY;
    return [pivX + sX * dx, pivY + sY * dy];
}

function myReflection(x, y) {
    let newX = -x;
    let newY = -y;
    return [newX, newY];
}

function myReflectionPiv(x, y, pivX, pivY) {
    let newX = 2 * pivX - x;
    let newY = 2 * pivY - y;
    return [newX, newY];
}

function myShearX(x, y) {
    let pivY = height / 2;
    let newX = x - (y - pivY);
    return [newX, y];
}

function myShearXPiv(x, y, pivY, shear) {
    let newX = x - (y - pivY) * shear;
    return [newX, y];
}

function myShearY(x, y) {
    let pivX = width / 2;
    let newY = y - (x - pivX);
    return [x, newY];
}

function myShearYPiv(x, y, pivX, shear) {
    let newY = y - (x - pivX) * shear;
    return [x, newY];
}

function draw() {
    background(102);
    strokeWeight(2);
    fill(255);
    polygon(width / 2, height / 2, 50, 6, null);
    fill(1);
    polygon(width / 2, height / 2, 50, 6, myTranslate, 50, 50);
    fill(1, 255, 1);
    polygon(width / 2, height / 2, 50, 6, myRotate, 40);
    fill(1, 1, 255);
    polygon(width / 2, height / 2, 50, 6, myRotatePiv, 90, width / 2, height / 2);
    fill(255, 1, 1);
    polygon(width / 2, height / 2, 50, 6, myScale, 1.4, 1.4);
    fill(0, 200, 100);
    polygon(-width / 4, -height / 4, 50, 6, myReflection);
    fill(150, 100, 20);
    polygon(width / 2, height / 2, 50, 6, myShearX);
    fill(100, 50, 200);
    polygon(width / 3, height / 3, 50, 6, myShearYPiv, width / 3, 0.2);
}

function polygon(x, y, radius, npoints, transform, ...params) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        if (transform != null) {
            [sx, sy] = transform(sx, sy, ...params);
        }
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
