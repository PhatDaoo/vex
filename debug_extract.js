const fs = require('fs');
const text = fs.readFileSync('D:/vex/vex3.min.js', 'utf8');
console.log(text.substring(text.length - 1000));
