// Winear.me - tiny static file server, no dependencies.
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, "http://x").pathname); }
  catch { res.writeHead(400); return res.end("Bad request"); }
  if (p.endsWith("/")) p += "index.html";
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) {
      // unknown paths fall back to the map page
      return fs.readFile(path.join(ROOT, "index.html"), (e2, html) => {
        if (e2) { res.writeHead(404); return res.end("Not found"); }
        res.writeHead(200, { "Content-Type": TYPES[".html"] }); res.end(html);
      });
    }
    const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    const headers = { "Content-Type": type, "Cache-Control": type.startsWith("text/html") ? "no-cache" : "public, max-age=86400" };
    if (/\bgzip\b/.test(req.headers["accept-encoding"] || "") && /json|javascript|css|html/.test(type)) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers); return res.end(zlib.gzipSync(data));
    }
    res.writeHead(200, headers); res.end(data);
  });
}).listen(PORT, () => console.log("Winear.me running on port " + PORT));
