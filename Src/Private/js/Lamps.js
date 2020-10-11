const loader = document.getElementById("loadingg");
const allButtons = ["deskButton", "bedButton"];
const deskLamp = {
    name: "desk",
    HTMLnode: document.getElementsByName("deskLampButton")[0],
    lampTitle: document.getElementById("deskLableTitle"),
    noComsPic: document.getElementById("desknoComsPic"),
    buttonBox: document.getElementById("deskLampButton"),
    buttonState: "Off",
    changeState: function(state) {
        this.buttonState = state;
    },
    changeItself: function() {
        this.noComsPic.style.visibility = "hidden";
        loader.style.visibility = "hidden";
        console.log("hiya");
        this.lampTitle.innerHTML = "Lamp Status";
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = "visible";
        this.HTMLnode.removeAttribute("onchange");
        if (this.buttonState == "Off") {
            this.HTMLnode.click();
        }
        this.HTMLnode.setAttribute("onchange", "buttonChange()");
    }
}
const bedLamp = {
    name: "bed",
    HTMLnode: document.getElementsByName("bedLampButton")[0],
    lampTitle: document.getElementById("bedLableTitle"),
    noComsPic: document.getElementById("bednoComsPic"),
    buttonBox: document.getElementById("LampButton"),
    buttonState: "Off",
    changeState: function(state) {
        this.buttonState = state;
    },
    changeItself: function() {
        this.noComsPic.style.visibility = "hidden";
        loader.style.visibility = "hidden";
        console.log("hiya");
        this.lampTitle.innerHTML = "Lamp Status";
        this.HTMLnode.disabled = false;
        this.buttonBox.style.visibility = "visible";
        this.HTMLnode.removeAttribute("onchange");
        if (this.buttonState == "Off") {
            this.HTMLnode.click();
        }
        this.HTMLnode.setAttribute("onchange", "buttonChange()");
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
    //string JSON
    lampChange.send(`{ ${currentButton.name}: ${currentButton.buttonState}}`);
}

function noComsSetup(currentButton) {
    currentButton.lampTitle.innerHTML = "No Connection";
    currentButton.noComsPic.style.visibility = "visible";
    currentButton.buttonBox.style.visibility = "hidden";
    loader.style.visibility = "hidden";
}

function subButtonChange(currentButton) {
    if (currentButton.buttonState == "Off") {
        currentButton.buttonState = "On";
    } else {
        currentButton.buttonState = "Off";
    }
    setLamp(currentButton, (mes) => {
        if (mes == "noComs") {
            noComsSetup(currentButton);
        }
    });
}

function buttonChange(currentButton) {
    currentButton.disabled = true;
    setTimeout(function() {
        console.log("HAHHA");
        currentButton.disabled = false;
    }, 1500);
    let buttonIdNum = allButtons.indexOf(currentButton.id);
    switch (buttonIdNum) {
        case 0:
            //desk lamp
            subButtonChange(deskLamp);
            break;
        case 1:
            //bed lamp
            subButtonChange(bedLamp);
            break;
    }
}


function getLamp(callback) {
    const lampCheck = new XMLHttpRequest();
    lampCheck.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(this.responseText);
            let objKeys = Object.keys(obj);
            let length = Object.keys(obj).length;
            //add more state change ehre
            for (let i = 0; i < length; i++) {
                if (objKeys[i] == 'desk') {
                    deskLamp.changeState(obj[objKeys[i]]);
                } else if (objKeys[i] == 'bed') {
                    bedLamp.changeState(obj[objKeys[i]]);
                } else {
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