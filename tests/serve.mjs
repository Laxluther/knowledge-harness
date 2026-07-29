/* Minimal static file server for the test suite.
   Serves the repo root so the site is driven exactly as deployed. */
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const PORT = Number(process.env.PORT || 8787);
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

export function start(port = PORT) {
  const server = http.createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p.endsWith("/")) p += "index.html";
      const full = normalize(join(ROOT, p));
      if (!full.startsWith(ROOT)) {
        res.writeHead(403).end();
        return;
      }
      const body = await readFile(full);
      res.writeHead(200, { "Content-Type": TYPES[extname(full)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

// Standalone: `node tests/serve.mjs`
if (process.argv[1] && normalize(fileURLToPath(import.meta.url)) === normalize(process.argv[1])) {
  start().then(() => console.log(`serving ${ROOT} at http://127.0.0.1:${PORT}`));
}
