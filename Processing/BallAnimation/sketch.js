function setup() {
    createCanvas(700, 700);
}

// P = (1−t)^2 * P1 + 2*(1−t)*t*P2 + t^2 * P3
// y = a(x - h)^2 + k
// h: vertex horizontal
// k: vertex vertical

// a = (y - k)/(x - h)
// f´(x) = 2*a*x - 2*a*h
// C = ((x1+x2)/2, y1 + f´(x1)*(x2-x1)/2)

let v1 = { x: 100, y: 100 }
let p1 = { x: 350, y: 600 }

const a1 = (p1.y - v1.y) / (p1.x - v1.x);
const fp_x1 = (x) => {
    return 2 * a1 * x - 2 * a1 * v1.x;
}
let C1 = {};
C1.x = (v1.x + p1.x) / 2;
C1.y = v1.y + fp_x1(v1.x) * (p1.x - v1.x) / 2;


function draw() {
    background(220);
    noFill()

    beginShape();
    vertex(v1.x, v1.y);
    quadraticVertex(C1.x, C1.y, p1.x, p1.y);
    endShape();

    for (let t = 0; t < 1.05; t += 0.05) {
        let x = pow((1 - t), 2) * v1.x + 2 * (1 - t) * t * C1.x + pow(t, 2) * p1.x;
        let y = pow((1 - t), 2) * v1.y + 2 * (1 - t) * t * C1.y + pow(t, 2) * p1.y;
        circle(x, y, 5);
    }

}