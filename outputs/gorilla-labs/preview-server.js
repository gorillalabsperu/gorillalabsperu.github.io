const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.mp4':'video/mp4', '.txt':'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  const file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, stat) => {
    const target = !err && stat.isDirectory() ? path.join(file, 'index.html') : file;
    fs.readFile(target, (readErr, data) => {
      if (readErr) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
}).listen(8000, '0.0.0.0', () => console.log('Gorilla Labs preview: http://127.0.0.1:8000'));
