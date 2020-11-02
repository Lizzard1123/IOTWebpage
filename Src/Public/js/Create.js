const formTitle = document.getElementById('title');
const createBox = document.getElementById('createBox');
const basicForm = document.getElementById('form');
const createForm = document.getElementById('createForm');
const bugTable = document.getElementById('bugTable');
const parameterName = document.getElementById('parameterName');
const parameter = document.getElementById('parameter');
const bugButton = document.getElementById('bugBox');
const createButton = document.getElementById('createBox');
const busyPic = document.getElementById('busyPic');
const feilds = ['Name', 'Password'];
let currentPage = 'Login';
let currentFeild = 1;
let submitInfo = {};

// eslint-disable-next-line no-unused-vars
function switchInfoPage(page) {
    if (page == 'Login' || currentPage == 'createAccount' || currentPage == 'Bugs') {
        formTitle.innerHTML = 'Login';
        basicForm.style.display = 'block';
        createForm.style.display = 'none';
        bugTable.style.display = 'none';
        currentPage = 'Login';
    } else if (page == 'createAccount') {
        formTitle.innerHTML = 'Create New Account';
        bugTable.style.display = 'none';
        basicForm.style.display = 'none';
        createForm.style.display = 'block';
        currentPage = 'createAccount';
    } else if (page == 'Bugs') {
        formTitle.innerHTML = 'Bugs';
        basicForm.style.display = 'none';
        createForm.style.display = 'none';
        bugTable.style.display = 'block';
        currentPage = 'Bugs';
        document.getElementById('bug').innerHTML = document.cookie;
    } else if (page == 'busy') {
        formTitle.innerHTML = 'Site is currently unavailible';
        basicForm.style.display = 'none';
        createForm.style.display = 'none';
        bugTable.style.display = 'none';
        busyPic.style.display = 'flex';
        bugButton.style.visibility = 'hidden';
        createButton.style.visibility = 'hidden';
        currentPage = 'busy';
    }
}

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
            createAccount();
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

// eslint-disable-next-line no-unused-vars
function checkErrors() {
    const sessionErrors = getCookie('sessionErrors');
    console.log(sessionErrors);
    if (!(sessionErrors == 'none' || sessionErrors == '')) {
        switchInfoPage('Bugs');
    }
}