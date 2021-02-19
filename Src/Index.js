import express from 'express';
import path from 'path';
import validator from 'validator';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ical from 'node-ical';
import formidable from 'formidable';
import cron from 'node-cron';
import http, { createServer } from 'http';
import WebSocket from 'ws';
import { Server } from 'socket.io';
import {
    error,
    handleLogin,
    createAccount,
    removeTimer,
    editTimer,
    getTimers,
    record,
    createTaskFromICAL,
    logLampChange,
    createCatan,
    updateCatanGame,
    getRolls,
    getCatanId,
    getCatanInfo,
    getCatanGames,
} from './appSrc/database.js';
import { getUserInfo, getUserInfoCookie, auth, getGithubCommits, checkXLM } from './appSrc/helpers.js';
import { Worker } from 'worker_threads';
import ejs from 'ejs';

const __dirname = path.resolve();
const result = dotenv.config({ path: `${path.join(__dirname, 'secretCodes.env')}` });

/**
 * logs to the console
 * @param {string} string - "String to be logged"
 * @param {string} data - "Additional data"
 */
function consoleLog(string, data = '') {
    console.log('\x1b[36m', string + ' ' + data);
}

if (result.error) {
    consoleLog('Dotnev Error Loading env', result.error);
}

const port = 3000;
const wsServerPort = 3001;
const app = express();
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const IOTServer = http.createServer(app);
const server = createServer();
const wss = new WebSocket.Server({ server });
const io = new Server(IOTServer);
const connected = {};
let bedStatus = false;
let deskStatus = false;
let noComs = true;
let globalWS = null;

app.use(cookieParser());
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ type: 'application/x-www-form-urlencoded', extended: true }));

app.use('/publicstatic', express.static('public'));
app.use('/privatestatic', (req, res, next) => {
    auth('stranger', req, res, next);
});
app.use('/privatestatic', express.static('Private'));

function renderError(res, data) {
    res.render(path.join(__dirname, 'Error.ejs'), { reason: data }, (err, str) => {
        if (err) {
            consoleLog('Error Rendering Error ah', err);
            res.sendStatus(500);
        }
        res.send(str);
    });
}

app.get('/error', (req, res) => {
    renderError(res, 'uh Oh');
});

app.get('/busy', (req, res) => {
    res.render(path.join(__dirname, 'Busy.html'), {}, (err, str) => {
        if (err) {
            consoleLog('Error Rendering Error ah', err);
            res.sendStatus(500);
        }
        res.send(str);
    });
});

// get login page
app.get('/login', (req, res) => {
    consoleLog('Served Login Page');
    record('Gave login page to', req.connection.remoteAddress, 3);
    res.render(path.join(__dirname, 'Auth.html'), {}, (err, str) => {
        if (err) {
            consoleLog('Error Rendering', err);
            res.redirect('/error');
        }
        res.send(str);
    });
});


app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    consoleLog('Served register Page');
    record('Gave register page to', req.connection.remoteAddress, 3);
    res.render(path.join(__dirname, 'Register.html'), {}, (err, str) => {
        if (err) {
            consoleLog('Error Rendering', err);
            res.redirect('/error');
        }
        res.send(str);
    });
});


app.get('/home/:page', (req, res, next) => {
    checkXLM(req, res, next);
}, (req, res, next) => {
    auth('stranger', req, res, next);
}, (req, res) => {
    const userDat = getUserInfo(req);
    record('Gave login page to', `${req.connection.remoteAddress} as ${userDat.name}`, 4);
    consoleLog('Served Home Path');
    const userInfo = getUserInfo(req);
    const permmitedSites = userInfo.securityLevel == 'admin' ? process.env.adminSites : process.env.strangerSites;
    consoleLog(permmitedSites.split(',')[0]);
    res.render(path.join(__dirname, 'Main.html'), {
        sites: permmitedSites.split(','),
        userName: userInfo.name,
        path: req.params.page,
    }, (err, str) => {
        if (err) {
            consoleLog('Error Rendering Main with req', err);
            renderError(res, err);
        }
        res.send(str);
    });
});

