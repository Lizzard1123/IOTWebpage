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

document.getElementById('back').onclick = () => {
    gameFinderPage.style.display = '';
    gamePage.style.display = 'none';
    document.getElementById('rolls').remove();
    const elm = document.createElement('div');
    elm.id = 'rolls';
    document.getElementById('gamePage').appendChild(elm);
};

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
        ctx.strokeText(i + 2, width / 12 * i + width / 12, height - bottomOffset, width / 12);
    }
    // bottom line
    ctx.fillStyle = '#000000';
    ctx.fillRect(15, height - 20, width, 5);
}

function getScale(obj) {
    const offset = .5;
    let highest = 0;
    console.log(highest);
    for (let i = 0; i < 11; i++) {
        if (obj[`num${i + 2}`] > highest) {
            highest = obj[`num${i + 2}`];
        }
    }
    return 1 / (highest / rolls.length) - offset;
}

function updateGraph() {
    const points = [];
    const scale = getScale(game);
    for (let i = 0; i < 11; i++) {
        // x
        points.push(width / 12 * i + width / 10);
        // y
        const proportion = game[`num${i+2}`] / rolls.length;
        points.push(height - (height - 15) * proportion * scale - 20);
    }
    console.log(points);
    drawCurve(ctx, points, .5, false, 16, true);
    ctx.fillStyle = '#039129';
    ctx.fill();
}

function updatePerfectGraph() {
    const points = [];
    const scale = getScale(game);
    console.log(scale);
    for (let i = 0; i < 11; i++) {
        // x
        points.push(width / 12 * i + width / 10);
        // y
        const proportion = perfectGame[`num${i+2}`];

        points.push(height - (height - 15) * proportion * scale - 20);
    }
    console.log(points);
    drawCurve(ctx, points, .5, false, 16, true);
    ctx.fillStyle = '#700c6a';
    ctx.fill();
}

function drawSide() {
    const segments = 11;
    const scale = getScale(game);
    for (let i = 0; i < segments; i++) {
        ctx.strokeText(i / 10, 3, height - (height - 15) * (i / 10) * scale - 20, 10);
    }
    // bottom line
    ctx.fillStyle = '#000000';
    ctx.fillRect(15, 0, 5, height - 15);
}

function loadGameStats() {
    clear();
    drawBottom();
    updateGraph();
    if (document.getElementById('perfectCheck').checked) {
        updatePerfectGraph();
    }
    drawSide();
}