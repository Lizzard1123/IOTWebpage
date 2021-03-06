const form = document.getElementById('form');
const nameinput = document.getElementById('Name');
const passwordinput = document.getElementById('Password');
const whitelist = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&* :\'.';
const namelabel = document.getElementById('namelabel');
const passwordlabel = document.getElementById('passwordlabel');
const title = document.getElementById('title');
const message = document.getElementById('message');

function chnagebacktext() {
    namelabel.innerHTML = 'Name';
    passwordlabel.innerHTML = 'Password';
}

function changetext(string) {
    if (string == 'both') {
        namelabel.innerHTML = 'Invalid Characters Present';
        passwordlabel.innerHTML = 'Invalid Characters Present';
    } else if (string == 'password') {
        passwordlabel.innerHTML = 'Invalid Characters Present';
    } else if (string == 'name') {
        namelabel.innerHTML = 'Invalid Characters Present';
    }
}

function checkWhitelist(string) {
    const arraystring = string.split('');
    if (arraystring.length == 0) {
        return true;
    }
    for (let i = 0; i < arraystring.length; i++) {
        if (whitelist.indexOf(arraystring[i]) == -1) {
            return true;
        }
    }
    return false;
}

function defaultcheckvalid(obj, textobj) {
    if (obj.validity.valueMissing) {
        textobj.innerHTML = 'Please Enter Something';
        return false;
    } else if (obj.value.length < 4) {
        textobj.innerHTML = 'Input Too Short';
        return false;
    }
    return true;
}

function ajaxSend() {
    const logincheck = new XMLHttpRequest();
    logincheck.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                window.location = this.responseURL;
            } else {
                const obj = JSON.parse(this.responseText);
                message.style.visibility = 'visible';
                form.style.visibility = 'hidden';
                title.style.visibility = 'hidden';
                if (obj.message == 'error') {
                    message.style.color = 'red';
                    message.innerHTML = 'Error';
                    setTimeout(() => {
                        message.style.visibility = 'hidden';
                        message.style.color = 'green';
                        title.style.visibility = 'visible';
                        form.style.visibility = 'visible';
                    }, 500);
                }
            }
        }
    };
    logincheck.open('POST', '/login', true);
    logincheck.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    logincheck.setRequestHeader('type', 'ajax');
    logincheck.send(`Name=${nameinput.value}&Password=${passwordinput.value}`);
}

// eslint-disable-next-line no-unused-vars
function checkvalid() {
    const passwordinvalid = checkWhitelist(passwordinput.value);
    const nameinvalid = checkWhitelist(nameinput.value);
    if (passwordinvalid && nameinvalid) {
        changetext('both');
    } else if (passwordinvalid) {
        changetext('password');
    } else if (nameinvalid) {
        changetext('name');
    } else {
        ajaxSend();
    }
    defaultcheckvalid(passwordinput, passwordlabel);
    defaultcheckvalid(nameinput, namelabel);
    setTimeout(chnagebacktext, 5000);
}