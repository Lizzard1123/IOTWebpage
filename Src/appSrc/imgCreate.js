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
const fields = workerData.fields;
/**
 * logs to the console
 * @param {string} string - "String to be logged"
 * @param {string} data - "Additional data"
 */
function consoleLog(string, data = '') {
    console.log('\x1b[33m', string + ' ' + data);
}

/**
 * gets brute force most common color of imageData
 * @param {data} imgData - "array of image data"
 * @return {array} - "array[3] of image data for pixel"
 */
function getcommoncolor(imgData) {
    const colors = [];
    const numberofcolors = [];
    const imglength = imgData.data.length;
    // key points in data to send to client for status
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
        // current image pixel
        const pixelcolor = [
            imgData.data[i],
            imgData.data[i + 1],
            imgData.data[i + 2],
        ];
        let found = false;
        let index;
        // go through colors to see if pixel is found
        for (let k = 0; k < colors.length; k++) {
            if (colors[k][0] == pixelcolor[0] && colors[k][1] == pixelcolor[1] && colors[k][2] == pixelcolor[2]) {
                found = true;
                index = k;
            }
        }
        if (found) {
            // has color increase it in the pixel count array
            numberofcolors[index] = ++numberofcolors[index];
        } else {
            // new color combo and new index counter
            colors.push(pixelcolor);
            numberofcolors.push(1);
        }
    }
    // go through index tracker to find most common
    let highest = 0;
    let highestindex = 0;
    for (let i = 0; i < numberofcolors.length; i++) {
        if (numberofcolors[i] > highest) {
            highestindex = i;
            highest = numberofcolors[i];
        }
    }
    // return array of most common color
    return colors[highestindex];
}


/**
 * returns if num is within offset of target
 * @param {number} limit - "offset"
 * @param {number} num - "number to test"
 * @param {number} target - "target number"
 * @return {boolean} - "true if num is within offset of target"
 */
function within(limit, num, target) {
    return (num > target - limit) && (num < target + limit);
};


/**
 * gets offseted most common color of imageData
 * @param {data} imgData - "array of image data"
 * @return {array} - "array[3] of image data for pixel"
 */
function getclosecolor(imgData) {
    const imgOffset = 10;
    const colors = [];
    const numberofcolors = [];
    const imglength = imgData.data.length;
    // key points in data to send to client for status
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
        // go through colors to see if pixel is found within offset
        for (let k = 0; k < colors.length; k++) {
            if (within(imgOffset, pixelcolor[0], colors[k][0]) &&
                within(imgOffset, pixelcolor[1], colors[k][1]) &&
                within(imgOffset, pixelcolor[2], colors[k][2])) {
                found = true;
                // increase on array
                numberofcolors[k] = ++numberofcolors[k];
            }
        }
        if (!found) {
            // new color combo and new index counter
            colors.push(pixelcolor);
            numberofcolors.push(1);
        }
    }
    // go through index tracker to find most common
    let highest = 0;
    let highestindex = 0;
    for (let i = 0; i < numberofcolors.length; i++) {
        if (numberofcolors[i] > highest) {
            highestindex = i;
            highest = numberofcolors[i];
        }
    }
    // return array of most common color
    return colors[highestindex];
}
const offset = 40;
const funcTotal = 4;

function beginImg(cvs, context, imgwidth, imgheight, colorstochoose, image, func) {
    context.fillStyle = `rgb(${colorstochoose[0]},${colorstochoose[1]},${colorstochoose[2]})`;
    context.fillRect(0, 0, Twidth, Theight);
    const chamger = (Theight - offset) / imgheight;
    const newwidth = imgwidth * chamger;
    const newheight = Theight - offset;
    context.drawImage(image, (Twidth - newwidth) / 2, 0, newwidth, newheight);
}

