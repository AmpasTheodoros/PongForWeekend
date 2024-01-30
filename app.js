// Color palette inspired by a source on Twitter
const colorPalette = {
    DarkBrown: "#654321",
    Fallow: "#C19A6B",
  };
  
  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");
  const scoreElement = document.getElementById("score");
  
  const FALLOW_COLOR = colorPalette.DarkBrown;
  const FALLOW_BALL_COLOR = colorPalette.Fallow;
  
  const DARK_BROWN_COLOR = colorPalette.Fallow;
  const DARK_BROWN_BALL_COLOR = colorPalette.DarkBrown;
  
  const SQUARE_SIZE = 25;
  
  const numSquaresX = canvas.width / SQUARE_SIZE;
  const numSquaresY = canvas.height / SQUARE_SIZE;
  
  let squares = [];
  
  for (let i = 0; i < numSquaresX; i++) {
    squares[i] = [];
    for (let j = 0; j < numSquaresY; j++) {
      squares[i][j] = i < numSquaresX / 2 ? FALLOW_COLOR : DARK_BROWN_COLOR;
    }
  }
  
  let x1 = canvas.width / 4;
  let y1 = canvas.height / 2;
  let dx1 = 12.5;
  let dy1 = -12.5;
  
  let x2 = (canvas.width / 4) * 3;
  let y2 = canvas.height / 2;
  let dx2 = -12.5;
  let dy2 = 12.5;
  
  function drawBall(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
  
  function drawSquares() {
    for (let i = 0; i < numSquaresX; i++) {
      for (let j = 0; j < numSquaresY; j++) {
        ctx.fillStyle = squares[i][j];
        ctx.fillRect(
          i * SQUARE_SIZE,
          j * SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
      }
    }
  }
  
  function updateSquareAndBounce(x, y, dx, dy, color) {
    let updatedDx = dx;
    let updatedDy = dy;
  
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      let checkX = x + Math.cos(angle) * (SQUARE_SIZE / 2);
      let checkY = y + Math.sin(angle) * (SQUARE_SIZE / 2);
  
      let i = Math.floor(checkX / SQUARE_SIZE);
      let j = Math.floor(checkY / SQUARE_SIZE);
  
      if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
        if (squares[i][j] !== color) {
          squares[i][j] = color;
  
          if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
            updatedDx = -updatedDx;
          } else {
            updatedDy = -updatedDy;
          }
        }
      }
    }
  
    return { dx: updatedDx, dy: updatedDy };
  }
  
  function updateScoreElement() {
    let fallowScore = 0;
    let darkBrownScore = 0;
    for (let i = 0; i < numSquaresX; i++) {
      for (let j = 0; j < numSquaresY; j++) {
        if (squares[i][j] === FALLOW_COLOR) {
          fallowScore++;
        } else if (squares[i][j] === DARK_BROWN_COLOR) {
          darkBrownScore++;
        }
      }
    }
  
    scoreElement.textContent = `Fallow ${fallowScore} | DarkBrown ${darkBrownScore}`;
  }
  
  function checkBoundaryCollision(x, y, dx, dy) {
    if (x + dx > canvas.width - SQUARE_SIZE / 2 || x + dx < SQUARE_SIZE / 2) {
      dx = -dx;
    }
    if (y + dy > canvas.height - SQUARE_SIZE / 2 || y + dy < SQUARE_SIZE / 2) {
      dy = -dy;
    }
  
    return { dx: dx, dy: dy };
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquares();
  
    drawBall(x1, y1, FALLOW_BALL_COLOR);
    let bounce1 = updateSquareAndBounce(x1, y1, dx1, dy1, FALLOW_COLOR);
    dx1 = bounce1.dx;
    dy1 = bounce1.dy;
  
    drawBall(x2, y2, DARK_BROWN_BALL_COLOR);
    let bounce2 = updateSquareAndBounce(x2, y2, dx2, dy2, DARK_BROWN_COLOR);
    dx2 = bounce2.dx;
    dy2 = bounce2.dy;
  
    let boundary1 = checkBoundaryCollision(x1, y1, dx1, dy1);
    dx1 = boundary1.dx;
    dy1 = boundary1.dy;
  
    let boundary2 = checkBoundaryCollision(x2, y2, dx2, dy2);
    dx2 = boundary2.dx;
    dy2 = boundary2.dy;
  
    x1 += dx1;
    y1 += dy1;
    x2 += dx2;
    y2 += dy2;
  
    updateScoreElement();
  
    requestAnimationFrame(draw);
  }
  
  requestAnimationFrame(draw);
  