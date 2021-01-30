import canvas from 'canvas';
import fs from 'fs';
import { parentPort, workerData } from 'worker_threads';

const resizewidth = 600;
const resizeheight = 600;
const path = workerData.pathName;
const __dirname = workerData.path;
const name = workerData.fileName;
const Twidth = workerData.width;
const Theight = workerData.height;
const id = workerData.id;
/**
 * logs to the console
 * @param {string} string - "String to be logged"
 * @param {string} data - "Additional data"
 */
function consoleLog(string, data = '') {
    console.log('\x1b[33m', string + ' ' + data);
}

function getcommoncolor(imgData) {
    const colors = [];
    const numberofcolors = [];
    const imglength = imgData.data.length;
    const intervalone = (imglength / 4) * 1;
    const intervaltwo = (imglength / 4) * 2;
    const intervalthree = (imglength / 4) * 3;
    const intervalfour = (imglength / 4) * 4;
    for (let i = 0; i < imglength; i += 4) {
        switch (i) {
            case intervalone:
                consoleLog(`${name}: [██......]`);
                parentPort.postMessage({
                    done: false,
                    data: 1,
                });
                break;
            case intervaltwo:
                consoleLog(`${name}: [████....]`);
                parentPort.postMessage({
                    done: false,
                    data: 2,
                });
                break;
            case intervalthree:
                consoleLog(`${name}: [██████..]`);
                parentPort.postMessage({
                    done: false,
                    data: 3,
                });
                break;
            case intervalfour:
                consoleLog(`${name}: [████████]`);
                parentPort.postMessage({
                    done: false,
                    data: 4,
                });
                break;
        }
        const pixelcolor = [
            imgData.data[i],
            imgData.data[i + 1],
            imgData.data[i + 2],
        ];
        let found = false;
        let index;
        for (let k = 0; k < colors.length; k++) {
            if (colors[k][0] == pixelcolor[0] && colors[k][1] == pixelcolor[1] && colors[k][2] == pixelcolor[2]) {
                found = true;
                index = k;
            }
        }
        if (found) {
            // has color
            numberofcolors[index] = ++numberofcolors[index];
        } else {
            colors.push(pixelcolor);
            numberofcolors.push(1);
        }
    }
    let highest = 0;
    let highestindex = 0;
    for (let i = 0; i < numberofcolors.length; i++) {
        if (numberofcolors[i] > highest) {
            highestindex = i;
            highest = numberofcolors[i];
        }
    }
    return colors[highestindex];
}
const offset = 40;
const funcTotal = 1;

function finishImg(cvs, context, imgwidth, imgheight, colorstochoose, image, func) {
    context.fillStyle = `rgb(${colorstochoose[0]},${colorstochoose[1]},${colorstochoose[2]})`;
    context.fillRect(0, 0, Twidth, Theight);
    const chamger = (Theight - offset) / imgheight;
    const newwidth = imgwidth * chamger;
    const newheight = Theight - offset;
    context.drawImage(image, (Twidth - newwidth) / 2, 0, newwidth, newheight);
    const buffer = cvs.toBuffer('image/png');
    fs.writeFile(`${__dirname}/Private/js/ICstore/new${name.substring(0, (name.length - 4))}v${func}_${id}.png`, buffer, (err) => {
        if (err) {
            consoleLog('error writing img file');
        }
    });
    fs.unlink(path, (err) => {
        if (err) {
            consoleLog('error unlinking img file');
        }
    });
    // /privatestatic/js
    const url = `/privatestatic/js/ICstore/new${name.substring(0, (name.length - 4))}v${func}_${id}.png`;
    parentPort.postMessage({
        done: true,
        data: url,
    });
}

export function sizeUpPhoto() {
    for (let func = 0; func < funcTotal; func++) {
        const cvs = canvas.createCanvas(Twidth, Theight, 'png');
        const context = cvs.getContext('2d');
        canvas.loadImage(path).then((image) => {
            const imgwidth = image.width;
            const imgheight = image.height;
            context.drawImage(image, 0, 0, resizewidth, resizeheight);
            let colorstochoose;
            switch (func) {
                case 0:
                    colorstochoose = getcommoncolor(context.getImageData(0, 0, resizewidth, resizeheight));
                    finishImg(cvs, context, imgwidth, imgheight, colorstochoose, image, func);
                    break;
            }
        });
    }
}

sizeUpPhoto();