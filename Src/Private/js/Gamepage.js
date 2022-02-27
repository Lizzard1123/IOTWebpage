const socket = io();
const userName = localStorage.getItem('gameName');
const iframe = document.getElementById('game');
let time = 0;
let firstTime = true;
const userData = {
    quit: false,
    name: userName,
};

function joinGame(ame) {
    socket.emit('joinGame', ({
        name: ame,
        playing: true,
    }));
}

function changeIframe(title) {
    const form = title.replace(' ', '_');
    iframe.src = `https://en.wikipedia.org/wiki/${form}`;
}

function loadSettings(data) {
    document.getElementById('start').innerHTML = data.start;
    document.getElementById('end').innerHTML = data.end;
    changeIframe(data.start);
}

function updateTimer() {
    time = Math.floor(time + .1 * 10) / 10;
    document.getElementById('timer').innerHTML = time;
}

socket.on('settings', (data) => {
    loadSettings(data);
});

const timer = setInterval(updateTimer, 100);

function endGame() {
    firstTime = false;
    clearInterval(timer);
    iframe.remove();
    userData['time'] = time;
    socket.emit('end', userData);
}

socket.on('quit', () => {
    if (firstTime) {
        userData['quit'] = true;
        endGame();
    }
    const ending = document.createElement('div');
    ending.innerHTML = 'quit';
    iframe.remove();
    document.getElementById('endingBox').appendChild(ending);
});

socket.on('endScreen', (data) => {
    if (firstTime && !data.quit) {
        endGame();
    }
    const ending = document.createElement('div');
    let endmessage = '';
    console.log(data);
    for (const title in data) {
        if (true) { // got it to shutup kinda typeof data[title] == 'string' || typeof data[title] == 'number'
            endmessage += title + ': ' + data[title] + '\n';
        }
    }
    ending.innerHTML = endmessage;
    document.getElementById('endingBox').appendChild(ending);
});

joinGame(userName);
document.getElementById('quit').onclick = () => {
    socket.emit('quitGame', ({ name: userName }));
    document.getElementById('quit').style.visibility = 'hidden';
};
document.getElementById('body').onbeforeunload = () => {
    socket.emit('leaveGame', ({ name: userName }));
};