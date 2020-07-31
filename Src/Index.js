import fs from 'fs'
import path from 'path'
const __dirname = path.resolve();
import express from 'express'

const app = express()
const port = 3000

import bodyParser from 'body-parser'
app.use(bodyParser.json());

app.route('/')
    .get((req, res) => {
        console.log(path.join(__dirname, "Main.html"));
        res.sendFile(path.join(__dirname, "Main.html"));
    })
    .post((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    })

app.get('/file/js/:id', (req, res) => {
    switch (req.params.id) {
        case 0:
            res.sendFile(path.join(__dirname, "GlobalJavascript.js"));
            break;
    }
});
app.get('/file/css/:id', (req, res) => {
    switch (req.params.id) {
        case 0:
            res.sendFile(path.join(__dirname, "GlobalCSS.css"));
            break;
    }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))