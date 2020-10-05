const width = window.innerWidth;
const height = window.innerHeight;
// how many triangles can be seen in a window
const screenhigh = 16;
// how many are required to fill entire page
// var actualhigh = 42;
// how many triangles go across
const numberwide = 22;
const triagnleWidth = width / numberwide;
const triangleheight = height / screenhigh;
// how many extra tiangles per row/height
const widthBuffer = 2;
const heightBuffer = 2;
// set triangles back some
const widthOffset = 1;
const heightOffset = 1;
const colors = [
    '#34b4eb',
    '#1b8ebf',
    '#0b5b7d',
    '#34708a',
    '#134b63',
    '#359fcc',
    '#00acf5',
    '#0e52c7',
    '#357efc',
    '#2e7bff',
    '#0e7ead',
    '#40addb',
    '#1483b3',
    '#6bc6ed',
    '#44aedb',
    '#196f94',
    '#146fc9',
    '#4487c9',
    '#0575e3',
    '#298ff2',
    '#034e96',
    '#78b8f5',
    '#2289b5',
    '#23afeb',
    '#0373a3',
    '#06668f',
    '#0489c2',
    '#77a8f2',
    '#3882f2',
    '#1051b3',
    '#267ea3',
];
// var colors = [];
/*
const coloroffset = 50;

function colorAlgogradient(r, g, b) {
    const value = (r + g + b) / 3;
    const newvalue = value + 2 * Math.random() * coloroffset - coloroffset;
    const valueratio = newvalue / value;
    return [r * valueratio, g * valueratio, b * valueratio];
}

for (var i = 0; i < numberofcolors; i++) {
    colors.push(`rgb(${colorAlgogradient(41, 112, 133)})`);
    //colors.push(`rgb(${ Math.floor(Math.random() * 255)}, ${ Math.floor(Math.random() * 255)}, ${ Math.floor(Math.random() * 255)})`);
}
*/
let totalTriangles = 0;

// created staggered rows of all coordindates for triangles
// eslint-disable-next-line no-unused-vars
function backpoints(width, height, actualhigh) {
    const coords = [];
    let count = 0;
    for (let g = 0; g <= actualhigh + heightBuffer; g++) {
        const row = [];
        count++;
        if (count % 2 == 0) {
            for (let i = 0; i <= (numberwide + widthBuffer); i++) {
                row.push([Math.round((i - widthOffset) * triagnleWidth + (triagnleWidth / 2)), Math.round((g - heightOffset) * triangleheight)]);
            }
        } else {
            for (let i = 0; i <= (numberwide + widthBuffer); i++) {
                row.push([Math.round((i - widthOffset) * triagnleWidth), Math.round((g - heightOffset) * triangleheight)]);
            }
        }
        coords.push(row);
    }
    return coords;
}

// takes in 3 verticies of coordinate arrays and concatinated it into string
function pointsToString(one, two, three) {
    let endstring = '';
    endstring = one[0] + ',' + one[1] + ' ' + two[0] + ',' + two[1] + ' ' + three[0] + ',' + three[1];
    return endstring;
}

// takes in #id and string of points and creates polygon inside of div parent + sets all attributes
function createTriangle(name, stringOfPoints) {
    const svg = document.getElementById('parent');
    const mypolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    svg.appendChild(mypolygon);
    mypolygon.id = name;
    mypolygon.setAttribute('points', stringOfPoints);
    mypolygon.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
    mypolygon.setAttribute('onmouseover', 'hoverchange(this)');
    mypolygon.setAttribute('onclick', 'clickfadeBody()');
    mypolygon.setAttribute('class', 'back-triangles');
    totalTriangles++;
}

// var trianglepositions = [];

// goes thtogh and takes the indexes of coordinates list to make a row of triangles
// eslint-disable-next-line no-unused-vars
function makeTriangleRows(list, actualhigh) {
    let currentTriangle = 0;
    const numberofrows = (((actualhigh + heightBuffer) + 3 - (actualhigh + heightBuffer) % 3) / 3);
    const numberofsections = numberwide - 1 + widthBuffer; // nice
    for (let t = 0; t < numberofrows + 1; t++) {
        const begstringOfPoints = pointsToString(list[t * 2][0], list[t * 2 + 1][0], list[t * 2 + 2][0]);
        currentTriangle++;
        const begtriangleName = 'triangle' + currentTriangle;
        createTriangle(begtriangleName, begstringOfPoints);
        // posRow.push(begtriangleName);
        for (let g = 0; g < numberofsections + 1; g++) {
            for (let i = 0; i < 4; i++) {
                const first = [0 + (t * 2), 0 + g];
                const second = [0 + (t * 2), 1 + g];
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
                const third = [1 + (t * 2), 0 + g];
                currentTriangle++;
                const triangleName = 'triangle' + currentTriangle;
                const stringOfPoints = pointsToString(list[first[0]][first[1]], list[second[0]][second[1]], list[third[0]][third[1]]);
                createTriangle(triangleName, stringOfPoints);
                // posRow.push(triangleName);
            }
        }
        // trianglepositions.push(posRow);
    }
}
// changes the coordinates in a random direction in a random number with these variables max
const randomxchangelimit = 25;
const randomychangelimit = 20;
// eslint-disable-next-line no-unused-vars
function randomizecoords(list) {
    const newlist = [];
    for (let i = 0; i < list.length; i++) {
        const newrow = [];
        for (let t = 0; t < list[i].length; t++) {
            const changex = Math.floor(Math.random() * randomxchangelimit);
            const changey = Math.floor(Math.random() * randomychangelimit);
            const Add = Math.random() >= 0.5;
            let newx;
            let newy;
            if (Add) {
                newx = list[i][t][0] + changex;
                newy = list[i][t][1] + changey;
            } else {
                newx = list[i][t][0] - changex;
                newy = list[i][t][1] - changey;
            }
            const newcoord = [newx, newy];
            newrow.push(newcoord);
        }
        newlist.push(newrow);
    }
    return newlist;
}

