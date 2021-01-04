const taskcontent = document.getElementById('taskcontent');
const task0 = document.getElementById('task0');

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
    console.log(obj);
    console.log(totaltime);
    console.log(currenttime);
    if (totaltime < 0 || currenttime < 0) {
        obj.style.backgroundColor = `rgb(${redcolor[0]}, ${redcolor[1]}, ${redcolor[2]})`;
        return;
    }
    const progress = currenttime / totaltime;
    colorarray = getbgcolor(greencolor, redcolor, progress);
    obj.style.backgroundColor = `rgb(${colorarray[0]}, ${colorarray[1]}, ${colorarray[2]})`;
    setTimeout(setbackground, (60 * 1000), obj, dateone, datetwo);
}

const ids = [];

// TODO
function avaliableid() {
    let count = 1;
    while (true) {
        if (!ids.includes(count)) {
            return count;
        } else {
            count++;
        }
    }
}


function clonetask(reqid = avaliableid()) {
    ids.push(parseInt(reqid));
    const cln = task0.cloneNode(true);
    cln.getElementsByClassName('delete')[0].style.visibility = 'visible';
    cln.id = reqid;
    cln.style.display = 'block';
    cln.getElementsByClassName('datething')[0].value = d.getFullYear() + '-' + monthActual + '-' + dayVal;
    taskcontent.appendChild(cln);
}

// eslint-disable-next-line no-unused-vars
function deleteparent(obj) {
    const deleteTimer = new XMLHttpRequest();
    deleteTimer.open('POST', '/timerdel', true);
    deleteTimer.setRequestHeader('Content-type', 'application/json');
    deleteTimer.setRequestHeader('type', 'ajax');
    console.log(`removing ${obj.parentElement.id}`);
    deleteTimer.send(JSON.stringify({ id: obj.parentElement.id }));
    obj.parentElement.remove();
    delete ids[ids.indexOf(obj.parentElement.id)];
}
// edit
function editTimer(obj) {
    const deleteTimer = new XMLHttpRequest();
    deleteTimer.open('POST', '/timeredit', true);
    deleteTimer.setRequestHeader('Content-type', 'application/json');
    deleteTimer.setRequestHeader('type', 'ajax');
    console.log(`editing ${obj['id']}`);
    deleteTimer.send(JSON.stringify(obj));
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
        const newTimer = {
            id: obj.parentElement.id,
            dateOne: Date.now(),
            dateTwo: new Date(time.value.replace('-', '/')),
            text: text.value,
        };
        editTimer(newTimer);
        obj.style.backgroundColor = 'darkgrey';
        text.disabled = true;
        time.disabled = true;
    }
}

// eslint-disable-next-line no-unused-vars
function recivefrombackend() {
    const gettimerlogs = new XMLHttpRequest();
    gettimerlogs.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            const res = JSON.parse(this.responseText);
            updatepagetimers(res);
        }
    };
    gettimerlogs.open('GET', '/timer', true);
    gettimerlogs.setRequestHeader('Content-type', 'application/json');
    gettimerlogs.setRequestHeader('type', 'ajax');
    gettimerlogs.send();
}

function updatepagetimers(obj) {
    for (let i = 0; i < obj.length; i++) {
        console.log(obj.length);
        clonetask(obj[i]['taskId']);
        console.log(obj[i]['startDate']);
        console.log(obj[i]['endDate']);
        console.log(obj);
        const thisobj = document.getElementById(obj[i]['taskId']);
        setbackground(thisobj, obj[i]['startDate'], obj[i]['endDate']);
        // title
        thisobj.getElementsByTagName('INPUT')[0].value = obj[i]['title'];
        // time new new Date(time.value.replace('-', '/'))
        const beforeDate = obj[i]['endDate'].substring(0, 10);
        thisobj.getElementsByTagName('INPUT')[1].value = beforeDate;
    }
}

// Uploading calender
// eslint-disable-next-line no-unused-vars
function getFile() {
    document.getElementById('fileInput').click();
}

// eslint-disable-next-line no-unused-vars
function uploadCalander() {
    document.getElementById('uploadFileForm').submit();
}