app.get('/home', (req, res, next) => {
    checkXLM(req, res, next);
}, (req, res, next) => {
    auth('stranger', req, res, next);
}, (req, res) => {
    const userDat = getUserInfo(req);
    record('Gave login page to', `${req.connection.remoteAddress} as ${userDat.name}`, 4);
    consoleLog('Served Home Path');
    const userInfo = getUserInfo(req);
    const permmitedSites = userInfo.securityLevel == 'admin' ? process.env.adminSites : process.env.strangerSites;
    consoleLog(permmitedSites.split(',')[0]);
    res.render(path.join(__dirname, 'Main.html'), {
        sites: permmitedSites.split(','),
        userName: userInfo.name,
        path: 'Home',
    }, (err, str) => {
        if (err) {
            consoleLog('Error Rendering Main', err);
            renderError(res, err);
        }
        res.send(str);
    });
});

app.post('/createAccount', (req, res, next) => {
    consoleLog('Creating and checking Account:', JSON.stringify(req.body));
    // request to login
    // check validity again through whitelist
    if (req.body.password == undefined) {
        res.sendStatus(403);
        return;
    }
    if (!validator.isWhitelisted(req.body.password, process.env.whitelist)) {
        record('Invalid Characters on backend from account', req.connection.remoteAddress, 5);
        consoleLog('Invalid characters on createaccount');
        error(res, 'validator account ');
    } else {
        next();
    }
}, (req, res) => {
    consoleLog('Creating user:', req.body.name);
    createAccount(req);
    res.sendStatus(200);
});

app.post('/login',
    (req, res, next) => {
        consoleLog('Authenticating with whitelist for user', req.body.Name);
        // request to login
        // check validity again through whitelist
        if (!validator.isWhitelisted(req.body.Password, process.env.whitelist)) {
            record('Invalid Characters on backend from', req.connection.remoteAddress, 5);
            consoleLog('invalid characters in login');
            error(res, 'validator');
        } else {
            next();
        }
    },
    // main check
    (req, res, next) => {
        handleLogin(req, res, next);
    },
    (req, res) => {
        consoleLog('logging in:', req.body.Name);
        // logging pourposes
    });

app.get('/timer', (req, res, next) => {
    auth('stranger', req, res, next);
}, (req, res) => {
    const mess = getTimers(getUserInfo(req).id);
    consoleLog(mess);
    return res.json(mess);
});

// TODO FIX it works? oh wait i dont think i use this actual method below a couple
app.post('/ToDo/uploadCal', (req, res) => {
    const userId = getUserInfo(req).id;
    const form = new formidable.IncomingForm();
    // eslint-disable-next-line space-before-function-paren
    form.parse(req, (err, fields, files) => {
        if (err) {
            consoleLog('Submited error');
            return;
        }
        const newData = ical.sync.parseFile(files.calender.path.toString());
        const keys = Object.keys(newData);
        for (let i = 0; i < keys.length; i++) {
            const now = Date.now();
            if (newData[keys[i]].end > now) {
                createTaskFromICAL(userId, Date.now(), newData[keys[i]].end, newData[keys[i]].summary);
            }
        }
        res.end();
    });
});

// timerdel
app.post('/timerdel', (req, res) => {
    const userId = getUserInfo(req).id;
    removeTimer(req.body.id, userId);
    res.end();
});

// timeredit
app.post('/timeredit', (req, res) => {
    const userId = getUserInfo(req).id;
    editTimer(req.body, userId);
    res.end();
});


