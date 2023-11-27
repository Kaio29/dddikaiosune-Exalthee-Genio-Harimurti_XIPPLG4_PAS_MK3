var canvas = document.getElementById("GL_Canvas");
var ctx = canvas.getContext("2d");

const karakterWidth = 50;
const karakterHeight = 50;
let karakterX = 10;
let karakterY = canvas.height / 2 - karakterHeight / 2;
let karakterSpeed = 30;

const musuhSize = 70;
let musuhX = canvas.width - musuhSize - 10;
let musuhY = canvas.height / 2 - musuhSize / 2;
let musuhColor = "purple";

const bulletRadius = 5;
let bullets = [];
let explosions = [];

let score = 0;


function drawKarakter(x, y, width, height, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawMusuh(x, y, size, color) {
  ctx.beginPath();
  ctx.moveTo(x + size / 2, y);
  for (let i = 1; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const x_i = x + size / 2 + size * Math.sin(angle);
    const y_i = y + size / 2 - size * Math.cos(angle);
    ctx.lineTo(x_i, y_i);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawBullet(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, bulletRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}


function drawStars() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Menggambar bintang random warna putih
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 5);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCanvas() {
  clearCanvas();

  drawStars(); 

  // Cek tabrakan antara karakter dan musuh
  if (
    karakterX < musuhX + musuhSize &&
    karakterX + karakterWidth > musuhX &&
    karakterY < musuhY + musuhSize &&
    karakterY + karakterHeight > musuhY
  ) {
    // Karakter mati, tampilkan peringatan dan reset permainan
    alert("GAME OVER!");
    resetGame();
    return;
  }

  drawKarakter(karakterX, karakterY, karakterWidth, karakterHeight, "blue");
  
  // Mengejar karakter
  if (musuhX > karakterX) {
    musuhX -= 1;
  }
  if (musuhX < karakterX) {
    musuhX += 1;
  }
  if (musuhY > karakterY) {
    musuhY -= 1;
  }
  if (musuhY < karakterY) {
    musuhY += 1;
  }
  
  bullets.forEach((bullet, bulletIndex) => {
    bullet.x += 5; 
    drawBullet(bullet.x, bullet.y);

    
    if (
      bullet.x > musuhX - bulletRadius && bullet.x < musuhX + musuhSize + bulletRadius &&
      bullet.y > musuhY - bulletRadius && bullet.y < musuhY + musuhSize + bulletRadius
    ) {
      bullets.splice(bulletIndex, 1);
      score++;
      resetMusuh();
    }

    
    if (bullet.x > canvas.width) {
      bullets.splice(bulletIndex, 1);
    }
  });

  drawMusuh(musuhX, musuhY, musuhSize, musuhColor);

  updateScore();
}

function moveKarakterUp() {
  karakterY -= karakterSpeed;
  if (karakterY < 10) {
    karakterY = 10;
  }
  updateCanvas();
}

function moveKarakterDown() {
  karakterY += karakterSpeed;
  if (karakterY > canvas.height - karakterHeight) {
    karakterY = canvas.height - karakterHeight;
  }
  updateCanvas();
}

function moveKarakterLeft() {
  karakterX -= karakterSpeed;
  if (karakterX < 10) {
    karakterX = 10;
  }
  updateCanvas();
}

function moveKarakterRight() {
  karakterX += karakterSpeed;
  if (karakterX > canvas.width - karakterWidth) {
    karakterX = canvas.width - karakterWidth;
  }
  updateCanvas();
}
//peluru
function shootBullet() {
  const bulletX = karakterX + karakterWidth;
  const bulletY = karakterY + karakterHeight / 2;
  bullets.push({ x: bulletX, y: bulletY });
  const bulletSound = document.getElementById("bulletSound");
  bulletSound.currentTime = 0;
  bulletSound.play();
}

function resetMusuh() {
  musuhX = canvas.width - musuhSize - 10;
  musuhY = Math.random() * (canvas.height - musuhSize);
  musuhColor = "purple";
}

function resetGame() {
  karakterX = 10;
  karakterY = canvas.height / 2 - karakterHeight / 2;
  score = 0;
  resetMusuh();
}
//score
function updateScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}
//pergerakan karakter pemain
document.addEventListener("keydown", (event) => {
  if (event.key === "w") {
    moveKarakterUp();
  } else if (event.key === "s") {
    moveKarakterDown();
  } else if (event.key === "a") {
    moveKarakterLeft();
  } else if (event.key === "d") {
    moveKarakterRight();
  } else if (event.key === " ") {
    shootBullet();
  }
});

setInterval(updateCanvas, 30);