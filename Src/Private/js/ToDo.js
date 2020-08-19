const taskcontent = document.getElementById("taskcontent");
const task1 = document.getElementById("task0");

var currenttasks = ['task0'];

var d = new Date();
var month = d.getMonth();
var month_actual = month + 1;
if (month_actual < 10) {
    month_actual = "0" + month_actual;
}

var day_val = d.getDate();
if (day_val < 10) {
    day_val = "0" + day_val;
}

document.getElementsByClassName("datething")[0].value = d.getFullYear() + "-" + month_actual + "-" + day_val;

const greencolor = [26, 156, 65];
const redcolor = [207, 0, 0];

function timeinbetween(dateone, datetwo) {
    return new Date(dateone) - new Date(datetwo);
}

function getbgcolor(colora, colorb, t) {
    let r1 = colora[0];
    let g1 = colora[1];
    let b1 = colora[2];
    let r2 = colorb[0];
    let g2 = colorb[1];
    let b2 = colorb[2];
    let newcolor = [
        r1 + (r2 - r1) * t,
        g1 + (g2 - g1) * t,
        b1 + (b2 - b1) * t
    ]
    return newcolor;
}

function setbackground(obj, dateone, datetwo) {
    var totaltime = timeinbetween(datetwo, dateone);
    var currenttime = timeinbetween(Date.now(), dateone);
    if (totaltime < 0 || currenttime < 0) {
        obj.style.backgroundColor = `rgb(${redcolor[0]}, ${redcolor[1]}, ${redcolor[2]})`;
        return;
    }
    var progress = currenttime / totaltime;
    colorarray = getbgcolor(greencolor, redcolor, progress);
    obj.style.backgroundColor = `rgb(${colorarray[0]}, ${colorarray[1]}, ${colorarray[2]})`
    setTimeout(setbackground, (60 * 1000), obj, dateone, datetwo);
}

function avaliableid() {
    let count = 0;
    while (true) {
        let newname = `task${count}`;
        if (currenttasks.indexOf(newname) == -1) {
            return newname;
        } else {
            count++;
        }
    }
}

function removeid(id) {
    let newidarray = [];
    for (var i = 0; i < currenttasks.length; i++) {
        if (currenttasks[i] != id) {
            newidarray.push(currenttasks[i]);
        }
    }
    currenttasks = newidarray;
    delete currenttaskobj[id];
}

var currenttaskobj = {};


function clonetask(reqid = avaliableid()) {
    var cln = task1.cloneNode(true);
    cln.getElementsByClassName("delete")[0].style.visibility = "visible";
    cln.id = reqid;
    currenttasks.push(reqid);
    cln.getElementsByClassName("datething")[0].value = d.getFullYear() + "-" + month_actual + "-" + day_val;
    taskcontent.appendChild(cln);
}

function deleteparent(obj) {
    removeid(obj.parentElement.id);
    obj.parentElement.remove();
}

function enableedit(obj) {
    let text = obj.parentElement.firstElementChild.getElementsByTagName("INPUT")[0];
    let time = obj.parentElement.firstElementChild.getElementsByTagName("INPUT")[1];
    if (text.disabled) {
        obj.style.backgroundColor = "rgb(104, 104, 104)";
        text.disabled = false;
        time.disabled = false;
    } else {
        //setintoplace
        if (checkWhitelist(text.value)) {
            text.value = "Invalid Character";
            text.disabled = true;
            time.disabled = true;
            return;
        }
        setbackground(obj.parentElement, Date.now(), new Date(time.value.replace('-', '/')));
        currenttaskobj[obj.parentElement.id] = [Date.now(), new Date(time.value.replace('-', '/')), text.value];
        obj.style.backgroundColor = "darkgrey";
        text.disabled = true;
        time.disabled = true;
    }
}

function sendtobackend() {
    var timerlogs = new XMLHttpRequest();
    timerlogs.open("POST", "/timer", true);
    timerlogs.setRequestHeader('Content-type', 'application/json');
    timerlogs.send(JSON.stringify(currenttaskobj));
}

function recivefrombackend() {
    var gettimerlogs = new XMLHttpRequest();
    gettimerlogs.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            currenttaskobj = res;
            updatepagetimers();
        }
    };
    gettimerlogs.open("GET", "/timer", true);
    gettimerlogs.setRequestHeader('Content-type', 'application/json');
    gettimerlogs.send();
}

function updatepagetimers(obj = currenttaskobj) {
    var object = Object.keys(obj);
    let number = object.length;
    for (var i = 0; i < number; i++) {
        clonetask(object[i]);
        var thisobj = document.getElementById(object[i]);
        setbackground(thisobj, obj[object[i]][0], obj[object[i]][1]);
        //title
        thisobj.getElementsByTagName("INPUT")[0].value = obj[object[i]][2];
        //time new 
        thisobj.getElementsByTagName("INPUT")[1].value = obj[object[i]][1].slice(0, 10);
    }
}