const socket = io();

let timer;
const counter = document.getElementById('counter');
let count = 0;
let userSet = false;
let userDataSet = {};

function updateTimer() {
    if (count < 5) {
        count++;
        counter.innerHTML = count;
    } else {
        window.location = '/privateStatic/html/Gamepage.html';
        clearInterval(timer);
    }
}

function createUser(name) {
    const user = document.createElement('div');
    user.id = name;
    user.className = 'users';
    user.innerHTML = name;
    document.getElementById('Users').appendChild(user);
}

function startCount() {
    timer = setInterval(updateTimer, 1000);
}

function createSetting(data) {
    const setting = document.createElement('div');
    setting.id = data.settingName;
    setting.className = 'settings';
    setting.innerHTML = data.settingName + ' : ' + data.description;
    document.getElementById('SettingBox').appendChild(setting);
}

socket.on('start', () => {
    if (userSet) {
        startCount();
    }
});

socket.on('updateUsers', (data) => {
    if (data.remove) {
        document.getElementById(data.name).remove();
    } else {
        createUser(data.name);
    }
});

socket.on('updateSettings', (data) => {
    if (data.remove) {
        document.getElementById(data.settingName).remove();
    } else {
        createSetting(data);
    }
});

document.getElementById('joinBtn').onclick = () => {
    if (document.getElementById('joinName').value.length == 0) {
        alert('Input Name NOW UWU');
    } else {
        const userData = {
            remove: false,
            name: document.getElementById('joinName').value,
        };
        socket.emit('join', (userData));
        document.getElementById('joinBtn').disabled = true;
        userSet = true;
        userDataSet = userData;
        document.getElementById('startBtn').style.visibility = 'visible';
        document.cookie = `gameName=${userDataSet.name}`;
    }
};

// https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=London&format=json
function getDescription(title, start, id) {
    const wikiRandom = new XMLHttpRequest();
    wikiRandom.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (start) { // query.pages[14492927].description
                document.getElementById('startDesc').innerHTML = JSON.parse(this.responseText).query.pages[id].description;
            } else {
                document.getElementById('endDesc').innerHTML = JSON.parse(this.responseText).query.pages[id].description;
            }
        }
    };
    wikiRandom.open('GET', `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=description&titles=${title}&format=json`, true);
    wikiRandom.send();
}

function getRandomUrlName(start) {
    const wikiRandom = new XMLHttpRequest();
    wikiRandom.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.responseText);
            const title = res.query.random[0].title;
            const id = res.query.random[0].id;
            if (start) {
                document.getElementById('start').value = title;
                getDescription(title, true, id.toString());
            } else {
                document.getElementById('end').value = title;
                getDescription(title, false, id.toString());
            }
        }
    };
    wikiRandom.open('GET', 'https://en.wikipedia.org/w/api.php?origin=*&rnnamespace=0&action=query&format=json&list=random&rnlimit=1', true);
    wikiRandom.send();
}

document.getElementById('randomStart').onclick = () => {
    getRandomUrlName(true);
};

document.getElementById('randomEnd').onclick = () => {
    getRandomUrlName(false);
};

document.getElementById('startBtn').onclick = () => {
    if (document.getElementById('start').value.length != 0 || document.getElementById('end').value.length != 0) {
        socket.emit('startGame', ({
            start: document.getElementById('start').value,
            end: document.getElementById('end').value,
        }));
    } else {
        alert('fill in start/end');
    }
};

socket.emit('getUsers');
document.getElementById('body').onbeforeunload = () => {
    if (userSet) {
        socket.emit('removeUser', (userDataSet));
    }
};