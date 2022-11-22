function setup() {
    createCanvas(700, 700);
}

const v1 = { x: 100, y: 100 }
const p = { x: 350, y: 600 }
const v2 = { x: 600, y: 100 }
const stepSize = 0.05;

// P = (1−t)^2 * P1 + 2*(1−t)*t*P2 + t^2 * P3
// y = a(x - h)^2 + k
// h: vertex horizontal
// k: vertex vertical

// a = (y - k)/(x - h)
// f´(x) = 2*a*x - 2*a*h
// C = ((x1+x2)/2, y1 + f´(x1)*(x2-x1)/2)



const a1 = (p.y - v1.y) / (p.x - v1.x);
const fp_x1 = (x) => {
    return 2 * a1 * x - 2 * a1 * v1.x;
}
let C1 = {};
C1.x = (v1.x + p.x) / 2;
C1.y = v1.y + fp_x1(v1.x) * (p.x - v1.x) / 2;



const a2 = (p.y - v2.y) / (p.x - v2.x);
const fp_x2 = (x) => {
    return 2 * a2 * x - 2 * a2 * v2.x;
}
let C2 = {};
C2.x = (v2.x + p.x) / 2;
C2.y = v2.y + fp_x2(v2.x) * (p.x - v2.x) / 2;

function draw() {
    background(220);
    noFill()

    beginShape();
    vertex(v1.x, v1.y);
    quadraticVertex(C1.x, C1.y, p.x, p.y);
    endShape();

    beginShape();
    vertex(v2.x, v2.y);
    quadraticVertex(C2.x, C2.y, p.x, p.y);
    endShape();

    let xp = v1.x;
    let yp = v1.y;
    for (let t = stepSize; t < 1.01; t += stepSize) {
        let xc = pow((1 - t), 2) * v1.x + 2 * (1 - t) * t * C1.x + pow(t, 2) * p.x;
        let yc = pow((1 - t), 2) * v1.y + 2 * (1 - t) * t * C1.y + pow(t, 2) * p.y;
        let _width = sqrt(pow(xc - xp, 2) + pow(yc - yp, 2));
        let angle = atan((yc - yp) / (xc - xp));
        push();
        translate((xp + xc) / 2, (yp + yc) / 2);
        rotate(angle);
        ellipse(0, 0, _width, 12);
        pop()
        xp = xc;
        yp = yc;
    }
    xp = p.x;
    yp = p.y;
    for (let t = stepSize; t < 1.01; t += stepSize) {
        let xc = pow((1 - t), 2) * p.x + 2 * (1 - t) * t * C2.x + pow(t, 2) * v2.x;
        let yc = pow((1 - t), 2) * p.y + 2 * (1 - t) * t * C2.y + pow(t, 2) * v2.y;
        let _width = sqrt(pow(xc - xp, 2) + pow(yc - yp, 2));
        let angle = atan((yc - yp) / (xc - xp));
        push();
        translate((xp + xc) / 2, (yp + yc) / 2);
        rotate(angle);
        ellipse(0, 0, _width, 12);
        pop()
        xp = xc;
        yp = yc;
    }

}