const fs = require('fs');
let content = fs.readFileSync('D:/vex/vex3.min.js', 'utf8');

// Thay thế tất cả việc đọc/ghi thuộc tính của this.currentConfig bằng (this.currentConfig||{}).
content = content.replace(/this\.currentConfig\.([a-zA-Z0-9_]+)/g, '(this.currentConfig||{}).$1');

fs.writeFileSync('D:/vex/vex3.min.js', content, 'utf8');
console.log('Successfully patched all currentConfig accesses.');
