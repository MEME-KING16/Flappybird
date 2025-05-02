console.warn(
  "DONT ENTER ANY CODE YOU DONT UNDERSTAND YOU CAN DO THIS COOL THING CALLED XXS AND YOU WILL BE COOKED"
);
// Globals
let g = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";
let mode = "Normal"; //"Nightmare";
let pipes = [];
let pipe_gap = 300;
let frame = 0;
let frameTime = 150;
let musicMuted = false;
let spookey = 7;
let skins = JSON.parse(localStorage.getItem("flappySkins")) || {"default":new Skin("Default","assets/bird.png",false, true),"chicken_jocky":new Skin("Chicken Jocky","assets/bird.png",false, false),"test":new Skin("test","assets/bird.png",true, false,true)}
// Load coins
let coins = parseInt(localStorage.getItem("flappyCoins")) || 0;
document.getElementById("coinAmount").innerText = coins

// Interval
let gameInterval = null;

// Elements
let bird_elm = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_cont = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");
let birdIMG = document.getElementById("birdIMG");

// Start evnt lstenr
// start_btn.addEventListener("click", () => {
//   start();
//   start_btn.style.display = "none";
// });

function elements(show) {
  start_btn.style.display = show ? "block" : "none";
  document.getElementById("difficulty").style.display = show ? "block" : "none";
  document.getElementById("mute").style.display = show ? "block" : "none";
  document.getElementById("shop-btn").style.display = show ? "block" : "none";
}

// Flap evnt lstenr
document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.code === "Space") {
    if (game_state !== "play") {
      start();
    }
    flapSound.play()
    if (mode === "Normal" || mode === "Easy")
    bird_dy = -7;
    else if (mode === "Low Gravity")
    bird_dy = -5
    else if (mode === "???")
    bird_dy = -spookey
    else
    bird_dy = 7;
  }
});

document.getElementById("mute").addEventListener("click",()=>{
  if(musicMuted)
    bkgSound.pause()
  else
    bkgSound.play()
  document.getElementById("mute").innerHTML = musicMuted ? "Mute Music" : "Unmute Music"
  musicMuted = !musicMuted
});

document.getElementById("shop-btn").addEventListener("click",()=>{
  elements(false);
  document.getElementById("score").style.display = "none";
  document.getElementById("bird").style.display = "none";
  for (let index = 0; index < Object.keys(skins).length; index++) {
    console.log(skins[Object.keys(skins)[index]].canBuy)
    if (skins[Object.keys(skins)[index]].canBuy) {
      document.getElementById("shop").innerText = document.getElementById("shop").innerText + skins[Object.keys(skins)[index]].name
    }
    
  }
});

// Flap evnt lstenr
// document.addEventListener("click", (e) => {
//   e.preventDefault();
//     if (game_state !== "play") {
//       start();
//     }
//     if (mode === "Normal" || mode === "Easy") bird_dy = -7;
//     else bird_dy = 7;
// });

function updateBirdAvatar(score) {
  if (score >= 10 && score < 20)
    return
} 

function getBetterRandomNumber() {
  // Create a typed array to hold the random values
  const array = new Uint32Array(1);

  // Fill the array with cryptographically secure random values
  window.crypto.getRandomValues(array);

  // Map the values to the specified range
  const randomValue = array[0] / (0xffffffff + 1); // Normalize to [0, 1)
  return randomValue;
}

// Gravity
function applyGravity() {
  bird_dy += g;
  let birdTop = bird_elm.offsetTop + bird_dy;
  bird_elm.classList.remove("jump");
  bird_elm.classList.remove("fall");
  if (
    (bird_dy < 0 && (mode === "Normal" || mode === "Easy" || mode === "Low Gravity" || mode === "???")) ||
    (bird_dy > 0 && mode === "Nightmare")
  ) {
    bird_elm.classList.add("jump");
  } else if (
    (bird_dy > 0 && (mode === "Normal" || mode === "Easy" || mode === "Low Gravity" || mode === "???")) ||
    (bird_dy < 0 && mode === "Nightmare")
  ) {
    bird_elm.classList.add("fall");
  }
  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_cont.offsetHeight - 210);
  bird_elm.style.top = birdTop + "px";
}

