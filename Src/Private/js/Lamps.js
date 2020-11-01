const pageInfo = window.parent;
const loader = document.getElementById('loadingg');
const allButtons = ['deskLampButton', 'bedLampButton'];
const allLampObj = ['desk', 'bed', 'all'];
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
    buttonState: 'Off',
    changeState: function(state) {
        document.cookie = `globalDeskState=${state}`;
        this.buttonState = state;
    },
    changeItself: function() {
        this.noComsPic.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
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
        document.cookie = `globalDeskState=noComs`;
        all.noComsSpecific();
    },
    click: function() {
        this.HTMLnode.click();
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
        document.cookie = `globalBedState=${state}`;
        this.buttonState = state;
    },
    changeItself: function() {
        this.noComsPic.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
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
        document.cookie = `globalBedState=noComs`;
        all.noComsSpecific();
    },
    click: function() {
        this.HTMLnode.click();
    },
};
// thx to w3 schools for this oen
const UserData = pageInfo.globalUserData();
console.log(UserData);

function setLamp(currentButton, callback) {
    if (pageInfo.isEmpty(UserData)) {
        pageInfo.pageClose(true, false);
        return;
    }
    if (UserData.securityLevel == 'admin') {
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
        lampChange.setRequestHeader('type', 'ajax');
        lampChange.send(JSON.stringify(sendMes));
    } else {
        callback('Forbidden');
    }
}

function noComsSetup(currentButton) {
    if (Array.isArray(currentButton)) {
        for (let i = 0; i < currentButton.length; i++) {
            if (currentButton[i] == 'desk') {
                deskLamp.noComsSpecific();
            } else if (currentButton[i] == 'bed') {
                bedLamp.noComsSpecific();
            } else if (currentButton[i] == 'all') {
                all.noComsSpecific();
            }
        }
    } else {
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
        if (mes == 'Forbidden') {
            console.log('Forbidden');
        } else {
            if (mes == 'noComs') {
                noComsSetup(currentButton);
            }
        }
    });
}

// eslint-disable-next-line no-unused-vars
function buttonChange(currentButton) {
    if (pageInfo.isEmpty(UserData)) {
        pageInfo.pageClose(true, false);
        return;
    }
    if (UserData.securityLevel != 'admin') {
        currentButton.click();
    } else {
        currentButton.disabled = true;
        setTimeout(function() {
            currentButton.disabled = false;
        }, 1500);
        const buttonIdNum = allButtons.indexOf(currentButton.name);
        switch (buttonIdNum) {
            case 0:
                // desk lamp
                subButtonChange(deskLamp);
                break;
            case 1:
                // bed lamp
                subButtonChange(bedLamp);
                break;
        }
    }
}


let timerCount = 0;
const timerLimit = 60;
// uses getLamp from pageinfo global
function updateFromGlobal() {
    // do for each button
    const GLOALLAMPSREADY = pageInfo.getCookie('GLOALLAMPSREADY') == 'true';
    if (GLOALLAMPSREADY) {
        const GlobaldeskState = pageInfo.getCookie('globalDeskState');
        const GlobalbedState = pageInfo.getCookie('globalBedState');
        if (GlobaldeskState == 'noComs') {
            deskLamp.noComsSpecific();
        } else {
            deskLamp.changeState(GlobaldeskState);
            deskLamp.changeItself();
        }
        if (GlobalbedState == 'noComs') {
            bedLamp.noComsSpecific();
        } else {
            bedLamp.changeState(GlobalbedState);
            bedLamp.changeItself();
        }
        if (GlobaldeskState != 'noComs' && GlobalbedState != 'noComs') {
            all.enable();
        }
    } else {
        // global has no response
        // call again in 1/2 sec
        setTimeout(() => {
            if (timerCount == timerLimit) {
                noComsSetup(allLampObj);
                pageInfo.document.cookie = `globalDeskState=noComs`;
                pageInfo.document.cookie = `globalBedState=noComs`;
                pageInfo.document.cookie = `GLOALLAMPSREADY=true`;
                timerCount = 0;
                console.log('okkk');
            } else {
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
        if (res == 'Forbidden') {
            console.log('Forbidden');
        } else {
            if (res == 'noComs') {
                noComsSetup(all);
                return;
            }
            deskLamp.clickWithoutChange(all.buttonState);
            bedLamp.clickWithoutChange(all.buttonState);
        }
    });
}
// eslint-disable-next-line no-unused-vars
function allOn() {
    all.buttonState = 'On';
    setLamp(all, (res) => {
        if (res == 'Forbidden') {
            console.log('Forbidden');
        } else {
            if (res == 'noComs') {
                noComsSetup(all);
                return;
            }
            deskLamp.clickWithoutChange(all.buttonState);
            bedLamp.clickWithoutChange(all.buttonState);
        }
    });
}