// Constantes del tamaño de pantalla
const w = window.innerWidth, h = window.innerHeight;

function setup() {
  createCanvas(w, h);
  circleLeft = width * 0.25;
  circleCenter = width * 0.5;
  circleRight = width * 0.75;
  middlePoint = height / 2;
  rad = 100;
}

function draw() {
  background("RGB(150, 200, 150)");
  stroke("RGB(100, 160, 100)");
  strokeWeight(2);
  
  // Texto Punto Pendiente
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Punto Pendiente", circleLeft, height * 0.72);
  circuloPuntoMedio(circleLeft, middlePoint, rad);
  
  // Texto DDA
  textSize(18);
  textAlign(CENTER, CENTER);
  text("DDA", circleCenter, height * 0.72);
  circuloPuntoMedio(circleCenter,middlePoint, rad);
  
  // Texto Bresenham
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Bresenham", circleRight, height * 0.72);
  circuloPuntoMedio(circleRight,middlePoint, rad);
  
  // Número de partes
  n = parseInt(prompt("¿En cuántas lineas se dividirá la pizza?: "));
  angle = (2 * PI) / n;
  
  // Llamado a la funcion Punto Pendiente
  for (let i = 0; i < n; i++) {
    let lineX = circleLeft + rad * cos(i * angle);
    let lineY =middlePoint + rad * sin(i * angle);
    pointA = new Punto(circleLeft,middlePoint);
    pointB = new Punto(lineX, lineY);
    drawPuntos(puntoPendiente(pointA, pointB));
  }
  
  // Llamado a la funcion DDA
  for (let i = 0; i < n; i++) {
    let lineX = circleCenter + rad * cos(i * angle);
    let lineY =middlePoint + rad * sin(i * angle);
    pointA = new Punto(circleCenter, middlePoint);
    pointB = new Punto(lineX, lineY);
    dda(pointA, pointB);
  }
  
  // Llamado a la funcion Bresenham
  for (let i = 0; i < n; i++) {
    let lineX = circleRight + rad * cos(i * angle);
    let lineY = middlePoint + rad * sin(i * angle);
    pointA = new Punto(circleRight, middlePoint);
    pointB = new Punto(lineX, lineY);
    bresenham(pointA, pointB);
  }

  noLoop();
}

// Calcular el punto medio de los circulos
function circuloPuntoMedio(x, y, radio) {
  let xAux = 0;
  let yAux = radio;
  let d = 1 - radio;

  while (xAux <= yAux) {
    point(x + xAux, y + yAux);
    point(x + yAux, y + xAux);
    point(x - xAux, y + yAux);
    point(x - yAux, y + xAux);
    point(x + xAux, y - yAux);
    point(x + yAux, y - xAux);
    point(x - xAux, y - yAux);
    point(x - yAux, y - xAux);

    if (d < 0) {
      d += 2 * xAux + 3;
    } else {
      d += 2 * (xAux - yAux) + 5;
      yAux--;
    }
    xAux++;
  }
}

// Funcion Punto Pendiente
function puntoPendiente(point1, point2) {
  puntos = [];
  plusX = 0;

  if (point1.x > point2.x) {
    plusX = -1;
  } else if (point1.x < point2.x) {
    plusX = 1;
  }

  if (point1.x === point2.x) {
    x = point1.x;

    if (point1.y > point2.y) {
      plusY = -1;
    } else {
      plusY = 1;
    }

    if (plusY == 1) {
      for (let y = point1.y; y < point2.y; y += plusY) {
        puntos.push(new Punto(x, y));
      }
    } else {
      for (let y = point1.y; y > point2.y; y += plusY) {
        puntos.push(new Punto(x, y));
      }
    }
  } else {
    m = (point2.y - point1.y) / (point2.x - point1.x);
    b = point1.y - m * point1.x;
    if (plusX == 1) {
      for (let x = point1.x; x < point2.x; x += plusX) {
        y = m * x + b;
        puntos.push(new Punto(x, y));
      }
    } else {
      for (let x = point1.x; x > point2.x; x += plusX) {
        y = m * x + b;
        puntos.push(new Punto(x, y));
      }
    }
  }
  return puntos;
}

function drawPuntos(puntos) {
  for (let punto of puntos) {
    punto.draw();
    print(punto.x);
  }
}

// Funcion DDA
function dda(point1, point2) {
  let dx = point2.x - point1.x;
  let dy = point2.y - point1.y;
  let pasos = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
  let plusX = dx / pasos;
  let m = dy / pasos;
  let x = point1.x;
  let y = point1.y;

  for (let i = 0; i <= pasos; i++) {
    point(x, y);
    x += plusX;
    y += m;
  }
}

// Funcion Bresenham
function bresenham(point1, point2) {
  let dx = abs(point2.x - point1.x);
  let dy = abs(point2.y - point1.y);
  let plusX = point1.x < point2.x ? 1 : -1;
  let plusY = point1.y < point2.y ? 1 : -1;
  let err = dx - dy;

  if (plusX == 1) {
    if (plusY == 1) {
      while (point1.x <= point2.x && point1.y <= point2.y) {
        point(point1.x, point1.y);
        let e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          point1.x += plusX;
        }
        if (e2 < dx) {
          err += dx;
          point1.y += plusY;
        }
      }
    } else if (plusY == -1) {
      while (point1.x <= point2.x && point1.y >= point2.y) {
        point(point1.x, point1.y);
        let e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          point1.x += plusX;
        }
        if (e2 < dx) {
          err += dx;
          point1.y += plusY;
        }
      }
    }
  } else if (plusX == -1) {
    if (plusY == 1) {
      while (point1.x >= point2.x && point1.y <= point2.y) {
        point(point1.x, point1.y);
        let e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          point1.x += plusX;
        }
        if (e2 < dx) {
          err += dx;
          point1.y += plusY;
        }
      }
    } else if (plusY == -1) {
      while (point1.x >= point2.x && point1.y >= point2.y) {
        point(point1.x, point1.y);
        let e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          point1.x += plusX;
        }
        if (e2 < dx) {
          err += dx;
          point1.y += plusY;
        }
      }
    }
  }
}

class Punto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    stroke("RGB(100, 160, 100)");
    point(this.x, this.y);
  }
}