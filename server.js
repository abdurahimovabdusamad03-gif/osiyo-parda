// Osiyo Home Collection — parda sayti serveri (Node 22, tashqi kutubxonasiz)
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { db, UPLOAD_DIR, getSettings, setSettings, parse, P_FIELDS, S_FIELDS } = require("./lib/db");
const { calculate } = require("./lib/calc");

const PORT = Number(process.env.PORT) || 3000;
const PUB = path.join(__dirname, "public");

/* ---------- auth ---------- */
function secret() {
  let s = getSettings(true).session_secret;
  if (!s) { s = crypto.randomBytes(32).toString("hex"); setSettings({ session_secret: s }); }
  return process.env.SESSION_SECRET || s;
}
function hashPw(pw, salt = crypto.randomBytes(16).toString("hex")) {
  return salt + ":" + crypto.scryptSync(String(pw), salt, 32).toString("hex");
}
function checkPw(pw) {
  const stored = getSettings(true).admin_hash;
  if (stored) {
    const [salt, h] = stored.split(":");
    const t = crypto.scryptSync(String(pw), salt, 32).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(t), Buffer.from(h));
  }
  const def = process.env.ADMIN_PASSWORD || "osiyo2011";
  return String(pw) === def;
}
function sign(payload) {
  const b = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return b + "." + crypto.createHmac("sha256", secret()).update(b).digest("base64url");
}
function verify(tok) {
  if (!tok || !tok.includes(".")) return null;
  const [b, sig] = tok.split(".");
  const good = crypto.createHmac("sha256", secret()).update(b).digest("base64url");
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  const p = JSON.parse(Buffer.from(b, "base64url").toString());
  return p.exp > Date.now() ? p : null;
}
const cookies = (req) => Object.fromEntries((req.headers.cookie || "").split(";").map((c) => c.trim().split("=")).filter((x) => x[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join("="))]));
const isAdmin = (req) => !!verify(cookies(req).sid);
const attempts = new Map();

/* ---------- helpers ---------- */
function send(res, code, data, headers = {}) {
  const body = typeof data === "string" || Buffer.isBuffer(data) ? data : JSON.stringify(data);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  res.end(body);
}
function body(req, limit = 12e6) {
  return new Promise((ok, bad) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > limit) { bad(new Error("too_large")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => { try { ok(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}); } catch { bad(new Error("bad_json")); } });
  });
}
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4", ".json": "application/json", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };
function serveFile(res, file, cache = "public, max-age=300") {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, { error: "not_found" });
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": cache });
    fs.createReadStream(file).pipe(res);
  });
}
const safeJoin = (base, p) => { const f = path.normalize(path.join(base, p)); return f.startsWith(base) ? f : null; };
const txt = (v, max = 2000) => String(v ?? "").trim().slice(0, max);
const ml = (v) => { const o = v && typeof v === "object" ? v : { uz: v }; return JSON.stringify({ uz: txt(o.uz, 5000), ru: txt(o.ru, 5000), en: txt(o.en, 5000) }); };
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

function catalog(all = false) {
  const w = all ? "" : " WHERE active=1";
  const categories = db.prepare("SELECT * FROM categories ORDER BY sort, id").all().map((r) => parse(r, ["name"]));
  const products = db.prepare("SELECT * FROM products" + w + " ORDER BY sort, id DESC").all().map((r) => parse(r, P_FIELDS));
  const styles = db.prepare("SELECT * FROM styles" + w + " ORDER BY sort, id").all().map((r) => parse(r, S_FIELDS));
  return { categories, products, styles };
}
function calcFor(windows) {
  const c = catalog(true);
  const map = (a) => Object.fromEntries(a.map((x) => [x.id, x]));
  return calculate(windows, { products: map(c.products), styles: map(c.styles) }, getSettings());
}

