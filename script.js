console.warn("DONT ENTER ANY CODE YOU DONT UNDERSTAND YOU CAN DO THIS COOL THING CALLED XXS AND YOU WILL BE COOKED");
// Globals
let g = .25;
let bird_y = 0;
let score = 0;
let game_stat = "start";


// Interval
let gameInterval = null

// Elements
let bird_elm = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_cont = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");

// Start evnt lstenr
start_btn.addEventListener("click", ()=>{
    start()
    start_btn.style.display = "none"
})


function start() {
    alert("Game started") // Add code
}