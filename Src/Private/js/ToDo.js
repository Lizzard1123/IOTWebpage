const taskcontent = document.getElementById('taskcontent');
const task1 = document.getElementById('task0');

let currenttasks = ['task0'];

const d = new Date();
const month = d.getMonth();
let monthActual = month + 1;
if (monthActual < 10) {
    monthActual = '0' + monthActual;
}

let dayVal = d.getDate();
if (dayVal < 10) {
    dayVal = '0' + dayVal;
}

document.getElementsByClassName('datething')[0].value = d.getFullYear() + '-' + monthActual + '-' + dayVal;

const greencolor = [26, 156, 65];
const redcolor = [207, 0, 0];

function timeinbetween(dateone, datetwo) {
    return new Date(dateone) - new Date(datetwo);
}

function getbgcolor(colora, colorb, t) {
    const r1 = colora[0];
    const g1 = colora[1];
    const b1 = colora[2];
    const r2 = colorb[0];
    const g2 = colorb[1];
    const b2 = colorb[2];
    const newcolor = [
        r1 + (r2 - r1) * t,
        g1 + (g2 - g1) * t,
        b1 + (b2 - b1) * t,
    ];
    return newcolor;
}

function setbackground(obj, dateone, datetwo) {
    const totaltime = timeinbetween(datetwo, dateone);
    const currenttime = timeinbetween(Date.now(), dateone);
    if (totaltime < 0 || currenttime < 0) {
        obj.style.backgroundColor = `rgb(${redcolor[0]}, ${redcolor[1]}, ${redcolor[2]})`;
        return;
    }
    const progress = currenttime / totaltime;
    colorarray = getbgcolor(greencolor, redcolor, progress);
    obj.style.backgroundColor = `rgb(${colorarray[0]}, ${colorarray[1]}, ${colorarray[2]})`;
    setTimeout(setbackground, (60 * 1000), obj, dateone, datetwo);
}

function avaliableid() {
    let count = 0;
    while (true) {
        const newname = `task${count}`;
        if (currenttasks.indexOf(newname) == -1) {
            return newname;
        } else {
            count++;
        }
    }
}

function removeid(id) {
    const newidarray = [];
    for (let i = 0; i < currenttasks.length; i++) {
        if (currenttasks[i] != id) {
            newidarray.push(currenttasks[i]);
        }
    }
    currenttasks = newidarray;
    delete currenttaskobj[id];
}

let currenttaskobj = {};


function clonetask(reqid = avaliableid()) {
    const cln = task1.cloneNode(true);
    cln.getElementsByClassName('delete')[0].style.visibility = 'visible';
    cln.id = reqid;
    currenttasks.push(reqid);
    cln.getElementsByClassName('datething')[0].value = d.getFullYear() + '-' + monthActual + '-' + dayVal;
    taskcontent.appendChild(cln);
}

// eslint-disable-next-line no-unused-vars
function deleteparent(obj) {
    removeid(obj.parentElement.id);
    obj.parentElement.remove();
}
// eslint-disable-next-line no-unused-vars
function enableedit(obj) {
    const text = obj.parentElement.firstElementChild.getElementsByTagName('INPUT')[0];
    const time = obj.parentElement.firstElementChild.getElementsByTagName('INPUT')[1];
    if (text.disabled) {
        obj.style.backgroundColor = 'rgb(104, 104, 104)';
        text.disabled = false;
        time.disabled = false;
    } else {
        // setintoplace
        if (checkWhitelist(text.value)) {
            text.value = 'Invalid Character';
            text.disabled = true;
            time.disabled = true;
            return;
        }
        setbackground(obj.parentElement, Date.now(), new Date(time.value.replace('-', '/')));
        currenttaskobj[obj.parentElement.id] = [Date.now(), new Date(time.value.replace('-', '/')), text.value];
        obj.style.backgroundColor = 'darkgrey';
        text.disabled = true;
        time.disabled = true;
    }
}
// eslint-disable-next-line no-unused-vars
function sendtobackend() {
    const timerlogs = new XMLHttpRequest();
    timerlogs.open('POST', '/timer', true);
    timerlogs.setRequestHeader('Content-type', 'application/json');
    timerlogs.setRequestHeader('type', 'ajax');
    console.log(currenttaskobj);
    timerlogs.send(JSON.stringify(currenttaskobj));
}
// eslint-disable-next-line no-unused-vars
function recivefrombackend() {
    const gettimerlogs = new XMLHttpRequest();
    gettimerlogs.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(typeof this.responseText);
            const res = JSON.parse(this.responseText);
            currenttaskobj = res;
            updatepagetimers();
        }
    };
    gettimerlogs.open('GET', '/timer', true);
    gettimerlogs.setRequestHeader('Content-type', 'application/json');
    gettimerlogs.setRequestHeader('type', 'ajax');
    gettimerlogs.send();
}

function updatepagetimers(obj = currenttaskobj) {
    const object = Object.keys(obj);
    const number = object.length;
    for (let i = 0; i < number; i++) {
        clonetask(object[i]);
        const thisobj = document.getElementById(object[i]);
        setbackground(thisobj, obj[object[i]][0], obj[object[i]][1]);
        // title
        thisobj.getElementsByTagName('INPUT')[0].value = obj[object[i]][2];
        // time new
        thisobj.getElementsByTagName('INPUT')[1].value = obj[object[i]][1].slice(0, 10);
    }
}