const formTitle = document.getElementById('title');
const basicForm = document.getElementById('form');
const bugTable = document.getElementById('bugTable');
let currentPage = 'Login';

// eslint-disable-next-line no-unused-vars
function switchInfoPage(page) {
    if (page == 'Login' || currentPage == 'Bugs') {
        formTitle.innerHTML = 'Login';
        basicForm.style.display = 'block';
        bugTable.style.display = 'none';
        currentPage = 'Login';
    } else if (page == 'Bugs') {
        formTitle.innerHTML = 'Bugs';
        basicForm.style.display = 'none';
        bugTable.style.display = 'block';
        currentPage = 'Bugs';
    }
}

// eslint-disable-next-line no-unused-vars
function checkErrors() {
    const sessionErrors = getCookie('sessionErrors');
    console.log(sessionErrors);
    if (!(sessionErrors == 'none' || sessionErrors == '')) {
        switchInfoPage('Bugs');
    }
}

const nameTable = document.getElementById('nameTable');
const nameExample = document.getElementById('nameCell1');

function cloneRow(obj, example, parent, id) {
    const cln = example.cloneNode(true);
    cln.innerHTML = obj;
    parent.appendChild(cln);
}

function setPage(bugList) {
    for (let i = 0; i < bugList.length; i++) {
        cloneRow(bugList[i], nameExample, nameTable, `nameCell${i+2}`);
    }
    nameExample.style.display = 'none';
}
let sessionErrors = getCookie('sessionErrors');

if (!(sessionErrors == 'none' || sessionErrors == '')) {
    sessionErrors = sessionErrors.split(',');
    setPage(sessionErrors);
}

document.getElementById('createBox').onclick = () => {
    window.location = '/register';
};

window.addEventListener('keyup', function(event) {
    if (event.key == 'Enter') {
        document.getElementById('submitbutton').click();
    }
});

// eslint-disable-next-line no-unused-vars
function switchsubmit() {
    document.getElementById('enablejs').remove();
    const newbutton = document.createElement('button');
    newbutton.id = 'submitbutton';
    newbutton.setAttribute('type', 'button');
    newbutton.setAttribute('name', 'Submit');
    newbutton.setAttribute('onclick', 'checkvalid()');
    newbutton.innerHTML = 'Submit';
    form.appendChild(newbutton);
    console.log(newbutton);
    console.log('tried');
}