async function telegram(order, result) {
  const s = getSettings(true);
  if (!s.tg_bot_token || !s.tg_chat_id) return;
  const c = catalog(true);
  const pn = (id) => { const p = c.products.find((x) => x.id === id); return p ? p.name.uz : "—"; };
  const sn = (id) => { const p = c.styles.find((x) => x.id === id); return p ? p.name.uz : "—"; };
  const f = (n) => Math.round(n).toLocaleString("ru-RU").replace(/ /g, " ");
  let t = `🧵 Yangi buyurtma #${order.id}\n👤 ${order.name}\n📞 ${order.phone}\n`;
  if (order.address) t += `📍 ${order.address}\n`;
  t += order.want_visit ? "🏠 Uyga borib o'lchash kerak\n" : "";
  result.windows.forEach((w) => {
    t += `\n▫️ ${w.name}: ${w.width} × ${w.height} m\n`;
    w.layers.forEach((l) => { t += `   ${l.kind}: ${pn(l.product_id)}, ${sn(l.style_id)} — ${l.meters} m${l.total ? `, ${f(l.total)} ${s.currency}` : ""}\n`; });
  });
  if (result.total) t += `\n💰 Jami: ${f(result.total)} ${s.currency}`;
  if (order.note) t += `\n📝 ${order.note}`;
  try {
    await fetch(`https://api.telegram.org/bot${s.tg_bot_token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: s.tg_chat_id, text: t }) });
  } catch (e) { console.error("telegram:", e.message); }
}

/* ---------- CRUD ---------- */
const TABLES = {
  products: {
    fields: (b) => ({ category_id: b.category_id ? num(b.category_id) : null, name: ml(b.name), description: ml(b.description), code: txt(b.code, 60), price: num(b.price), old_price: num(b.old_price), roll_height: num(b.roll_height, 2.8), color: txt(b.color, 80), composition: txt(b.composition, 120), country: txt(b.country, 60), images: JSON.stringify((Array.isArray(b.images) ? b.images : []).map((x) => txt(x, 300)).slice(0, 12)), in_stock: b.in_stock ? 1 : 0, featured: b.featured ? 1 : 0, active: b.active === false ? 0 : 1, sort: num(b.sort) }),
  },
  categories: { fields: (b) => ({ name: ml(b.name), kind: ["tyul", "parda", "other"].includes(b.kind) ? b.kind : "parda", image: txt(b.image, 300), sort: num(b.sort) }) },
  styles: { fields: (b) => ({ name: ml(b.name), description: ml(b.description), coefficient: num(b.coefficient, 2), sewing_price: num(b.sewing_price), sewing_unit: b.sewing_unit === "karniz" ? "karniz" : "meter", applies_to: ["tyul", "parda", "both"].includes(b.applies_to) ? b.applies_to : "both", image: txt(b.image, 300), active: b.active === false ? 0 : 1, sort: num(b.sort) }) },
};
function upsert(table, id, b) {
  const f = TABLES[table].fields(b);
  const keys = Object.keys(f);
  if (id) {
    db.prepare(`UPDATE ${table} SET ${keys.map((k) => k + "=?").join(",")} WHERE id=?`).run(...keys.map((k) => f[k]), id);
    return id;
  }
  return Number(db.prepare(`INSERT INTO ${table}(${keys.join(",")}) VALUES(${keys.map(() => "?").join(",")})`).run(...keys.map((k) => f[k])).lastInsertRowid);
}

/* ---------- router ---------- */
async function api(req, res, url) {
  const p = url.pathname, m = req.method;

  if (p === "/api/public" && m === "GET") return send(res, 200, { settings: getSettings(), ...catalog() });

  if (p === "/api/calc" && m === "POST") { const b = await body(req); return send(res, 200, calcFor(b.windows)); }

  if (p === "/api/event" && m === "POST") {
    const b = await body(req, 2000);
    if (["view", "calc", "call", "tg"].includes(b.type)) db.prepare("INSERT INTO events(type,ref) VALUES(?,?)").run(b.type, b.ref ? num(b.ref) : null);
    return send(res, 200, { ok: true });
  }

  if (p === "/api/orders" && m === "POST") {
    const b = await body(req, 200000);
    const name = txt(b.name, 120), phone = txt(b.phone, 40);
    if (!name || phone.replace(/\D/g, "").length < 7) return send(res, 400, { error: "name_phone" });
    const windows = (Array.isArray(b.windows) ? b.windows : []).slice(0, 30);
    const result = calcFor(windows);
    const r = db.prepare("INSERT INTO orders(name,phone,address,note,lang,want_visit,windows,result,total) VALUES(?,?,?,?,?,?,?,?,?)")
      .run(name, phone, txt(b.address, 300), txt(b.note, 1500), txt(b.lang, 4), b.want_visit ? 1 : 0, JSON.stringify(windows), JSON.stringify(result), result.total);
    const order = { id: Number(r.lastInsertRowid), name, phone, address: txt(b.address, 300), note: txt(b.note, 1500), want_visit: !!b.want_visit };
    telegram(order, result);
    return send(res, 200, { ok: true, id: order.id });
  }

  /* --- admin --- */
  if (p === "/api/admin/login" && m === "POST") {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const a = attempts.get(ip) || { n: 0, t: Date.now() };
    if (Date.now() - a.t > 15 * 60e3) { a.n = 0; a.t = Date.now(); }
    if (a.n >= 8) return send(res, 429, { error: "too_many" });
    const b = await body(req, 2000);
    if (!checkPw(b.password)) { a.n++; attempts.set(ip, a); return send(res, 401, { error: "wrong" }); }
    attempts.delete(ip);
    const secure = (req.headers["x-forwarded-proto"] || "").includes("https") ? "; Secure" : "";
    return send(res, 200, { ok: true }, { "Set-Cookie": `sid=${sign({ exp: Date.now() + 30 * 864e5 })}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${30 * 86400}${secure}` });
  }
  if (p === "/api/admin/logout") return send(res, 200, { ok: true }, { "Set-Cookie": "sid=; Path=/; Max-Age=0" });
  if (!p.startsWith("/api/admin/")) return send(res, 404, { error: "not_found" });
  if (!isAdmin(req)) return send(res, 401, { error: "auth" });

  if (p === "/api/admin/me") return send(res, 200, { ok: true, default_password: !getSettings(true).admin_hash && !process.env.ADMIN_PASSWORD });
  if (p === "/api/admin/data" && m === "GET") {
    const s = getSettings(true); delete s.session_secret; delete s.admin_hash;
    return send(res, 200, { settings: s, ...catalog(true) });
  }
  if (p === "/api/admin/settings" && m === "PUT") {
    const b = await body(req, 100000);
    const allowed = ["shop_name", "currency", "phone", "telegram", "telegram_channel", "instagram", "address", "map_url", "hours", "hem_top_cm", "hem_bottom_cm", "side_cm", "floor_gap_cm", "reserve_pct", "default_roll_height", "default_coefficient", "tg_bot_token", "tg_chat_id", "hero_title", "hero_sub"];
    const numeric = ["hem_top_cm", "hem_bottom_cm", "side_cm", "floor_gap_cm", "reserve_pct", "default_roll_height", "default_coefficient"];
    const out = {};
    for (const k of allowed) if (k in b) out[k] = numeric.includes(k) ? num(b[k]) : b[k] && typeof b[k] === "object" ? JSON.parse(ml(b[k])) : txt(b[k], 500);
    setSettings(out);
    return send(res, 200, { ok: true });
  }
  if (p === "/api/admin/password" && m === "PUT") {
    const b = await body(req, 2000);
    if (!checkPw(b.current)) return send(res, 400, { error: "wrong" });
    if (String(b.next || "").length < 6) return send(res, 400, { error: "short" });
    setSettings({ admin_hash: hashPw(b.next) });
    return send(res, 200, { ok: true });
  }
  if (p === "/api/admin/test-telegram" && m === "POST") {
    const s = getSettings(true);
    if (!s.tg_bot_token || !s.tg_chat_id) return send(res, 400, { error: "empty" });
    try {
      const r = await fetch(`https://api.telegram.org/bot${s.tg_bot_token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: s.tg_chat_id, text: "✅ Osiyo Home sayti Telegram'ga ulandi" }) });
      const j = await r.json();
      return send(res, j.ok ? 200 : 400, j.ok ? { ok: true } : { error: j.description || "tg" });
    } catch (e) { return send(res, 400, { error: e.message }); }
  }
  if (p === "/api/admin/upload" && m === "POST") {
    const b = await body(req);
    const mt = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(b.data || "");
    if (!mt) return send(res, 400, { error: "image" });
    const name = Date.now().toString(36) + crypto.randomBytes(4).toString("hex") + "." + (mt[1] === "jpeg" ? "jpg" : mt[1]);
    fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(mt[2], "base64"));
    return send(res, 200, { url: "/uploads/" + name });
  }
  const crud = /^\/api\/admin\/(products|categories|styles)(?:\/(\d+))?$/.exec(p);
  if (crud) {
    const [, table, id] = crud;
    if (m === "POST" || m === "PUT") { const nid = upsert(table, id ? Number(id) : null, await body(req, 200000)); return send(res, 200, { ok: true, id: nid }); }
    if (m === "DELETE" && id) { db.prepare(`DELETE FROM ${table} WHERE id=?`).run(Number(id)); return send(res, 200, { ok: true }); }
  }
  if (p === "/api/admin/orders" && m === "GET") {
    const rows = db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 500").all().map((r) => parse(r, ["windows", "result"]));
    return send(res, 200, rows);
  }
  const om = /^\/api\/admin\/orders\/(\d+)$/.exec(p);
  if (om && m === "PUT") {
    const b = await body(req, 10000);
    const st = ["new", "contacted", "measured", "sewing", "done", "cancelled"].includes(b.status) ? b.status : "new";
    db.prepare("UPDATE orders SET status=?, admin_note=? WHERE id=?").run(st, txt(b.admin_note, 2000), Number(om[1]));
    return send(res, 200, { ok: true });
  }
  if (om && m === "DELETE") { db.prepare("DELETE FROM orders WHERE id=?").run(Number(om[1])); return send(res, 200, { ok: true }); }
  if (p === "/api/admin/stats" && m === "GET") {
    const q = (sql, ...a) => db.prepare(sql).all(...a);
    return send(res, 200, {
      orders_by_status: q("SELECT status, COUNT(*) n, SUM(total) sum FROM orders GROUP BY status"),
      orders_30d: q("SELECT date(created_at) d, COUNT(*) n, SUM(total) sum FROM orders WHERE created_at >= datetime('now','-30 days') GROUP BY d ORDER BY d"),
      views: q("SELECT ref, COUNT(*) n FROM events WHERE type='view' AND at >= datetime('now','-30 days') GROUP BY ref ORDER BY n DESC LIMIT 10"),
      events: q("SELECT type, COUNT(*) n FROM events WHERE at >= datetime('now','-30 days') GROUP BY type"),
      ordered: q("SELECT result FROM orders WHERE created_at >= datetime('now','-90 days')").map((r) => r.result),
    });
  }
  return send(res, 404, { error: "not_found" });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  try {
    if (url.pathname.startsWith("/api/")) return await api(req, res, url);
    if (url.pathname === "/calc.js") return serveFile(res, path.join(__dirname, "lib", "calc.js"));
    if (url.pathname.startsWith("/uploads/")) { const f = safeJoin(UPLOAD_DIR, url.pathname.slice(9)); return f ? serveFile(res, f, "public, max-age=2592000, immutable") : send(res, 404, {}); }
    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      const f = safeJoin(PUB, url.pathname);
      if (f && fs.existsSync(f) && fs.statSync(f).isFile()) return serveFile(res, f);
      return serveFile(res, path.join(PUB, "admin", "index.html"), "no-cache");
    }
    const f = safeJoin(PUB, url.pathname === "/" ? "index.html" : url.pathname);
    if (f && fs.existsSync(f) && fs.statSync(f).isFile()) return serveFile(res, f, f.endsWith(".html") ? "no-cache" : "public, max-age=300");
    return serveFile(res, path.join(PUB, "index.html"), "no-cache");
  } catch (e) {
    console.error(e);
    send(res, e.message === "too_large" ? 413 : 400, { error: e.message });
  }
}).listen(PORT, () => console.log("Osiyo parda sayti: http://localhost:" + PORT));
