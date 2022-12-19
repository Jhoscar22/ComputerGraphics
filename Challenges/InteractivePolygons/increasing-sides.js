function setup() {
    createCanvas(640, 480);
    vertices = getVertices()
    r = random(0, 255);
    g = random(0, 255);
    b = random(0, 255);
}

let x1, x2, y1, y2;

function generateRegularPolygon(sides, radius) {
    let angle = 2 * PI / sides;
    let points = [];
    for (let i = 0; i < sides; i++) {
        let x = radius * cos(angle * i);
        let y = radius * sin(angle * i);
        points.push({ x, y });
    }
    return points;
}

let min = 5;
let max = 12;
let count = min;
let radius = 100
let vertices;

function getVertices() {
    if (count == max + 1) { count = min }
    let polygon = generateRegularPolygon(count, radius)
    count++;
    return polygon;

}

let r = 100;
let g = 200;
let b = 30;

function draw() {
    background(100);
    strokeWeight(2);
    fill(r, g, b);
    polygon(width / 2, height / 2);

}

function mousePressed() {
    vertices = getVertices();
    r = random(0, 255);
    g = random(0, 255);
    b = random(0, 255);
}

function polygon(x, y) {
    beginShape();
    for (const v of vertices) {
        vertex(x + v.x, y + v.y);
    }
    endShape(CLOSE);
}