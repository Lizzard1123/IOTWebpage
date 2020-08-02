var width = window.innerWidth;
var height = window.innerHeight;
var numberhigh = 16;
var actualhigh = 30;
var numberwide = 22;
var triagnleWidth = width / numberwide;
var triangleheight = height / numberhigh;

function backpoints(width, height) {
    var coords = [];
    var count = 0;
    for (var g = 0; g <= actualhigh; g++) {
        var row = [];
        count++;
        if (count % 2 == 0) {
            for (var i = 0; i <= numberwide; i++) {
                row.push([Math.round(i * triagnleWidth + (triagnleWidth / 2)), Math.round(g * triangleheight)]);
            }
        } else {
            for (var i = 0; i <= numberwide; i++) {
                row.push([Math.round(i * triagnleWidth), Math.round(g * triangleheight)]);
            }
        }
        coords.push(row);
    }
    return coords;
}

function pointsToString(one, two, three) {
    var endstring = "";
    endstring = one[0] + "," + one[1] + " " + two[0] + "," + two[1] + " " + three[0] + "," + three[1];
    return endstring;
}
var colors = ["#34b4eb", "#1b8ebf", "#0b5b7d", "#34708a", "#134b63", "#359fcc", "#00acf5", "#0e52c7", "#357efc", "#2e7bff", "#0e7ead", "#40addb", "#1483b3", "#6bc6ed", "#44aedb", "#196f94", "#146fc9", "#4487c9", "#0575e3", "#298ff2", "#034e96", "#78b8f5", "#2289b5", "#23afeb", "#0373a3", "#06668f", "#0489c2", "#77a8f2", "#3882f2", "#1051b3", "#267ea3"];
var totalTriangles = 0;

function CreateTriangle(name, stringOfPoints) {
    const svg = document.getElementById("parent");
    const mypolygon = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    svg.appendChild(mypolygon);
    mypolygon.id = name;
    mypolygon.setAttribute("points", stringOfPoints);
    mypolygon.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
    mypolygon.setAttribute("onmouseover", "hoverchange(this)");
    mypolygon.setAttribute("onclick", "fadeBody()");
    totalTriangles++;
}

function makeTriangleRows(list) {
    var currentTriangle = 0;
    var numberofrows = (actualhigh - 2) / 2;
    var numberofsections = numberwide - 1;
    for (var t = 0; t < numberofrows + 1; t++) {
        var begstringOfPoints = pointsToString(list[t * 2][0], list[t * 2 + 1][0], list[t * 2 + 2][0]);
        currentTriangle++;
        var begtriangleName = "triangle" + currentTriangle;
        CreateTriangle(begtriangleName, begstringOfPoints);
        for (var g = 0; g < numberofsections + 1; g++) {
            for (var i = 0; i < 4; i++) {
                var first = [0 + (t * 2), 0 + g];
                var second = [0 + (t * 2), 1 + g];
                switch (i) {
                    case 1:
                        first[0] += 1;
                        first[1] += 1;
                        break;
                    case 2:
                        first[0] += 1;
                        first[1] += 1;
                        second[0] += 2;
                        break;
                    case 3:
                        first[0] += 2;
                        second[0] += 2;
                        break;
                }
                var third = [1 + (t * 2), 0 + g];
                currentTriangle++;
                var triangleName = "triangle" + currentTriangle;

                var stringOfPoints = pointsToString(list[first[0]][first[1]], list[second[0]][second[1]], list[third[0]][third[1]]);
                CreateTriangle(triangleName, stringOfPoints);
            }
        }

    }
}
var randomxchangelimit = 30;
var randomychangelimit = 30;

function randomizecoords(list) {
    var newlist = []
    for (var i = 0; i < list.length; i++) {
        var newrow = [];
        for (var t = 0; t < list[i].length; t++) {
            var changex = Math.floor(Math.random() * randomxchangelimit);
            var changey = Math.floor(Math.random() * randomychangelimit);
            var Add = Math.random() >= 0.5;
            var newx;
            var newy;
            if (Add) {
                newx = list[i][t][0] + changex;
                newy = list[i][t][1] + changey;
            } else {
                newx = list[i][t][0] - changex;
                newy = list[i][t][1] - changey;
            }
            var newcoord = [newx, newy];
            newrow.push(newcoord);
        }
        newlist.push(newrow);
    }
    return newlist;
}

/*
var testing = backpoints(width, height);
for (var i = 0; i < testing.length; i++) {
    for (var t = 0; t < testing[i].length; t++) {
        const svg = document.getElementById("parent");
        const txt = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        svg.appendChild(txt);
        txt.innerHTML = "(" + i + "," + t + ")";
        txt.setAttribute("x", testing[i][t][0]);
        txt.setAttribute("y", testing[i][t][1]);
        txt.setAttribute("font-size", "smaller");
    }
}
*/

makeTriangleRows(randomizecoords(backpoints(width, height)));

/*




*/

function hoverchange(triangle) {
    triangle.removeAttribute("fill");
    triangle.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
}


var Fadeinterval;
var Fadetime = 1;
var FadeTotalTime = 800;
var bodyVisible = true;
var dissapearingActs = ["header", "scrollbar", "body", "footer"];
var opacitysetting = 1;
var inProgress = false;

function fadeInBody() {
    inProgress = true;
    document.getElementById("backsplash").style.zIndex = -1;
    if (opacitysetting < 1) {
        opacitysetting += (1 / FadeTotalTime);
        for (var i = 0; i < dissapearingActs.length; i++) {
            document.getElementById(dissapearingActs[i]).style.opacity = opacitysetting;
        }
    } else {
        clearInterval(Fadeinterval);
        bodyVisible = true;
        inProgress = false;
    }
}

function fadeOutBody() {
    inProgress = true;

    if (opacitysetting > 0) {
        opacitysetting -= (1 / FadeTotalTime);
        for (var i = 0; i < dissapearingActs.length; i++) {
            document.getElementById(dissapearingActs[i]).style.opacity = opacitysetting;
        }
    } else {
        clearInterval(Fadeinterval);
        bodyVisible = false;
        document.getElementById("backsplash").style.zIndex = 10;
        inProgress = false;
    }
}

function fadeBody() {
    FadeTotalTime = 800;
    if (!inProgress) {
        if (bodyVisible) {
            Fadeinterval = setInterval(fadeOutBody, Fadetime);
        } else {
            Fadeinterval = setInterval(fadeInBody, Fadetime);
        }
    } else {}
}


var notMovingTimer;
var timeoutTime = 10000;
var Moving = false;
var needToResume = false;
var randomizeTriangles;
var randomizeTime = 100;

function AFK() {
    needToResume = true;
    FadeTotalTime = 5000;
    clearInterval(Fadeinterval);
    Fadeinterval = setInterval(fadeOutBody, Fadetime);
    randomizeTriangles = setInterval(randomcolorTriangles, randomizeTime);
}

function timeoutScreen() {
    if (needToResume) {
        FadeTotalTime = 300;
        clearInterval(Fadeinterval);
        Fadeinterval = setInterval(fadeInBody, Fadetime);
        needToResume = false;
        clearInterval(randomizeTriangles);
    }
    clearTimeout(notMovingTimer);
    notMovingTimer = setTimeout(AFK, timeoutTime);
}

function randomcolorTriangles() {
    var randomselector = Math.floor(Math.random() * totalTriangles);
    var triangle = document.getElementById("triangle" + (randomselector - 1));
    triangle.removeAttribute("fill");
    triangle.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
}

/*




*/