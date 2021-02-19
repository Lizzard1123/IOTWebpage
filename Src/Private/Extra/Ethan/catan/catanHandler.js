let gameName;
let rolls = [];
const game = {};
const perfectGame = {};
const gameFinderPage = document.getElementById('introBox');
const gamePage = document.getElementById('gamePage');

function foundGame() {
    gameFinderPage.style.display = 'none';
    gamePage.style.display = '';
    getGame();
}

function getGame() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);
            document.getElementById('currentGame').innerHTML = data[0].name;
            document.getElementById('Info').innerHTML = data[0].info;
        }
    };
    xhttp.open('POST', '/getCatanGameInfo', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${gameName}`);
}

// eslint-disable-next-line no-unused-vars
function createGame() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('currentGame').innerHTML = document.getElementById('createGameName').value;
            document.getElementById('Info').innerHTML = document.getElementById('createGameInfo').value;
            gameName = document.getElementById('createGameName').value;
            foundGame();
            updatePage();
        }
    };
    xhttp.open('POST', '/createCatanGame', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${document.getElementById('createGameName').value}&info=${document.getElementById('createGameInfo').value}`);
}


// eslint-disable-next-line no-unused-vars
function findGame() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('currentGame').innerHTML = document.getElementById('createGameName').value;
            gameName = document.getElementById('findGameName').value;
            foundGame();
            updatePage();
        }
    };
    xhttp.open('POST', '/findCatanGame', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${document.getElementById('findGameName').value}`);
}


// eslint-disable-next-line no-unused-vars
function updateDice() {
    const val = document.getElementById('rollNumInput').value;
    if (val == '' || val < 2 || val > 12) {
        console.log('skip');
        return;
    }
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rolls.push(val);
            game[`num${document.getElementById('rollNumInput').value}`]++;
            console.log('done');
            const elm = document.createElement('div');
            elm.innerHTML = document.getElementById('rollNumInput').value;
            document.getElementById('rolls').appendChild(elm);
            document.getElementById('rollNumInput').value = '';
            loadGameStats();
        }
    };
    xhttp.open('POST', '/updateDice', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${gameName}&roll=${document.getElementById('rollNumInput').value}`);
}

function setupSample() {
    for (let i = 0; i < 6; i++) {
        perfectGame[`num${i + 2}`] = (i + 1) / 36;
        perfectGame[`num${12 - i}`] = (i + 1) / 36;
    }
    for (let i = 0; i < 11; i++) {
        game[`num${i + 2}`] = 0;
    }
}

function updatePage() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);
            setupSample();
            rolls = data;
            for (let i = 0; i < data.length; i++) {
                const elm = document.createElement('div');
                elm.innerHTML = data[i].roll;
                document.getElementById('rolls').appendChild(elm);
                game[`num${data[i].roll}`]++;
            }
            loadGameStats();
        }
    };
    xhttp.open('POST', '/getCatanGame', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${gameName}`);
}

// canvases Handlers
const graph = document.getElementById('graph');
const width = 360;
const height = 200;
const ctx = graph.getContext('2d');

function clear() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
}

function drawBottom() {
    // numbers
    const bottomOffset = 5;
    for (let i = 0; i < 11; i++) {
        ctx.strokeText(i + 2, width / 12 * i + width / 24, height - bottomOffset, width / 12);
    }
    // bottom line
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, height - 20, width, 5);
}

function getScale(obj) {
    const offset = .5;
    let highest = obj[`num2`] / rolls.length;
    for (let i = 0; i < 11; i++) {
        if (highest < obj[`num${i + 2}`] / rolls.length) {
            highest = obj[`num${i + 2}`] / rolls.length;
        }
    }
    return 1 / highest - offset;
}

function updateGraph() {
    const points = [];
    for (let i = 0; i < 11; i++) {
        // x isnt mathmatically inline but it lines up with text
        points.push(width / 12 * i + width / 18);
        // y
        const proportion = game[`num${i+2}`] / rolls.length;
        const scale = getScale(game);
        points.push(height - height * proportion * scale - 15);
    }
    console.log(points);
    drawCurve(ctx, points, .5, false, 16, true);
    ctx.fillStyle = '#039129';
    ctx.fill();
}

function updatePerfectGraph() {
    const points = [];
    for (let i = 0; i < 11; i++) {
        // x isnt mathmatically inline but it lines up with text
        points.push(width / 12 * i + width / 18);
        // y
        const proportion = perfectGame[`num${i+2}`] / rolls.length;
        const scale = getScale(perfectGame);
        console.log(scale);
        points.push(height - height * proportion * scale - 15);
    }
    console.log(points);
    drawCurve(ctx, points, .5, false, 16, true);
    ctx.fillStyle = '#700c6a';
    ctx.fill();
}

function loadGameStats() {
    clear();
    drawBottom();
    updateGraph();
    if (document.getElementById('perfectCheck').checked) {
        updatePerfectGraph();
    }
}