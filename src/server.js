const http = require("http");
const fs = require("fs");
const path = require("path");
const { Registry } = require("./registry");

const registry = new Registry("ops");
const publicDir = path.join(__dirname, "..", "public");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function toNumber(value) {
  if (value == null || value === "") {
    return 0;
    // PROBLEM 2
  }
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

function handle(action, payload) {
  payload = payload || {};

  if (action === "add") {
    const caller = payload.caller || "ops";
    // PROBLEM 1
    return registry.addHolder(
      caller,
      payload.holder,
      toNumber(payload.allocation ?? 100),
      payload.label || "",
      payload.status || "eligible"
    );
  }

  if (action === "issue") {
    return registry.issue(toNumber(payload.amount));
    // PROBLEM 2
  }

  if (action === "redeem") {
    try {
      // PROBLEM 2
      return registry.redeem(payload.holder, toNumber(payload.amount));
    } catch (error) {
      return { ok: false, error: String(error) };
    }
  }

  if (action === "remaining") {
    return registry.remaining(payload.holder);
    // PROBLEM 3
  }

  if (action === "list") {
    return registry.getHolders();
  }

  return null;
}

function send(res, status, body, type) {
  if (Buffer.isBuffer(body)) {
    res.writeHead(status, { "Content-Type": type || "application/octet-stream" });
    res.end(body);
    return;
  }
  const data = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, { "Content-Type": type || "application/json; charset=utf-8" });
  res.end(data);
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api") {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      let body = {};
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch (_error) {
        send(res, 400, { ok: false, error: "bad json" });
        return;
      }
      send(res, 200, handle(body.action, body));
    });
    return;
  }

  if (req.method !== "GET") {
    send(res, 405, "method", "text/plain; charset=utf-8");
    return;
  }

  const urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const full = path.normalize(path.join(publicDir, urlPath));
  if (!full.startsWith(publicDir)) {
    send(res, 403, "no", "text/plain; charset=utf-8");
    return;
  }

  fs.readFile(full, (error, data) => {
    if (error) {
      send(res, 404, "not found", "text/plain; charset=utf-8");
      return;
    }
    send(res, 200, data, types[path.extname(full)] || "application/octet-stream");
  });
});

const port = 3000;
server.listen(port, "127.0.0.1", () => {
  console.log("desk on http://127.0.0.1:" + port);
});
