import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import request from 'request';
import cookie from 'cookie';
/**
 * logs to the console
 * @param {string} string - "String to be logged"
 * @param {string} data - "Additional data"
 */
function consoleLog(string, data = '') {
    console.log('\x1b[35m', string + ' ' + data);
}

/**
 * returns object of user request cookies
 * @param {req} req - "User request"
 * @return {object} - "User cookies or \'Invalid\' "
 */
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

/**
 * returns object of user request cookies
 * @param {req} str - "User cookie"
 * @return {object} - "User cookies or \'Invalid\' "
 */
export function getUserInfoCookie(str) {
    const token = cookie.parse(str).token;
    try {
        const data = jwt.verify(token, process.env.secretkey);
        return data;
    } catch (err) {
        consoleLog('Invalid JWT', err);
        return 'Invalid';
    }
}

/**
 * Checks if user is authenticated, redirects if invalid
 * @param {string} privlage - "Level of security needed to access"
 * @param {req} req - "User request"
 * @param {res} res - "User response"
 * @param {next} next - "Next function"
 */
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


/**
 * Sends message to ESP Lamps
 * @param {string} name - "Name of lamp"
 * @param {string} mes - "Message to ESP"
 * @param {function} callback - "Callback"
 * @return {string} - "Respnse from ESP"
 */
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
    return 'EOF';
}

/**
 * Responds 'noComs' if error
 * @param {string} err - "Name of lamp"
 * @param {res} res - "User response"
 */
export function eSPPostErr(err, res) {
    if (err) {
        consoleLog('ESP post err', err);
        res.json({ status: 'noComs' });
    } else {
        res.json({ status: 'Got it' });
    }
}

/**
 * Gets Github Commits for IOTWebpage
 * @param {number} pagenum - "Github commit page"
 * @param {function} callback - "Callback function"
 */
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