app.post('/githubCommits', (req, res) => {
    const sendMess = [];
    consoleLog('Github Page sent:', req.body.page);
    getGithubCommits(req.body.page, (err, responsething) => {
        if (err) {
            consoleLog('GithubCommits Error', err);
            return res.send('[]');
        } else {
            if (responsething == undefined) {
                consoleLog('Github undefined');
                return res.send('[]');
            }
            const github = JSON.parse(responsething);
            if (github.message == 'Not Found') {
                consoleLog('No Github Acsess');
                res.send('[]');
            } else {
                for (let i = 0; i < github.length; i++) {
                    const currentmes = {
                        'name': github[i].commit.committer.name,
                        'date': github[i].commit.committer.date,
                        'message': github[i].commit.message,
                    };
                    sendMess.push(currentmes);
                }
                res.send(sendMess);
            }
        }
    });
});

app.post('/createImg', (req, res, next) => {
    auth('admin', req, res, next);
}, (req, res) => {
    consoleLog('um');
    const form = new formidable.IncomingForm({ keepExtensions: true, uploadDir: `${__dirname}/Private/js/ICstore` });
    form.parse(req, (err, fields, files) => {
        if (err) {
            consoleLog('Submited error');
            return;
        }
        consoleLog(JSON.stringify(fields));
        const data = {
            pathName: files.file.path.toString(),
            path: __dirname,
            fileName: files.file.name,
            width: parseInt(fields.screenwidth),
            height: parseInt(fields.screenheight),
            id: getUserInfo(req).id,
            fields: fields,
        };
        const worker = new Worker('./appSrc/imgCreate.js', { workerData: data });
        worker.on('error', (connecterr) => {
            throw connecterr;
        });
        worker.on('exit', () => {
            consoleLog('Worker Done');
        });
        worker.on('message', (msg) => {
            if (msg.done) {
                consoleLog('Done?: ', JSON.stringify(msg));
                consoleLog('sending to:', connected[(getUserInfo(req).id).toString()]);
                io.to(connected[(getUserInfo(req).id).toString()]).emit('done', msg.data);
            } else {
                io.to(connected[(getUserInfo(req).id).toString()]).emit('updates', msg.data);
            }
        });
    });
    res.sendFile(path.join(__dirname, '/Private/html/reciveImg.html'));
});


app.get('/getImg/:url', (req, res, next) => {
    auth('admin', req, res, next);
}, (req, res) => {
    res.type('png');
    res.sendFile(path.join(__dirname, '/Private/js/ICstore/', req.params.url));
});

cron.schedule('0 50 6 * * *', () => {
    consoleLog('Turning on lamps SCHEDULE test');
    globalWS.send(`${JSON.stringify({ bed: 'On', desk: 'On' })}`);
});

// catan game viewer
app.get('/catanViewer', (req, res) => {
    const catanGames = getCatanGames();
    res.render(path.join(__dirname, 'Private/Extra/Ethan/catan/Catan.html'), {
        games: catanGames,
    }, (err, str) => {
        if (err) {
            consoleLog('Error Rendering Error ah', err);
            res.sendStatus(500);
        }
        res.send(str);
    });
});
app.post('/createCatanGame', (req, res) => {
    createCatan(req.body.name, req.body.info);
    res.sendStatus(200);
});
app.post('/updateDice', (req, res) => {
    consoleLog(getCatanId(req.body.name)[0].id);
    updateCatanGame(getCatanId(req.body.name)[0].id, req.body.roll);
    res.sendStatus(200);
});
app.post('/getCatanGame', (req, res) => {
    res.send(getRolls(getCatanId(req.body.name)[0].id));
});
app.post('/findCatanGame', (req, res) => {
    res.send(getCatanId(req.body.name));
});
app.post('/getCatanGameInfo', (req, res) => {
    res.send(getCatanInfo(req.body.name));
});
// SOCKET.IO

// game vars
let usersGame = [];
let gameUserData = [];
const gameDat = {};