function beginImgGrey(cvs, context, imgwidth, imgheight, colorstochoose, image, func) {
    const average = Math.floor((colorstochoose[0] + colorstochoose[1] + colorstochoose[2]) / 3);
    context.fillStyle = `rgb(${average},${average},${average})`;
    context.fillRect(0, 0, Twidth, Theight);
    const chamger = (Theight - offset) / imgheight;
    const newwidth = imgwidth * chamger;
    const newheight = Theight - offset;
    context.drawImage(image, (Twidth - newwidth) / 2, 0, newwidth, newheight);
    const data = context.getImageData((Twidth - newwidth) / 2, 0, newwidth, newheight);
    for (let i = 0; i < data.data.length; i += 4) {
        const avg = Math.floor((data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3);
        data.data[i] = avg;
        data.data[i + 1] = avg;
        data.data[i + 2] = avg;
    }
    context.putImageData(data, (Twidth - newwidth) / 2, 0);
}


function beginImgExtend(cvs, context, imgwidth, imgheight, colorstochoose, image, func) {
    context.fillStyle = `rgb(${255},${255},${255})`;
    context.fillRect(0, 0, Twidth, Theight);
    const chamger = (Theight - offset) / imgheight;
    const newwidth = imgwidth * chamger;
    const newheight = Theight - offset;
    context.drawImage(image, (Twidth - newwidth) / 2, 0, newwidth, newheight);
    const leftData = context.getImageData((Twidth - newwidth) / 2, 0, 1, newheight);
    const rightData = context.getImageData((Twidth + newwidth) / 2 - 1, 0, 1, newheight);
    for (let i = 0; i < (Twidth - newwidth) / 2; i++) {
        context.putImageData(leftData, i, 0);
    }
    for (let i = (Twidth + newwidth) / 2 - 1; i < Twidth; i++) {
        context.putImageData(rightData, i, 0);
    }
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
                case 0: // brute force
                    colorstochoose = getcommoncolor(context.getImageData(0, 0, resizewidth, resizeheight));
                    beginImg(cvs, context, imgwidth, imgheight, colorstochoose, image, func);
                    break;
                case 1: // close
                    colorstochoose = getclosecolor(context.getImageData(0, 0, resizewidth, resizeheight));
                    beginImg(cvs, context, imgwidth, imgheight, colorstochoose, image, func);
                    break;
                case 2: // greyscale
                    colorstochoose = getclosecolor(context.getImageData(0, 0, resizewidth, resizeheight));
                    beginImgGrey(cvs, context, imgwidth, imgheight, colorstochoose, image, func);
                    break;
                case 3: // line extenion
                    beginImgExtend(cvs, context, imgwidth, imgheight, colorstochoose, image, func);
                    break;
            }
        });
    }
    fs.unlink(path, (err) => {
        if (err) {
            consoleLog('error unlinking img file', err);
        }
    });
}

function selectPhoto() {
    const cvs = canvas.createCanvas(Twidth, Theight, 'png');
    const context = cvs.getContext('2d');
    canvas.loadImage(path).then((image) => {
        const imgwidth = image.width;
        const imgheight = image.height;
        let colorstochoose;
        // background + image stage
        if (fields.looseColor == 'on') { // common color
            colorstochoose = getclosecolor(context.getImageData(0, 0, resizewidth, resizeheight));
            beginImg(cvs, context, imgwidth, imgheight, colorstochoose, image, 9);
        } else if (fields.stretch == 'on') { // stretch
            beginImgExtend(cvs, context, imgwidth, imgheight, colorstochoose, image, 9);
        } else if (fields.random == 'on') { // leave it up to the cvs library
            context.drawImage(image, 0, 0, 1, 1);
            colorstochoose = getcommoncolor(context.getImageData(0, 0, resizewidth, resizeheight));
            beginImg(cvs, context, imgwidth, imgheight, colorstochoose, image, 9);
        } else { // brute force
            colorstochoose = getcommoncolor(context.getImageData(0, 0, resizewidth, resizeheight));
            beginImg(cvs, context, imgwidth, imgheight, colorstochoose, image, 9);
        }
        // effects
        // black and white
        if (fields.BW == 'on') {
            const data = context.getImageData(0, 0, Twidth, Theight);
            for (let i = 0; i < data.data.length; i += 4) {
                const avg = Math.floor((data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3);
                data.data[i] = avg;
                data.data[i + 1] = avg;
                data.data[i + 2] = avg;
            }
            context.putImageData(data, 0, 0);
        }
        // reverse horizontally
        if (fields.reverse == 'on') {
            const data = context.getImageData(0, 0, Twidth, Theight);
            const copy = data.data;
            for (let i = 0; i < data.data.length; i += 4) {
                data.data[i] = copy[copy.length - i - 1];
                data.data[i + 1] = copy[copy.length - 2];
                data.data[i + 2] = copy[copy.length - 3];
            }
            context.putImageData(data, 0, 0);
        }

        // if (fields.edge) {
        //
        // }
    });
    const buffer = cvs.toBuffer('image/png');
    fs.writeFile(`${__dirname}/Private/js/ICstore/new${name.substring(0, (name.length - 4))}v${9}_${id}.png`, buffer, (err) => {
        if (err) {
            consoleLog('error writing img file');
        }
    });
    // /privatestatic/js
    const url = `/privatestatic/js/ICstore/new${name.substring(0, (name.length - 4))}v${9}_${id}.png`;
    parentPort.postMessage({
        done: true,
        data: url,
    });
    fs.unlink(path, (err) => {
        if (err) {
            consoleLog('error unlinking img file', err);
        }
    });
}

selectPhoto();
// sizeUpPhoto();