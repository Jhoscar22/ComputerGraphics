function setup() {
    createCanvas(640, 480);
    vertices = getVertices()
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

function draw() {
    background(100);
    strokeWeight(2);
    fill(100, 200, 30);
    polygon(width / 2, height / 2);

}

function mousePressed() {
    vertices = getVertices();
}

function polygon(x, y) {
    beginShape();
    for (const v of vertices) {
        vertex(x + v.x, y + v.y);
    }
    endShape(CLOSE);
}