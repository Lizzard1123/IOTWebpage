const createBox = document.getElementById('createBox');
const parameterName = document.getElementById('parameterName');
const parameter = document.getElementById('parameter');
const feilds = ['Name', 'Password'];
let currentFeild = 1;
let submitInfo = {};


function changeInput() {
    console.log(currentFeild);
    parameterName.innerHTML = feilds[currentFeild - 1];
    // setup for password
    if (feilds[currentFeild - 1] == 'Password') {
        parameter.type = 'password';
        parameter.min = '10';
        document.getElementById('createFormBtn').innerHTML = 'Create!';
    } else if (feilds[currentFeild - 1] == 'Name') {
        // generic text
        parameter.type = 'text';
        parameter.min = '4';
    }
    // logs submit info
    submitInfo[feilds[currentFeild - 2].toLowerCase()] = parameter.value;
    parameter.value = '';
}

function submitNewInfo() {
    const sendAccountInfo = new XMLHttpRequest();
    sendAccountInfo.open('POST', '/createAccount', true);
    sendAccountInfo.setRequestHeader('Content-type', 'application/json');
    sendAccountInfo.setRequestHeader('type', 'ajax');
    sendAccountInfo.send(JSON.stringify(submitInfo));
    submitInfo = {};
    window.location = '/login';
}

// eslint-disable-next-line no-unused-vars
function nextInput() {
    if (currentFeild == feilds.length) {
        console.log('Er');
        if (!defaultcheckvalid(parameter, parameterName)) {
            console.log('l');
            return;
        }
        submitInfo[feilds[currentFeild - 1].toLowerCase()] = parameter.value;
        parameter.value = '';
        console.log(submitInfo);
        if (!checkWhitelist(submitInfo.name) && !checkWhitelist(submitInfo.password)) {
            console.log('pip');
            submitNewInfo();
            switchInfoPage('Login');
            createBox.style.display = 'none';
        }
        return;
    }
    if (!defaultcheckvalid(parameter, parameterName)) {
        return;
    }
    currentFeild++;
    changeInput();
}