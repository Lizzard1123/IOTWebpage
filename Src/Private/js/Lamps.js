const loader = document.getElementById('loadingg');
const allButtons = ['deskLampButton', 'bedLampButton'];
const allLampObj = ['desk', 'bed', 'all'];
const deskLamp = {
    name: 'desk',
    HTMLnode: document.getElementsByName('deskLampButton')[0],
    lampTitle: document.getElementById('deskLabelTitle'),
    noComsPic: document.getElementById('deskNoComsPic'),
    buttonBox: document.getElementById('deskLampButton'),
    buttonState: 'Off',
    changeState: function(state) {
        console.log('cs' + state);
        document.cookie = `globalDeskState=${state}`;
        this.buttonState = state;
    },
    changeItself: function() {
        this.noComsPic.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
        console.log('hiya');
        this.lampTitle.innerHTML = 'Desk Lamp Status';
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = 'visible';
        this.HTMLnode.removeAttribute('onchange');
        if (this.buttonState == 'Off') {
            this.HTMLnode.click();
        }
        this.HTMLnode.setAttribute('onchange', 'buttonChange(this)');
    },
    clickWithoutChange: function(newState) {
        this.HTMLnode.removeAttribute('onchange');
        if (this.buttonState != newState) {
            this.HTMLnode.click();
            this.changeState(newState);
        }
        this.HTMLnode.setAttribute('onchange', 'buttonChange(this)');
    },
    noComsSpecific: function() {
        this.lampTitle.innerHTML = 'No Connection';
        this.noComsPic.style.visibility = 'visible';
        this.buttonBox.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
    },
};
const bedLamp = {
    name: 'bed',
    HTMLnode: document.getElementsByName('bedLampButton')[0],
    lampTitle: document.getElementById('bedLabelTitle'),
    noComsPic: document.getElementById('bedNoComsPic'),
    buttonBox: document.getElementById('bedLampButton'),
    buttonState: 'Off',
    changeState: function(state) {
        console.log('cs' + state);
        document.cookie = `globalBedState=${state}`;
        this.buttonState = state;
    },
    changeItself: function() {
        console.log('hereee');
        this.noComsPic.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
        console.log('hiya');
        this.lampTitle.innerHTML = 'Bed Lamp Status';
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = 'visible';
        this.HTMLnode.removeAttribute('onchange');
        if (this.buttonState == 'Off') {
            this.HTMLnode.click();
        }
        this.HTMLnode.setAttribute('onchange', 'buttonChange(this)');
    },
    clickWithoutChange: function(newState) {
        this.HTMLnode.removeAttribute('onchange');
        if (this.buttonState != newState) {
            this.HTMLnode.click();
            this.changeState(newState);
        }
        this.HTMLnode.setAttribute('onchange', 'buttonChange(this)');
    },
    noComsSpecific: function() {
        this.lampTitle.innerHTML = 'No Connection';
        this.noComsPic.style.visibility = 'visible';
        this.buttonBox.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
    },
};
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

function setLamp(currentButton, callback) {
    const lampChange = new XMLHttpRequest();
    lampChange.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(this.responseText);
            callback(obj.status);
        }
    };
    lampChange.open('POST', '/espLights_Update', true);
    lampChange.setRequestHeader('Content-type', 'application/json');
    // string JSON currentButton.name currentButton.buttonState
    const sendMes = {};
    sendMes[currentButton.name] = currentButton.buttonState;
    console.log(sendMes);
    console.log(JSON.stringify(sendMes));
    lampChange.send(JSON.stringify(sendMes));
}

function noComsSetup(currentButton) {
    if (Array.isArray(currentButton)) {
        console.log('poog');
        for (let i = 0; i < currentButton.length; i++) {
            if (currentButton[i] == 'desk') {
                console.log('poog desk');
                deskLamp.noComsSpecific();
            } else if (currentButton[i] == 'bed') {
                console.log('poog bed');
                bedLamp.noComsSpecific();
            } else if (currentButton[i] == 'all') {
                console.log('poog all');
                all.noComsSpecific();
            }
        }
    } else {
        console.log(currentButton);
        currentButton.noComsSpecific();
    }
}

