const fs = require('fs');
let content = fs.readFileSync('D:/vex/vex3.min.js', 'utf8');

const target = 'return void console.warn(\'Audio key "\'+e+\'" missing from cache\')';
const replacement = '(this.audioBuffer=t.context.createBuffer(1,1,22050))';

if (content.includes(target)) {
    content = content.split(target).join(replacement);
    fs.writeFileSync('D:/vex/vex3.min.js', content, 'utf8');
    console.log('Successfully replaced warning with silent buffer creation.');
} else {
    console.log('Target not found.');
}
