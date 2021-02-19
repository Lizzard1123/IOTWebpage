const iframe = document.getElementById('embeded');
// eslint-disable-next-line no-unused-vars
const buttonOne = document.getElementsByName('buttonOne');
const buttonTwo = document.getElementsByName('buttonTwo');
// eslint-disable-next-line no-unused-vars
const buttonThree = document.getElementsByName('buttonThree');
// eslint-disable-next-line no-unused-vars
const buttonFour = document.getElementsByName('buttonFour');
// eslint-disable-next-line no-unused-vars
const buttonFive = document.getElementsByName('buttonFive');
// eslint-disable-next-line no-unused-vars
const buttonSix = document.getElementsByName('buttonSix');
// eslint-disable-next-line no-unused-vars
const buttonSeven = document.getElementsByName('buttonSeven');
// eslint-disable-next-line no-unused-vars
const buttonEight = document.getElementsByName('buttonEight');
// eslint-disable-next-line no-unused-vars
const buttonNine = document.getElementsByName('buttonNine');
const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
let custom;
const normal = ['true', 'true', 'true', 'true', 'true', 'true', 'false', 'true', 'true'];
const slider = document.getElementById('switcherselector');
const switches = document.getElementsByClassName('switchpages');
// ['Extra', 'Remote', 'Lamps', 'Home', 'To-Do', 'Image', 'Game'];
const titles = [];
let numberofpages;
let middle;
let maxdivbox;
let offset;

function setUp(collection) {
    for (let i = 0; i < collection.length; i++) {
        titles.push(collection[i].innerHTML.replace(/\s/g, ''));
    }
    numberofpages = titles.length;
    middle = numberofpages / 2 - .5;
    maxdivbox = 100 / numberofpages;
    offset = 2.5;
}

function givetitles() {
    for (let i = 0; i < numberofpages; i++) {
        switches[i].innerHTML = titles[i];
    }
}

function setintoplace() {
    for (let i = 0; i < numberofpages; i++) {
        switches[i].style.left = `${maxdivbox * i - offset}%`;
        if (i != middle) {
            switches[i].style.zIndex = 5;
            switches[i].style.cursor = 'pointer';
        } else {
            switches[i].style.zIndex = -1;
            switches[i].style.cursor = 'grab';
        }
    }
    givetitles();
}

// eslint-disable-next-line no-unused-vars
function grab(elm) {
    elm.style.cursor = 'grabbing';
}

// eslint-disable-next-line no-unused-vars
function unGrab(elm, thing) {
    elm.style.cursor = thing;
}

function closesttomiddle() {
    let closest = 100;
    let indexnumber;
    for (let i = 0; i < numberofpages; i++) {
        const value = parseInt(switches[i].style.left) - 40;
        if (Math.abs(value) < closest) {
            closest = Math.abs(value);
            indexnumber = i;
        }
    }
    return indexnumber;
}


// eslint-disable-next-line no-unused-vars
function updateslider() {
    const value = slider.value - 50;
    for (let i = 0; i < numberofpages; i++) {
        const newval = (i * maxdivbox) + value;
        switches[i].style.left = `${newval}%`;
    }
}

// eslint-disable-next-line no-unused-vars
function updatesliderbar(num) {
    slider.value = 50;
    let targetmiddle;
    if (num == undefined) {
        targetmiddle = titles[closesttomiddle()];
    } else {
        targetmiddle = titles[num - 1];
    }
    while (titles[middle] != targetmiddle) {
        titles.unshift(titles.pop());
    }
    setintoplace();
    iframe.src = `privatestatic/html/${titles[middle]}.html`;
    document.getElementById('Title').innerHTML = titles[middle];
}

// eslint-disable-next-line no-unused-vars
function checkAuth() {
    try {
        console.log(iframe.contentDocument.getElementsByTagName('PRE')[0].innerHTML);
        if (iframe.contentDocument.getElementsByTagName('PRE')[0].innerHTML == 'Unauthorized') {
            failedToLoad(iframe, true);
        }
    } finally {
        return;
    }
}

function getinfo(number) {
    let thisValue;
    if (typeof number == 'string') {
        const numbertoreturn = numbers.indexOf(number);
        thisValue = custom[numbertoreturn];
    } else {
        thisValue = custom[number - 1];
    }
    if (thisValue == 'false') {
        return false;
    }
    return true;
}

function addtoall() {
    for (let i = 0; i < 9; i++) {
        eval(`button${numbers[i]}[0].setAttribute("onchange", "setsettings(this)");`);
    }
}

function defultsettings() {
    custom = normal;
    for (let i = 0; i < 9; i++) {
        if (custom[i] == 'false') {
            eval(`button${numbers[i]}[0].click();`);
        }
    }
}
let artificalmove;

function resetPage() {
    if (getinfo(1)) {
        document.getElementById('pagebody').setAttribute('onmousemove', 'timeoutScreen()');
    } else {
        if (custom[1] == 'true') {
            buttonTwo[0].click();
        }
        clearTimeout(notMovingTimer);
        document.getElementById('pagebody').removeAttribute('onmousemove');
    }
    if (getinfo(7)) {
        clearInterval(randomizeTriangles);
        clearInterval(artificalmove);
        artificalmove = setInterval(randomcolorTriangles, randomizeTime);
    } else {
        clearInterval(artificalmove);
        clearInterval(randomizeTriangles);
    }
}

// eslint-disable-next-line no-unused-vars
function loadsettings(titleset) {
    try {
        custom = localStorage.getItem('custom').split(',');
    } catch {
        console.log('going defauult');
    } finally {
        if (custom == undefined) {
            defultsettings();
        } else {
            for (let i = 0; i < 9; i++) {
                if (custom[i] == 'false') {
                    eval(`button${numbers[i]}[0].click();`);
                }
            }
        }
        addtoall();
        resetPage();
        if (titleset) {
            // home
            setUp(document.getElementsByClassName('switchpages'));
            setintoplace();
            document.getElementById('scrollbar_middle').style.visibility = 'visible';
        } else {
            // auth
            if (window.location.href.includes('/login')) {
                switchsubmit();
            }
        }
        try {
            checkErrors();
        } finally {
            return;
        }
    }
}

// eslint-disable-next-line no-unused-vars
function setsettings(button) {
    const change = numbers.indexOf(button.name.slice(6));
    const newvarr = [];
    for (let i = 0; i < 9; i++) {
        if (i == change) {
            if (custom[i] == 'false') {
                newvarr.push('true');
            } else {
                newvarr.push('false');
            }
        } else {
            newvarr.push(custom[i]);
        }
    }
    localStorage.setItem('custom', newvarr);
    custom = localStorage.getItem('custom').split(',');
    resetPage();
}