import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function error(res, errorthing = 'default') {
    consoleLog('Error function:', errorthing);
    record('Error', errorthing, 2);
    return res.sendStatus(401).end();
}

function consoleLog(string, data = '') {
    console.log('\x1b[32m', string + ' ' + data);
}

const db = new Database('IOTWebpageDB.db', { verbose: consoleLog });
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

const time = `${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;
const serverBusy = true;

export function dbexecute(returnVal, message) {
    const stmt = db.prepare(message);
    if (returnVal) {
        return stmt.all();
    }
    stmt.run();
}

export function record(qtype, string, level, id = null) {
    dbexecute(false, `INSERT INTO logs VALUES(${id}, '${qtype + string}', ${level}, '${time}');`);
}

function nextID() {
    consoleLog(JSON.stringify(dbexecute(true, 'SELECT MAX(id) FROM users')));
    return dbexecute(true, 'SELECT MAX(id) FROM users')[0]['MAX(id)'] + 1;
}

export function createAccount(req) {
    const bcryptPassword = bcrypt.hashSync(req.body.password, 12);
    dbexecute(false, `INSERT INTO users VALUES(${nextID()}, '${req.body.name}', '${bcryptPassword}', '${time}', 'stranger');`);
    consoleLog('Done writing user');
}

export function handleLogin(req, res, next) {
    // checks if user is found
    const user = dbexecute(true, `SELECT * FROM users WHERE name = '${req.body.Name}'`);
    const foundUser = user.length != 0;
    if (!foundUser) {
        consoleLog('No user found for', req.body.Name);
        error(res, err);
        next();
    } else {
        consoleLog('User found:', user[0]['name']);
    }
    const id = user[0]['id'];
    // compare passwords
    bcrypt.compare(req.body.Password, user[0]['password'], (err, result) => {
        if (err) {
            // general error with bcrpyt
            consoleLog('General bcrypt error');
            error(res, err);
        }
        // passwords match
        if (result) {
            record('logging in', req.connection.remoteAddress, 3);
            consoleLog('Bcrtpy same password');
            // set last login
            dbexecute(false, `UPDATE users SET lastLog = '${time}' WHERE id = ${id}`);
            // public data to send
            const publicData = dbexecute(true, `SELECT id, name, securityLevel FROM users WHERE id = ${id}`);
            // jwt
            const token = jwt.sign(publicData[0], process.env.secretkey, { expiresIn: '720min' });
            // set authorization cookie with jwt
            res.cookie('token', token, {
                // 30 min
                maxAge: process.env.timeoutTime,
            });
            // ajax redirect
            consoleLog('Validated and redirected');
            // parsed on frontend and rediredted there with credintials
            if (serverBusy && user[0]['securityLevel'] != 'admin') {
                return res.json({
                    message: 'busy',
                });
            } else {
                return res.json({
                    message: 'redirect',
                    newpage: '/home',
                });
            }
        } else { // incorrect password
            record('Failed login from', req.connection.remoteAddress, 3);
            // record('password attempt', req.body.Password, 3);
            consoleLog('Incorrect Password');
            return res.json({
                message: 'error',
            });
        }
    });
    next();
}


export function removeTimer(id, userId) {
    dbexecute(false, `DELETE FROM tasks WHERE id = ${userId} AND taskId = ${id}`);
}

export function editTimer(body, userId) {
    const task = dbexecute(true, `SELECT * FROM tasks WHERE taskId = ${body.id} AND id = ${userId}`);
    const foundTask = task.length != 0;
    if (foundTask) { // delete so new
        removeTimer(body.id, userId);
    }
    const maxid = Number(dbexecute(true, `SELECT MAX(taskId) FROM tasks WHERE id = ${userId}`)[0]['MAX(taskId)']) + 1;
    dbexecute(false, `INSERT INTO tasks VALUES(${userId}, '${body.text}', ${body.dateOne}, '${body.dateTwo}', ${maxid})`);
}

export function getTimers(id) {
    consoleLog(id);
    return dbexecute(true, `SELECT * FROM tasks WHERE id = ${id}`);
}