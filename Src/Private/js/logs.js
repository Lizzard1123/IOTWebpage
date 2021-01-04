import fs from 'fs';
import path from 'path';
const keeplogsfor = 7;
const date = new Date();
const month = date.getMonth();
let monthActual = month + 1;
if (monthActual < 10) {
    monthActual = '0' + monthActual;
}

let dayVal = date.getDate();
if (dayVal < 10) {
    dayVal = '0' + dayVal;
}
const title = `${monthActual}${dayVal}${date.getFullYear()}`;
const time = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
let logspath;

function consoleLog(string, data = '') {
    console.log('\x1b[34m', string + ' ' + data);
}

async function updateCurrentDir() {
    consoleLog('Updating Directory for Logs');
    const dir = await fs.promises.opendir(logspath);
    const newdir = [];
    for await (const dirent of dir) {
        newdir.push(dirent.name);
    }
    return newdir;
}


function createDay() {
    consoleLog('Creating New Day', `${logspath}\\${title}.json`);
    fs.writeFile(`${logspath}\\${title}.json`, JSON.stringify({
        created_on: title,
        logs: [],
    }), (err) => {
        if (err) {
            consoleLog('Error writing day file', err);
            return;
        }
    });
}

/*
export function record(qtype, string, level) {
    fs.readFile(`${logspath}\\${title}.json`, 'utf-8', (err, data) => {
        if (err) {
            consoleLog('Error reading log file', err);
            return false;
        }
        const obj = JSON.parse(data);
        const content = {};
        content[qtype] = `${level}_${time}_${string}`;
        obj.logs.push(content);
        fs.writeFile(`${logspath}\\${title}.json`, JSON.stringify(obj), (err) => {
            if (err) {
                consoleLog('Error Writing record', err);
            }
        });
        return true;
    });
}
*/
/*
export async function checkDaily(paththing) {
    logspath = path.join(paththing, 'Private', 'Logs');
    consoleLog('Checking Daily function');
    const currentdir = await updateCurrentDir();
    const testcase = `${title}.json`;
    if (!currentdir.includes(testcase)) {
        createDay();
    }
    if (currentdir.length > keeplogsfor) {
        consoleLog('Deleting day', `${currentdir[0]}`);
        fs.unlink(`${logspath}/${currentdir[0]}`, (err) => {
            if (err) {
                consoleLog('Error deleting day');
            }
        });
    }
}
*/