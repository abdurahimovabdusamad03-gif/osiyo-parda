/* Osiyo Home — admin panel */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const I = {
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2Z"/><path d="M9 9h6M9 13h6"/></svg>',
  fabric: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>',
  style: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 4h18"/><path d="M5 4c0 6 1 11 5 16M19 4c0 6-1 11-5 16"/><path d="M7.5 4v7M16.5 4v7"/></svg>',
  cat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M6 10l6-6 6 6M4 20h16"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
};
const STATUS = { new: "Yangi", contacted: "Bog'lanildi", measured: "O'lchandi", sewing: "Tikilmoqda", done: "Bajarildi", cancelled: "Bekor" };
const KIND = { tyul: "Tyul", parda: "Parda", other: "Boshqa (kalkulyatorda yo'q)" };
const AP = { both: "Tyul va parda", tyul: "Faqat tyul", parda: "Faqat parda" };

let D = null, ORDERS = [], STATS = null, me = {};
const ml = (o) => (o && typeof o === "object" ? o.uz || o.ru || o.en || "" : o || "");
const money = (n) => { const c = (D && D.settings.currency) || "so'm"; const v = Math.round(n || 0); return c === "$" || c === "USD" ? "$" + v.toLocaleString("en-US") : v.toLocaleString("ru-RU").replace(/ /g, " ") + " " + c; };
const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("on"), 2200); };

async function api(method, url, body) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  if (r.status === 401 && !url.endsWith("/login")) { loginView(); throw new Error("auth"); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || "error"), { status: r.status });
  return j;
}
async function load() {
  [D, ORDERS] = await Promise.all([api("GET", "/api/admin/data"), api("GET", "/api/admin/orders")]);
}

/* ---------- login ---------- */
function loginView(err) {
  $("#root").innerHTML = `<div class="login"><form id="lf"><img src="/img/logo.png" alt=""><h1>Admin panel</h1>
    <input class="inp" type="password" name="p" placeholder="Parol" autocomplete="current-password" autofocus>
    <div class="err">${esc(err || "")}</div><button class="btn pri block">Kirish</button>
    <a href="/" style="text-align:center;font-size:13px;color:var(--muted)">← Saytga qaytish</a></form></div>`;
  $("#lf").onsubmit = async (e) => {
    e.preventDefault();
    try { await api("POST", "/api/admin/login", { password: e.target.p.value }); start(); }
    catch (x) { loginView(x.status === 429 ? "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring." : "Parol noto'g'ri"); }
  };
}

