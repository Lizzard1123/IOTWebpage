import fs from 'fs';
import ns from 'node-schedule';
import path from 'path';
const keeplogsfor = 7;
var currentdir = [];
var d = new Date();
var month = d.getMonth();
var month_actual = month + 1;
if (month_actual < 10) {
    month_actual = "0" + month_actual;
}

var day_val = d.getDate();
if (day_val < 10) {
    day_val = "0" + day_val;
}
var title = `${month_actual}${day_val}${d.getFullYear()}`;
var time = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
var logspath;
//"C:\\Users\\ethan_lbv4wic\\Desktop\\IOTwebpage\\Src\\Private\\logs";

async function updatecurrentdir() {
    console.log("Updating Dir");
    const dir = await fs.promises.opendir(logspath);
    let newdir = [];
    for await (const dirent of dir) {
        newdir.push(dirent.name);
    }
    console.log("this");

    currentdir = newdir;
    console.log(currentdir);
    return newdir;
}

function createDay() {
    console.log("Creating Day");
    if (currentdir.indexOf(title) == -1) {
        fs.writeFile(`${logspath}\\${title}.json`, JSON.stringify({
            created_on: title,
            logs: []
        }), err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Done writing"); // Success 
        });
    }
}
export function record(qtype, string, level) {
    console.log("Recording");
    fs.readFile(`${logspath}\\${title}.json`, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            console.log("record really failed");
            return false;
        }
        console.log(`${logspath}\\${title}.json`);
        let obj = JSON.parse(data);
        let content = {};
        content[qtype] = `${level}_${time}_${string}`;
        obj.logs.push(content);
        fs.writeFile(`${logspath}\\${title}.json`, JSON.stringify(obj), (err) => {
            if (err) {
                console.log("errrorooeore");
                console.log(err);
            }
        });
        console.log("recoreded true");
        return true;
    })
}

export function CheckDaily(paththing) {
    logspath = path.join(paththing, "Private", "Logs");
    console.log("checking daily");
    updatecurrentdir();
    let testcase = `${title}.json`;
    if (currentdir.includes(testcase) == -1) {
        console.log(`${title}.json`);
        console.log("creating day");
        createDay();
    }
    if (currentdir.length >= keeplogsfor - 1) {
        console.log("deleating day");
        fs.unlink(`${logspath}${currentdir[0]}`);
    }
}