let x1, x2, y1, y2, x3, x4, y3, y4;

let lineDrawed = false;
let pointOneDrawed = false;
let pointsDrawed = false;
let pointRadius = 8;

function setup() {
    createCanvas(700, 700);
}

function draw() {
    background(220);
    strokeWeight(2);
    stroke(0);
    if (!x4) {
        line(x1, y1, x2, y2);
    }
    stroke(180, 50, 20);
    fill(180, 50, 20);
    circle(x3, y3, pointRadius);
    stroke(100, 40, 80);
    fill(100, 40, 80);
    circle(x4, y4, pointRadius);
    if (x4) {
        noFill();
        stroke(20, 50, 200);
        bezier(x1, y1, x3, y3, x4, y4, x2, y2);
    }
}

function mousePressed() {
    if (!lineDrawed) {
        x1 = x2 = mouseX;
        y1 = y2 = mouseY;
    } else if (!pointOneDrawed) {
        x3 = mouseX;
        y3 = mouseY;
        pointOneDrawed = true
    } else if (!pointsDrawed) {
        x4 = mouseX;
        y4 = mouseY;
        pointsDrawed = true;
    }
}

function mouseDragged() {
    if (!lineDrawed) {
        x2 = mouseX;
        y2 = mouseY;
    } else if (pointsDrawed) {
        let dx3Sqrd = pow(mouseX - x3, 2);
        let dy3Sqrd = pow(mouseY - y3, 2);
        let dx4Sqrd = pow(mouseX - x4, 2);
        let dy4Sqrd = pow(mouseY - y4, 2);
        let radiusSqrd = pow(pointRadius, 2)

        if (dx3Sqrd + dy3Sqrd <= radiusSqrd) {
            x3 = mouseX
            y3 = mouseY
        } else if (dx4Sqrd + dy4Sqrd <= radiusSqrd) {
            x4 = mouseX
            y4 = mouseY
        }
    }
}

function mouseReleased() {
    lineDrawed = true
}