import fs from 'fs';

const filePath = 'dist/index.js';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.startsWith('#!/usr/bin/env node')) {
	content = '#!/usr/bin/env node\n' + content;
	fs.writeFileSync(filePath, content);
}

fs.chmodSync(filePath, '755');
console.log('Added shebang and set permissions');
