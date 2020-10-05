import fs from 'fs';
import path from 'path';
const keeplogsfor = 7;
const d = new Date();
const month = d.getMonth();
let monthActual = month + 1;
if (monthActual < 10) {
    monthActual = '0' + monthActual;
}

let dayVal = d.getDate();
if (dayVal < 10) {
    dayVal = '0' + dayVal;
}
const title = `${monthActual}${dayVal}${d.getFullYear()}`;
const time = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
let logspath;
// "C:\\Users\\ethan_lbv4wic\\Desktop\\IOTwebpage\\Src\\Private\\logs";

async function updatecurrentdir() {
    console.log('Updating Dir');
    const dir = await fs.promises.opendir(logspath);
    const newdir = [];
    for await (const dirent of dir) {
        newdir.push(dirent.name);
    }
    console.log('this');
    return newdir;
}


function createDay() {
    console.log('Creating Day');
    fs.writeFile(`${logspath}\\${title}.json`, JSON.stringify({
        created_on: title,
        logs: [],
    }), (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Done writing'); // Success
    });
}
export function record(qtype, string, level) {
    console.log('Recording');
    fs.readFile(`${logspath}\\${title}.json`, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            console.log('record really failed');
            return false;
        }
        console.log(`${logspath}\\${title}.json`);
        const obj = JSON.parse(data);
        const content = {};
        content[qtype] = `${level}_${time}_${string}`;
        obj.logs.push(content);
        fs.writeFile(`${logspath}\\${title}.json`, JSON.stringify(obj), (err) => {
            if (err) {
                console.log('errrorooeore');
                console.log(err);
            }
        });
        console.log('recoreded true');
        return true;
    });
}

export async function CheckDaily(paththing) {
    logspath = path.join(paththing, 'Private', 'Logs');
    console.log('checking daily');
    const currentdir = await updatecurrentdir();
    const testcase = `${title}.json`;
    console.log('dirrrrrrrrrr');
    console.log(currentdir);
    console.log(testcase);
    console.log('hello');
    console.log(currentdir.includes(testcase));
    if (!currentdir.includes(testcase)) {
        console.log(`${title}.json`);
        console.log('creating day');
        createDay();
    }
    if (currentdir.length >= keeplogsfor - 1) {
        console.log('deleating day');
        fs.unlink(`${logspath}/${currentdir[0]}`, (err) => {
            console.log('removed file');
            console.log(err);
        });
    }
}