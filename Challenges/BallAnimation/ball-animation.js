//use 'esversion: 8'
function setup() {
    createCanvas(700, 700);
    frameRate(1);
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let state = 0;

function curves() {
    beginShape();
    vertex(v1.x, v1.y);
    quadraticVertex(C1.x, C1.y, p.x, p.y);
    endShape();

    beginShape();
    vertex(v2.x, v2.y);
    quadraticVertex(C2.x, C2.y, p.x, p.y);
    endShape();
}

async function frame(xp, yp, t, wait, mod) {
    if (wait) {
        await sleep(25);
    }
    let xc;
    let yc;
    let m = t % mod;
    let _width;
    if (t > 0.999 && t < 1.001) {
        if (wait) {
            background(220);
        }
        push();
        translate(p.x, p.y);
        stroke(203, 64, 12);
        fill(255, 87, 51);
        ellipse(0, 0, 40, 12);
        pop()
        return {xp: p.x, yp: p.y};
    }
    if (0 <= t && t < 1) {
        xc = pow((1 - t), 2) * v1.x + 2 * (1 - t) * t * C1.x + pow(t, 2) * p.x;
        yc = pow((1 - t), 2) * v1.y + 2 * (1 - t) * t * C1.y + pow(t, 2) * p.y;
    } else {
        t -= 1;
        xc = pow((1 - t), 2) * p.x + 2 * (1 - t) * t * C2.x + pow(t, 2) * v2.x;
        yc = pow((1 - t), 2) * p.y + 2 * (1 - t) * t * C2.y + pow(t, 2) * v2.y;
    }
    _width = sqrt(pow(xc - xp, 2) + pow(yc - yp, 2));
    let angle = atan((yc - yp) / (xc - xp));
    if (0 < m && m < 0.001 || mod - 0.001 < m && m < mod) {
        if (wait) {
            background(220);
        }
        push();
        translate((xp + xc) / 2, (yp + yc) / 2);
        rotate(angle);
        stroke(203, 64, 12);
        fill(255, 87, 51);
        ellipse(0, 0, _width, 12);
        pop()
    }
    return { xp: xc, yp: yc }
}

async function draw() {
    background(220);
    noFill()

    if (state == 1) {
        curves();
        return;
    } else if (state == 2) {
        let xp = v1.x;
        let yp = v1.y;
        let _width;
        for (let t = stepSize; t <= 2.0001; t += stepSize) {
            let r = await frame(xp, yp, t, false, stepSize*2);
            xp = r.xp
            yp = r.yp
        }
    } else if (state == 3) {
        let xp = v1.x;
        let yp = v1.y;
        for (let t = stepSize; t <= 2.0001; t += stepSize) {
            let r = await frame(xp, yp, t, true, stepSize);
            xp = r.xp
            yp = r.yp
        }
    }
}

async function mousePressed() {
    if (state == 0) {
        state = 1;
    } else if (state == 1) {
        state = 2;
    } else if (state == 2) {
        state = 3;
    }
}