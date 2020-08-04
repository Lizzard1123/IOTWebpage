//things that move
var movings = ["Weather", "tag", "tag-triangle", "footer"];
var count = 0;
//% per incriment
var incriment = .25;
var movingtimer;
// % to move up
var target = 37;
var done = target / incriment;
// delay inbetween each incriment
var delay = 5;
var isshowing = false;
var inProgress = false;

function Move(upwards) {
    if (count == done) {
        console.log("upward done");
        count = 0;
        if (upwards) {
            isshowing = true;
        } else {
            isshowing = false;
        }
        inProgress = false;
        clearInterval(movingtimer);
    } else {
        for (var i = 0; i < movings.length; i++) {
            var obj = document.getElementById(movings[i]);
            var bottomnumber = (obj.style.bottom).split("");
            bottomnumber.pop();
            var newval;
            if (bottomnumber[0] == '-') {
                bottomnumber.shift();
                if (upwards) {
                    newval = -(parseFloat(bottomnumber.join("")) - incriment);
                } else {
                    newval = -(parseFloat(bottomnumber.join("")) + incriment);
                }
            } else {
                if (upwards) {
                    newval = (parseFloat(bottomnumber.join("")) + incriment);
                } else {
                    newval = (parseFloat(bottomnumber.join("")) - incriment);
                }
            }
            obj.style.bottom = `${newval}%`;
        }
        count++;
    }
}

function moveBottom() {
    if (!inProgress) {
        if (!isshowing) {
            inProgress = true;
            movingtimer = setInterval(Move, delay, true);
        } else {
            inProgress = true;
            movingtimer = setInterval(Move, delay, false);
        }
    }
}