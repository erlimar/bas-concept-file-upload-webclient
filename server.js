const path = require('path');
const fs = require('fs');
const http = require('http');

const APP_HOSTNAME = '127.0.0.1';
const APP_PORT = process.env.PORT || 3000;

function writeResult(res, code, message) {
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(code || 500);
    res.end(message || 'Internal Server Error');
}

const server = http.createServer((req, res) => {

    if (req.method !== 'GET') {
        writeResult(res, 400, 'Bad Request!');
        return;
    }

    let filePath = './public' + (
        req.url === '/'
            ? '/index.html'
            : req.url);

    fs.exists(filePath, (exists) => {

        if (!exists) {
            writeResult(res, 404, 'Not found');
            return;
        }

        fs.stat(filePath, function (error, stat) {
            let readStream;

            if (error) {
                writeResult(res);
                return;
            }

            if (stat.isDirectory()) {
                writeResult(res, 403, 'Forbidden');
                return;
            }

            readStream = fs.createReadStream(filePath);
            readStream.on('error', writeResult);
            res.writeHead(200);
            readStream.pipe(res);
        });
    });
});

server.listen(APP_PORT, APP_HOSTNAME, () => {
    console.log(`Listening on port ${APP_PORT}...`);
})