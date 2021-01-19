import canvas from 'canvas';
import fs from 'fs';


// const screenheight = 768;
// const screenwidth = 1366;
const resizewidth = 600;
const resizeheight = 600;
/**
 * logs to the console
 * @param {string} string - "String to be logged"
 * @param {string} data - "Additional data"
 */
function consoleLog(string, data = '') {
    console.log('\x1b[33m', string + ' ' + data);
}

async function getcommoncolor(imgData, filename) {
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
                console.log(`${filename}: [██......]`);
                break;
            case intervaltwo:
                console.log(`${filename}: [████....]`);
                break;
            case intervalthree:
                console.log(`${filename}: [██████..]`);
                break;
            case intervalfour:
                console.log(`${filename}: [████████]`);
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

function finishImg(cvs, context, imgwidth, imgheight, Twidth, Theight, colorstochoose, name, id, cb, userId) {
    consoleLog('Done!');
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
    cb(userId, url);
}

export function sizeUpPhoto(path, __dirname, name, Twidth, Theight, id, cb, userId) {
    for (let func = 0; func < funcTotal; func++) {
        const cvs = canvas.createCanvas(parseInt(Twidth), parseInt(Theight), 'png');
        const context = cvs.getContext('2d');
        canvas.loadImage(path).then((image) => {
            const imgwidth = image.width;
            const imgheight = image.height;
            context.drawImage(image, 0, 0, resizewidth, resizeheight);
            let colorstochoose;
            switch (func) {
                case 0:
                    colorstochoose = getcommoncolor(context.getImageData(0, 0, resizewidth, resizeheight), path).then(
                        // eslint-disable-next-line no-unused-vars
                        finishImg(cvs, context, imgwidth, imgheight, Twidth, Theight, colorstochoose, name, id, cb, userId));
                    break;
            }
        });
    }
}