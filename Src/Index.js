import express from 'express';
import path from 'path';
import validator from 'validator';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ical from 'node-ical';
import formidable from 'formidable';
import cron from 'node-cron';
import http from 'http';
import { Server } from 'socket.io';
import { error, handleLogin, createAccount, removeTimer, editTimer, getTimers, record, createTaskFromICAL } from './appSrc/database.js';
import { getUserInfo, auth, sendMessageToESPLights, eSPPostErr, getGithubCommits } from './appSrc/helpers.js';

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
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(cookieParser());
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ type: 'application/x-www-form-urlencoded', extended: true }));

app.use('/publicstatic', express.static('public'));
app.use('/privatestatic', (req, res, next) => {
    auth('stranger', req, res, next);
});
app.use('/privatestatic', express.static('Private'));

// get login page
app.get('/login', (req, res) => {
    consoleLog('Served Login Page');
    record('Gave login page to', req.connection.remoteAddress, 3);
    res.sendFile(path.join(__dirname, 'Auth.html'));
});

app.get('/home', (req, res, next) => {
    auth('stranger', req, res, next);
}, (req, res) => {
    const userDat = getUserInfo(req);
    record('Gave login page to', `${req.connection.remoteAddress} as ${userDat.name}`, 4);
    consoleLog('Served Home Path');
    res.sendFile(path.join(__dirname, 'Main.html'));
});

app.post('/createAccount', (req, res, next) => {
    consoleLog('Creating and checking Account:', JSON.stringify(req.body));
    // request to login
    // check validity again through whitelist
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

app.post('/espLights_Update', (req, res, next) => {
    auth('admin', req, res, next);
}, (req, res) => {
    const reqMessage = req.body;
    const firstObj = Object.keys(reqMessage)[0];
    if (reqMessage[firstObj] == 'On') {
        consoleLog('Turning Light On:', firstObj);
        sendMessageToESPLights(firstObj, 'On', (err) => {
            eSPPostErr(err, res);
        });
    } else if (reqMessage[firstObj] == 'Off') {
        consoleLog('Turning Light Off:', firstObj);
        sendMessageToESPLights(firstObj, 'Off', (err) => {
            eSPPostErr(err, res);
        });
    } else {
        consoleLog('Unknown body', req.body);
    }
    return;
});

// get lights status
app.get('/espLights_Status', (req, res) => {
    sendMessageToESPLights('status', 'question', (err, mes) => {
        if (err) {
            if (err.errno == 'ETIMEDOUT') {
                consoleLog('No response from ESP');
                res.json({ status: 'noComs' });
            }
        } else {
            res.json(JSON.parse(mes));
        }
    });
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

// TODO FIX
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

cron.schedule('0 50 6 * * *', () => {
    consoleLog('Turning on lamps SCHEDULE test');
    sendMessageToESPLights('all', 'On', (err) => {
        if (err) {
            consoleLog('ESP post err', err);
        }
    });
});

// SOCKET.IO

io.on('connection', (socket) => {
    consoleLog('id: ', socket.id);
    socket.on('messages', (message) => {
        // sending to the client
        socket.emit('messages', `recived! ${message}`);

        // sending to all clients except sender
        socket.broadcast.emit('messages', `recived from ${message} friends!`);
    });
});


httpServer.listen(port, () => consoleLog(`IOTWebpage is listening on port ${port}!`));