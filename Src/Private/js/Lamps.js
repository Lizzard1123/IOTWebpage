const all = {
    name: 'all',
    buttonState: 'Off',
    allOffButton: document.getElementById('allOff'),
    allOnButton: document.getElementById('allOn'),
    noComsSpecific: function() {
        this.allOffButton.disabled = true;
        this.allOnButton.disabled = true;
    },
    enable: function() {
        this.allOffButton.disabled = false;
        this.allOnButton.disabled = false;
    },
};
const deskLamp = {
    name: 'desk',
    HTMLnode: document.getElementsByName('deskLampButton')[0],
    lampTitle: document.getElementById('deskLabelTitle'),
    noComsPic: document.getElementById('deskNoComsPic'),
    buttonBox: document.getElementById('deskLampButton'),
    buttonState: true,
    changeState: function(state) {
        this.buttonState = state;
    },
    switchState: function() {
        this.changeState(!this.buttonState);
        return this.buttonState;
    },
    setUp: function() {
        this.noComsPic.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
        this.lampTitle.innerHTML = 'Desk Lamp Status';
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = 'visible';
        all.enable();
        console.log('setup');
    },
    clickWithoutChange: function(newState) {
        console.log('clc');
        this.setUp();
        if (this.buttonState != newState) {
            console.log('change');
            this.HTMLnode.removeAttribute('onchange');
            this.HTMLnode.click();
            this.changeState(newState);
            this.HTMLnode.setAttribute('onchange', 'buttonChange(this)');
        }
    },
    noComsSpecific: function() {
        console.log('no coms');
        this.lampTitle.innerHTML = 'No Connection';
        this.noComsPic.style.visibility = 'visible';
        this.buttonBox.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
        all.noComsSpecific();
    },
    click: function() {
        console.log('click');
        this.HTMLnode.click();
    },
};
const bedLamp = {
    name: 'bed',
    HTMLnode: document.getElementsByName('bedLampButton')[0],
    lampTitle: document.getElementById('bedLabelTitle'),
    noComsPic: document.getElementById('bedNoComsPic'),
    buttonBox: document.getElementById('bedLampButton'),
    buttonState: true,
    changeState: function(state) {
        this.buttonState = state;
    },
    switchState: function() {
        this.changeState(!this.buttonState);
        return this.buttonState;
    },
    setUp: function() {
        this.noComsPic.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
        this.lampTitle.innerHTML = 'Bed Lamp Status';
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = 'visible';
        all.enable();
    },
    clickWithoutChange: function(newState) {
        this.setUp();
        if (this.buttonState != newState) {
            this.HTMLnode.removeAttribute('onchange');
            this.HTMLnode.click();
            this.changeState(newState);
            this.HTMLnode.setAttribute('onchange', 'buttonChange(this)');
        }
    },
    noComsSpecific: function() {
        this.lampTitle.innerHTML = 'No Connection';
        this.noComsPic.style.visibility = 'visible';
        this.buttonBox.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
        all.noComsSpecific();
    },
    click: function() {
        this.HTMLnode.click();
    },
};

const socket = io();
const loader = document.getElementById('loadingg');
let awaitingRes = false;

function sendInfo(deskVal, bedVal) {
    socket.emit('update', `{"bed":${bedVal? '\"On\"' : '\"Off\"'},"desk":${deskVal? '\"On\"' : '\"Off\"'}}`);
    awaitingRes = true;
}

// eslint-disable-next-line no-unused-vars
function buttonChange(element) {
    let newdesk = deskLamp.buttonState;
    let newbed = bedLamp.buttonState;
    if (element == deskLamp.HTMLnode) {
        newdesk = deskLamp.switchState();
    } else if (element == bedLamp.HTMLnode) {
        newbed = bedLamp.switchState();
    } else {
        console.log('not recognized');
    }
    sendInfo(newdesk, newbed);
}

function sendInfoAll(Val) {
    socket.emit('update', `{"all":${Val? '\"On\"' : '\"Off\"'}}`);
}

// eslint-disable-next-line no-unused-vars
function buttonAllChange(element) {
    if (element == all.allOffButton) {
        sendInfoAll(false);
    } else if (element == all.allOnButton) {
        sendInfoAll(true);
    } else {
        console.log('not recognizedf');
    }
}

socket.on('status', (data) => {
    const values = JSON.parse(data);
    awaitingRes = false;
    if (values['status'] == 'noComs') {
        bedLamp.noComsSpecific();
        deskLamp.noComsSpecific();
    } else {
        bedLamp.clickWithoutChange(values['bed'] == 'On' ? true : false);
        deskLamp.clickWithoutChange(values['desk'] == 'On' ? true : false);
    }
});

socket.emit('status', 'hey');
deskLamp.setUp();
deskLamp.HTMLnode.setAttribute('onchange', 'buttonChange(this)');
bedLamp.setUp();
bedLamp.HTMLnode.setAttribute('onchange', 'buttonChange(this)');

all.allOffButton.setAttribute('onClick', 'buttonAllChange(this)');
all.allOnButton.setAttribute('onClick', 'buttonAllChange(this)');
setInterval(() => {
    if (!awaitingRes) {
        socket.emit('status', 'hey');
    }
}, 2000);