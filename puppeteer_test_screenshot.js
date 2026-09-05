const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    let filePath = path.join('D:/vex', reqUrl === '/' ? '/index.html' : reqUrl);
    if (!fs.existsSync(filePath)) {
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
        await page.setViewport({ width: 800, height: 600 });
        
        await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait 3 seconds
        await new Promise(r => setTimeout(r, 3000));
        
        await page.screenshot({ path: 'D:/vex/screenshot.png' });
        console.log('Screenshot saved to D:/vex/screenshot.png');
        await browser.close();
    } catch (e) {
        console.error(e);
    }
    server.close();
});
