const fs = require("fs");
const p = __dirname;
let html = fs.readFileSync(p + "/index.html", "utf8");
const css = fs.readFileSync(p + "/styles.css", "utf8");
const store = fs.readFileSync(p + "/store.js", "utf8");
const app = fs.readFileSync(p + "/app.js", "utf8");
html = html.replace(
  '<link rel="stylesheet" href="styles.css" />',
  "<style>\n" + css + "\n</style>"
);
html = html.replace(
  '<script src="store.js"></script>\n  <script src="app.js"></script>',
  "<script>\n" + store + "\n</script>\n<script>\n" + app + "\n</script>"
);
const out = p + "/安全生产看板.html";
fs.writeFileSync(out, html, "utf8");
console.log("wrote", out, fs.statSync(out).size);
