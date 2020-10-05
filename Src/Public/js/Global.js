/*
There is a lot of ignoring eslint commets bc i used a system of variable varibles which in turn uses eval()
which i know is bad practice, but there shouldnt be a way to use it mallicously
and its pretty cool how it works lol it condenced the code a whole lot
*/
// things that move
// eslint-disable-next-line no-unused-vars
const bottomcontents = ['Weather', 'footer'];
// eslint-disable-next-line no-unused-vars
const leftcontents = ['scrollbar_left', 'leftscrollbarcontent'];
// eslint-disable-next-line no-unused-vars
const rightcontents = ['scrollbar_right', 'rightscrollbarcontent'];
// timers
// eslint-disable-next-line no-unused-vars
let movingtimerbottom;
// eslint-disable-next-line no-unused-vars
let movingtimerleft;
// eslint-disable-next-line no-unused-vars
let movingtimerright;
// % to move up
// eslint-disable-next-line no-unused-vars
const bottomtarget = 37;
// eslint-disable-next-line no-unused-vars
const lefttarget = 50;
// eslint-disable-next-line no-unused-vars
const righttarget = 40;
// status vars
// eslint-disable-next-line no-unused-vars
const bottomisshowing = false;
// eslint-disable-next-line no-unused-vars
const bottominProgress = false;
// eslint-disable-next-line no-unused-vars
const leftisshowing = true;
// eslint-disable-next-line no-unused-vars
const leftinProgress = false;
// eslint-disable-next-line no-unused-vars
const rightisshowing = true;
// eslint-disable-next-line no-unused-vars
const rightinProgress = false;
// global
let count = 0;
// delay inbetween each incriment
// eslint-disable-next-line no-unused-vars
const delay = 5;
// % per incriment
const incriment = .25;
const functionQueue = [];
// eslint-disable-next-line no-unused-vars
function Move(upwards, name, contents, target) {
    const done = target / incriment;
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
        for (let i = 0; i < contents.length; i++) {
            const obj = document.getElementById(contents[i]);
            const bottomnumber = (obj.style.bottom).split('');
            bottomnumber.pop();
            let newval;
            if (bottomnumber[0] == '-') {
                bottomnumber.shift();
                if (upwards) {
                    newval = -(parseFloat(bottomnumber.join('')) - incriment);
                } else {
                    newval = -(parseFloat(bottomnumber.join('')) + incriment);
                }
            } else {
                if (upwards) {
                    newval = (parseFloat(bottomnumber.join('')) + incriment);
                } else {
                    newval = (parseFloat(bottomnumber.join('')) - incriment);
                }
            }
            obj.style.bottom = `${ newval }vh`;
        }
        count++;
    }
}

// clicked on
// eslint-disable-next-line no-unused-vars
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
// nice

/*
SCROLLBAR
*/