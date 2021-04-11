let noUserFound = false;

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

document.getElementById('Body').onload = () => {
    console.log("starting");
    const name = globalUserData();
    if (Object.keys(name).length == 0) {
        noUserFound = true;
        return;
    }
    getIP(name.name);
    document.getElementById('nameInput').value = name.name;
};

function checkForm() {
    if (!checkWhitelist(document.getElementById('printerIP').value)) {
        return true;
    }
    return false;
}

function getIP(name) {
    console.log("trying to find logged ip");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            if (this.responseText != '') {
                window.location.href = '/privateStatic/html/Room.html';
                window.open(`http://${this.responseText}/`, '_blank');
            } else {
                alert('No user data found for printer IP');
            }
        }
    };
    xhttp.open('POST', '/getPrinterIP', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${name}`);
}

function setIP(name, IP) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = '/privateStatic/html/Room.html';
            window.open(`http://${document.getElementById('printerIP').value}/`, '_blank');
        }
    };
    xhttp.open('POST', '/setPrinterIP', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`name=${name}&printerIP=${IP}`);
}

document.getElementById('formSubmit').onclick = () => {
    if (!noUserFound) {
        if (checkForm()) {
            setIP(document.getElementById('nameInput').value, document.getElementById('printerIP').value);
        } else {
            alert('invalid creditials');
        }
    } else {
        alert('Invalid user token');
    }
};