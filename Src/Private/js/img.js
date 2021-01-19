const submit = document.getElementById('button');
const preSet = document.getElementById('presets');
const width = document.getElementById('screenwidth');
const height = document.getElementById('screenheight');
const lowLimit = 600;
const highLimit = 2000;
const socketIO = io();
let id;

socketIO.on('connect', () => {
    id = socketIO.io.engine.id;
    console.log('connected img');
    console.log(`id: ${id}`);
    document.cookie = `socketId=${id}`;
});

socketIO.on(`${id}`, (data) => { // url
    console.log(data);
});

preSet.onchange = () => {
    if (preSet.value = 'Ethan') {
        width.value = 1366;
        height.value = 768;
    }
};

submit.onclick = () => {
    if (width.value < lowLimit || width.value > highLimit || height.value < lowLimit || height.value > highLimit) {
        return;
    } else {
        document.getElementById('create').submit();
    }
};