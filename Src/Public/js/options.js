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
const titles = ['Extra', 'content one', 'Home', 'Lamps', 'TODO'];
const pagelink = ['Extra', 'content_1', 'Home', 'Lamps', 'ToDo'];
const numberofpages = titles.length;
const maxdivbox = 100 / numberofpages;

function givetitles() {
    for (let i = 0; i < numberofpages; i++) {
        switches[i].innerHTML = titles[i];
    }
}

function setintoplace() {
    for (let i = 0; i < numberofpages; i++) {
        switches[i].style.left = `${maxdivbox * i}%`;
    }
    givetitles();
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
function updatesliderbar() {
    slider.value = 50;
    const targetmiddle = titles[closesttomiddle()];
    while (titles[2] != targetmiddle) {
        titles.unshift(titles.pop());
        pagelink.unshift(pagelink.pop());
    }
    setintoplace();

    document.getElementById('embeded').src = `privatestatic/html/${pagelink[2]}.html`;
    document.getElementById('Title').innerHTML = titles[2];
}

function getinfo(number) {
    let thisValue;
    if (typeof number == "string") {
        numbertoreturn = numbers.indexOf(number);
        thisValue = custom[numbertoreturn];
    } else {
        thisValue = custom[number - 1];
    }
    if (thisValue == 'false') {
        return false;
    } else {
        return true;
    }
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

let userinfo = {};

function updatepageuser() {
    console.log(userinfo);
    document.getElementById('profilename').innerHTML = `Signed in as: ${userinfo.name}`;
}

function getuserinfo() {
    const getuserinforeq = new XMLHttpRequest();
    getuserinforeq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.responseText);
            userinfo = res;
            updatepageuser();
        }
    };
    getuserinforeq.open('GET', '/userinfo', true);
    getuserinforeq.setRequestHeader('Content-type', 'application/json');
    getuserinforeq.send();
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
            getuserinfo();
            setintoplace();
        } else {
            // auth

            switchsubmit();
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
const customcookies = ['token'];

function clearcookies() {
    for (let i = 0; i < customcookies.length; i++) {
        document.cookie = `${customcookies[i]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

// eslint-disable-next-line no-unused-vars
function pageClose(reload) {
    clearcookies();
    if (reload) {
        location.reload();
    }
}