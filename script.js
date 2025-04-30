console.warn(
  "DONT ENTER ANY CODE YOU DONT UNDERSTAND YOU CAN DO THIS COOL THING CALLED XXS AND YOU WILL BE COOKED"
);
// Globals
let g = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";
let mode = "normal";//"nightmare";
let pipes = [];
let pipe_gap = 300;
let frame = 0
let frameTime = 150

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

// Flap evnt lstenr
document.addEventListener("keydown", (e) => {
    e.preventDefault()
  if (e.code === "Space") {
    if (game_state !== "play") {
      start();
    }
    if (mode === "normal" || mode === "easy")
    bird_dy = -7;
    else
    bird_dy = 7;
  }
});

// Flap evnt lstenr
// document.addEventListener("click", (e) => {
//     e.preventDefault()
//       if (game_state !== "play") {
//         start();
//       }
//       bird_dy = -7;
//   });


function getBetterRandomNumber() {
  // Create a typed array to hold the random values
  const array = new Uint32Array(1);
  
  // Fill the array with cryptographically secure random values
  window.crypto.getRandomValues(array);
  
  // Map the values to the specified range
  const randomValue = array[0] / (0xFFFFFFFF + 1); // Normalize to [0, 1)
  return randomValue
}

// Gravity
function applyGravity() {
  bird_dy += g;
  let birdTop = bird_elm.offsetTop + bird_dy;
  bird_elm.classList.remove("jump");
  bird_elm.classList.remove("fall");
  if ((bird_dy < 0 && (mode === "normal" || mode === "easy")) || (bird_dy > 0 && mode === "nightmare")) {
    bird_elm.classList.add("jump");
  } else if ((bird_dy > 0 && (mode === "normal" || mode === "easy")) || (bird_dy < 0 && mode === "nightmare")) {
    bird_elm.classList.add("fall");
  }
  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_cont.offsetHeight - 210);
  bird_elm.style.top = birdTop + "px";
}


function createPipe() {
  let pipe_position = Math.floor(getBetterRandomNumber() * (game_cont.offsetHeight - pipe_gap - 100)) + 50;

  // Top pipe
  let top_pipe = document.createElement("div");
  top_pipe.classList.add("pipe","topPipe");
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_cont.appendChild(top_pipe);

  // Bottem pipe
  let bottem_pipe = document.createElement("div");
  bottem_pipe.classList.add("pipe","bottemPipe");
  bottem_pipe.style.height = game_cont.offsetHeight - pipe_gap - pipe_position + "px";
  bottem_pipe.style.bottom = "0px";
  bottem_pipe.style.left = "100%";
  game_cont.appendChild(bottem_pipe)
  pipes.push(top_pipe,bottem_pipe);
}

// Move pipes
function movePipes() {
  for (const pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - 3 + "px";

    // Remove off screen pipes
    if(pipe.offsetLeft < - pipe.offsetWidth) {
      pipe.remove()
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0)
}

// Start function
function start() {
  if (mode === "nightmare") {
    game_cont.classList.add("nightmareMode");
    bird_elm.classList.add("nightmareMode");
    g = -0.3;
    frameTime = 100
    pipe_gap = 200
  } else if (mode === "normal") {
    game_cont.classList.remove("nightmareMode");
    bird_elm.classList.remove("nightmareMode");
    g = 0.25
    frameTime = 150
    pipe_gap = 300
  } else if (mode === "easy") {
    game_cont.classList.remove("nightmareMode");
    bird_elm.classList.remove("nightmareMode");
    g = 0.25
    frameTime = 300
    pipe_gap = 400
  }
  game_state = "play";
  start_btn.style.display = "none";
  score_display.classList.add("started");
  if (gameInterval !== null) return;
  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    frame++;
    if (frame % frameTime === 0)
      createPipe();
  }, 10);
}
