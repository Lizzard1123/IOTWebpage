var fish = document.getElementById("fish");

var speed = .25;
var position = 100;
var limit = -40;

function moveFish(){
    position -= speed;
    if(position < limit){
        position = 100;
    }
    fish.style.left = position + "%";
}

fish.style.visibility = "visible";
setInterval(moveFish, 10);