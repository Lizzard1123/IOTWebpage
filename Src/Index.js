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
const whitelist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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
        res.redirect(302, '/login');
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
        console.log("Authenticating with whitelist");
        //request to login
        //check validity again through whitelist
        if (!validator.isWhitelisted(req.body.Password, whitelist)) {
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
                    return;
                }
                //there is a file for user parse it
                let filedata = JSON.parse(data);
                console.log(`user: ${filedata}`);
                //engrypt and compare paswword and check with user file
                bcrypt.compare(req.body.Password, filedata.password, (err, result) => {
                    if (err) {
                        //general error with bcrpyt
                        console.log("bcrypt error");
                        error(res, err);
                        return;
                    }
                    //result is true if password is the same
                    if (result) {
                        //same password
                        console.log("Bcrtpy same password");
                        //create jwt
                        const token = jwt.sign({
                                securitylevel: "admin"
                            }, secretkey, {
                                expiresIn: "1h"
                            })
                            //set authorization cookie with jwt
                        res.cookie("token", token, {
                            //ms
                            //30 min
                            maxAge: 1800000
                        });
                        //redirect to home page
                        res.redirect(302, '/home');
                        console.log("redirected");
                    } else {
                        //incorrect password
                        console.log("not right");
                        error(res, err);
                        return;
                    }
                })
            });
        } catch (errror) {
            //error up above in some statement
            console.log("other fuckin error");
            console.log(errror);
            error(errror, res);
            return;
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));