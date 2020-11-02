const nameTable = document.getElementById('nameTable');
const nameExample = document.getElementById('nameCell1');
let commitList;
let currentNum = 0;
const githubCommitNumber = 5;
let hardLimit;
let page = 1;

function setLimit(length) {
    if (length < 25) {
        hardLimit = page;
    }
}

function getGithub(pagenum, callback) {
    const githubCommits = new XMLHttpRequest();
    githubCommits.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == undefined) {
                console.error('Github failed');
            } else {
                const obj = JSON.parse(this.responseText);
                setLimit(obj.length);
                callback(obj);
            }
        }
    };
    githubCommits.open('POST', '/githubCommits', true);
    githubCommits.setRequestHeader('Content-type', 'application/json');
    githubCommits.send(JSON.stringify({
        'page': pagenum,
    }));
}

function cloneRow(obj, example, parent, id) {
    const cln = example.cloneNode(true);
    cln.id = id;
    const d = new Date(obj.date);
    const dateShort = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    let timeOfDay;
    let hour = d.getHours();
    if (hour > 12) {
        hour = hour - 12;
        timeOfDay = 'pm';
    } else if (hour == 0) {
        hour = 12;
        timeOfDay = 'am';
    } else {
        timeOfDay = 'am';
    }
    let min = d.getMinutes();
    if (min < 10) {
        min = '0' + min;
    }
    const timeShort = hour + ':' + min + timeOfDay;
    const content = obj.name + ' made a commit at ' + dateShort + ' at ' + timeShort + '<br />' + obj.message;
    cln.innerHTML = content;
    parent.appendChild(cln);
}

function setPage(num) {
    while (nameTable.firstChild) {
        nameTable.removeChild(nameTable.lastChild);
    }
    const limit = (commitList.length == 25) ? 5 * (num + 1) : (commitList.length - 5 * num < 5) ? commitList.length : 5 * (num + 1);
    for (let i = num * 5; i < limit; i++) {
        cloneRow(commitList[i], nameExample, nameTable, `nameCell${i+2}`);
    }
}

function setupPage(pagenum) {
    getGithub(pagenum, (obj) => {
        commitList = obj;
        setPage(currentNum);
    });
}

// eslint-disable-next-line no-unused-vars
function increasePage(up) {
    if (up) {
        if (currentNum == githubCommitNumber - 1) {
            if (page != hardLimit) {
                page++;
                currentNum = 0;
                getGithub(page, (obj) => {
                    commitList = obj;
                    setPage(currentNum);
                });
            }
        } else {
            currentNum++;
            setPage(currentNum);
        }
    } else {
        if (currentNum == 0 && page != 1) {
            page--;
            currentNum = githubCommitNumber - 1;
            getGithub(page, (obj) => {
                commitList = obj;
                setPage(currentNum);
            });
        } else if (currentNum != 0) {
            currentNum--;
            setPage(currentNum);
        }
    }
}

setupPage(page);