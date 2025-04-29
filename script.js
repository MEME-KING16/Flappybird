console.warn(
  "DONT ENTER ANY CODE YOU DONT UNDERSTAND YOU CAN DO THIS COOL THING CALLED XXS AND YOU WILL BE COOKED"
);
// Globals
let g = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";
let mode = "normal"//"nightmare";

// Interval
let gameInterval = null;

// Elements
let bird_elm = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_cont = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");

// Start evnt lstenr
start_btn.addEventListener("click", () => {
  start();
  start_btn.style.display = "none";
});

//Flap evnt lstenr
document.addEventListener("keydown", (e) => {
    e.preventDefault()
  if (e.code === "Space") {
    if (game_state !== "play") {
      start();
    }
    bird_dy = -7;
  }
});

document.addEventListener("click", (e) => {
    e.preventDefault()
      if (game_state !== "play") {
        start();
      }
      bird_dy = -7;
  });

function applyGravity() {
  bird_dy += g;
  let birdTop = bird_elm.offsetTop + bird_dy;
  bird_elm.classList.remove("jump");
  bird_elm.classList.remove("fall");
  if (bird_dy < 0) {
    bird_elm.classList.add("jump");
  } else if (bird_dy > 0) {
    bird_elm.classList.add("fall");
  }
  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_cont.offsetHeight - 210);
  bird_elm.style.top = birdTop + "px";
}

function start() {
  if (mode === "nightmare") {
    game_cont.classList.add("nightmareMode");
    bird_elm.classList.add("nightmareMode");
    g *= 2
  } else {
    game_cont.classList.remove("nightmareMode");
    bird_elm.classList.remove("nightmareMode");
  }
  game_state = "play";
  start_btn.style.display = "none";
  score_display.classList.add("started");
  if (gameInterval !== null) return;
  gameInterval = setInterval(() => {
    applyGravity();
  }, 10);
}
