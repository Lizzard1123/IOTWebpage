/*import fs from 'fs'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
const __dirname = path.resolve();
const port = 3000;
const app = express();
app.use(bodyParser.json());
*/
const apiKey = '7b680d37f077e26a7117832bf236f2a8';
const lat = 33.3168;
const lon = -84.4406;
import https from 'https';

console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=
${lon}&exclude={}&appid=${apiKey}`);

https.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=
${lon}&exclude={}&appid=${apiKey}`, (response) => {
    let todo = '';

    // called when a data chunk is received.
    response.on('data', (chunk) => {
        todo += chunk;
    });

    // called when the complete response is received.
    response.on('end', () => {
        console.log(JSON.parse(todo));
    });

}).on("error", (error) => {
    console.log("Error: " + error.message);
});