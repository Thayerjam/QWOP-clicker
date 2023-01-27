/*
~ideas
    1) Toggleable "skulls" that make the game harder but give more points 
    2) clicker classes, talent trees, experience, skills
    3) bouncing between sides as a way to get score
    4) action game, fighting blips on the screen with skills/abilities. freezeframe/slowdown on successful hit

~skills
    1)

~classes {
    1) beast neighbor
    2) necrodancer
    3) lance a little
}
*/

/*
~where I left off

Adding black borders to the canvas, one side of which will change to red randomly and periodically like with whack a mole. Score increases and color changes from red to black when player hits the red side.
*/

let vertAccelerationDisplay = document.querySelector("#vertAcceleration");
let horAccelerationDisplay = document.querySelector("#horAcceleration");
let scoreDisplay = document.querySelector("#score");
let windSpeedDisplay = document.querySelector("#windSpeed");
let windDirectionDisplay = document.querySelector("#windDirection");

let button1 = document.querySelector("#upgrade1");
let button2 = document.querySelector("#upgrade2");
let button3 = document.querySelector("#upgrade3");
let button4 = document.querySelector("#upgrade4");
let button5 = document.querySelector("#upgrade5");

let building4 = document.querySelector("#building4");

let cookie = document.querySelector("#cookie");
let cursor = document.querySelector("#cursor");

let canvasHeight = 1080;
let canvasWidth = 1920;

const c = document.getElementById("scrubCanvas");
const ctx = c.getContext("2d");
ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

let squareX = 100;
let squareY = 200;

let squareSize = 30;
let boxAdjustedHeight = 1080 - squareSize;
let boxAdjustedWidth = 1920 - squareSize;

let userCursor = {
  squareX: 100,
  squareY: 200,
  squareSize: 10,
  acceleration: [0, 0],
  currentDirection: [0, 0, 0, 0],
};

/* [down, up, right, left] */
let acceleration = [0, 0];
let currentDirection = [0, 0, 0, 0];
let score = 0;
let scoreFactor = 1;

let intervalSpeed = 30;
let interval = setInterval(iterate, intervalSpeed);
let windIntervalSpeed = 300;
let windInterval = setInterval(changeWind, windIntervalSpeed);

let cookieX;
let cookieY;
let isCookie = false;

let gravity = 0;
let isGravity = false;

let windSpeed = 0;
let windDirection = [0, 0];
let isWind = false;

