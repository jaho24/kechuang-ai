const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
const config = fs.readFileSync('config.js', 'utf8');
const cssMark = '<link rel="stylesheet" href="styles.css" />';
const jsMark = '<script src="app.js"></script>';
const cfgMark = '<script src="config.js"></script>';
if (!html.includes(cssMark) || !html.includes(jsMark) || !html.includes(cfgMark)) {
  console.error('index.html 中未找到样式或脚本引用，无法打包');
  process.exit(1);
}
const out = html
  .replace(cssMark, '<style>\n' + css + '\n</style>')
  .replace(cfgMark, '<script>\n' + config + '\n<' + '/script>')
  .replace(jsMark, '<script>\n' + js + '\n<' + '/script>');
const dest = '会议督查督办系统.html';
fs.writeFileSync(dest, out, 'utf8');
console.log('ok', dest, fs.statSync(dest).size, 'bytes');
