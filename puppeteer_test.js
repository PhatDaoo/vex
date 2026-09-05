const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    let filePath = path.join('D:/vex', reqUrl === '/' ? '/index.html' : reqUrl);
    
    // Some games try to load from root, so fallback to local if needed
    if (!fs.existsSync(filePath)) {
        console.log("SERVER 404:", filePath);
        res.writeHead(404);
        res.end('Not found');
        return;
    }
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.json') contentType = 'application/json';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.wav') contentType = 'audio/wav';
    if (ext === '.mp3') contentType = 'audio/mpeg';
    if (ext === '.ogg') contentType = 'audio/ogg';
    
    fs.readFile(filePath, (err, content) => {
        if (err) { res.writeHead(500); res.end(); }
        else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content); }
    });
});

server.listen(8080, async () => {
    console.log('Server running on 8080');
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
        page.on('response', response => {
            if (!response.ok()) {
                console.log('RESPONSE FAILED:', response.status(), response.url());
            }
        });
        
        await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
        await browser.close();
    } catch (e) {
        console.error(e);
    }
    server.close();
});
