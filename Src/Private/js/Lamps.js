const button = document.getElementsByName("LampButton")[0];
const lampTitle = document.getElementById("lable");
const noComsPic = document.getElementById("noComsPic");
const buttonBox = document.getElementById("LampButton");
const loader = document.getElementById("loadingg");
let buttonState = "Off";

function setLamp(state, callback) {
    const lampChange = new XMLHttpRequest();
    lampChange.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(this.responseText);
            callback(obj.status);
        }
    };
    lampChange.open('POST', '/espLights_Update', true);
    lampChange.setRequestHeader("Content-type", "application/json");
    lampChange.send(JSON.stringify({ state: state }));
}

function noComsSetup() {
    lampTitle.innerHTML = "No Connection";
    noComsPic.style.visibility = "visible";
    buttonBox.style.visibility = "hidden";
    loader.style.visibility = "hidden";
}

function buttonChange() {
    button.disabled = true;
    setTimeout(function() {
        console.log("HAHHA");
        button.disabled = false;
    }, 1500);
    if (buttonState == "Off") {
        buttonState = "On";
    } else {
        buttonState = "Off";
    }
    setLamp(buttonState, (mes) => {
        if (mes == "noComs") {
            noComsSetup();
        }
    });
}


function getLamp(callback) {
    const lampCheck = new XMLHttpRequest();
    lampCheck.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(this.responseText);
            if (obj.status == "noComs") {
                noComsSetup();
                return;
            } else if (obj.status == "On") {
                buttonState = "On";
            } else if (obj.status == "Off") {
                buttonState = "Off";
            }
            if (callback !== undefined) {
                callback();
            }
        }
    };
    lampCheck.open('GET', '/espLights_Status', true);
    lampCheck.send();
}

function changePage() {
    //defualt is on so idk
    button.removeAttribute("onchange");
    if (buttonState == "Off") {
        button.click();
    }
    button.setAttribute("onchange", "buttonChange()");
}

function checkForConnection(starting) {
    let temp = buttonState;
    getLamp(() => {
        //gets connection
        noComsPic.style.visibility = "hidden";
        loader.style.visibility = "hidden";
        console.log("hiya");
        lampTitle.innerHTML = "Lamp Status";
        button.disabled = false;
        buttonBox.style.visibility = "visible";
        changePage();
        button.setAttribute("onchange", "buttonChange()");
    });
}

function startupLamps() {
    button.disabled = true;
    //handles if no connection found
    checkForConnection();
}