let isScoringBounces = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyQ") {
    currentDirection[0] = 1;
  } else if (e.code === "KeyW") {
    currentDirection[1] = 1;
  } else if (e.code === "KeyO") {
    currentDirection[2] = 1;
  } else if (e.code === "KeyP") {
    currentDirection[3] = 1;
  } else if (e.code === "Space") {
    let squareXPositionOnPage = (squareX / canvasWidth) * 100;
    let squareYPositionOnPage = (squareY / canvasHeight) * 100;

    let button1Coords = button1.getBoundingClientRect();
    let button1LeftPercent = (button1Coords.left / window.innerWidth) * 100;
    let button1RightPercent = (button1Coords.right / window.innerWidth) * 100;
    let button1TopPercent = (button1Coords.top / window.innerHeight) * 100;
    let button1BottomPercent =
      (button1Coords.bottom / window.innerHeight) * 100;

    function defineItemCoords(item) {
      let itemCoords = item.getBoundingClientRect();
      let output = {
        left: (itemCoords.left / window.innerWidth) * 100,
        right: (itemCoords.right / window.innerWidth) * 100,
        top: (itemCoords.top / window.innerHeight) * 100,
        bottom: (itemCoords.bottom / window.innerHeight) * 100,
      };
      return output;
    }

    let building4Coords = defineItemCoords(building4);

    let button2Coords = button2.getBoundingClientRect();
    let button2LeftPercent = (button2Coords.left / window.innerWidth) * 100;
    let button2RightPercent = (button2Coords.right / window.innerWidth) * 100;
    let button2TopPercent = (button2Coords.top / window.innerHeight) * 100;
    let button2BottomPercent =
      (button2Coords.bottom / window.innerHeight) * 100;

    let cookieCoords = cookie.getBoundingClientRect();
    let cookieLeftPercent = (cookieCoords.left / window.innerWidth) * 100;
    let cookieRightPercent = (cookieCoords.right / window.innerWidth) * 100;
    let cookieTopPercent = (cookieCoords.top / window.innerHeight) * 100;
    let cookieBottomPercent = (cookieCoords.bottom / window.innerHeight) * 100;

    console.log(squareXPositionOnPage, squareYPositionOnPage);
    console.log("left", button1LeftPercent);
    console.log("top", button1TopPercent);

    if (
      squareXPositionOnPage >= button1LeftPercent &&
      squareXPositionOnPage <= button1RightPercent &&
      squareYPositionOnPage >= button1TopPercent &&
      squareYPositionOnPage <= button1BottomPercent
    ) {
      button1.click();
    } else if (
      squareXPositionOnPage >= button2LeftPercent &&
      squareXPositionOnPage <= button2RightPercent &&
      squareYPositionOnPage >= button2TopPercent &&
      squareYPositionOnPage <= button2BottomPercent
    ) {
      button2.click();
    } else if (
      squareXPositionOnPage >= cookieLeftPercent &&
      squareXPositionOnPage <= cookieRightPercent &&
      squareYPositionOnPage >= cookieTopPercent &&
      squareYPositionOnPage <= cookieBottomPercent
    ) {
      cookie.style.display = "none";
      isCookie = false;
      score += scoreFactor;
    } else if (
      squareXPositionOnPage >= building4Coords.left &&
      squareXPositionOnPage <= building4Coords.right &&
      squareYPositionOnPage >= building4Coords.top &&
      squareYPositionOnPage <= building4Coords.bottom
    ) {
      if (building4.style.backgroundColor === "green") {
        building4.style.backgroundColor = "";
      } else {
        building4.style.backgroundColor = "green";
      }
      isScoringBounces = !isScoringBounces;
    } else {
      console.log("you clicked on nothing!");
    }
  } else if (e.code === "Escape") {
    if (isGravity) {
      toggleGravity();
    }
    if (isWind) {
      toggleWind();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "KeyQ") {
    currentDirection[0] = 0;
  } else if (e.code === "KeyW") {
    currentDirection[1] = 0;
  } else if (e.code === "KeyO") {
    currentDirection[2] = 0;
  } else if (e.code === "KeyP") {
    currentDirection[3] = 0;
  }
});

function generateCookie() {
  let cookieStyle = getComputedStyle(cookie);
  let cookieWidth = parseInt(cookieStyle.width);
  let cookieHeight = parseInt(cookieStyle.height);
  cookieX =
    Math.random() * (window.innerWidth - cookieWidth - 10 - 250) + 10 + 250;
  cookieY = Math.random() * (window.innerHeight - cookieHeight - 10) + 10;
  cookie.style.left = `${cookieX}px`;
  cookie.style.top = `${cookieY}px`;
  cookie.style.display = "initial";
  isCookie = true;
}

function clearSquare() {
  ctx.clearRect(squareX - 1, squareY - 1, squareSize + 2, squareSize + 2);
}

function reduceAcceleration() {
  if (acceleration[0] > 0) {
    acceleration[0] -= 1 - gravity;
  }
  if (acceleration[1] > 0) {
    acceleration[1] -= 1;
  }
  if (acceleration[0] < 0) {
    acceleration[0] += 1;
  }
  if (acceleration[1] < 0) {
    acceleration[1] += 1;
  }
}

function changeAcceleration() {
  if (
    squareY <= boxAdjustedHeight &&
    squareY >= 0 &&
    squareX <= boxAdjustedWidth &&
    squareX >= 0
  ) {
    if (isGravity && squareY !== boxAdjustedHeight) {
      acceleration[0] += 1;
    }
    if (currentDirection[0] === 1 && squareY < boxAdjustedHeight) {
      //down
      acceleration[0] += 3;
    }
    if (currentDirection[1] === 1 && squareY > 0) {
      //up
      acceleration[0] -= 3;
    }
    if (currentDirection[2] === 1 && squareX < boxAdjustedWidth) {
      //right
      acceleration[1] += 3;
    }
    if (currentDirection[3] === 1 && squareX > 0) {
      //left
      acceleration[1] -= 3;
    }
  }
}

