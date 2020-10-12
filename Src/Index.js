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

const __dirname = path.resolve();
const port = 3000;
const app = express();
const Keys = JSON.parse(fs.readFileSync('./Private/codes.json', 'utf8'));

checkDaily(__dirname);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/privatestatic', [(err, req, res, next) => {
    auth(req, res, next);
}, express.static('Private')]);
app.use('/publicstatic', express.static('public'));

function error(res, errorthing = 'default') {
    console.log('error message lolzies fuck you');
    console.log(errorthing);
    record('Error', errorthing, 2);
    return res.sendStatus(401).end();
}
// userinfo


// auth function
function auth(req, res, next) {
    console.log('Authenticating');
    try {
        const decoded = jwt.verify(req.cookies.token, Keys.secretkey);
        req.params.userData = decoded;
        next();
    } catch (err) {
        record('Failed Auth ip', req.connection.remoteAddress, 3);
        const isAjaxRequest = req.header.type == 'ajax';
        console.log(isAjaxRequest);
        if (isAjaxRequest) {
            console.log('tsednw');
            res.send('/login').end();
        } else {
            res.redirect(302, '/login');
        }
    }
}
// get login page
app.get('/login', (req, res) => {
    console.log('login path freebie');
    record('Gave login page to', req.connection.remoteAddress, 3);
    res.sendFile(path.join(__dirname, 'Auth.html'));
});

app.get('/home', (req, res, next) => {
    auth(req, res, next);
}, (req, res) => {
    record('Gave login page to', `${req.connection.remoteAddress} as ${req.params.userData.name}`, 4);
    console.log('home path auth');
    res.sendFile(path.join(__dirname, 'Main.html'));
});

app.post('/login',
    (req, res, next) => {
        console.log('Authenticating with whitelist');
        // request to login
        // check validity again through whitelist
        if (!validator.isWhitelisted(req.body.Password, Keys.whitelist)) {
            record('Invalid Characters on backend from', req.connection.remoteAddress, 5);
            console.log('invalid characters');
            error(res, 'validator');
        } else {
            next();
        }
    },
    // main check
    (req, res, next) => {
        try {
            console.log('Account check');
            // read from json file under username
            fs.readFile(path.join(__dirname, `/users/${req.body.Name}.json`), 'utf-8', (err, data) => {
                if (err) {
                    // no file found/error reading json file
                    console.log('read err no file present');
                    error(res, err);
                }
                // there is a file for user parse it
                const filedata = JSON.parse(data);
                console.log(`user: ${filedata}`);
                // engrypt and compare paswword and check with user file
                bcrypt.compare(req.body.Password, filedata.Private.password, (err, result) => {
                    if (err) {
                        // general error with bcrpyt
                        console.log('bcrypt error');
                        error(res, err);
                    }
                    // result is true if password is the same
                    if (result) {
                        // same password
                        record('logging in', req.connection.remoteAddress, 3);
                        console.log('Bcrtpy same password');
                        // create jwt
                        const token = jwt.sign({
                            securitylevel: 'admin',
                            name: req.body.Name,
                        }, Keys.secretkey, {
                            expiresIn: '30min',
                        });
                        // set authorization cookie with jwt
                        res.cookie('token', token, {
                            // ms
                            // 30 min
                            maxAge: 1800000,
                        });
                        // ajax redirect
                        console.log('redirected');
                        return res.json({
                            message: 'redirect',
                            newpage: '/home',
                        });
                    } else {
                        // incorrect password
                        record('Failed login from', req.connection.remoteAddress, 3);
                        record('password attempt', req.body.Password, 3);
                        console.log('not right');
                        return res.json({
                            message: 'error',
                        });
                    }
                });
            });
        } catch (errror) {
            // error up above in some statement
            console.log('other fuckin error');
            console.log(errror);
            error(res, err);
        } finally {
            // ends main segment
            next();
        }
    },
    (req, res) => {
        console.log('loggin');
        // logging pourposes
    });

