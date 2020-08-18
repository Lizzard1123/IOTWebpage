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
    return Math.abs(new Date(dateone) - new Date(datetwo));
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
    var totaltime = timeinbetween(dateone, datetwo);
    var currenttime = timeinbetween(dateone, Date.now());
    var progress = currenttime / totaltime;
    colorarray = getbgcolor(greencolor, redcolor, progress);
    obj.style.backgroundColor = `rgb(${colorarray[0]}, ${colorarray[1]}, ${colorarray[2]})`
    console.log('doing');
    console.log(progress);
    setTimeout(setbackground, (60 * 1000), obj, dateone, datetwo);
}

function avaliableid() {
    let count = 0;
    while (true) {
        let newname = `task${count}`;
        if (currenttasks.indexOf(newname) == -1) {
            currenttasks.push(newname);
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
}

function clonetask() {
    var cln = task1.cloneNode(true);
    cln.getElementsByClassName("delete")[0].style.visibility = "visible";
    cln.id = avaliableid();
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
        setbackground(obj.parentElement, Date.now(), new Date(time.value.replace('-', '/')))
        obj.style.backgroundColor = "darkgrey";
        text.disabled = true;
        time.disabled = true;
    }
}