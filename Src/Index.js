import fs from 'fs'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import validator from 'validator'

const apiKey = '46090bba-0f08-4505-bb94-0a945b51a614';
const __dirname = path.resolve();
const port = 3000;
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static('public'));


app.route('/login')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "Auth.html"));
    })
    .post((req, res) => {
        console.log(req);
        res.send(JSON.stringify({
            Name: req.body.Name || null,
            Password: req.body.Password || null
        }));
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`));