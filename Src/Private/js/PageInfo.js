// holds global info for js pages
function clearcookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
}

// eslint-disable-next-line no-unused-vars
function pageClose(clearcook, top) {
    if (clearcook) {
        clearcookies();
    }
    if (top) {
        location.reload();
    } else {
        window.top.location.reload();
    }
}
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
    return 'none';
}
// LAMPS

// eslint-disable-next-line no-unused-vars
function globalUserData() {
    if (getCookie('token') == 'none') {
        return {};
    } else {
        // eslint-disable-next-line no-unused-vars
        return JSON.parse(window.atob(getCookie('token').split('.')[1]));
    }
}

// eslint-disable-next-line no-unused-vars
function isEmpty(obj) {
    console.log(obj);
    return Object.keys(obj).length === 0;
}
// lamps
function changeReady(input) {
    if (input) {
        document.cookie = `GLOALLAMPSREADY=true`;
    }
}
const deskLampGlobal = {
    buttonState: 'Off',
    changeState: function(state) {
        document.cookie = `globalDeskState=` + state;
        this.buttonState = state;
    },
};
const bedLampGlobal = {
    buttonState: 'Off',
    changeState: function(state) {
        document.cookie = `globalBedState=` + state;
        this.buttonState = state;
    },
};

function getLamp(callback) {
    const lampCheck = new XMLHttpRequest();
    lampCheck.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let obj = JSON.parse(this.responseText);
            if (typeof obj == 'string') {
                obj = JSON.parse(obj);
            }
            if (obj.status == 'noComs') {
                // no coms global
                deskLampGlobal.changeState('noComs');
                bedLampGlobal.changeState('noComs');
                changeReady(true);
                return;
            }
            const objKeys = Object.keys(obj);
            const length = Object.keys(obj).length;
            // add more state change ehre
            for (let i = 0; i < length; i++) {
                if (objKeys[i] == 'desk') {
                    deskLampGlobal.changeState(obj[objKeys[i]]);
                } else if (objKeys[i] == 'bed') {
                    bedLampGlobal.changeState(obj[objKeys[i]]);
                } else {
                    console.log(obj);
                    console.log('no button found fuck');
                }
            }
            // eslint-disable-next-line no-unused-vars
            changeReady(true);
            if (callback !== undefined) {
                callback(objKeys, length);
            }
        }
    };

    lampCheck.open('GET', '/espLights_Status', true);
    lampCheck.setRequestHeader('type', 'ajax');
    lampCheck.send();
}


function globalStartupLamps() {
    getLamp();
}


// global Startup
function globalStartUp() {
    document.cookie = `GLOALLAMPSREADY=false`;
    globalStartupLamps();
}
globalStartUp();