import canvas from 'canvas';
import fs from 'fs';


// const screenheight = 768;
// const screenwidth = 1366;
const context = cvs.getContext('2d');
const resizewidth = 600;
const resizeheight = 600;

function getcommoncolor(imgData, filename) {
    const colors = [];
    const numberofcolors = [];
    const imglength = imgData.data.length;
    const intervalone = (imglength / 4) * 1;
    const intervaltwo = (imglength / 4) * 2;
    const intervalthree = (imglength / 4) * 3;
    const intervalfour = (imglength / 4) * 4;
    for (i = 0; i < imglength; i += 4) {
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
export function sizeUpPhoto(path, Twidth, Theight, id) {
    for (let func = 0; func < funcTotal; func++) {
        const cvs = canvas.createCanvas(Twidth, Theight, 'png');
        canvas.loadImage(path).then((image) => {
            const imgwidth = image.width;
            const imgheight = image.height;
            context.drawImage(image, 0, 0, resizewidth, resizeheight);
            let colorstochoose;
            switch (func) {
                case 0:
                    colorstochoose = getcommoncolor(context.getImageData(0, 0, resizewidth, resizeheight), path);
                    break;
            }
            console.log(`Progress: ${i+1}/${files.length} - ${(i+1)/files.length * 100}%`);
            context.fillStyle = `rgb(${colorstochoose[0]},${colorstochoose[1]},${colorstochoose[2]})`;
            context.fillRect(0, 0, Twidth, Theight);
            const chamger = (Theight - offset) / imgheight;
            const newwidth = imgwidth * chamger;
            const newheight = Theight - offset;
            context.drawImage(image, (Twidth - newwidth) / 2, 0, newwidth, newheight);
            const buffer = cvs.toBuffer('image/png');
            fs.writeFileSync(`../Private/js/ICstore/new${path}v${func}:${id}`, buffer);
        });
    }

}