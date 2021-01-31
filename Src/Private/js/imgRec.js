const socketIO = io();
let id;

socketIO.on('connect', () => {
    id = socketIO.io.engine.id;
    console.log('connected img');
    console.log(`id: ${id}`);
    document.cookie = `socketId=${id}`;
});

socketIO.on('done', (data) => { // url
    console.log(data);
    try {
        document.getElementById('loading').remove();
    } catch {
        console.log('wow thats fast');
    }
    const img = document.createElement('IMG');
    img.src = data;
    document.getElementById('imgContainer').appendChild(img);
    const btn = document.createElement('A');
    const url = data.replace('/privatestatic/js/ICstore/', '');
    console.log(url);
    btn.href = `/getImg/${url}`;
    btn.innerHTML = 'Download';
    btn.download = url;
    document.getElementById('imgContainer').appendChild(btn);
});
socketIO.on('updates', (data) => { // url
    console.log(data);
    const div = document.createElement('DIV');
    switch (data) {
        case 1:
            div.innerHTML = '██';
            break;
        case 2:
            document.getElementById('loading').remove();
            div.innerHTML = '████';
            break;
        case 3:
            document.getElementById('loading').remove();
            div.innerHTML = '██████';
            break;
        case 4:
            document.getElementById('loading').remove();
            div.innerHTML = '████████';
            break;
    }
    div.id = 'loading';
    document.getElementById('imgContainer').appendChild(div);
});