/*
//variety of changes
function gradientTopLeft(list) {
    var middlex = math.round(list.length / 2);
}

function aroundRound(list) {
    var orderOfOperations = [];
    var copiedlist = list;
    while (true) {
        if (copiedlist[1].length == 0) {
            for (var i = 0; i < copiedlist[0].legnth; i++) {
                orderOfOperations.push(copiedlist[0].pop());
            }
            break;
        } else {
            for (var i = 0; i < copiedlist[0].length; i++) {
                orderOfOperations.push(copiedlist[0].shift());
            }
            for (var i = 1; i < copiedlist.length; i++) {
                orderOfOperations.push(copiedlist[i].pop());
            }
            for (var i = copiedlist[copiedlist.length - 2].length; i > 0; i--) {
                orderOfOperations.push(copiedlist[copiedlist.length - 1].pop());
            }
            for (var i = copiedlist.length - 2; i > 0 - 1; i--) {
                orderOfOperations.push(copiedlist[i].shift());
            }
        }

    }

    return orderOfOperations;
}

var number = 1;

var circleChange;

function ChangeByStep(list) {
    console.log("changed to " + number);
    var current = document.getElementById(list[number]);
    console.log(current);
    current.removeAttribute("fill");
    current.setAttribute("fill", 'black');
    if (number == list.length) {
        console.log('cleared');
        clearInterval(circleChange);
    } else {
        number++;
    }
}

var orderList = aroundRound(trianglepositions);
circleChange = setInterval(ChangeByStep(orderList), 100);
var testing = setInterval(() => { console.log('1sec') }, 1000);


*/

// removes and resets the fill of polygon
// eslint-disable-next-line no-unused-vars
function hoverchange(triangle) {
    triangle.removeAttribute('fill');
    triangle.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
}

// fadescreen variables
let Fadeinterval;
const Fadetime = 1;
let FadeTotalTime = 800;
let bodyVisible = true;
const dissapearingActs = ['header', 'scrollbar', 'body', 'footer', 'Weather'];
let opacitysetting = 1;
let inProgress = false;

function fadeInBody() {
    inProgress = true;
    document.getElementById('backsplash').style.zIndex = -1;
    if (opacitysetting < 1) {
        opacitysetting += (1 / FadeTotalTime);
        for (let i = 0; i < dissapearingActs.length; i++) {
            try {
                document.getElementById(dissapearingActs[i]).style.opacity = opacitysetting;
            } catch {
                continue;
            }
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
        for (let i = 0; i < dissapearingActs.length; i++) {
            try {
                document.getElementById(dissapearingActs[i]).style.opacity = opacitysetting;
            } catch {
                continue;
            }
        }
    } else {
        clearInterval(Fadeinterval);
        bodyVisible = false;
        document.getElementById('backsplash').style.zIndex = 10;
        inProgress = false;
    }
}
// eslint-disable-next-line no-unused-vars
function clickFadeBody() {
    if (getinfo('four')) {
        fadeBody();
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


let notMovingTimer;
const timeoutTime = 10000;
let needToResume = false;
let randomizeTriangles;
const randomizeTime = 100;

function AFK() {
    needToResume = true;
    FadeTotalTime = 5000;
    clearInterval(Fadeinterval);
    Fadeinterval = setInterval(fadeOutBody, Fadetime);
    if (getinfo('two') && !getinfo('seven')) {
        randomizeTriangles = setInterval(randomcolorTriangles, randomizeTime);
    }
}

// eslint-disable-next-line no-unused-vars
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
    const randomselector = Math.floor(Math.random() * totalTriangles);
    const triangle = document.getElementById('triangle' + (randomselector + 1));
    triangle.removeAttribute('fill');
    triangle.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
}

// Window key presses
window.onkeydown = function(e) {
    if (e.keyCode == 32) {
        // ChangeByStep(orderList);
    }
};