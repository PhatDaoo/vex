const fs = require('fs');
let content = fs.readFileSync('D:/vex/vex3.min.js', 'utf8');
const target = `throw new Error('Audio key "'+e+'" missing from cache')`;
const replacement = `return void console.warn('Audio key "'+e+'" missing from cache')`;
if (content.includes(target)) {
    content = content.split(target).join(replacement);
    fs.writeFileSync('D:/vex/vex3.min.js', content, 'utf8');
    console.log('Successfully replaced all occurrences.');
} else {
    console.log('Target not found.');
}