/* ---------- shell ---------- */
const TABS = [["orders", "Buyurtmalar", I.orders], ["products", "Matolar", I.fabric], ["styles", "Fasonlar", I.style], ["categories", "Kategoriyalar", I.cat], ["settings", "Sozlamalar", I.set]];
function shell(tab, inner) {
  const nNew = ORDERS.filter((o) => o.status === "new").length;
  $("#root").innerHTML = `<header class="top"><div class="top-in"><img src="/img/logo.png" alt=""><div><b>Osiyo Home</b><small>Admin panel</small></div>
    <div class="r"><a href="/" target="_blank">Sayt ↗</a><button id="logout">Chiqish</button></div></div>
    <nav class="tabs">${TABS.map(([k, l]) => `<a href="#${k}" class="${tab === k ? "on" : ""}">${l}${k === "orders" && nNew ? ` (${nNew})` : ""}</a>`).join("")}</nav></header>
    <main class="pg">${me.default_password ? `<div class="warn-box">⚠️ Standart parol ishlatilmoqda. Sozlamalar bo'limida parolni almashtiring.</div>` : ""}${inner}</main>
    <nav class="abar">${TABS.map(([k, l, ic]) => `<a href="#${k}" class="${tab === k ? "on" : ""}">${ic}${l.split(" ")[0]}${k === "orders" && nNew ? `<span class="badge-n">${nNew}</span>` : ""}</a>`).join("")}</nav>`;
  $("#logout").onclick = async () => { await api("POST", "/api/admin/logout"); loginView(); };
}

/* ---------- orders ---------- */
let oFilter = "active";
function ordersView() {
  const now = Date.now();
  const d30 = ORDERS.filter((o) => now - new Date(o.created_at.replace(" ", "T") + "Z") < 30 * 864e5);
  const sum30 = d30.filter((o) => o.status !== "cancelled").reduce((a, o) => a + (o.total || 0), 0);
  const days = [...Array(30)].map((_, i) => { const d = new Date(now - (29 - i) * 864e5).toISOString().slice(0, 10); return d30.filter((o) => o.created_at.slice(0, 10) === d).length; });
  const mx = Math.max(1, ...days);
  const list = ORDERS.filter((o) => (oFilter === "all" ? true : oFilter === "active" ? !["done", "cancelled"].includes(o.status) : o.status === oFilter));
  const views = (STATS?.views || []).map((v) => { const p = D.products.find((x) => x.id === v.ref); return p ? `<div class="it" style="padding:8px"><img src="${esc((p.images || [])[0] || "/img/fabric.jpg")}" style="width:40px;height:40px"><div class="tx"><b>${esc(ml(p.name))}</b></div><div class="rt">${v.n} 👁</div></div>` : ""; }).join("");
  const ev = Object.fromEntries((STATS?.events || []).map((e) => [e.type, e.n]));
  return `<div class="pg-h"><h1>Buyurtmalar</h1><button class="btn line sm" id="refresh">Yangilash</button></div>
    <div class="kpis"><div class="kpi"><small>Yangi</small><b>${ORDERS.filter((o) => o.status === "new").length}</b></div><div class="kpi"><small>30 kunda buyurtma</small><b>${d30.length}</b></div>
    <div class="kpi"><small>30 kunlik summa (taxminiy)</small><b style="font-size:19px">${money(sum30)}</b></div><div class="kpi"><small>30 kunda hisoblashlar</small><b>${ev.calc || 0}</b></div></div>
    <div class="card"><h3>Oxirgi 30 kun</h3><div class="bars">${days.map((n) => `<div style="height:${(n / mx) * 100}%" title="${n}"></div>`).join("")}</div>
      <div style="display:flex;gap:14px;margin-top:10px;font-size:13px;color:var(--muted);flex-wrap:wrap"><span>📞 Qo'ng'iroq bosildi: <b>${ev.call || 0}</b></span><span>✈️ Telegram bosildi: <b>${ev.tg || 0}</b></span><span>👁 Mato ko'rildi: <b>${ev.view || 0}</b></span></div></div>
    ${views ? `<div class="card"><h3>Eng ko'p ko'rilgan matolar (30 kun)</h3><div class="list">${views}</div></div>` : ""}
    <div class="chips2" style="margin:6px 0 12px">${[["active", "Faol"], ["new", "Yangi"], ["done", "Bajarilgan"], ["cancelled", "Bekor"], ["all", "Hammasi"]].map(([k, l]) => `<button data-of="${k}" class="${oFilter === k ? "on" : ""}">${l}</button>`).join("")}</div>
    <div class="list">${list.length ? list.map((o) => `<button class="it" data-order="${o.id}"><div class="tx"><b>#${o.id} · ${esc(o.name)}</b><small>${esc(o.phone)} · ${esc(o.created_at.slice(0, 16))}</small><small>${(o.result.windows || []).length} ta deraza${o.want_visit ? " · 🏠 o'lchashga" : ""}</small></div>
      <div class="rt"><span class="st st-${o.status}">${STATUS[o.status]}</span><div style="margin-top:6px">${o.total ? money(o.total) : ""}</div></div></button>`).join("") : `<div class="empty">Buyurtmalar yo'q</div>`}</div>`;
}
function orderModal(id) {
  const o = ORDERS.find((x) => x.id === id);
  const pn = (pid) => { const p = D.products.find((x) => x.id === pid); return p ? ml(p.name) + (p.code ? ` (${p.code})` : "") : "Mato tanlanmagan"; };
  const sn = (sid) => { const s = D.styles.find((x) => x.id === sid); return s ? ml(s.name) : "—"; };
  const tel = o.phone.replace(/[^\d+]/g, "");
  openModal(`<button class="x" data-close>${I.x}</button><h3>Buyurtma #${o.id}</h3><p class="sub">${esc(o.created_at)} · til: ${esc(o.lang || "uz")}</p>
    <div class="card" style="margin-top:14px"><b style="font-size:17px">${esc(o.name)}</b><div><a href="tel:${esc(tel)}" style="color:var(--violet);font-weight:700">${esc(o.phone)}</a></div>
    ${o.address ? `<div>📍 ${esc(o.address)}</div>` : ""}${o.want_visit ? `<div>🏠 Uyga borib o'lchash so'ralgan</div>` : ""}${o.note ? `<div style="margin-top:6px">📝 ${esc(o.note)}</div>` : ""}
    <div style="display:flex;gap:8px;margin-top:12px"><a class="btn pri sm" href="tel:${esc(tel)}">Qo'ng'iroq</a><a class="btn line sm" href="https://t.me/${esc(tel)}" target="_blank">Telegram</a></div></div>
    ${(o.result.windows || []).map((w) => `<div class="ow"><b>${esc(w.name)} — ${w.width} × ${w.height} m, ${w.panels} qanot</b>${w.layers.map((l) => `<div>${l.kind === "tyul" ? "Tyul" : "Parda"}: ${esc(pn(l.product_id))}, ${esc(sn(l.style_id))} (×${l.coefficient}) — <b style="display:inline">${l.meters} m</b>${l.total ? ` · ${money(l.total)}` : ""}${l.method === "drops" ? ` · ${l.drops} bo'lak` : ""}</div>`).join("")}</div>`).join("")}
    ${o.total ? `<div style="display:flex;justify-content:space-between;font-weight:800;font-size:18px;margin-top:12px"><span>Jami</span><span>${money(o.total)}</span></div>` : ""}
    <div class="ffs" style="margin-top:16px"><label class="fl"><span>Holati</span><div class="chips2" id="ost">${Object.entries(STATUS).map(([k, l]) => `<button type="button" data-st="${k}" class="${o.status === k ? "on" : ""}">${l}</button>`).join("")}</div></label>
    <label class="fl"><span>Ichki izoh (mijoz ko'rmaydi)</span><textarea class="inp" id="anote">${esc(o.admin_note || "")}</textarea></label></div>
    <div class="foot-b"><button class="btn danger" id="odel">O'chirish</button><button class="btn pri" id="osave">Saqlash</button></div>`, true);
  let st = o.status;
  $("#ost").onclick = (e) => { const b = e.target.closest("[data-st]"); if (!b) return; st = b.dataset.st; $$("#ost button").forEach((x) => x.classList.toggle("on", x === b)); };
  $("#osave").onclick = async () => { await api("PUT", "/api/admin/orders/" + id, { status: st, admin_note: $("#anote").value }); o.status = st; o.admin_note = $("#anote").value; closeModal(); toast("Saqlandi"); render(); };
  $("#odel").onclick = async () => { if (!confirm("Buyurtmani o'chirasizmi?")) return; await api("DELETE", "/api/admin/orders/" + id); ORDERS = ORDERS.filter((x) => x.id !== id); closeModal(); render(); };
}

/* ---------- multilingual field ---------- */
function mlf(name, label, val, area, help) {
  val = val && typeof val === "object" ? val : { uz: val || "" };
  const tag = (l) => area ? `<textarea class="inp sm" data-ml="${name}" data-lang="${l}" ${l !== "uz" ? "hidden" : ""} rows="4">${esc(val[l] || "")}</textarea>` : `<input class="inp sm" data-ml="${name}" data-lang="${l}" value="${esc(val[l] || "")}" ${l !== "uz" ? "hidden" : ""}>`;
  return `<div class="fl"><span>${label}</span><div class="lt" data-lt="${name}">${["uz", "ru", "en"].map((l) => `<button type="button" data-l="${l}" class="${l === "uz" ? "on" : ""} ${!val[l] ? "miss" : ""}">${l.toUpperCase()}</button>`).join("")}</div>${["uz", "ru", "en"].map(tag).join("")}${help ? `<small>${help}</small>` : ""}</div>`;
}
document.addEventListener("input", (e) => {
  const el = e.target.closest("[data-ml]"); if (!el) return;
  const b = el.closest(".fl")?.querySelector(`.lt [data-l="${el.dataset.lang}"]`); if (b) b.classList.toggle("miss", !el.value.trim());
});
const readMl = (root, name) => Object.fromEntries($$(`[data-ml="${name}"]`, root).map((e) => [e.dataset.lang, e.value]));
document.addEventListener("click", (e) => {
  const b = e.target.closest(".lt [data-l]"); if (!b) return;
  const name = b.parentNode.dataset.lt, l = b.dataset.l, fl = b.closest(".fl");
  $$("button", b.parentNode).forEach((x) => x.classList.toggle("on", x === b));
  $$(`[data-ml="${name}"]`, fl).forEach((x) => (x.hidden = x.dataset.lang !== l));
});

/* ---------- images ---------- */
function resize(file, max = 1600) {
  return new Promise((ok, bad) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      ok(c.toDataURL("image/jpeg", 0.85)); URL.revokeObjectURL(img.src);
    };
    img.onerror = bad; img.src = URL.createObjectURL(file);
  });
}
function imgPicker(el, urls, multiple = true) {
  const draw = () => {
    el.innerHTML = urls.map((u, i) => `<div class="im"><img src="${esc(u)}" alt="">${i === 0 && multiple ? '<span class="first">Asosiy</span>' : ""}<button type="button" data-rm="${i}">${I.x}</button></div>`).join("")
      + (multiple || !urls.length ? `<label>${I.up}<span>Rasm<br>yuklash</span><input type="file" accept="image/*" ${multiple ? "multiple" : ""} hidden></label>` : "");
    const inp = $("input[type=file]", el);
    if (inp) inp.onchange = async () => {
      for (const f of inp.files) {
        try { toast("Yuklanmoqda..."); const data = await resize(f); const r = await api("POST", "/api/admin/upload", { data }); urls.push(r.url); draw(); } catch { toast("Rasm yuklanmadi"); }
      }
      toast("Yuklandi");
    };
  };
  el.onclick = (e) => { const b = e.target.closest("[data-rm]"); if (b) { urls.splice(Number(b.dataset.rm), 1); draw(); } };
  draw();
}

