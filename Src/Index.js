import fs from 'fs'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

const __dirname = path.resolve();
const port = 3000;
const app = express();
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.route('/')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "Main.html"));
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`));