const loader = document.getElementById("loadingg");
const allButtons = ["deskLampButton", "bedLampButton"];
const allLampObj = ["desk", "bed"];
const deskLamp = {
    name: "desk",
    HTMLnode: document.getElementsByName("deskLampButton")[0],
    lampTitle: document.getElementById("deskLabelTitle"),
    noComsPic: document.getElementById("deskNoComsPic"),
    buttonBox: document.getElementById("deskLampButton"),
    buttonState: "Off",
    changeState: function(state) {
        this.buttonState = state;
    },
    changeItself: function() {
        this.noComsPic.style.visibility = "hidden";
        loader.style.visibility = "hidden";
        console.log("hiya");
        this.lampTitle.innerHTML = "Desk Lamp Status";
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = "visible";
        this.HTMLnode.removeAttribute("onchange");
        if (this.buttonState == "Off") {
            this.HTMLnode.click();
        }
        this.HTMLnode.setAttribute("onchange", "buttonChange(this)");
    },
    noComsSpecific: function() {
        this.lampTitle.innerHTML = "No Connection";
        this.noComsPic.style.visibility = "visible";
        this.buttonBox.style.visibility = "hidden";
        loader.style.visibility = "hidden";
    }
}
const bedLamp = {
    name: "bed",
    HTMLnode: document.getElementsByName("bedLampButton")[0],
    lampTitle: document.getElementById("bedLabelTitle"),
    noComsPic: document.getElementById("bedNoComsPic"),
    buttonBox: document.getElementById("bedLampButton"),
    buttonState: "Off",
    changeState: function(state) {
        this.buttonState = state;
    },
    changeItself: function() {
        this.noComsPic.style.visibility = "hidden";
        loader.style.visibility = "hidden";
        console.log("hiya");
        this.lampTitle.innerHTML = "Bed Lamp Status";
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = "visible";
        this.HTMLnode.removeAttribute("onchange");
        if (this.buttonState == "Off") {
            this.HTMLnode.click();
        }
        this.HTMLnode.setAttribute("onchange", "buttonChange(this)");
    },
    noComsSpecific: function() {
        this.lampTitle.innerHTML = "No Connection";
        this.noComsPic.style.visibility = "visible";
        this.buttonBox.style.visibility = "hidden";
        loader.style.visibility = "hidden";
    }
}

function setLamp(currentButton, callback) {
    const lampChange = new XMLHttpRequest();
    lampChange.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(this.responseText);
            callback(obj.status);
        }
    };
    lampChange.open('POST', '/espLights_Update', true);
    lampChange.setRequestHeader("Content-type", "application/json");
    //string JSON currentButton.name currentButton.buttonState
    let sendMes = {};
    sendMes[currentButton.name] = currentButton.buttonState;
    console.log(sendMes);
    console.log(JSON.stringify(sendMes));
    lampChange.send(JSON.stringify(sendMes));
}

function noComsSetup(currentButton) {
    if (Array.isArray(currentButton)) {
        console.log("poog");
        for (let i = 0; i < currentButton.length; i++) {
            if (currentButton[i] == 'desk') {
                console.log("poog desk");
                deskLamp.noComsSpecific();
            } else if (currentButton[i] == 'bed') {
                console.log("poog bed");
                bedLamp.noComsSpecific();
            }
        }
    } else {
        console.log(currentButton);
        currentButton.noComsSpecific();
    }
}

function subButtonChange(currentButton) {
    if (currentButton.buttonState == "Off") {
        currentButton.buttonState = "On";
    } else {
        currentButton.buttonState = "Off";
    }
    setLamp(currentButton, (mes) => {
        console.log('kkk');
        console.log(mes);
        if (mes == "noComs") {
            noComsSetup(currentButton);
        }
    });
}

function buttonChange(currentButton) {
    console.log(currentButton);
    currentButton.disabled = true;
    setTimeout(function() {
        console.log("HAHHA");
        currentButton.disabled = false;
    }, 1500);
    let buttonIdNum = allButtons.indexOf(currentButton.name);
    console.log(currentButton.name);
    console.log(buttonIdNum);
    switch (buttonIdNum) {
        case 0:
            //desk lamp
            console.log("desky");
            subButtonChange(deskLamp);
            break;
        case 1:
            //bed lamp
            console.log("bedy");
            subButtonChange(bedLamp);
            break;
    }
}


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
}


function checkForConnection() {
    getLamp((objKeys, length) => {
        //gets connection
        for (let i = 0; i < length; i++) {
            if (objKeys[i] == 'desk') {
                deskLamp.changeItself();
            } else if (objKeys[i] == 'bed') {
                bedLamp.changeItself();
            } else {
                console.log("no button found fuck here");
            }
        }
    });
}

function startupLamps() {
    deskLamp.HTMLnode.disabled = true;
    bedLamp.HTMLnode.disabled = true;
    //handles if no connection found
    checkForConnection();
}