/* ---------- products ---------- */
let pFilter = "";
function productsView() {
  const list = D.products.filter((p) => !pFilter || p.category_id === Number(pFilter));
  return `<div class="pg-h"><h1>Matolar</h1><button class="btn pri sm" data-new-p>${I.plus}Yangi mato</button></div>
    <div class="chips2" style="margin-bottom:12px"><button data-pf="" class="${!pFilter ? "on" : ""}">Hammasi (${D.products.length})</button>${D.categories.map((c) => `<button data-pf="${c.id}" class="${Number(pFilter) === c.id ? "on" : ""}">${esc(ml(c.name))} (${D.products.filter((p) => p.category_id === c.id).length})</button>`).join("")}</div>
    <div class="list">${list.map((p) => `<button class="it ${p.active ? "" : "off"}" data-p="${p.id}"><img src="${esc((p.images || [])[0] || "/img/fabric.jpg")}" alt=""><div class="tx"><b>${esc(ml(p.name))}</b><small>${esc([p.code, p.color, p.roll_height + " m"].filter(Boolean).join(" · "))}</small><small>${p.active ? "" : "Yashirin · "}${p.in_stock ? "" : "Mavjud emas · "}${p.featured ? "★ Tanlangan" : ""}</small></div><div class="rt">${money(p.price)}<small style="display:block;color:var(--muted);font-weight:600">/ metr</small></div></button>`).join("") || `<div class="empty">Matolar yo'q</div>`}</div>`;
}
function productModal(id) {
  const p = id ? D.products.find((x) => x.id === id) : { name: {}, description: {}, images: [], price: 0, old_price: 0, roll_height: D.settings.default_roll_height || 2.8, in_stock: 1, featured: 0, active: 1, category_id: pFilter ? Number(pFilter) : (D.categories[0] || {}).id, sort: 0 };
  const imgs = [...(p.images || [])];
  openModal(`<button class="x" data-close>${I.x}</button><h3>${id ? "Matoni tahrirlash" : "Yangi mato"}</h3>
    <form class="ffs" id="pf" style="margin-top:14px">
      <div class="fl"><span>Rasmlar (birinchisi asosiy)</span><div class="imgs" id="pimgs"></div></div>
      ${mlf("name", "Nomi *", p.name)}
      <div class="row2"><label class="fl"><span>Kategoriya</span><select class="inp sm" name="category_id">${D.categories.map((c) => `<option value="${c.id}" ${p.category_id === c.id ? "selected" : ""}>${esc(ml(c.name))}</option>`).join("")}</select></label>
      <label class="fl"><span>Kod / artikul</span><input class="inp sm" name="code" value="${esc(p.code || "")}"></label></div>
      <div class="row2"><label class="fl"><span>Narx (1 metr), ${esc(D.settings.currency)}</span><input class="inp sm" name="price" inputmode="decimal" value="${p.price || ""}"></label>
      <label class="fl"><span>Eski narx (chegirma uchun)</span><input class="inp sm" name="old_price" inputmode="decimal" value="${p.old_price || ""}"></label></div>
      <label class="fl"><span>Mato balandligi (rulon eni), metr</span><input class="inp sm" name="roll_height" inputmode="decimal" value="${p.roll_height || ""}"><small>Masalan 2.8 yoki 3.0. Kalkulyator shu bilan mato butun bo'lakda yetadimi-yo'qmi hisoblaydi.</small></label>
      <div class="row2"><label class="fl"><span>Rang</span><input class="inp sm" name="color" value="${esc(p.color || "")}"></label><label class="fl"><span>Ishlab chiqarilgan</span><input class="inp sm" name="country" value="${esc(p.country || "")}"></label></div>
      <label class="fl"><span>Tarkibi</span><input class="inp sm" name="composition" value="${esc(p.composition || "")}"></label>
      ${mlf("description", "Tavsif", p.description, true)}
      <label class="sw">Saytda ko'rinsin<input type="checkbox" name="active" ${p.active ? "checked" : ""}></label>
      <label class="sw">Mavjud (sotuvda bor)<input type="checkbox" name="in_stock" ${p.in_stock ? "checked" : ""}></label>
      <label class="sw">Tanlangan (bosh sahifada)<input type="checkbox" name="featured" ${p.featured ? "checked" : ""}></label>
      <label class="fl"><span>Tartib raqami</span><input class="inp sm" name="sort" inputmode="numeric" value="${p.sort || 0}"><small>Kichik raqam oldinda turadi.</small></label>
      <div class="err" id="perr"></div>
      <div class="foot-b">${id ? '<button type="button" class="btn danger" id="pdel">O\'chirish</button>' : ""}<button class="btn pri">Saqlash</button></div>
    </form>`, true);
  imgPicker($("#pimgs"), imgs);
  $("#pf").onsubmit = async (e) => {
    e.preventDefault(); const f = e.target;
    const body = { name: readMl(f, "name"), description: readMl(f, "description"), category_id: f.category_id.value, code: f.code.value, price: num(f.price.value), old_price: num(f.old_price.value), roll_height: num(f.roll_height.value), color: f.color.value, country: f.country.value, composition: f.composition.value, images: imgs, active: f.active.checked, in_stock: f.in_stock.checked, featured: f.featured.checked, sort: num(f.sort.value) };
    if (!body.name.uz && !body.name.ru) { $("#perr").textContent = "Nomini kiriting"; return; }
    await api(id ? "PUT" : "POST", "/api/admin/products" + (id ? "/" + id : ""), body);
    await load(); closeModal(); toast("Saqlandi"); render();
  };
  if (id) $("#pdel").onclick = async () => { if (!confirm("Matoni o'chirasizmi?")) return; await api("DELETE", "/api/admin/products/" + id); await load(); closeModal(); render(); };
}
const num = (v) => Number(String(v || "").replace(/\s/g, "").replace(",", ".")) || 0;

