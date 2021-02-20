/* eslint-disable guard-for-in */

const bottomcontents = document.getElementById('footer');
const leftcontents = [document.getElementById('scrollbar_left'), document.getElementById('leftscrollbarcontent')];
const rightcontents = [document.getElementById('scrollbar_right'), document.getElementById('rightscrollbarcontent')];
const midcontents = [document.getElementById('scrollbar_mid'), document.getElementById('midscrollbarcontent')];
let bottomShowing = false;
let leftShwoing = false;
let rightShowing = false;

function moveLeft() {
    let aim;
    if (leftShwoing) { // to closed
        aim = 86;
        leftShwoing = false;
    } else { // to open
        aim = 36;
        leftShwoing = true;
    }
    for (let i = 0; i < leftcontents.length; i++) {
        leftcontents[i].style.bottom = `${aim}vh`;
    }
}

function moveRight() {
    let aim;
    if (rightShowing) { // to closed
        aim = 86;
        rightShowing = false;
    } else { // to open
        aim = 46;
        rightShowing = true;
    }
    for (let i = 0; i < rightcontents.length; i++) {
        rightcontents[i].style.bottom = `${aim}vh`;
    }
}

function moveMid() {
    let aim;
    if (rightShowing) { // to closed
        aim = 50;
        rightShowing = false;
    } else { // to open
        aim = 8.5;
        rightShowing = true;
    }
    midcontents[0].style.bottom = `${aim + 24}vh`;
    midcontents[1].style.bottom = `${aim}vh`;
}

function moveBottom() {
    let aim;
    if (bottomShowing) { // to closed
        aim = 0;
        bottomShowing = false;
    } else { // to open
        aim = 40;
        bottomShowing = true;
    }
    bottomcontents.style.bottom = `${aim}vh`;
}
if (document.getElementById('scrollbar_right')) {
    document.getElementById('scrollbar_right').onclick = moveRight;
}
if (document.getElementById('scrollbar_left')) {
    document.getElementById('scrollbar_left').onclick = moveLeft;
}
if (document.getElementById('footer')) {
    document.getElementById('footer').onclick = moveBottom;
}
if (document.getElementById('scrollbar_mid')) {
    document.getElementById('scrollbar_mid').onclick = moveMid;
}