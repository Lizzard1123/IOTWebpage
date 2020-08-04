import fs from 'fs'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

const apiKey = '46090bba-0f08-4505-bb94-0a945b51a614';
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