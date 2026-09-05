const fs = require('fs');
let content = fs.readFileSync('D:/vex/vex3.min.js', 'utf8');

const target = 'resetConfig:function(){this.currentConfig.seek=0,this.currentConfig.delay=0}';
const replacement = 'resetConfig:function(){this.currentConfig&&(this.currentConfig.seek=0,this.currentConfig.delay=0)}';

if (content.includes(target)) {
    content = content.split(target).join(replacement);
    fs.writeFileSync('D:/vex/vex3.min.js', content, 'utf8');
    console.log('Successfully replaced resetConfig');
} else {
    console.log('resetConfig Target not found.');
}
