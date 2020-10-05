// eslint-disable-next-line no-unused-vars
const buttonOne = document.getElementsByName('button_one');
const buttonTwo = document.getElementsByName('button_two');
// eslint-disable-next-line no-unused-vars
const buttonThree = document.getElementsByName('button_three');
// eslint-disable-next-line no-unused-vars
const buttonFour = document.getElementsByName('button_four');
// eslint-disable-next-line no-unused-vars
const buttonFive = document.getElementsByName('button_five');
// eslint-disable-next-line no-unused-vars
const buttonSix = document.getElementsByName('button_six');
// eslint-disable-next-line no-unused-vars
const buttonSeven = document.getElementsByName('button_seven');
// eslint-disable-next-line no-unused-vars
const buttonEight = document.getElementsByName('button_eight');
// eslint-disable-next-line no-unused-vars
const buttonNine = document.getElementsByName('button_nine');
const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
let custom;
const normal = ['true', 'true', 'true', 'true', 'true', 'true', 'false', 'true', 'true'];
const slider = document.getElementById('switcherselector');
const switches = document.getElementsByClassName('switchpages');
const titles = ['content one', 'content two', 'Home', 'content four', 'TODO'];
const pagelink = ['content_1', 'content_2', 'Home', 'content_4', 'ToDo'];
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
        givetitles();
    }
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
    const numbertoreturn = numbers.indexOf(number);
    if (custom[numbertoreturn] == 'false') {
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
    if (getinfo('one')) {
        document.getElementById('pagebody').setAttribute('onmousemove', 'timeoutScreen()');
    } else {
        if (custom[1] == 'true') {
            buttonTwo[0].click();
        }
        clearTimeout(notMovingTimer);
        document.getElementById('pagebody').removeAttribute('onmousemove');
    }
    if (getinfo('seven')) {
        clearInterval(randomizeTriangles);
        artificalmove = setInterval(randomcolorTriangles, randomizeTime);
    } else {
        clearInterval(artificalmove);
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