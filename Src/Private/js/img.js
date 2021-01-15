const submit = document.getElementById('button');
const width = document.getElementById('screenwidth');
const height = document.getElementById('screenheight');
const lowLimit = 600;
const highLimit = 2000;
const socket = io();

socket.on('connect', () => {
    console.log('connected img');
});

socket.on('imgUpdate', (data) => { // url
    console.log(data);
});

submit.onclick = () => {
    if (width.value < lowLimit || width.value > highLimit || height.value < lowLimit || height.value > highLimit) {
        return;
    } else {
        document.getElementById('create').submit();
    }
};