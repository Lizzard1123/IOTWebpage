import fs from 'fs';
import ns from 'node-schedule';
import path from 'path';

var currentdir = [];
const d = new Date();
var title = `${d.getMonth()}${d.getDay()}${d.getFullYear()}`;
var time = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
const logspath = "C:\\Users\\ethan_lbv4wic\\Desktop\\PersonalWebpage\\Src\\Private\\logs";
const currenttitle = `${logspath}\\${title}.json`;

async function updatecurrentdir() {
    console.log("Updating Dir");
    const dir = await fs.promises.opendir(logspath);
    let newdir = [];
    for await (const dirent of dir) {
        newdir.push(dirent.name);
    }
    currentdir = newdir;
}

function createDay() {
    console.log("Creating Day");
    if (currentdir.indexOf(title) == -1) {
        fs.writeFile(currenttitle, JSON.stringify({
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
    fs.readFile(currenttitle, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            console.log("record failed");
            return false;
        }
        let obj = JSON.parse(data);
        let content = {};
        content[qtype] = `${level}_${time}_${string}`;
        obj.logs.push(content);
        console.log(obj);
        fs.writeFile(currenttitle, JSON.stringify(obj), (err) => {
            if (err) {
                console.log("errrorooeore");
                console.log(err);
            }
        });
        console.log("recoreded true");
        return true;
    })
}

//jobs
const keeplogsfor = 7;
//create new day/ delete end
//every day at 1 am
var newday = ns.scheduleJob('0 0 * * *', () => {
    console.log("Daily update");
    createDay();
    updatecurrentdir();
    if (currentdir.length >= keeplogsfor - 1) {
        fs.unlink(`"C:\\Users\\ethan_lbv4wic\\Desktop\\PersonalWebpage\\Src\\Private\\logs\\${currentdir[0]}"`);
    }
    // updatecurrentdir();
});
console.log("should be good");