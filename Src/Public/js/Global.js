//things that move
var bottomcontents = ["Weather", "footer"];
var leftcontents = ["scrollbar_left", "leftscrollbarcontent"];
var rightcontents = ["scrollbar_right", "rightscrollbarcontent"];
//timers
var movingtimerbottom;
var movingtimerleft;
var movingtimerright;
// % to move up
var bottomtarget = 37;
var lefttarget = 50;
var righttarget = 35;
//status vars
var bottomisshowing = false;
var bottominProgress = false;
var leftisshowing = true;
var leftinProgress = false;
var rightisshowing = true;
var rightinProgress = false;
//global
var count = 0;
// delay inbetween each incriment
var delay = 5;
//% per incriment
var incriment = .25;
var functionQueue = [];

function Move(upwards, name, contents, target) {
    var done = target / incriment;
    if (count == done) {
        count = 0;
        if (upwards) {
            eval(`${name}isshowing = true;`);
        } else {
            eval(`${name}isshowing = false;`);
        }
        eval(`${name}inProgress = false;`);
        eval(`clearInterval(movingtimer${name});`);
        eval(functionQueue.pop());
    } else {
        for (var i = 0; i < contents.length; i++) {
            var obj = document.getElementById(contents[i]);
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
            obj.style.bottom = `${ newval }%`;
        }
        count++;
    }
}

//clicked on
function moveBottom(name) {

    eval(`
        if (!bottominProgress && !leftinProgress && !rightinProgress) {
            if (!${name}isshowing) {
                ${name}inProgress = true;
                movingtimer${name} = setInterval(Move, delay, true, name, ${name}contents, ${name}target);
            } else {
                ${name}inProgress = true;
                movingtimer${name} = setInterval(Move, delay, false, name, ${name}contents, ${name}target);
            }
        } else {
            functionQueue.push("moveBottom(\'${name}\');");
        }
    `);
}
//nice

/*
SCROLLBAR
*/