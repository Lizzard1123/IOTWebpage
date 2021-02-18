const graph = document.getElementById('graph');
const width = 480;
const height = 200;
const ctx = graph.getContext('2d');
// not filling
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, height, width, 0);

let gameName;
let rolls = [];
const game = {};
const perfectGame = {};
const newGameForm = document.getElementById('createGame');
const findGameForm = document.getElementById('findGame');

function createGame() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('currentGame').innerHTML = document.getElementById('createGameName').value;
            document.getElementById('Info').innerHTML = document.getElementById('createGameInfo').value;
            findGameForm.style.visibility = 'hidden';
            newGameForm.style.visibility = 'hidden';
            gameName = document.getElementById('createGameName').value;
            updatePage();
        }
    };
    xhttp.open('POST', '/createCatanGame', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${document.getElementById('createGameName').value}&info=${document.getElementById('createGameInfo').value}`);
}

function findGame() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('currentGame').innerHTML = document.getElementById('createGameName').value;
            findGameForm.style.visibility = 'hidden';
            newGameForm.style.visibility = 'hidden';
            gameName = document.getElementById('findGameName').value;
            updatePage();
        }
    };
    xhttp.open('POST', '/findCatanGame', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${document.getElementById('findGameName').value}`);
}

function updateDice() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rolls.push(document.getElementById('rollNumInput').value);
            game[`num${document.getElementById('rollNumInput').value}`]++;
            console.log('done');
            const elm = document.createElement('div');
            elm.innerHTML = document.getElementById('rollNumInput').value;
            document.getElementById('rolls').appendChild(elm);
            document.getElementById('rollNumInput').value = '';
        }
    };
    xhttp.open('POST', '/updateDice', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${gameName}&roll=${document.getElementById('rollNumInput').value}`);
}

function updatePage() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);
            rolls = data;
            for (let i = 0; i < data.length; i++) {
                const elm = document.createElement('div');
                elm.innerHTML = data[i].roll;
                document.getElementById('rolls').appendChild(elm);
                game[`num${data[i].roll}`]++;
            }
        }
    };
    xhttp.open('POST', '/getCatanGame', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${gameName}`);
}

function setup() {
    for (let i = 0; i < 6; i++) {
        perfectGame[`num${i + 2}`] = (i + 1) / 36;
        perfectGame[`num${12 - i}`] = (i + 1) / 36;
    }
    for (let i = 0; i < 11; i++) {
        game[`num${i + 2}`] = 0;
    }
}

setup();