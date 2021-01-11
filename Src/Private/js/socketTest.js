const socket = io();

socket.on('connect', () => {
    console.log('connected');
});
document.getElementById('button').onclick = () => {
    socket.emit('messages', 'Hello World!');
};
socket.on('messages', (data) => {
    console.log(data);
});