/* ---------- styles ---------- */
function stylesView() {
  return `<div class="pg-h"><h1>Fasonlar</h1><button class="btn pri sm" data-new-s>${I.plus}Yangi fason</button></div>
    <div class="help" style="margin-bottom:12px">Koeffitsient — 1 metr karnizga necha metr mato ketishi. Masalan, lenta ×2, to'lqin ×2.5, qalin tyul ×3, rimskiy ×1.1. Kalkulyator shu raqam bilan hisoblaydi.</div>
    <div class="list">${D.styles.map((s) => `<button class="it ${s.active ? "" : "off"}" data-s="${s.id}"><img src="${esc(s.image || "/img/styles/lenta.svg")}" alt=""><div class="tx"><b>${esc(ml(s.name))}</b><small>×${s.coefficient} · ${AP[s.applies_to]}</small></div><div class="rt">${money(s.sewing_price)}<small style="display:block;color:var(--muted);font-weight:600">${s.sewing_unit === "karniz" ? "/ m karniz" : "/ m mato"}</small></div></button>`).join("")}</div>`;
}
function styleModal(id) {
  const s = id ? D.styles.find((x) => x.id === id) : { name: {}, description: {}, coefficient: 2, sewing_price: 0, sewing_unit: "meter", applies_to: "both", image: "", active: 1, sort: 0 };
  const imgs = s.image ? [s.image] : [];
  openModal(`<button class="x" data-close>${I.x}</button><h3>${id ? "Fasonni tahrirlash" : "Yangi fason"}</h3>
    <form class="ffs" id="sf" style="margin-top:14px">
      <div class="fl"><span>Rasm</span><div class="imgs" id="simg"></div></div>
      ${mlf("name", "Nomi *", s.name)}${mlf("description", "Qisqa tavsif", s.description, true)}
      <div class="row2"><label class="fl"><span>Koeffitsient (×)</span><input class="inp sm" name="coefficient" inputmode="decimal" value="${s.coefficient}"></label>
      <label class="fl"><span>Kimga</span><select class="inp sm" name="applies_to">${Object.entries(AP).map(([k, l]) => `<option value="${k}" ${s.applies_to === k ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>
      <div class="row2"><label class="fl"><span>Tikish narxi, ${esc(D.settings.currency)}</span><input class="inp sm" name="sewing_price" inputmode="decimal" value="${s.sewing_price || ""}"></label>
      <label class="fl"><span>Tikish narxi qanday</span><select class="inp sm" name="sewing_unit"><option value="meter" ${s.sewing_unit !== "karniz" ? "selected" : ""}>1 metr mato uchun</option><option value="karniz" ${s.sewing_unit === "karniz" ? "selected" : ""}>1 metr karniz uchun</option></select></label></div>
      <label class="sw">Saytda ko'rinsin<input type="checkbox" name="active" ${s.active ? "checked" : ""}></label>
      <label class="fl"><span>Tartib raqami</span><input class="inp sm" name="sort" inputmode="numeric" value="${s.sort || 0}"></label>
      <div class="foot-b">${id ? '<button type="button" class="btn danger" id="sdel">O\'chirish</button>' : ""}<button class="btn pri">Saqlash</button></div>
    </form>`, true);
  imgPicker($("#simg"), imgs, false);
  $("#sf").onsubmit = async (e) => {
    e.preventDefault(); const f = e.target;
    await api(id ? "PUT" : "POST", "/api/admin/styles" + (id ? "/" + id : ""), { name: readMl(f, "name"), description: readMl(f, "description"), coefficient: num(f.coefficient.value) || 1, applies_to: f.applies_to.value, sewing_price: num(f.sewing_price.value), sewing_unit: f.sewing_unit.value, image: imgs[0] || "", active: f.active.checked, sort: num(f.sort.value) });
    await load(); closeModal(); toast("Saqlandi"); render();
  };
  if (id) $("#sdel").onclick = async () => { if (!confirm("Fasonni o'chirasizmi?")) return; await api("DELETE", "/api/admin/styles/" + id); await load(); closeModal(); render(); };
}

/* ---------- categories ---------- */
function catsView() {
  return `<div class="pg-h"><h1>Kategoriyalar</h1><button class="btn pri sm" data-new-c>${I.plus}Yangi</button></div>
    <div class="help" style="margin-bottom:12px">Turi kalkulyator uchun muhim: "Tyul" turidagi matolar tyul qatlamida, "Parda" turidagilar parda qatlamida chiqadi.</div>
    <div class="list">${D.categories.map((c) => `<button class="it" data-c="${c.id}"><img src="${esc(c.image || ((D.products.find((p) => p.category_id === c.id) || {}).images || [])[0] || "/img/fabric.jpg")}" alt=""><div class="tx"><b>${esc(ml(c.name))}</b><small>${KIND[c.kind]} · ${D.products.filter((p) => p.category_id === c.id).length} ta mato</small></div></button>`).join("")}</div>`;
}
function catModal(id) {
  const c = id ? D.categories.find((x) => x.id === id) : { name: {}, kind: "parda", image: "", sort: D.categories.length + 1 };
  const imgs = c.image ? [c.image] : [];
  openModal(`<button class="x" data-close>${I.x}</button><h3>${id ? "Kategoriya" : "Yangi kategoriya"}</h3>
    <form class="ffs" id="cf" style="margin-top:14px"><div class="fl"><span>Muqova rasmi (ixtiyoriy)</span><div class="imgs" id="cimg"></div></div>
      ${mlf("name", "Nomi *", c.name)}
      <label class="fl"><span>Turi</span><select class="inp sm" name="kind">${Object.entries(KIND).map(([k, l]) => `<option value="${k}" ${c.kind === k ? "selected" : ""}>${l}</option>`).join("")}</select></label>
      <label class="fl"><span>Tartib raqami</span><input class="inp sm" name="sort" inputmode="numeric" value="${c.sort || 0}"></label>
      <div class="foot-b">${id ? '<button type="button" class="btn danger" id="cdel">O\'chirish</button>' : ""}<button class="btn pri">Saqlash</button></div></form>`, true);
  imgPicker($("#cimg"), imgs, false);
  $("#cf").onsubmit = async (e) => { e.preventDefault(); const f = e.target; await api(id ? "PUT" : "POST", "/api/admin/categories" + (id ? "/" + id : ""), { name: readMl(f, "name"), kind: f.kind.value, image: imgs[0] || "", sort: num(f.sort.value) }); await load(); closeModal(); toast("Saqlandi"); render(); };
  if (id) $("#cdel").onclick = async () => { if (!confirm("Kategoriyani o'chirasizmi? Undagi matolar kategoriyasiz qoladi.")) return; await api("DELETE", "/api/admin/categories/" + id); await load(); closeModal(); render(); };
}

/* ---------- settings ---------- */
function settingsView() {
  const s = D.settings;
  const n = (k, l, h) => `<label class="fl"><span>${l}</span><input class="inp sm" name="${k}" inputmode="decimal" value="${esc(s[k])}">${h ? `<small>${h}</small>` : ""}</label>`;
  const tx = (k, l, h) => `<label class="fl"><span>${l}</span><input class="inp sm" name="${k}" value="${esc(s[k] || "")}">${h ? `<small>${h}</small>` : ""}</label>`;
  return `<div class="pg-h"><h1>Sozlamalar</h1></div><form id="stf">
    <div class="card"><h3>Do'kon va aloqa</h3><div class="ffs">${tx("shop_name", "Do'kon nomi")}
      <div class="row2">${tx("phone", "Telefon")}<label class="fl"><span>Valyuta</span><select class="inp sm" name="currency">${["so'm", "$"].map((c) => `<option ${s.currency === c ? "selected" : ""}>${c}</option>`).join("")}</select></label></div>
      ${tx("telegram", "Telegram (buyurtma uchun)", "Masalan: https://t.me/abdurhimov_life")}${tx("telegram_channel", "Telegram kanal")}${tx("instagram", "Instagram")}${tx("map_url", "Xarita havolasi")}
      ${mlf("address", "Manzil", s.address)}${mlf("hours", "Ish vaqti", s.hours)}
      ${mlf("hero_title", "Bosh sahifa sarlavhasi (ixtiyoriy)", s.hero_title, false, "Bo'sh qoldirsangiz standart matn chiqadi.")}${mlf("hero_sub", "Bosh sahifa tagmatni (ixtiyoriy)", s.hero_sub, true)}</div></div>
    <div class="card"><h3>Hisoblash qoidalari</h3><div class="help" style="margin-bottom:12px">Metr = karniz × koeffitsient + chetlar. Agar mato balandligi yetmasa, bo'laklarga bo'lib hisoblanadi.</div><div class="ffs">
      <div class="row2">${n("hem_top_cm", "Tepa zapas, sm", "Lenta uchun buklama")}${n("hem_bottom_cm", "Past zapas, sm", "Faqat bo'lak usulida")}</div>
      <div class="row2">${n("side_cm", "Yon zapas (har chetga), sm")}${n("floor_gap_cm", "Poldan bo'shliq, sm")}</div>
      <div class="row2">${n("reserve_pct", "Qo'shimcha zaxira, %", "Masalan 5% — har doim biroz ko'proq")}${n("default_roll_height", "Standart mato balandligi, m", "Mato tanlanmaganda")}</div>
      ${n("default_coefficient", "Standart koeffitsient", "Fason tanlanmaganda")}</div></div>
    <div class="card"><h3>Telegram xabarnoma</h3><div class="help" style="margin-bottom:12px">1) Telegram'da @BotFather'ga /newbot yozib bot oching va tokenni shu yerga qo'ying. 2) Botingizga /start yozing. 3) @userinfobot'dan o'z ID raqamingizni oling (yoki guruh ID). Shundan keyin har bir buyurtma Telegram'ga keladi.</div><div class="ffs">
      ${tx("tg_bot_token", "Bot token")}${tx("tg_chat_id", "Chat ID")}<button type="button" class="btn line sm" id="tgtest">Sinov xabarini yuborish</button></div></div>
    <button class="btn pri block" style="margin-bottom:12px">Sozlamalarni saqlash</button></form>
    <form class="card" id="pwf"><h3>Parolni almashtirish</h3><div class="ffs"><input class="inp sm" type="password" name="cur" placeholder="Hozirgi parol" autocomplete="current-password"><input class="inp sm" type="password" name="nx" placeholder="Yangi parol (kamida 6 belgi)" autocomplete="new-password"><div class="err" id="pwerr"></div><button class="btn line">Parolni saqlash</button></div></form>`;
}
function bindSettings() {
  $("#stf").onsubmit = async (e) => {
    e.preventDefault(); const f = e.target; const b = {};
    ["shop_name", "phone", "currency", "telegram", "telegram_channel", "instagram", "map_url", "tg_bot_token", "tg_chat_id"].forEach((k) => (b[k] = f[k].value.trim()));
    ["hem_top_cm", "hem_bottom_cm", "side_cm", "floor_gap_cm", "reserve_pct", "default_roll_height", "default_coefficient"].forEach((k) => (b[k] = num(f[k].value)));
    ["address", "hours", "hero_title", "hero_sub"].forEach((k) => (b[k] = readMl(f, k)));
    await api("PUT", "/api/admin/settings", b); await load(); toast("Saqlandi");
  };
  $("#tgtest").onclick = async () => {
    try { await $("#stf").requestSubmit(); await new Promise((r) => setTimeout(r, 400)); await api("POST", "/api/admin/test-telegram"); toast("Xabar yuborildi ✅"); }
    catch (x) { toast(x.message === "empty" ? "Token va Chat ID kiriting" : "Xato: " + x.message); }
  };
  $("#pwf").onsubmit = async (e) => {
    e.preventDefault();
    try { await api("PUT", "/api/admin/password", { current: e.target.cur.value, next: e.target.nx.value }); e.target.reset(); me.default_password = false; toast("Parol almashtirildi"); render(); }
    catch (x) { $("#pwerr").textContent = x.message === "short" ? "Yangi parol kamida 6 belgi bo'lsin" : "Hozirgi parol noto'g'ri"; }
  };
}

/* ---------- modal ---------- */
function openModal(html, wide) { const m = $("#modal"); m.innerHTML = `<div class="sheet ${wide ? "wide" : ""}">${html}</div>`; m.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal() { $("#modal").classList.remove("open"); document.body.style.overflow = ""; }

/* ---------- router ---------- */
function render() {
  const tab = (location.hash.slice(1) || "orders");
  const views = { orders: ordersView, products: productsView, styles: stylesView, categories: catsView, settings: settingsView };
  shell(tab, (views[tab] || ordersView)());
  if (tab === "settings") bindSettings();
  window.scrollTo(0, 0);
}
document.addEventListener("click", async (e) => {
  const c = (s) => e.target.closest(s); let el;
  if (c("[data-close]") || e.target.id === "modal") return closeModal();
  if ((el = c("[data-order]"))) return orderModal(Number(el.dataset.order));
  if ((el = c("[data-of]"))) { oFilter = el.dataset.of; return render(); }
  if ((el = c("[data-pf]"))) { pFilter = el.dataset.pf; return render(); }
  if ((el = c("[data-p]"))) return productModal(Number(el.dataset.p));
  if (c("[data-new-p]")) return productModal(null);
  if ((el = c("[data-s]"))) return styleModal(Number(el.dataset.s));
  if (c("[data-new-s]")) return styleModal(null);
  if ((el = c("[data-c]"))) return catModal(Number(el.dataset.c));
  if (c("[data-new-c]")) return catModal(null);
  if (c("#refresh")) { await load(); STATS = await api("GET", "/api/admin/stats"); toast("Yangilandi"); return render(); }
});
window.addEventListener("hashchange", render);

async function start() {
  try { me = await api("GET", "/api/admin/me"); await load(); STATS = await api("GET", "/api/admin/stats").catch(() => null); render(); }
  catch (x) { if (x.message !== "auth") $("#root").innerHTML = '<div class="pg empty">Xatolik. Sahifani yangilang.</div>'; }
}
start();
setInterval(async () => { if (!D || document.hidden || $("#modal").classList.contains("open")) return; const n = ORDERS.length; try { ORDERS = await api("GET", "/api/admin/orders"); if (ORDERS.length > n) { toast("🔔 Yangi buyurtma!"); if ((location.hash.slice(1) || "orders") === "orders") render(); } } catch {} }, 60000);
})();