function moveSquare() {
  if (isWind) {
    squareY += acceleration[0] + windDirection[0] * windSpeed;
    squareX += acceleration[1] + windDirection[1] * windSpeed;
  } else {
    squareY += acceleration[0];
    squareX += acceleration[1];
  }

  squareY = Number(squareY.toFixed(2));
  squareX = Number(squareX.toFixed(2));
  if (squareY < 0) {
    squareY = 0;
  }
  if (squareY > boxAdjustedHeight) {
    squareY = boxAdjustedHeight;
  }
  if (squareX < 0) {
    squareX = 0;
  }
  if (squareX > boxAdjustedWidth) {
    squareX = boxAdjustedWidth;
  }
}

function edgeCollision() {
  if (squareY <= 0 || squareY >= boxAdjustedHeight) {
    acceleration[0] = acceleration[0] * -1;
    acceleration[0] = Math.floor(acceleration[0] / 1.3);
    if (isScoringBounces) {
      score += 1;
    }
  }
  if (squareX <= 0 || squareX >= boxAdjustedWidth) {
    acceleration[1] = acceleration[1] * -1;
    acceleration[1] = Math.floor(acceleration[1] / 1.3);
    if (isScoringBounces) {
      score += 1;
    }
  }
}

function drawSquare() {
  ctx.drawImage(cursor, squareX, squareY, squareSize, squareSize);
}

function incrementScore() {}

function updateScore() {
  scoreDisplay.innerText = `Score: ${score}`;
}

function iterate() {
  if (!isCookie) {
    generateCookie();
  }
  vertAccelerationDisplay.innerText = "Vertical Accel: " + acceleration[0];
  horAccelerationDisplay.innerText = "Horizontal Accel: " + acceleration[1];
  clearSquare();
  edgeCollision();
  reduceAcceleration();
  changeAcceleration();
  moveSquare();
  drawSquare();
  incrementScore();
  updateScore();
}

function toggleGravity() {
  isGravity = !isGravity;
  if (gravity === 0) {
    gravity = 0.5;
    scoreFactor = Math.floor(scoreFactor * 2);
    button1.innerText = "toggleGravity: on";
  } else {
    gravity = 0;
    scoreFactor = Math.floor(scoreFactor / 2);
    button1.innerText = "toggleGravity: off";
  }
}

function toggleWind() {
  if (!isWind) {
    button2.innerText = "toggleWind: on";
  } else {
    button2.innerText = "toggleWind: off";
  }
  isWind = !isWind;
}

function changeWind() {
  let randomNumber = Math.random();
  if (randomNumber > 0.8) {
    windSpeed += 0.1;
  } else if (randomNumber < 0.2) {
    windSpeed -= 0.1;
  }
  if (windSpeed >= 1) {
    windSpeed = 1;
  }
  if (windSpeed <= -1) {
    windSpeed = -1;
  }
  if (randomNumber < 0.2) {
    if (windDirection[0] < 3) {
      windDirection[0] += 1;
    }
  } else if (randomNumber < 0.4) {
    if (windDirection[0] > -3) {
      windDirection[0] -= 1;
    }
  } else if (randomNumber < 0.6) {
    if (windDirection[1] < 3) {
      windDirection[1] += 1;
    }
  } else if (randomNumber < 0.8) {
    if (windDirection[1] > -3) {
      windDirection[1] -= 1;
    }
  }
  windSpeed = Number(windSpeed.toFixed(2));
  windSpeedDisplay.innerText = `Wind Speed: ${windSpeed}`;
  windDirectionDisplay.innerText = `Wind Direction: ${windDirection[0]}, ${windDirection[1]}`;
}

button1.addEventListener("click", toggleGravity);
button2.addEventListener("click", toggleWind);
