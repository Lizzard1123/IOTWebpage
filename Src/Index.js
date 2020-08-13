import fs from 'fs'
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const apiKey = '46090bba-0f08-4505-bb94-0a945b51a614';
const __dirname = path.resolve();
const port = 3000;
const app = express();

const secretkey = "10202004";

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/privatestatic', [(err, req, res, next) => { Auth(req, res, next) }, express.static('Private')]);
app.use('/publicstatic', express.static('public'));

function error(res, err = "default") {
    console.log("error message lolzies fuck you");
    console.log(err);
    res.sendStatus(401).end();
}
//userinfo


//auth function
function Auth(req, res, next) {
    console.log("Authenticating");
    try {
        let decoded = jwt.verify(req.cookies.token, secretkey);
        req.userData = decoded;
        next();
    } catch (err) {
        error(res, err);
    }

}
//get login page
app.get('/login', (req, res) => {
    console.log("login path freebie");
    res.sendFile(path.join(__dirname, "Auth.html"));
});

app.get('/home', (req, res, next) => { Auth(req, res, next) }, (req, res) => {
    console.log("home path auth");
    res.sendFile(path.join(__dirname, "Main.html"));
});

app.post('/login', (req, res, next) => {
        console.log("Authenticating white");
        //authentication
        next();
    },
    (req, res, next) => {
        try {
            console.log("Account check");

            fs.readFile(path.join(__dirname, `/users/${req.body.Name}.json`), 'utf-8', (err, data) => {
                if (err) {
                    console.log("read err");
                    error(res, err);
                    return;
                }
                let filedata = JSON.parse(data);
                console.log(`user: ${filedata}`);
                //there is a file for user
                bcrypt.compare(req.body.Password, filedata.password, (err, result) => {
                    if (err) {
                        //general error with bcrpyt
                        console.log("bcrypt error");
                        error(res, err);
                        return;
                    }
                    if (result) {
                        //same password
                        console.log("Bcrtpy same password");
                        const token = jwt.sign({
                            securitylevel: "admin"
                        }, secretkey, {
                            expiresIn: "1h"
                        })
                        res.cookie("token", token, {
                            maxAge: 60000
                        });
                        res.redirect(302, '/home');
                        console.log("redirected");
                    } else {
                        console.log("not right");
                        error(res, err);
                        return;
                    }
                })
            });
        } catch (errror) {
            console.log("other fuckin error");
            console.log(errror);
            error(errror, res);
            return;
        } finally {
            next();
        }
    },
    (req, res) => {
        console.log("loggin");
        //logging

    }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));