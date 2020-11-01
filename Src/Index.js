import fs from 'fs';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { record } from './Private/js/logs.js';
import { checkDaily } from './Private/js/logs.js';
import request from 'request';
import dotenv from 'dotenv';

const serverBusy = true;

const __dirname = path.resolve();
const result = dotenv.config({ path: `${path.join(__dirname, 'secretCodes.env')}` });

function consoleLog(string, data = '') {
    console.log('\x1b[36m', string + ' ' + data);
}
if (result.error) {
    consoleLog('Dotnev Error Loading env', result.error);
}

const port = 3000;
const app = express();
const date = new Date();
const month = date.getMonth();
let monthActual = month + 1;
if (monthActual < 10) {
    monthActual = '0' + monthActual;
}
let dayVal = date.getDate();
if (dayVal < 10) {
    dayVal = '0' + dayVal;
}
const title = `${monthActual}${dayVal}${date.getFullYear()}`;
const time = `${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;
checkDaily(__dirname);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/publicstatic', express.static('public'));
app.use('/privatestatic', (req, res, next) => {
    console.log('podkjhas ');
    auth('stranger', req, res, next);
});
app.use('/privatestatic', express.static('Private'));


function error(res, errorthing = 'default') {
    consoleLog('Error function:', errorthing);
    record('Error', errorthing, 2);
    return res.sendStatus(401).end();
}
// userinfo
function getUserInfo(req) {
    const token = req.cookies.token;
    try {
        const data = jwt.verify(token, process.env.secretkey);
        return data;
    } catch (err) {
        consoleLog('Invalid JWT', err);
        return 'Invalid';
    }
}

// auth function
function auth(privlage, req, res, next) {
    consoleLog('Authenticating user');
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.secretkey);
        if (decoded.securityLevel == privlage || decoded.securityLevel == 'admin') {
            next();
        } else {
            res.send('Forbidden');
        }
    } catch (err) {
        record('Failed Auth ip', req.connection.remoteAddress, 3);
        const isAjaxRequest = req.header.type == 'ajax';
        consoleLog('Is it an AJAX request:', isAjaxRequest);
        if (isAjaxRequest) {
            consoleLog('It is');
            res.send('/login').end();
        } else {
            consoleLog('Redirecting expired Token');
            res.redirect(302, '/login');
        }
    }
}
// static file check

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
    const bcryptPassword = bcrypt.hashSync(req.body.password, 12);
    consoleLog('Creating user:', req.body.name);
    fs.writeFile(`${__dirname}\\users\\${req.body.name}.json`, JSON.stringify({
        'Public': {
            'name': req.body.name,
            'securityLevel': 'stranger',
        },
        'Private': {
            'password': bcryptPassword,
            'lastLog': '',
        },
        'timers': {},
    }), (err) => {
        if (err) {
            consoleLog('Error writing user', err);
            return;
        }
        consoleLog('Done writing user'); // Success
    });
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
        try {
            consoleLog('Checking if Account is there');
            // read from json file under username
            fs.readFile(path.join(__dirname, `/users/${req.body.Name}.json`), 'utf-8', (err, data) => {
                if (err) {
                    // no file found/error reading json file
                    consoleLog('No user found for', req.body.Name);
                    error(res, err);
                }
                consoleLog('User found:', req.body.Name);
                // there is a file for user parse it
                const filedata = JSON.parse(data);
                // engrypt and compare paswword and check with user file
                bcrypt.compare(req.body.Password, filedata.Private.password, (err, result) => {
                    if (err) {
                        // general error with bcrpyt
                        consoleLog('General bcrypt error');
                        error(res, err);
                    }
                    // result is true if password is the same
                    consoleLog('Password matches:', result);
                    if (result) {
                        // same password
                        record('logging in', req.connection.remoteAddress, 3);
                        consoleLog('Bcrtpy same password');
                        // set LAst login
                        filedata.Private.lastLog = `${title}_${time}`;
                        fs.writeFile(path.join(__dirname, `/users/${req.body.Name}.json`), JSON.stringify(filedata), (err) => {
                            if (err) {
                                consoleLog('Error writing lastLog');
                                return;
                            }
                        });
                        // create jwt
                        const token = jwt.sign(filedata.Public, process.env.secretkey, { expiresIn: '30min' });
                        // set authorization cookie with jwt
                        res.cookie('token', token, {
                            // ms
                            // 30 min
                            maxAge: process.env.timeoutTime,
                        });
                        // ajax redirect
                        consoleLog('Validated and redirected');
                        // parsed on frontend and rediredted there with credintials
                        if (serverBusy && filedata.Public.securityLevel != 'admin') {
                            return res.json({
                                message: 'busy',
                            });
                        } else {
                            return res.json({
                                message: 'redirect',
                                newpage: '/home',
                            });
                        }
                    } else {
                        // incorrect password
                        record('Failed login from', req.connection.remoteAddress, 3);
                        // record('password attempt', req.body.Password, 3);
                        consoleLog('Incorrect Password');
                        return res.json({
                            message: 'error',
                        });
                    }
                });
            });
        } catch (errror) {
            // error up above in some statement
            consoleLog('Weird error in Login', errror);
            error(res, err);
        } finally {
            // ends main segment
            next();
        }
    },
    (req, res) => {
        consoleLog('logging in:', req.body.Name);
        // logging pourposes
    });

// keep timers
app.post('/timer', (req, res, next) => {
    auth('stranger', req, res, next);
}, (req, res) => {
    const keysarray = Object.keys(req.body);
    let lastkeyarrayval;
    try {
        lastkeyarrayval = req.body[keysarray[(keysarray.length - 1)]][2];
        if (!validator.isWhitelisted(lastkeyarrayval, process.env.whitelist)) {
            record('Invalid Characters on backend from', req.connection.remoteAddress, 5);
            consoleLog('Invalid character in timer post');
            error(res, 'validator for timer post');
            return;
        }
    } catch {
        lastkeyarrayval = {};
    } finally {
        const userTimer = getUserInfo(req);
        const userPath = `/users/${userTimer.name}.json`;
        const timerpath = path.join(__dirname, userPath);
        let userJSON = fs.readFileSync(timerpath);
        userJSON = JSON.parse(userJSON);
        userJSON.timers = req.body;
        fs.writeFile(timerpath, JSON.stringify(userJSON), (err) => {
            if (err) {
                consoleLog('Timer set failed', err);
                return;
            }
            consoleLog('Updated timer for', userTimer.name);
            return res.send('done');
        });
    }
});
app.get('/timer', (req, res, next) => {
    auth('stranger', req, res, next);
}, (req, res) => {
    const userTimer = getUserInfo(req);
    const userPath = `/users/${userTimer.name}.json`;
    const timerpath = path.join(__dirname, userPath);
    fs.readFile(timerpath, (err, data) => {
        if (err) {
            consoleLog('Timer get failed', err);
            return false;
        }
        return res.json(JSON.parse(data).timers);
    });
});


// esp local ip
const espLightsIP = 'http://192.168.1.110:80/ESPLights';

function sendMessageToESPLights(name, mes, callback) {
    const propperMes = {};
    propperMes[name] = mes;
    request.post(
        espLightsIP, {
            headers: {
                'content-type': 'text/plain',
            },
            // message it sends
            body: JSON.stringify(propperMes),
        },
        (error, response) => {
            if (error || (response.statusCode == 500)) {
                consoleLog('Req error to ESP', error);
                callback(error);
                return;
            }
            if (response.statusCode != 200) {
                consoleLog('Not ok Status code ESP');
            }
            callback(error, response.body);
            return response.body;
        },
    );
}

function eSPPostErr(err, res) {
    if (err) {
        consoleLog('ESP post err', err);
        res.json({ status: 'noComs' });
    } else {
        res.json({ status: 'Got it' });
    }
}

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


function getGithubCommits(callback) {
    request.get(
        process.env.githubLink, {
            headers: {
                'User-Agent': 'EthanIOTBACKEND',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `${process.env.GithubAcsess}`,
            },
        },
        (error, response) => {
            if (error || (response.statusCode == 500)) {
                consoleLog('Github request error', error);
                callback(error);
                return;
            }
            if (response.statusCode != 200) {
                consoleLog('Github not ok StatusCode');
            }
            callback(error, response.body);
            return response;
        },
    );
}

app.post('/githubCommits', (req, res) => {
    const sendMess = [];
    getGithubCommits((err, responsething) => {
        const page = req.body.page;
        const github = JSON.parse(responsething);
        if (github == undefined || github.message == 'Not Found') {
            consoleLog('No Github Acsess');
            res.send('[]');
        } else {
            for (let i = 25 * (page - 1); i < 25 * page; i++) {
                const currentmes = {
                    'name': github[i].commit.committer.name,
                    'date': github[i].commit.committer.date,
                    'message': github[i].commit.message,
                };
                sendMess.push(currentmes);
            }
            res.send(sendMess);
        }
    });
});

app.listen(port, () => consoleLog(`IOTWebpage is listening on port ${port}!`));