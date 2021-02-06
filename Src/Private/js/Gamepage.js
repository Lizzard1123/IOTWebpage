// thx w3 schools again
function getCookie(cname) {
    const tname = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(tname) == 0) {
            return c.substring(tname.length, c.length);
        }
    }
    return '';
}

const socket = io();
const userName = getCookie('gameName');
const iframe = document.getElementById('game');

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

socket.on('settings', (data) => {
    loadSettings(data);
});

socket.on('endScreen', (data) => {
    const ending = document.createElement('div');
    ending.id = data.settingName;
    ending.innerHTML = data.description;
    document.getElementById('endingBox').appendChild(ending);
});

joinGame(userName);
document.getElementById('quit').onclick = () => {
    socket.emit('quitGame', ({ name: userName }));
};
document.getElementById('body').onbeforeunload = () => {
    socket.emit('leaveGame', ({ name: userName }));
};