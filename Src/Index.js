import fs from 'fs'
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { record } from './Private/js/logs.js';
import { CheckDaily } from './Private/js/logs.js';


const __dirname = path.resolve();
const port = 3000;
const app = express();
const Keys = JSON.parse(fs.readFileSync('./Private/codes.json', "utf8"));

CheckDaily(__dirname);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/privatestatic', [(err, req, res, next) => { Auth(req, res, next) }, express.static('Private')]);
app.use('/publicstatic', express.static('public'));

function error(res, errorthing = "default") {
    console.log("error message lolzies fuck you");
    console.log(errorthing);
    record("Error", errorthing, 2);
    return res.sendStatus(401).end();
}
//userinfo


//auth function
function Auth(req, res, next) {
    console.log("Authenticating");
    try {
        let decoded = jwt.verify(req.cookies.token, Keys.secretkey);
        req.params.userData = decoded;
        next();
    } catch (err) {
        record("Failed Auth ip", req.connection.remoteAddress, 3);
        var isAjaxRequest = req.xhr;
        console.log(isAjaxRequest);
        if (isAjaxRequest) {
            console.log("tsednw");
            res.send("\/login").end();
        } else {
            res.redirect(302, '/login');
        }

    }

}
//get login page
app.get('/login', (req, res) => {
    console.log("login path freebie");
    record("Gave login page to", req.connection.remoteAddress, 3);
    res.sendFile(path.join(__dirname, "Auth.html"));
});

app.get('/home', (req, res, next) => { Auth(req, res, next) }, (req, res) => {
    record("Gave login page to", `${req.connection.remoteAddress} as ${req.params.userData.name}`, 4);
    console.log("home path auth");
    res.sendFile(path.join(__dirname, "Main.html"));
});

app.post('/login', (req, res, next) => {
        console.log("Authenticating with whitelist");
        //request to login
        //check validity again through whitelist
        if (!validator.isWhitelisted(req.body.Password, Keys.whitelist)) {
            record("Invalid Characters on backend from", req.connection.remoteAddress, 5);
            console.log("invalid characters");
            error(res, "validator");
        } else {
            next();
        }
    },
    //main check
    (req, res, next) => {
        try {
            console.log("Account check");
            //read from json file under username
            fs.readFile(path.join(__dirname, `/users/${req.body.Name}.json`), 'utf-8', (err, data) => {
                if (err) {
                    //no file found/error reading json file
                    console.log("read err no file present");
                    error(res, err);
                }
                //there is a file for user parse it
                let filedata = JSON.parse(data);
                console.log(`user: ${filedata}`);
                //engrypt and compare paswword and check with user file
                bcrypt.compare(req.body.Password, filedata.Private.password, (err, result) => {
                    if (err) {
                        //general error with bcrpyt
                        console.log("bcrypt error");
                        error(res, err);
                    }
                    //result is true if password is the same
                    if (result) {
                        //same password
                        record("logging in", req.connection.remoteAddress, 3);
                        console.log("Bcrtpy same password");
                        //create jwt
                        const token = jwt.sign({
                                securitylevel: "admin",
                                name: req.body.Name
                            }, Keys.secretkey, {
                                expiresIn: "30min"
                            })
                            //set authorization cookie with jwt
                        res.cookie("token", token, {
                            //ms
                            //30 min
                            maxAge: 1800000
                        });
                        //ajax redirect
                        console.log("redirected");
                        return res.json({
                            message: "redirect",
                            newpage: "/home"
                        });

                    } else {
                        //incorrect password
                        record("Failed login from", req.connection.remoteAddress, 3);
                        record("password attempt", req.body.Password, 3);
                        console.log("not right");
                        return res.json({
                            message: "error"
                        });
                    }
                })
            });
        } catch (errror) {
            //error up above in some statement
            console.log("other fuckin error");
            console.log(errror);
            error(res, err);
        } finally {
            //ends main segment
            next();
        }
    },
    (req, res) => {
        console.log("loggin");
        //logging pourposes

    }
);

//keep timers
app.post('/timer', (req, res, next) => { Auth(req, res, next) }, (req, res) => {
    let keysarray = Object.keys(req.body);
    let lastkeyarrayval;
    try {
        lastkeyarrayval = req.body[keysarray[(keysarray.length - 1)]][2];
        if (!validator.isWhitelisted(lastkeyarrayval, Keys.whitelist)) {
            record("Invalid Characters on backend from", req.connection.remoteAddress, 5);
            console.log("invalid character in timer post");
            error(res, "validator for timer post");
            return;
        }
    } catch {
        lastkeyarrayval = {};
    } finally {
        const timerpath = path.join(__dirname, "Private\\timers.json");
        fs.writeFile(timerpath, JSON.stringify(req.body), (err) => {
            if (err) {
                console.log(err);
                console.log("timer set failed");
                return false;
            }
            console.log('should work');
            return res.send('done');
        });
    }
});
app.get('/timer', (req, res, next) => { Auth(req, res, next) }, (req, res) => {
    const timerpath = path.join(__dirname, "Private\\timers.json");
    fs.readFile(timerpath, (err, data) => {
        if (err) {
            console.log(err);
            console.log("timer get failed");
            return false;
        }
        console.log('sent');
        console.log(JSON.parse(data));
        return res.json(JSON.parse(data));
    });
});

app.get('/userinfo', (req, res, next) => { Auth(req, res, next) }, (req, res) => {
    console.log(req.params.userData);
    const timerpath = path.join(__dirname, `users\\${req.params.userData.name}.json`);
    fs.readFile(timerpath, (err, data) => {
        if (err) {
            console.log(err);
            console.log("user get failed");
            return false;
        }
        console.log('user sent');
        console.log(JSON.parse(data));
        let obj = JSON.parse(data);
        console.log(obj.Public)
        return res.json(obj.Public);
    });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));