function subButtonChange(currentButton) {
    if (currentButton.buttonState == 'Off') {
        currentButton.changeState('On');
    } else {
        currentButton.changeState('Off');
    }
    setLamp(currentButton, (mes) => {
        console.log('kkk');
        console.log(mes);
        if (mes == 'noComs') {
            noComsSetup(currentButton);
        }
    });
}

// eslint-disable-next-line no-unused-vars
function buttonChange(currentButton) {
    console.log(currentButton);
    currentButton.disabled = true;
    setTimeout(function() {
        console.log('HAHHA');
        currentButton.disabled = false;
    }, 1500);
    const buttonIdNum = allButtons.indexOf(currentButton.name);
    console.log(currentButton.name);
    console.log(buttonIdNum);
    switch (buttonIdNum) {
        case 0:
            // desk lamp
            console.log('desky');
            subButtonChange(deskLamp);
            break;
        case 1:
            // bed lamp
            console.log('bedy');
            subButtonChange(bedLamp);
            break;
    }
}

/*
function getLamp(callback) {
    const lampCheck = new XMLHttpRequest();
    lampCheck.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //idfk
            let obj = JSON.parse(this.responseText);
            if (typeof obj == "string") {
                obj = JSON.parse(obj);
            }
            if (obj.status == "noComs") {
                console.log(obj);
                noComsSetup(allLampObj);
                return;
            }
            let objKeys = Object.keys(obj);
            let length = Object.keys(obj).length;
            console.log(obj);
            console.log(typeof obj);
            console.log(objKeys);
            console.log(length);
            //add more state change ehre
            for (let i = 0; i < length; i++) {
                if (objKeys[i] == 'desk') {
                    deskLamp.changeState(obj[objKeys[i]]);
                } else if (objKeys[i] == 'bed') {
                    bedLamp.changeState(obj[objKeys[i]]);
                } else {
                    console.log(obj);
                    console.log("no button found fuck");
                }
            }
            if (callback !== undefined) {
                callback(objKeys, length);
            }
        }
    };
    lampCheck.open('GET', '/espLights_Status', true);
    lampCheck.send();
}*/
// thx to w3 schools for this oen
function getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
let timerCount = 0;
const timerLimit = 30;

function updateFromGlobal() {
    // do for each button
    const GLOALLAMPSREADY = getCookie('GLOALLAMPSREADY') == 'true';
    if (GLOALLAMPSREADY) {
        const GlobaldeskState = getCookie('globalDeskState');
        const GlobalbedState = getCookie('globalBedState');
        if (GlobaldeskState == 'noComs') {
            bedLamp.noComsSpecific();
        } else {
            console.log('deskg' + GlobaldeskState);
            deskLamp.changeState(GlobaldeskState);
            deskLamp.changeItself();
        }
        if (GlobalbedState == 'noComs') {
            bedLamp.noComsSpecific();
        } else {
            console.log('bedg' + GlobalbedState);
            bedLamp.changeState(GlobalbedState);
            bedLamp.changeItself();
        }

        all.enable();
    } else {
        // global has no response
        // call again in 1/2 sec
        setTimeout(() => {
            if (timerCount == timerLimit) {
                noComsSetup(allLampObj);
                timerCount = 0;
            } else {
                console.log(timerCount);
                console.log('waiting');
                updateFromGlobal();
            }
            timerCount++;
        }, 500);
    }
}

// eslint-disable-next-line no-unused-vars
function startupLamps() {
    deskLamp.HTMLnode.disabled = true;
    bedLamp.HTMLnode.disabled = true;
    // handles if no connection found
    updateFromGlobal();
}
// eslint-disable-next-line no-unused-vars
function allOff() {
    all.buttonState = 'Off';
    setLamp(all, (res) => {
        if (res == 'noComs') {
            noComsSetup(all);
        }
        deskLamp.clickWithoutChange(all.buttonState);
        bedLamp.clickWithoutChange(all.buttonState);
    });
}
// eslint-disable-next-line no-unused-vars
function allOn() {
    all.buttonState = 'On';
    setLamp(all, (res) => {
        if (res == 'noComs') {
            noComsSetup(all);
        }
        deskLamp.clickWithoutChange(all.buttonState);
        bedLamp.clickWithoutChange(all.buttonState);
    });
}