// keep timers
app.post('/timer', (req, res, next) => {
    auth(req, res, next);
}, (req, res) => {
    const keysarray = Object.keys(req.body);
    let lastkeyarrayval;
    try {
        lastkeyarrayval = req.body[keysarray[(keysarray.length - 1)]][2];
        if (!validator.isWhitelisted(lastkeyarrayval, Keys.whitelist)) {
            record('Invalid Characters on backend from', req.connection.remoteAddress, 5);
            console.log('invalid character in timer post');
            error(res, 'validator for timer post');
            return;
        }
    } catch {
        lastkeyarrayval = {};
    } finally {
        const timerpath = path.join(__dirname, 'Private\\timers.json');
        fs.writeFile(timerpath, JSON.stringify(req.body), (err) => {
            if (err) {
                console.log(err);
                console.log('timer set failed');
                return false;
            }
            console.log('should work');
            return res.send('done');
        });
    }
});
app.get('/timer', (req, res, next) => {
    auth(req, res, next);
}, (req, res) => {
    const timerpath = path.join(__dirname, 'Private\\timers.json');
    fs.readFile(timerpath, (err, data) => {
        if (err) {
            console.log(err);
            console.log('timer get failed');
            return false;
        }
        console.log('sent');
        console.log(JSON.parse(data));
        return res.json(JSON.parse(data));
    });
});

app.get('/userinfo', (req, res, next) => {
    auth(req, res, next);
}, (req, res) => {
    console.log(req.params.userData);
    const timerpath = path.join(__dirname, `users\\${req.params.userData.name}.json`);
    fs.readFile(timerpath, (err, data) => {
        if (err) {
            console.log(err);
            console.log('user get failed');
            return false;
        }
        console.log('user sent');
        console.log(JSON.parse(data));
        const obj = JSON.parse(data);
        console.log(obj.Public);
        return res.json(obj.Public);
    });
});

//esp local ip
const espLightsIP = "http://192.168.1.110:80/ESPLights";

function sendMessageToESPLights(name, mes, callback) {
    let propperMes = {};
    propperMes[name] = mes;
    request.post(espLightsIP, {
            headers: {
                "content-type": "text/plain",
            },
            //message it sends
            body: JSON.stringify(propperMes)
        },
        (error, response) => {
            if (error || (response.statusCode == 500)) {
                console.log(error);
                console.log("req error");
                callback(error);
                return;
            }
            if (response.statusCode != 200) {
                console.log("fix status code dumbass");
            }
            callback(error, response.body);
            return response;
        }

    );
}
//turn on lights
/* (req, res, next) => {
    auth(req, res, next);
},
*/

function ESPPostErr(err, res) {
    if (err) {
        console.log("Post err");
        console.log(err);
        res.json({ status: "noComs" });
    } else {
        res.json({ status: 'Got it' });
    }
}

app.post('/espLights_Update', (req, res) => {
    let reqMessage = req.body;
    console.log(reqMessage);
    let firstObj = Object.keys(reqMessage)[0];
    if (reqMessage[firstObj] == "On") {
        console.log("pointy on");
        sendMessageToESPLights(firstObj, "On", (err) => {
            console.log("pointyq");
            ESPPostErr(err, res);
        });
    } else if (reqMessage[firstObj] == "Off") {
        console.log("pointy off");
        sendMessageToESPLights(firstObj, "Off", (err) => {
            console.log("pointyw");
            ESPPostErr(err, res);
        });
    } else {
        console.log(res.body);
        console.log("unknown res");
    }
    return;
});

//get lights status
app.get('/espLights_Status', (req, res) => {
    sendMessageToESPLights("status", "question", (err, mes) => {
        if (err) {
            if (err.errno == 'ETIMEDOUT') {
                console.log("timeout err");
                res.json({ status: "noComs" });
            }
        } else {
            res.json(mes);
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));