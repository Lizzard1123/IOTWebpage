const nameTable = document.getElementById('nameTable');
const timeTable = document.getElementById('timeTable');
const messageTable = document.getElementById('messageTable');

const nameExample = document.getElementById('nameCell1');
const titleExample = document.getElementById('timeCell1');
const messageExample = document.getElementById('messageCell1');

const page = 1;

function getGithub(pagenum, callback) {
    const githubCommits = new XMLHttpRequest();
    githubCommits.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == undefined) {
                console.error('Github failed');
            } else {
                const obj = JSON.parse(this.responseText);
                console.log('hiyahere');
                console.log(obj);
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

function cloneRow(name, example, parent, id) {
    const cln = example.cloneNode(true);
    cln.id = id;
    cln.innerHTML = name;
    parent.appendChild(cln);
}

function setupPage(pagenum) {
    getGithub(pagenum, (obj) => {
        for (let i = 0; i < obj.length; i++) {
            const current = obj[i];
            cloneRow(current.name, nameExample, nameTable, `nameCell${i+2}`);
            cloneRow(current.date, titleExample, timeTable, `timeCell${i+2}`);
            cloneRow(current.message, messageExample, messageTable, `messageCell${i+2}`);
        }
    });
}
console.log('re');
setupPage(page);