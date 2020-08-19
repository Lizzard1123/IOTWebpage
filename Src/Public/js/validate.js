var form = document.getElementById("form");
var nameinput = document.getElementById("Name");
var passwordinput = document.getElementById("Password");
var whitelist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var namelabel = document.getElementById("namelabel");
var passwordlabel = document.getElementById("passwordlabel");
var title = document.getElementById("title");
var message = document.getElementById("message");

function chnagebacktext() {
    namelabel.innerHTML = "Name";
    passwordlabel.innerHTML = "Password";
}

function changetext(string) {
    if (string == "both") {
        namelabel.innerHTML = "Invalid Characters Present";
        passwordlabel.innerHTML = "Invalid Characters Present";
    } else if (string == "password") {
        passwordlabel.innerHTML = "Invalid Characters Present";
    } else if (string == "name") {
        namelabel.innerHTML = "Invalid Characters Present";
    }
}

function checkWhitelist(string) {
    var arraystring = string.split("");
    if (arraystring.length == 0) {
        return true;
    }
    for (var i = 0; i < arraystring.length; i++) {
        if (whitelist.indexOf(arraystring[i]) == -1) {
            return true;
        }
    }
    return false;
}

function valider(obj) {
    console.log("hell");
}

function defaultcheckvalid(obj, textobj) {
    if (obj.validity.valueMissing) {
        textobj.innerHTML = "Please Enter Something";
        return false;
    } else if (obj.value.length < 4) {
        textobj.innerHTML = "Input Too Short";
        return false;
    }
    return true;
}

function Ajaxsend() {
    var logincheck = new XMLHttpRequest();
    logincheck.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("doneeeee");
            let obj = JSON.parse(this.responseText);
            message.style.visibility = "visible";
            form.style.visibility = "hidden";
            title.style.visibility = "hidden";
            if (obj.message == "redirect") {
                message.innerHTML = "Authorized";
                setTimeout(() => { window.location.href = obj.newpage }, 500);
            } else if (obj.message == "error") {
                message.style.color = "red";
                message.innerHTML = "Error";
                setTimeout(() => {
                    message.style.visibility = "hidden";
                    message.style.color = "green";
                    title.style.visibility = "visible";
                    form.style.visibility = "visible";
                }, 500);
            }
        }
    };
    logincheck.open("POST", "/login", true);
    logincheck.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    logincheck.send(`Name=${nameinput.value}&Password=${passwordinput.value}`);
}

function checkvalid() {
    var passwordinvalid = checkWhitelist(passwordinput.value);
    var nameinvalid = checkWhitelist(nameinput.value);
    if (passwordinvalid && nameinvalid) {
        changetext("both");
    } else if (passwordinvalid) {
        changetext("password");
    } else if (nameinvalid) {
        changetext("name");
    } else {
        Ajaxsend();
    }
    defaultcheckvalid(passwordinput, passwordlabel);
    defaultcheckvalid(nameinput, namelabel);
    setTimeout(chnagebacktext, 5000);
}

function switchsubmit() {
    document.getElementById("enablejs").remove();
    var newbutton = document.createElement("button");
    newbutton.id = "submitbutton";
    newbutton.setAttribute("type", "button");
    newbutton.setAttribute("name", "Submit");
    newbutton.setAttribute("onclick", "checkvalid()");
    newbutton.innerHTML = "Submit"
    form.appendChild(newbutton);
    console.log(newbutton);
    console.log("tried");
}