import jwt from 'jsonwebtoken';
import request from 'request';

function consoleLog(string, data = '') {
    console.log('\x1b[35m', string + ' ' + data);
}

export function getUserInfo(req) {
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
export function auth(privlage, req, res, next) {
    consoleLog('Authenticating user');
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.secretkey);
        if (decoded.securityLevel == privlage || decoded.securityLevel == 'admin') {
            next();
        } else {
            res.send('Forbidden');
        }
    } catch (err) {
        // record('Failed Auth ip', (req.connection.remoteAddress).toString(), 3);
        const isAjaxRequest = req.header.type == 'ajax';
        consoleLog('Is it an AJAX request:', isAjaxRequest);
        if (isAjaxRequest) {
            consoleLog('It is');
            res.sendStatus(401).end();
        } else {
            consoleLog('Redirecting expired Token');
            if (req.path == '/home') {
                res.redirect(302, '/login');
            } else {
                res.sendStatus(401).end();
            }
        }
    }
}

export function checkForDup(original, lookFor) {
    for (const property in original) {
        if (original[property][2] == lookFor) {
            consoleLog('duplicate entry');
            return false;
        }
    }
    return true;
}

// keep timers
export function updateTimers(userTimer, addto, add = {}) {
    const user = dbexecute(true, `SELECT * from tasks WHERE id = ${userTimer.id}`);
    if (addto) {
        const keys = Object.keys(user);
        let count = keys.length;
        for (const property in add) {
            if (checkForDup(user, add[property][2])) {
                count++;
                userJSON.timers[`task${count}`] = add[property];
            }
        }
    } else {
        userJSON.timers = add;
    }
}


export function sendMessageToESPLights(name, mes, callback) {
    const propperMes = {};
    propperMes[name] = mes;
    request.post(
        process.env.espLightsIP, {
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

export function eSPPostErr(err, res) {
    if (err) {
        consoleLog('ESP post err', err);
        res.json({ status: 'noComs' });
    } else {
        res.json({ status: 'Got it' });
    }
}

export function getGithubCommits(pagenum, callback) {
    request.get(

        {
            url: process.env.githubLink,
            qs: {
                per_page: 25,
                page: pagenum,
            },
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