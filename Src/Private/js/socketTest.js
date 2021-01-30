const socket = io();

socket.on('connect', () => {
    console.log('connected');
});
document.getElementById('button').onclick = () => {
    socket.emit('status', 'get');
};
document.getElementById('button1').onclick = () => {
    socket.emit('update', '{"bed":"On","desk":"Off"}');
};
document.getElementById('button2').onclick = () => {
    socket.emit('update', '{"bed":"Off","desk":"Off"}');
};
socket.on('status', (data) => {
    console.log(data);
});