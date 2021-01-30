import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Logs to the console
 * @param {string} string - "String to be logged"
 * @param {string} data - "Additional data"
 */
function consoleLog(string, data = '') {
    console.log('\x1b[32m', string + ' ' + data);
}

/**
 * Logs, records, and responds error
 * @param {res} res - "String to be logged"
 * @param {string} errorthing - "Error message"
 * @return {status} "Error status"
 */
export function error(res, errorthing = 'default') {
    consoleLog('Error function:', errorthing);
    record('Error', errorthing, 2);
    return res.sendStatus(401).end();
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

/**
 * Executes SQL
 * @param {boolean} returnVal - "True if expected return val"
 * @param {string} message - "SQL command"
 * @return {object} "Returned values in dictionary array"
 */
function dbexecute(returnVal, message) {
    const stmt = db.prepare(message);
    if (returnVal) {
        return stmt.all();
    }
    stmt.run();
}

/**
 * Records to DB
 * @param {string} qtype - "Type of error"
 * @param {string} string - "Message to record"
 * @param {number} level - "Level of concern 4 being least"
 * @param {number} id - "Id of user"
 */
export function record(qtype, string, level, id = null) {
    dbexecute(false, `INSERT INTO logs VALUES(${id}, '${qtype + string}', ${level}, '${time}');`);
}

/**
 * Returns next ID available in DB
 * @return {number} - "Next ID"
 */
function nextID() {
    consoleLog(JSON.stringify(dbexecute(true, 'SELECT MAX(id) FROM users')));
    return dbexecute(true, 'SELECT MAX(id) FROM users')[0]['MAX(id)'] + 1;
}

/**
 * Creates account
 * @param {req} req - "User request"
 */
export function createAccount(req) {
    const bcryptPassword = bcrypt.hashSync(req.body.password, 12);
    dbexecute(false, `INSERT INTO users VALUES(${nextID()}, '${req.body.name}', '${bcryptPassword}', '${time}', 'stranger');`);
    consoleLog('Done writing user');
}

/**
 * Checks if login is valid and logs user in
 * @param {req} req - "User request"
 * @param {res} res - "User response"
 * @param {next} next - "Next function"
 */
export function handleLogin(req, res, next) {
    // checks if user is found
    const user = dbexecute(true, `SELECT * FROM users WHERE name = '${req.body.Name}'`);
    const foundUser = user.length != 0;
    if (!foundUser) {
        consoleLog('No user found for', req.body.Name);
        error(res, 'no user found');
        next();
    } else {
        consoleLog('User found:', user[0]['name']);
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
                    res.redirect('/busy');
                } else {
                    res.redirect('/home');
                }
            } else { // incorrect password
                record('Failed login from', req.connection.remoteAddress, 3);
                // record('password attempt', req.body.Password, 3);
                consoleLog('Incorrect Password');
                return res.status(401).json({
                    message: 'error',
                });
            }
        });
        next();
    }
}

/**
 * Removes selected timer
 * @param {number} id - "Task id"
 * @param {number} userId - "User id"
 */
export function removeTimer(id, userId) {
    dbexecute(false, `DELETE FROM tasks WHERE id = ${userId} AND taskId = ${id}`);
}

/**
 * Edits or creates timer for user
 * @param {body} body - "User request body"
 * @param {number} userId - "User id"
 */
export function editTimer(body, userId) {
    const task = dbexecute(true, `SELECT * FROM tasks WHERE taskId = ${body.id} AND id = ${userId}`);
    const foundTask = task.length != 0;
    if (foundTask) { // delete so new
        removeTimer(body.id, userId);
    }
    const maxid = Number(dbexecute(true, `SELECT MAX(taskId) FROM tasks WHERE id = ${userId}`)[0]['MAX(taskId)']) + 1;
    dbexecute(false, `INSERT INTO tasks VALUES(${userId}, '${body.text}', ${body.dateOne}, '${body.dateTwo}', ${maxid})`);
}

/**
 * Makes tasks from ICAL
 * @param {number} userId - "User id"
 * @param {number} now - "Current time"
 * @param {string} end - "End time"
 * @param {string} summary - "Summary of task"
 */
export function createTaskFromICAL(userId, now, end, summary) {
    const maxid = Number(dbexecute(true, `SELECT MAX(taskId) FROM tasks WHERE id = ${userId}`)[0]['MAX(taskId)']) + 1;
    const oldDate = new Date(end);
    const day = oldDate.getDate() < 10 ? '0' + oldDate.getDate() : oldDate.getDate();
    const newmonth = (oldDate.getMonth() + 1) < 10 ? '0' + (oldDate.getMonth() + 1) : (oldDate.getMonth() + 1);
    const newDate = oldDate.getFullYear() + '-' + newmonth + '-' + day;
    dbexecute(false, `INSERT INTO tasks VALUES(${userId}, '${summary}', ${now}, '${newDate}', ${maxid})`);
}

/**
 * Recives tasks for user
 * @param {number} id - "User id"
 * @return {object} - "Tasks for the user"
 */
export function getTimers(id) {
    consoleLog(id);
    return dbexecute(true, `SELECT * FROM tasks WHERE id = ${id}`);
}


/**
 * Logs that a user (id) has changed a lamp status, Does not contain which lamp
 * @param {number} id - "User id"
 */
export function logLampChange(id) {
    record('lamp change', '', 4, id);
}