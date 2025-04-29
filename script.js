console.warn("DONT ENTER ANY CODE YOU DONT UNDERSTAND YOU CAN DO THIS COOL THING CALLED XXS AND YOU WILL BE COOKED");
// Globals
let g = .25;
let bird_dy = 0;
let score = 0;
let game_state = "start";


// Interval
let gameInterval = null

// Elements
let bird_elm = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_cont = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");

// Start evnt lstenr
start_btn.addEventListener("click", ()=>{
    start();
    start_btn.style.display = "none";
})

function applyGravity() {
    bird_dy += g;
    let birdTop = bird_elm.offsetTop + bird_dy

    birdTop = Math.max(birdTop, 0);
    birdTop = Math.min(birdTop, 682)
    bird_elm.style.top = birdTop + 'px'
}

function start() {
    game_state = "play"
    gameInterval = setInterval(() => {
        applyGravity()
    }, 100);
}