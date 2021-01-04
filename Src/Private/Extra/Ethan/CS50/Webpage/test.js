         
var box = document.getElementById("clickBox");
var score = document.getElementById("score");
var HS = document.getElementById("HS");
var startBtn = document.getElementById("start");

var High = 100000;
var playing = false;
var time = 0;
var timer;

function count(){
    time++;
}

function startTimer(){
    box.style.backgroundColor = "#12ff55";
    timer = setInterval(count, 1);
}

function startGame(){
    //max time 10 seconds
    var randomTime = Math.random() * 10000;
    setTimeout(startTimer, randomTime);
    
}

box.onclick = function(){
    if(playing){
        box.style.backgroundColor = "#ff1226";
        score.innerHTML = "Score: " + time + "ms";
        if(time < High){
            High = time;
            HS.innerHTML = "High Score: " + High + "ms";
        }
        time = 0;
        startBtn.click();
        playing = false;
        clearInterval(timer);
    }
}

startBtn.onclick = function(){
    if(playing){
        startBtn.innerHTML = "Try Again"
    } else {
        startGame();
        playing = true;
        startBtn.innerHTML = "Good Luck!"
    }
}