io.on('connection', (socket) => {
    consoleLog('New client id: ', socket.client.id);
    connected[getUserInfoCookie(socket.handshake.headers.cookie).id] = socket.id;
    socket.on('status', (message) => {
        // sending to the client
        if (noComs) {
            socket.emit('status', `${JSON.stringify({ status: 'noComs' })}`);
        } else {
            socket.emit('status', `${JSON.stringify({ status: 'online', bed: bedStatus?'On':'Off', desk: deskStatus?'On':'Off' })}`);
        }
    });
    socket.on('update', (message) => {
        // sending to the client
        if (noComs || globalWS == null) {
            socket.emit('status', `${JSON.stringify({ status: 'noComs' })}`);
        } else {
            logLampChange(getUserInfoCookie(socket.handshake.headers.cookie).id);
            globalWS.send(message);
            const response = JSON.parse(message);
            response['status'] = 'online';
            io.emit('status', JSON.stringify(response));
        }
    });

    // game

    socket.on('join', (data) => {
        usersGame.push((data));
        consoleLog(JSON.stringify(usersGame[0]));
        io.emit('updateUsers', (data));
    });

    socket.on('startGame', (data) => {
        gameDat['start'] = data.start;
        gameDat['end'] = data.end;
        io.emit('start');
    });

    socket.on('updateStart', (data) => {
        consoleLog('sending', JSON.stringify(data));
        io.emit('updateStartPos', (data));
    });

    socket.on('updateEnd', (data) => {
        consoleLog('sending', JSON.stringify(data));
        io.emit('updateEndPos', (data));
    });

    socket.on('getUsers', () => {
        consoleLog('updating');
        consoleLog(usersGame[0]);
        for (let i = 0; i < usersGame.length; i++) {
            consoleLog(JSON.stringify(usersGame[i]));
            socket.emit('updateUsers', usersGame[i]);
        }
    });

    socket.on('removeUser', (data) => {
        consoleLog('removing');
        const newUserGame = [];
        for (let i = 0; i < usersGame.length; i++) {
            consoleLog('array', usersGame[i].name);
            consoleLog('rem', data.name);
            if (usersGame[i].name != data.name) {
                consoleLog('add');
                newUserGame.push(data);
            } else {
                consoleLog('sent');
                data.remove = true;
                io.emit('updateUsers', (data));
            }
        }
        consoleLog('new', JSON.stringify(newUserGame[0]));
        usersGame = newUserGame;
    });

    // gmae game

    socket.on('joinGame', (data) => {
        gameUserData.push(data);
        socket.emit('settings', gameDat);
    });

    socket.on('leaveGame', (data) => {
        consoleLog('removing game user');
        const newUserGameList = [];
        for (let i = 0; i < newUserGameList.length; i++) {
            if (newUserGameList[i].name != data.name) {
                newUserGameList.push(data.name);
            }
        }
        usersGame = newUserGameList;
    });

    socket.on('quitGame', (data) => {
        consoleLog('wuitting');
        let giveup = true;
        for (let i = 0; i < gameUserData.length; i++) {
            if (data.name == gameUserData[i].name) {
                consoleLog('wuitting', gameUserData[i].name);
                gameUserData[i].playing = false;
                for (let j = 0; j < gameUserData.length; j++) {
                    if (gameUserData[j].playing) {
                        giveup = false;
                    }
                }
            }
        }

        if (giveup) {
            gameUserData = [];
            consoleLog('donezo');
            io.emit('quit');
        }
        socket.emit('quit');
    });

    socket.on('end', (data) => {
        io.emit('endScreen', (data));
    });
});

// ws
function heartbeat() {
    // eslint-disable-next-line no-invalid-this
    this.isAlive = true;
}

wss.on('connection', function(ws) {
    console.log('ESP connected');
    noComs = false;
    globalWS = ws;
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', (data) => {
        if (data != 'Connected') {
            const updateVar = JSON.parse(data);
            bedStatus = updateVar['bed'] == 'On' ? true : false;
            deskStatus = updateVar['desk'] == 'On' ? true : false;
        }
    });
    ws.on('close', function() {
        noComs = true;
        console.log('ESP disconnected');
    });
});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 5000);

wss.on('close', function close() {
    clearInterval(interval);
});

IOTServer.listen(port, () => consoleLog(`IOTWebpage is listening on port ${port}!`));
server.listen(wsServerPort, () => consoleLog(`wsServer is listening on port ${wsServerPort}!`));