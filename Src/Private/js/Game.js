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