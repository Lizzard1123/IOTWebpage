var form = document.getElementById("form");
var nameinput = document.getElementById("Name");
var passwordinput = document.getElementById("Password");
var whitelist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var namelabel = document.getElementById("namelabel");
var passwordlabel = document.getElementById("passwordlabel");

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
    setTimeout(chnagebacktext, 5000);
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
        form.submit();
    }
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