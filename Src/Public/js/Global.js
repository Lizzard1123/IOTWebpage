//things that move
var movings = ["Weather", "tag", "tag_triangle_one", "tag_triangle_two", "footer"];
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
//tag objects
var tagtriangleone = document.getElementById("tag_triangle_one");
var tagtriangletwo = document.getElementById("tag_triangle_two");

function Move(upwards) {
    if (count == done) {
        console.log("upward done");
        count = 0;
        if (upwards) {
            isshowing = true;
            tagtriangleone.style.visibility = 'hidden';
            tagtriangletwo.style.visibility = 'visible';
        } else {
            isshowing = false;
            tagtriangleone.style.visibility = 'visible';
            tagtriangletwo.style.visibility = 'hidden';
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
//clicked on
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
} //nice

/*
SCROLLBAR
*/