function createPipe() {
  let pipe_position =
    Math.floor(
      getBetterRandomNumber() * (game_cont.offsetHeight - pipe_gap - 210)
    ) + 50;

  // Top pipe
  let top_pipe = document.createElement("div");
  top_pipe.classList.add("pipe", "topPipe");
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_cont.appendChild(top_pipe);

  // Bottem pipe
  let bottem_pipe = document.createElement("div");
  bottem_pipe.classList.add("pipe", "bottemPipe");
  bottem_pipe.style.height =
    game_cont.offsetHeight - pipe_gap - pipe_position + "px";
  bottem_pipe.style.bottom = "0px";
  bottem_pipe.style.left = "100%";
  game_cont.appendChild(bottem_pipe);
  pipes.push(top_pipe, bottem_pipe);
  // ???
  if (mode === "???") {
  frameTime = Math.random() * 200
  g = Math.random()
  pipe_gap = Math.random()  * 200
  spookey = Math.random() * 10
}
}

// Move pipes
function movePipes() {
  for (const pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - 3 + "px";

    // Remove off screen pipes
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

// Check Collison
function checkCollision() {
  let birdRect = bird_elm.getBoundingClientRect();
  for (const pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }

  // Collision with top and bottom
  if (
    bird_elm.offsetTop <= 0 ||
    bird_elm.offsetTop >= game_cont.offsetHeight - 210
  ) {
    endGame();
  }

  // Increse score when pipe is passed (paired)
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      // Only check once for each pair
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird_elm.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        scoreSound.play()
        incScore();
        coins++
        document.getElementById("coinAmount").innerText = coins
        localStorage.setItem("flappyCoins",coins)
      }
    }
  });
}

function incScore(amt = 1) {
  score += amt;
  document.getElementById("score").innerText = score;
}

function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  hitSound.play()
  if (Number(localStorage.getItem("score" + mode)) < score) {
    new Toast({
      message: `New High Score For ${mode} Reached\nOld: ${localStorage.getItem("score" + mode)}\nNew: ${score}`,
      type: 'default'
    });
    localStorage.setItem("score" + mode, String(score));
  }
  resetGame();
}

function resetGame() {
  bird_elm.style.top = "50%";
  bird_dy = 0;
  for (const pipe of pipes) {
    pipe.remove();
  }

  pipes = [];
  frame = 0;
  score = 0;
  game_state = "start";
  elements(true)
  score_display.style.top = "30%";
  game_cont.classList.remove("nightmareMode");
  bird_elm.classList.remove("nightmareMode");
}

// Start function
function start() {
  gameMode();
  if (mode === "Nightmare") {
    game_cont.classList.add("nightmareMode");
    bird_elm.classList.add("nightmareMode");
    g = -0.3;
    frameTime = 150;
    pipe_gap = 250;
  } else if (mode === "Normal") {
    game_cont.classList.remove("nightmareMode");
    bird_elm.classList.remove("nightmareMode");
    g = 0.25;
    frameTime = 200;
    pipe_gap = 350;
  } else if (mode === "Easy") {
    game_cont.classList.remove("nightmareMode");
    bird_elm.classList.remove("nightmareMode");
    g = 0.25;
    frameTime = 300;
    pipe_gap = 450;
  } else if (mode == "Low Gravity") {
    game_cont.classList.remove("nightmareMode");
    bird_elm.classList.remove("nightmareMode");
    g = 0.05
    frameTime = 150;
    pipe_gap = 300;
  } else if (mode == "???") {
    game_cont.classList.remove("nightmareMode");
    bird_elm.classList.remove("nightmareMode");
    g = 0.25
    frameTime = 150;
    pipe_gap = 300;
  }
  game_state = "play";
  elements(false)
  score_display.style.top = "5%";
  document.getElementById("score").innerText = 0;
  if (gameInterval !== null) return;
  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();
    frame++;
    if (frame % frameTime === 0) createPipe();
  }, 10);
}

function gameMode() {
 let gamemode = document.getElementById("difficulty").value;
  if (gamemode == undefined) {
    alert("Enter a Gamemode");
  } else {
    mode = gamemode;
  }
}