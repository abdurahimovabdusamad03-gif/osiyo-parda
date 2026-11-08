/* Osiyo Home Collection — mijozlar sayti */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };

/* ---------- i18n ---------- */
const T = {
  uz: {
    home: "Bosh sahifa", catalog: "Katalog", styles: "Fasonlar", calc: "Kalkulyator", contact: "Aloqa", calcShort: "Hisoblash",
    heroEye: "2011 yildan beri", heroT: "Uyingizga <em>nafislik</em> olib kiramiz", heroS: "Turkiya va Xitoyning eng sifatli parda matolari. Onlayn hisoblang yoki 24/7 uyingizga borib o'lchaymiz.",
    calcBtn: "Narxni hisoblash", catBtn: "Katalogni ko'rish", stYears: "yillik tajriba", stFab: "mato turi", st247: "uyga borib o'lchash",
    bandT: "Uyingizga borib buyurtma olamiz", bandS: "Kechasi ham, dam olish kunlari ham. Namunalarni olib boramiz, joyida o'lchab, narxini aytamiz.", live: "Hozir ham qabul qilamiz", call: "Qo'ng'iroq", tg: "Telegram",
    catsT: "Mato <em>turlari</em>", allProducts: "Barchasi", featT: "Tanlangan <em>matolar</em>", seeAll: "Hammasi →",
    howT: "Qanday <em>ishlaymiz</em>", how: [["Tanlang", "Katalogdan mato va fason tanlang yoki bizga yozing."], ["Hisoblang", "Kalkulyator kerakli metr va narxni darhol chiqaradi."], ["O'lchaymiz", "Namunalar bilan uyingizga boramiz va aniq o'lchaymiz."], ["Tikib o'rnatamiz", "Pardani tikib, karnizga osib beramiz."]],
    worksT: "Bizning <em>ishlarimiz</em>", aiBadge: "Tez kunda", aiT: "AI dizayner", aiS: "Sun'iy intellekt sizga parda tanlashda yordam beradi:", ai: ["Xona rasmini yuklang — rang va fason bo'yicha maslahat oling", "Mato rasmini yuboring — AI shu matodan parda dizaynini chizib beradi", "Savollaringizga istalgan vaqtda javob beradi"],
    visitL: "Do'konimiz", map: "Xaritada ochish", hoursL: "Ish vaqti",
    search: "Qidirish...", sortDef: "Saralash", sortLow: "Arzonroq", sortHigh: "Qimmatroq", noRes: "Hech narsa topilmadi", perM: "/ metr", height: "Balandligi", color: "Rang", comp: "Tarkibi", country: "Ishlab chiqarilgan", code: "Kod", inStock: "Mavjud", outStock: "Hozircha yo'q", new: "Yangi", sale: "Chegirma", top: "Top",
    calcWith: "Shu mato bilan hisoblash", askTg: "Telegram'da so'rash", stylesT: "Parda <em>fasonlari</em>", stylesS: "Fason qancha mato ketishini belgilaydi: burma qanchalik zich bo'lsa, shuncha ko'p mato kerak.", coefTxt: (k) => `1 m karnizga ${k} m mato`, sewTxt: "tikish", perKarniz: "/ m karniz", forBoth: "Tyul va parda", forTyul: "Tyul uchun", forParda: "Parda uchun",
    calcT: "Parda <em>kalkulyatori</em>", calcS: "Har bir deraza o'lchamini kiriting, fason va matoni tanlang — kerakli metr va taxminiy narx darhol chiqadi.", howto: "Kenglik — karniz uzunligi. Balandlik — karnizdan polgacha.",
    window: "Deraza", rooms: ["Zal", "Yotoqxona", "Oshxona", "Bolalar xonasi", "Mehmonxona", "Ofis"], width: "Kenglik", heightL: "Balandlik", m: "m", panels: "Qanotlar", p1: "1 qanot", p2: "2 qanot", dims: "O'lchamlar",
    tyul: "Tyul", parda: "Parda", tyulS: "Yengil, yorug'lik o'tkazadi", pardaS: "Baxmal yoki blekaut", style: "Fason", fabric: "Mato", later: "Keyin tanlayman", addWin: "Yana deraza qo'shish", remove: "O'chirish",
    sumT: "Hisob-kitob", total: "Taxminiy jami", fabricCost: "mato", sewCost: "tikish", order: "Buyurtma berish", fine: "Narx taxminiy. Aniq narx uyingizda o'lchagandan keyin aytiladi.", incomplete: "Narx to'liq emas: ba'zi qatlamlarda mato tanlanmagan.", drops: (n) => `Mato balandligi yetmaydi — ${n} bo'lakdan tikiladi`, enterDims: "O'lchamlarni kiriting",
    ordT: "Buyurtma berish", ordS: "Ma'lumotlaringizni qoldiring — tez orada bog'lanamiz.", name: "Ismingiz", phone: "Telefon raqam", address: "Manzil (ixtiyoriy)", noteL: "Izoh (ixtiyoriy)", visit: "Uyimga kelib o'lchab bering", send: "Yuborish", sending: "Yuborilmoqda...", errNP: "Ism va telefon raqamni kiriting", errNet: "Xatolik. Qayta urinib ko'ring yoki qo'ng'iroq qiling.", doneT: "Rahmat! Buyurtma qabul qilindi", doneS: (n) => `Buyurtma raqami: #${n}. Tez orada siz bilan bog'lanamiz.`, close: "Yopish",
    footS: "Turkiya va Xitoyning eng sifatli parda matolari — optom va chakana.", links: "Bo'limlar", since: "2011 yildan beri",
  },
  ru: {
    home: "Главная", catalog: "Каталог", styles: "Фасоны", calc: "Калькулятор", contact: "Контакты", calcShort: "Расчёт",
    heroEye: "С 2011 года", heroT: "Приносим в ваш дом <em>изящество</em>", heroS: "Лучшие шторные ткани из Турции и Китая. Рассчитайте онлайн или вызовите замерщика 24/7.",
    calcBtn: "Рассчитать стоимость", catBtn: "Смотреть каталог", stYears: "лет опыта", stFab: "видов ткани", st247: "выезд на замер",
    bandT: "Приедем к вам и примем заказ", bandS: "Ночью и в выходные. Привезём образцы, сделаем замер и назовём цену на месте.", live: "Принимаем прямо сейчас", call: "Позвонить", tg: "Telegram",
    catsT: "Виды <em>тканей</em>", allProducts: "Все", featT: "Избранные <em>ткани</em>", seeAll: "Все →",
    howT: "Как мы <em>работаем</em>", how: [["Выберите", "Ткань и фасон в каталоге или напишите нам."], ["Рассчитайте", "Калькулятор сразу покажет метраж и цену."], ["Замерим", "Приедем с образцами и сделаем точный замер."], ["Сошьём и повесим", "Пошьём шторы и повесим на карниз."]],
    worksT: "Наши <em>работы</em>", aiBadge: "Скоро", aiT: "AI-дизайнер", aiS: "Искусственный интеллект поможет выбрать шторы:", ai: ["Загрузите фото комнаты — получите совет по цвету и фасону", "Отправьте фото ткани — AI нарисует дизайн штор из неё", "Ответит на вопросы в любое время"],
    visitL: "Наш магазин", map: "Открыть на карте", hoursL: "Время работы",
    search: "Поиск...", sortDef: "Сортировка", sortLow: "Дешевле", sortHigh: "Дороже", noRes: "Ничего не найдено", perM: "/ метр", height: "Высота", color: "Цвет", comp: "Состав", country: "Производство", code: "Код", inStock: "В наличии", outStock: "Нет в наличии", new: "Новинка", sale: "Скидка", top: "Хит",
    calcWith: "Рассчитать с этой тканью", askTg: "Спросить в Telegram", stylesT: "Фасоны <em>штор</em>", stylesS: "Фасон определяет расход ткани: чем гуще складки, тем больше ткани нужно.", coefTxt: (k) => `${k} м ткани на 1 м карниза`, sewTxt: "пошив", perKarniz: "/ м карниза", forBoth: "Тюль и шторы", forTyul: "Для тюля", forParda: "Для штор",
    calcT: "Калькулятор <em>штор</em>", calcS: "Введите размеры каждого окна, выберите фасон и ткань — метраж и примерная цена появятся сразу.", howto: "Ширина — длина карниза. Высота — от карниза до пола.",
    window: "Окно", rooms: ["Зал", "Спальня", "Кухня", "Детская", "Гостиная", "Офис"], width: "Ширина", heightL: "Высота", m: "м", panels: "Полотна", p1: "1 полотно", p2: "2 полотна", dims: "Размеры",
    tyul: "Тюль", parda: "Портьера", tyulS: "Лёгкий, пропускает свет", pardaS: "Бархат или блэкаут", style: "Фасон", fabric: "Ткань", later: "Выберу позже", addWin: "Добавить окно", remove: "Удалить",
    sumT: "Расчёт", total: "Примерно итого", fabricCost: "ткань", sewCost: "пошив", order: "Оформить заказ", fine: "Цена примерная. Точную стоимость назовём после замера.", incomplete: "Цена неполная: в некоторых слоях не выбрана ткань.", drops: (n) => `Высоты ткани не хватает — шьётся из ${n} частей`, enterDims: "Введите размеры",
    ordT: "Оформить заказ", ordS: "Оставьте данные — мы скоро свяжемся.", name: "Ваше имя", phone: "Телефон", address: "Адрес (необязательно)", noteL: "Комментарий (необязательно)", visit: "Приезжайте на замер", send: "Отправить", sending: "Отправка...", errNP: "Введите имя и телефон", errNet: "Ошибка. Попробуйте ещё раз или позвоните.", doneT: "Спасибо! Заказ принят", doneS: (n) => `Номер заказа: #${n}. Мы скоро свяжемся с вами.`, close: "Закрыть",
    footS: "Лучшие шторные ткани из Турции и Китая — опт и розница.", links: "Разделы", since: "С 2011 года",
  },
  en: {
    home: "Home", catalog: "Catalog", styles: "Styles", calc: "Calculator", contact: "Contact", calcShort: "Estimate",
    heroEye: "Since 2011", heroT: "Bringing <em>elegance</em> into your home", heroS: "Premium curtain fabrics from Turkey and China. Estimate online or book a free home measurement 24/7.",
    calcBtn: "Get a price", catBtn: "Browse catalog", stYears: "years of craft", stFab: "fabric types", st247: "home measuring",
    bandT: "We come to your home to take the order", bandS: "Nights and weekends too. We bring samples, measure on site and quote the price.", live: "Taking orders now", call: "Call", tg: "Telegram",
    catsT: "Fabric <em>types</em>", allProducts: "All", featT: "Featured <em>fabrics</em>", seeAll: "See all →",
    howT: "How we <em>work</em>", how: [["Choose", "Pick a fabric and style or just message us."], ["Estimate", "The calculator shows meters and price instantly."], ["We measure", "We visit with samples and measure precisely."], ["Sew & install", "We tailor the curtains and hang them for you."]],
    worksT: "Our <em>work</em>", aiBadge: "Coming soon", aiT: "AI designer", aiS: "Artificial intelligence will help you choose:", ai: ["Upload a room photo — get colour and style advice", "Send a fabric photo — AI draws a curtain design from it", "Answers your questions any time"],
    visitL: "Our store", map: "Open in maps", hoursL: "Opening hours",
    search: "Search...", sortDef: "Sort", sortLow: "Price: low", sortHigh: "Price: high", noRes: "Nothing found", perM: "/ meter", height: "Height", color: "Colour", comp: "Composition", country: "Made in", code: "Code", inStock: "In stock", outStock: "Out of stock", new: "New", sale: "Sale", top: "Top",
    calcWith: "Estimate with this fabric", askTg: "Ask on Telegram", stylesT: "Curtain <em>styles</em>", stylesS: "The style decides how much fabric you need: the denser the folds, the more fabric.", coefTxt: (k) => `${k} m of fabric per 1 m of rail`, sewTxt: "sewing", perKarniz: "/ m of rail", forBoth: "Sheer & drapes", forTyul: "For sheers", forParda: "For drapes",
    calcT: "Curtain <em>calculator</em>", calcS: "Enter each window's size, pick a style and fabric — meters and an estimated price appear instantly.", howto: "Width — length of the rail. Height — from rail to floor.",
    window: "Window", rooms: ["Living room", "Bedroom", "Kitchen", "Kids room", "Guest room", "Office"], width: "Width", heightL: "Height", m: "m", panels: "Panels", p1: "1 panel", p2: "2 panels", dims: "Size",
    tyul: "Sheer", parda: "Drape", tyulS: "Light, lets sunlight in", pardaS: "Velvet or blackout", style: "Style", fabric: "Fabric", later: "Choose later", addWin: "Add another window", remove: "Remove",
    sumT: "Estimate", total: "Estimated total", fabricCost: "fabric", sewCost: "sewing", order: "Place an order", fine: "Estimated price. Final price after measuring at your home.", incomplete: "Price incomplete: some layers have no fabric selected.", drops: (n) => `Fabric not tall enough — sewn from ${n} pieces`, enterDims: "Enter the size",
    ordT: "Place an order", ordS: "Leave your details — we'll get back to you shortly.", name: "Your name", phone: "Phone number", address: "Address (optional)", noteL: "Note (optional)", visit: "Come to measure at my home", send: "Send", sending: "Sending...", errNP: "Please enter your name and phone", errNet: "Something went wrong. Try again or call us.", doneT: "Thank you! Order received", doneS: (n) => `Order number: #${n}. We'll contact you soon.`, close: "Close",
    footS: "Premium curtain fabrics from Turkey and China — wholesale and retail.", links: "Sections", since: "Since 2011",
  },
};
let lang = store.get("lang", (navigator.language || "uz").startsWith("ru") ? "ru" : "uz");
if (!T[lang]) lang = "uz";
const t = (k) => T[lang][k] ?? T.uz[k] ?? k;
const L = (o) => (o && typeof o === "object" ? o[lang] || o.uz || o.ru || o.en || "" : o || "");

/* ---------- icons ---------- */
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M21.5 4.5 2.8 11.6c-.8.3-.8 1.4 0 1.7l4.5 1.6 1.7 5.3c.2.7 1.1.9 1.6.4l2.6-2.4 4.6 3.4c.6.4 1.4.1 1.6-.6l3.1-15c.2-.9-.6-1.6-1.4-1.3Z"/><path d="m7.3 14.9 9.4-6.4"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>',
  curtain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 4h18"/><path d="M5 4c0 6 1 11 5 16M19 4c0 6-1 11-5 16"/><path d="M7.5 4v7M16.5 4v7"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/></svg>',
  later: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

/* ---------- data ---------- */
let D = null;
const byId = (arr, id) => arr.find((x) => x.id === Number(id));
const money = (n) => {
  const c = D.settings.currency || "so'm";
  const v = Math.round(n || 0);
  if (c === "$" || c === "USD") return "$" + v.toLocaleString("en-US");
  return v.toLocaleString("ru-RU").replace(/ /g, " ") + " " + c;
};
const ev = (type, ref) => { try { fetch("/api/event", { method: "POST", body: JSON.stringify({ type, ref }), keepalive: true }); } catch {} };
const telLink = () => "tel:" + String(D.settings.phone || "").replace(/[^\d+]/g, "");
const img0 = (p) => (p.images && p.images[0]) || "/img/fabric.jpg";
const catOf = (p) => byId(D.categories, p.category_id);
const kindOf = (p) => (catOf(p) || {}).kind || "parda";

/* ---------- chrome ---------- */
function chrome(route) {
  const nav = [["#/", t("home")], ["#/katalog", t("catalog")], ["#/fasonlar", t("styles")], ["#/#aloqa", t("contact")]];
  const on = (h) => (h === "#/" ? route === "" : route.startsWith(h.slice(2)) && h !== "#/#aloqa");
  $("#links").innerHTML = nav.map(([h, l]) => `<a href="${h}" class="${on(h) ? "on" : ""}">${esc(l)}</a>`).join("") + `<a href="#/kalkulyator" class="cta">${esc(t("calc"))}</a>`;
  $("#drawer").innerHTML = nav.concat([["#/kalkulyator", t("calc")]]).map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join("");
  $("#lang").innerHTML = ["uz", "ru", "en"].map((l) => `<button data-l="${l}" class="${l === lang ? "on" : ""}">${l.toUpperCase()}</button>`).join("");
  $("#tabbar").innerHTML = [["#/", I.home, t("home"), route === ""], ["#/katalog", I.grid, t("catalog"), route.startsWith("katalog") || route.startsWith("mato")], ["#/kalkulyator", I.calc, t("calcShort"), route.startsWith("kalkulyator"), "mid"], ["#/fasonlar", I.curtain, t("styles"), route.startsWith("fason")]]
    .map(([h, ic, l, o, c]) => `<a href="${h}" class="${o ? "on" : ""} ${c || ""}">${c ? `<i>${ic}</i>` : ic}<span>${esc(l)}</span></a>`).join("");
  const s = D.settings;
  $("#foot").innerHTML = `<div class="wrap">
    <div><a class="brand" href="#/"><img src="/img/logo.png" alt=""><span>Osiyo Home<small>Collection</small></span></a><p style="margin-top:12px;max-width:340px">${esc(t("footS"))}</p></div>
    <div><h4>${esc(t("links"))}</h4><a href="#/katalog">${esc(t("catalog"))}</a><a href="#/fasonlar">${esc(t("styles"))}</a><a href="#/kalkulyator">${esc(t("calc"))}</a></div>
    <div><h4>${esc(t("contact"))}</h4><a href="${telLink()}">${esc(s.phone)}</a><a href="${esc(s.telegram)}" target="_blank" rel="noopener">Telegram</a><a href="${esc(s.instagram)}" target="_blank" rel="noopener">Instagram</a><a href="${esc(s.map_url)}" target="_blank" rel="noopener">${esc(t("map"))}</a></div>
    <div class="copy">© ${esc(s.shop_name)} · ${esc(t("since"))}</div></div>`;
  document.documentElement.lang = lang;
}

/* ---------- pages ---------- */
const productCard = (p) => {
  const tags = [];
  if (!p.in_stock) tags.push(`<span class="tag out">${esc(t("outStock"))}</span>`);
  else if (p.old_price > p.price) tags.push(`<span class="tag gold">${esc(t("sale"))}</span>`);
  else if (p.featured) tags.push(`<span class="tag">${esc(t("top"))}</span>`);
  return `<a class="pc" href="#/mato/${p.id}"><div class="ph"><img src="${esc(img0(p))}" alt="${esc(L(p.name))}" loading="lazy">${tags.join("")}</div>
    <div class="bd"><b>${esc(L(p.name))}</b><small>${esc([p.color, p.roll_height ? p.roll_height + " m" : ""].filter(Boolean).join(" · "))}</small>
    <div class="price">${p.price ? money(p.price) : ""}<small> ${p.price ? esc(t("perM")) : ""}</small>${p.old_price > p.price ? `<s>${money(p.old_price)}</s>` : ""}</div></div></a>`;
};

function pageHome() {
  const s = D.settings;
  const feat = D.products.filter((p) => p.featured).slice(0, 8);
  const list = feat.length ? feat : D.products.slice(0, 8);
  const cats = D.categories.map((c) => {
    const p = D.products.find((x) => x.category_id === c.id);
    const n = D.products.filter((x) => x.category_id === c.id).length;
    return `<a class="cat" href="#/katalog/${c.id}"><img src="${esc(c.image || (p ? img0(p) : "/img/fabric.jpg"))}" alt="" loading="lazy"><span><b>${esc(L(c.name))}</b><small>${n} ×</small></span></a>`;
  }).join("");
  const works = ["ish-1", "ish-2", "ish-3", "ish-4", "ish-5"].map((f) => `<div><img src="/img/demo/${f}.jpg" alt="" loading="lazy"></div>`).join("");
  return `
  <section class="hero"><video autoplay muted loop playsinline poster="/img/video-poster.jpg" src="/img/video.mp4"></video>
    <div class="wrap"><span class="eyebrow">${esc(t("heroEye"))}</span><h1>${L(s.hero_title) ? esc(L(s.hero_title)) : t("heroT")}</h1><p>${esc(L(s.hero_sub) || t("heroS"))}</p>
      <div class="acts"><a class="btn gold" href="#/kalkulyator">${I.calc}${esc(t("calcBtn"))}</a><a class="btn ghost" href="#/katalog">${esc(t("catBtn"))}</a></div>
      <div class="hero-stats"><div><b>${new Date().getFullYear() - 2011}+</b><span>${esc(t("stYears"))}</span></div><div><b>${D.products.length}+</b><span>${esc(t("stFab"))}</span></div><div><b>24/7</b><span>${esc(t("st247"))}</span></div></div></div></section>
  <div class="wrap">
    <section class="sec reveal"><div class="band"><div class="n">24/7</div><div><span class="live"><i></i>${esc(t("live"))}</span><h3>${esc(t("bandT"))}</h3><p>${esc(t("bandS"))}</p></div>
      <div class="acts"><a class="btn gold" href="${telLink()}" data-ev="call">${I.phone}${esc(t("call"))}</a><a class="btn ghost" href="${esc(s.telegram)}" target="_blank" rel="noopener" data-ev="tg">${I.tg}${esc(t("tg"))}</a></div></div></section>
    <section class="sec reveal"><div class="sec-h"><h2>${t("catsT")}</h2><a href="#/katalog">${esc(t("seeAll"))}</a></div><div class="cats">${cats}</div></section>
    <section class="sec reveal"><div class="sec-h"><h2>${t("featT")}</h2><a href="#/katalog">${esc(t("seeAll"))}</a></div><div class="grid">${list.map(productCard).join("")}</div></section>
    <section class="sec reveal"><div class="sec-h"><h2>${t("howT")}</h2></div><div class="steps">${t("how").map((h, i) => `<div class="step"><div class="n">0${i + 1}</div><b>${esc(h[0])}</b><p>${esc(h[1])}</p></div>`).join("")}</div></section>
    <section class="sec reveal"><div class="sec-h"><h2>${t("worksT")}</h2><a href="${esc(s.telegram_channel)}" target="_blank" rel="noopener">${esc(t("seeAll"))}</a></div><div class="works">${works}</div></section>
    <section class="sec reveal"><div class="ai"><div><span class="badge">${esc(t("aiBadge"))}</span><h3 style="margin-top:12px">${esc(t("aiT"))}</h3><p style="color:var(--muted);margin-top:6px">${esc(t("aiS"))}</p></div>
      <ul>${t("ai").map((x) => `<li>${I.spark}<span>${esc(x)}</span></li>`).join("")}</ul></div></section>
    ${contactBlock()}
  </div>`;
}

function contactBlock() {
  const s = D.settings;
  return `<section class="sec reveal" id="aloqa"><div class="sec-h"><h2>${esc(t("contact"))}</h2></div><div class="contact">
    <div class="visit"><div class="lb">${esc(t("visitL"))}</div><h3>${esc(L(s.address))}</h3><p><b>${esc(t("hoursL"))}:</b> ${esc(L(s.hours))}</p>
      <div class="acts"><a class="btn gold" href="${esc(s.map_url)}" target="_blank" rel="noopener">${I.pin}${esc(t("map"))}</a></div></div>
    <div class="clist">
      <a class="ci" href="${telLink()}" data-ev="call"><span class="ic">${I.phone}</span><span><b>${esc(s.phone)}</b><small>${esc(t("call"))}</small></span></a>
      <a class="ci" href="${esc(s.telegram)}" target="_blank" rel="noopener" data-ev="tg"><span class="ic">${I.tg}</span><span><b>Telegram</b><small>${esc(t("order"))}</small></span></a>
      <a class="ci" href="${esc(s.instagram)}" target="_blank" rel="noopener"><span class="ic">${I.ig}</span><span><b>Instagram</b><small>@osiyohomecollection</small></span></a>
    </div></div></section>`;
}

let F = { q: "", sort: "" };
function pageCatalog(catId) {
  const chips = [`<a class="chip ${!catId ? "on" : ""}" href="#/katalog">${esc(t("allProducts"))}</a>`].concat(D.categories.map((c) => `<a class="chip ${Number(catId) === c.id ? "on" : ""}" href="#/katalog/${c.id}">${esc(L(c.name))}</a>`)).join("");
  return `<div class="wrap"><div class="page-h"><h1>${esc(t("catalog"))}</h1></div>
    <div class="toolbar"><label class="search">${I.search}<input id="q" value="${esc(F.q)}" placeholder="${esc(t("search"))}"></label>
    <select class="sel" id="sort"><option value="">${esc(t("sortDef"))}</option><option value="low" ${F.sort === "low" ? "selected" : ""}>${esc(t("sortLow"))}</option><option value="high" ${F.sort === "high" ? "selected" : ""}>${esc(t("sortHigh"))}</option></select></div>
    <div class="filters">${chips}</div><div class="grid" id="plist"></div></div>`;
}
function fillCatalog(catId) {
  let a = D.products.filter((p) => !catId || p.category_id === Number(catId));
  const q = F.q.trim().toLowerCase();
  if (q) a = a.filter((p) => [L(p.name), p.code, p.color, p.composition, p.country, ...Object.values(p.name || {})].join(" ").toLowerCase().includes(q));
  if (F.sort === "low") a.sort((x, y) => x.price - y.price);
  if (F.sort === "high") a.sort((x, y) => y.price - x.price);
  $("#plist").innerHTML = a.length ? a.map(productCard).join("") : `<div class="empty" style="grid-column:1/-1">${esc(t("noRes"))}</div>`;
}

function pageProduct(id) {
  const p = byId(D.products, id);
  if (!p) return `<div class="wrap empty">${esc(t("noRes"))}</div>`;
  ev("view", p.id);
  const c = catOf(p);
  const imgs = p.images && p.images.length ? p.images : ["/img/fabric.jpg"];
  const spec = [[t("height"), p.roll_height ? p.roll_height + " m" : ""], [t("color"), p.color], [t("comp"), p.composition], [t("country"), p.country]].filter((x) => x[1]);
  const msg = encodeURIComponent(`${L(p.name)} (${p.code || "#" + p.id})`);
  const tgUser = (D.settings.telegram || "").split("t.me/")[1];
  return `<div class="wrap"><div class="pp">
    <div class="gal"><div class="main"><img id="gm" src="${esc(imgs[0])}" alt="${esc(L(p.name))}"></div>
      ${imgs.length > 1 ? `<div class="th">${imgs.map((s, i) => `<button class="${i ? "" : "on"}" data-img="${esc(s)}"><img src="${esc(s)}" alt=""></button>`).join("")}</div>` : ""}</div>
    <div class="pi"><div class="crumbs"><a href="#/katalog">${esc(t("catalog"))}</a>${c ? ` / <a href="#/katalog/${c.id}">${esc(L(c.name))}</a>` : ""}</div>
      <h1>${esc(L(p.name))}</h1>${p.code ? `<div class="code">${esc(t("code"))}: ${esc(p.code)}</div>` : ""}
      ${p.price ? `<div class="big">${money(p.price)} <small>${esc(t("perM"))}</small>${p.old_price > p.price ? ` <s style="font-size:16px;color:var(--muted);font-weight:500">${money(p.old_price)}</s>` : ""}</div>` : ""}
      <div class="stock ${p.in_stock ? "" : "no"}"><i></i>${esc(p.in_stock ? t("inStock") : t("outStock"))}</div>
      <div class="specs">${spec.map(([k, v]) => `<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join("")}</div>
      ${L(p.description) ? `<p class="desc">${esc(L(p.description))}</p>` : ""}
      <div class="acts"><a class="btn pri" href="#/kalkulyator?p=${p.id}">${I.calc}${esc(t("calcWith"))}</a>
      <a class="btn line" href="${tgUser ? `https://t.me/${esc(tgUser)}?text=${msg}` : esc(D.settings.telegram)}" target="_blank" rel="noopener" data-ev="tg">${I.tg}${esc(t("askTg"))}</a></div></div>
  </div>
  <section class="sec"><div class="sec-h"><h2>${t("featT")}</h2></div><div class="grid">${D.products.filter((x) => x.id !== p.id && x.category_id === p.category_id).concat(D.products.filter((x) => x.id !== p.id && x.category_id !== p.category_id)).slice(0, 4).map(productCard).join("")}</div></section></div>`;
}

function pageStyles() {
  const ap = { both: t("forBoth"), tyul: t("forTyul"), parda: t("forParda") };
  return `<div class="wrap"><div class="page-h"><h1>${t("stylesT")}</h1><p>${esc(t("stylesS"))}</p></div><div class="sgrid" style="margin-top:20px">
    ${D.styles.map((s) => `<div class="sc"><div class="im"><img src="${esc(s.image || "/img/styles/lenta.svg")}" alt="" loading="lazy"></div><div class="bd"><h3>${esc(L(s.name))}</h3><p>${esc(L(s.description))}</p>
    <div class="k"><span>${esc(t("coefTxt")(s.coefficient))}</span>${s.sewing_price ? `<span class="g">${esc(t("sewTxt"))}: ${money(s.sewing_price)} ${esc(s.sewing_unit === "karniz" ? t("perKarniz") : t("perM"))}</span>` : ""}<span>${esc(ap[s.applies_to] || "")}</span></div></div></div>`).join("")}
  </div><div style="margin-top:24px;text-align:center"><a class="btn pri" href="#/kalkulyator">${I.calc}${esc(t("calcBtn"))}</a></div></div>`;
}

/* ---------- calculator ---------- */
let W = store.get("calc_windows", null);
const newWin = (i) => ({ name: t("rooms")[i % 6], width: "", height: "", panels: 2, layers: { tyul: { on: true, product_id: null, style_id: null }, parda: { on: true, product_id: null, style_id: null } } });
function ensureW() {
  if (!Array.isArray(W) || !W.length) W = [newWin(0)];
  W.forEach((w) => ["tyul", "parda"].forEach((k) => {
    const l = w.layers[k];
    if (l.product_id && !byId(D.products, l.product_id)) l.product_id = null;
    if (l.style_id && !byId(D.styles, l.style_id)) l.style_id = null;
    if (!l.style_id) { const s = stylesFor(k)[0]; l.style_id = s ? s.id : null; }
  }));
}
const stylesFor = (k) => D.styles.filter((s) => s.applies_to === "both" || s.applies_to === k);
const fabricsFor = (k) => D.products.filter((p) => kindOf(p) === k);
const saveW = () => store.set("calc_windows", W);
const toCalc = () => W.map((w) => ({ name: w.name, width: Number(String(w.width).replace(",", ".")), height: Number(String(w.height).replace(",", ".")), panels: w.panels, layers: ["tyul", "parda"].filter((k) => w.layers[k].on).map((k) => ({ kind: k, product_id: w.layers[k].product_id, style_id: w.layers[k].style_id })) }));
function compute() {
  const map = (a) => Object.fromEntries(a.map((x) => [x.id, x]));
  const valid = toCalc().map((w) => (w.width > 0 && w.height > 0 ? w : { ...w, layers: [] }));
  return PardaCalc.calculate(valid, { products: map(D.products), styles: map(D.styles) }, D.settings);
}

function pageCalc(q) {
  ensureW();
  const pre = Number(new URLSearchParams(q).get("p"));
  if (pre && byId(D.products, pre)) { const k = kindOf(byId(D.products, pre)); if (W[0].layers[k]) { W[0].layers[k].on = true; W[0].layers[k].product_id = pre; saveW(); } }
  return `<div class="wrap"><div class="page-h"><h1>${t("calcT")}</h1><p>${esc(t("calcS"))}</p></div>
    <div class="calc"><div><div id="wins"></div><button class="add-win" id="addw">${I.plus}${esc(t("addWin"))}</button></div><aside class="sum" id="sum"></aside></div>
    <div class="calc-pad"></div></div><div class="dock" id="dock"></div>`;
}
const howtoSvg = '<svg viewBox="0 0 64 54" fill="none"><rect x="14" y="10" width="36" height="40" rx="2" fill="#fff" stroke="#c9a45c" stroke-width="1.5"/><path d="M6 6h52" stroke="#2a1640" stroke-width="2.5" stroke-linecap="round"/><path d="M8 2v8M56 2v8" stroke="#7b3fc4" stroke-width="1.5"/><path d="M10 2h44" stroke="#7b3fc4" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M60 6v46" stroke="#7b3fc4" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M4 52h58" stroke="#6b5020" stroke-width="1.5"/></svg>';
function renderWins() {
  const res = compute();
  $("#wins").innerHTML = W.map((w, i) => {
    const r = res.windows[i] || { layers: [] };
    const lay = (k) => {
      const l = w.layers[k]; const lr = r.layers.find((x) => x.kind === k);
      const sts = stylesFor(k), fabs = fabricsFor(k);
      return `<div class="layer ${l.on ? "on" : ""}"><button class="layer-h" data-tog="${i}:${k}"><span class="cb">${I.check}</span><span><b>${esc(t(k))}</b><small>${esc(t(k + "S"))}</small></span>${l.on && lr ? `<span class="m">${lr.meters} ${esc(t("m"))}</span>` : ""}</button>
        <div class="layer-b"><div><div class="lbl">${esc(t("style"))}<a class="hint" href="#/fasonlar">?</a></div><div class="picks">${sts.map((s) => `<button class="pick ${l.style_id === s.id ? "on" : ""}" data-st="${i}:${k}:${s.id}"><div class="im"><img src="${esc(s.image || "/img/styles/lenta.svg")}" alt="" loading="lazy"></div><div class="tx"><b>${esc(L(s.name))}</b><small>×${s.coefficient}</small></div></button>`).join("")}</div></div>
        <div><div class="lbl">${esc(t("fabric"))}</div><div class="picks"><button class="pick none ${!l.product_id ? "on" : ""}" data-fb="${i}:${k}:0"><div class="im">${I.later}</div><div class="tx"><b>${esc(t("later"))}</b><small>&nbsp;</small></div></button>${fabs.map((p) => `<button class="pick ${l.product_id === p.id ? "on" : ""}" data-fb="${i}:${k}:${p.id}"><div class="im"><img src="${esc(img0(p))}" alt="" loading="lazy"></div><div class="tx"><b>${esc(L(p.name))}</b><small>${p.price ? money(p.price) : ""}</small></div></button>`).join("")}</div></div>
        <div class="note" data-note="${i}:${k}" ${lr && lr.method === "drops" ? "" : "hidden"}>${lr && lr.method === "drops" ? esc(t("drops")(lr.drops)) : ""}</div></div></div>`;
    };
    return `<div class="win"><div class="win-h"><span class="no">${i + 1}</span><input value="${esc(w.name)}" data-name="${i}" aria-label="${esc(t("window"))}">${W.length > 1 ? `<button data-del="${i}" aria-label="${esc(t("remove"))}">${I.trash}</button>` : ""}</div>
      <div class="win-b">${i === 0 ? `<div class="howto">${howtoSvg}<span>${esc(t("howto"))}</span></div>` : ""}
        <div><div class="lbl">${esc(t("dims"))}</div><div class="dims"><div><div class="field-l">${esc(t("width"))}</div><label class="field"><input inputmode="decimal" placeholder="3.00" value="${esc(w.width)}" data-w="${i}"><span>${esc(t("m"))}</span></label></div>
        <div><div class="field-l">${esc(t("heightL"))}</div><label class="field"><input inputmode="decimal" placeholder="2.70" value="${esc(w.height)}" data-h="${i}"><span>${esc(t("m"))}</span></label></div></div></div>
        <div><div class="lbl">${esc(t("panels"))}</div><div class="seg"><button class="${w.panels === 1 ? "on" : ""}" data-pn="${i}:1">${esc(t("p1"))}</button><button class="${w.panels === 2 ? "on" : ""}" data-pn="${i}:2">${esc(t("p2"))}</button></div></div>
        ${lay("tyul")}${lay("parda")}</div></div>`;
  }).join("");
  renderSum(res);
}
function renderSum(res = compute()) {
  const has = res.windows.some((w) => w.layers.length);
  const rows = res.windows.filter((w) => w.layers.length).map((w) => `<div class="row"><span>${esc(w.name)} · ${w.width}×${w.height} ${esc(t("m"))}</span><b>${w.total ? money(w.total) : w.layers.map((l) => l.meters + " " + t("m")).join(" + ")}</b></div>`).join("");
  $("#sum").innerHTML = `<h3>${esc(t("sumT"))}</h3>${has ? `<div class="meters">${["tyul", "parda"].filter((k) => res.meters[k]).map((k) => `<div><small>${esc(t(k))}</small><b>${res.meters[k]} ${esc(t("m"))}</b></div>`).join("")}</div><div class="rows">${rows}</div>
    ${res.total ? `<div class="tot"><span>${esc(t("total"))}</span><b>${money(res.total)}</b></div>` : ""}${!res.complete ? `<div class="fine">${esc(t("incomplete"))}</div>` : ""}` : `<p style="color:rgba(255,255,255,.7);margin-top:8px">${esc(t("enterDims"))}</p>`}
    <button class="btn gold block" data-order ${has ? "" : "disabled"}>${esc(t("order"))}</button><div class="fine">${esc(t("fine"))}</div>`;
  const dock = $("#dock");
  if (dock) dock.innerHTML = `<div><small>${esc(has ? (res.total ? t("total") : t("sumT")) : t("enterDims"))}</small><b>${has ? (res.total ? money(res.total) : Object.entries(res.meters).map(([k, v]) => v + " " + t("m")).join(" + ")) : "—"}</b></div><button class="btn gold" data-order ${has ? "" : "disabled"}>${esc(t("order"))}</button>`;
}
let calcEvSent = false;
function bindCalc() {
  renderWins();
  const app = $("#app");
  app.oninput = (e) => {
    const d = e.target.dataset;
    if (d.w != null) W[d.w].width = e.target.value;
    else if (d.h != null) W[d.h].height = e.target.value;
    else if (d.name != null) W[d.name].name = e.target.value;
    else return;
    saveW();
    if (d.name == null) {
      const res = compute();
      W.forEach((w, i) => ["tyul", "parda"].forEach((k) => {
        const l = (res.windows[i] || { layers: [] }).layers.find((x) => x.kind === k);
        const head = document.querySelector(`[data-tog="${i}:${k}"]`);
        if (head) { let m = head.querySelector(".m"); if (l && w.layers[k].on) { if (!m) { m = document.createElement("span"); m.className = "m"; head.appendChild(m); } m.textContent = l.meters + " " + t("m"); } else if (m) m.remove(); }
        const note = document.querySelector(`[data-note="${i}:${k}"]`);
        if (note) { const dr = l && l.method === "drops"; note.hidden = !dr; note.textContent = dr ? t("drops")(l.drops) : ""; }
      }));
      renderSum(res);
      if (!calcEvSent && res.total) { calcEvSent = true; ev("calc"); }
    }
  };
  $("#addw").onclick = () => { W.push(newWin(W.length)); ensureW(); saveW(); renderWins(); };
}

/* ---------- order modal ---------- */
function openOrder() {
  const res = compute();
  const m = $("#modal");
  const saved = store.get("contact", {});
  m.innerHTML = `<div class="sheet"><button class="x" data-close>${I.x}</button><h3>${esc(t("ordT"))}</h3><p class="sub">${esc(t("ordS"))}</p>
    ${res.total ? `<div style="margin-top:12px;padding:12px 14px;border-radius:14px;background:var(--mist);display:flex;justify-content:space-between;font-weight:700"><span>${esc(t("total"))}</span><span style="color:var(--plum)">${money(res.total)}</span></div>` : ""}
    <form class="form" id="of"><input class="inp" name="name" placeholder="${esc(t("name"))}" value="${esc(saved.name || "")}" autocomplete="name">
    <input class="inp" name="phone" type="tel" placeholder="+998 __ ___ __ __" value="${esc(saved.phone || "")}" autocomplete="tel">
    <input class="inp" name="address" placeholder="${esc(t("address"))}" autocomplete="street-address">
    <textarea class="inp" name="note" placeholder="${esc(t("noteL"))}"></textarea>
    <label class="check"><input type="checkbox" name="visit" checked>${esc(t("visit"))}</label>
    <div class="err" id="oerr"></div><button class="btn pri block" type="submit">${esc(t("send"))}</button></form></div>`;
  m.classList.add("open");
  $("#of").onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target), btn = e.target.querySelector("button[type=submit]");
    const body = { name: f.get("name"), phone: f.get("phone"), address: f.get("address"), note: f.get("note"), want_visit: !!f.get("visit"), lang, windows: toCalc().filter((w) => w.width > 0 && w.height > 0) };
    if (!String(body.name).trim() || String(body.phone).replace(/\D/g, "").length < 7) { $("#oerr").textContent = t("errNP"); return; }
    btn.disabled = true; btn.textContent = t("sending");
    try {
      const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error);
      store.set("contact", { name: body.name, phone: body.phone });
      $(".sheet", m).innerHTML = `<div class="done"><div class="ok">${I.check}</div><h3>${esc(t("doneT"))}</h3><p class="sub" style="margin-top:8px">${esc(t("doneS")(j.id))}</p>
        <div style="display:grid;gap:10px;margin-top:20px"><a class="btn line" href="${esc(D.settings.telegram)}" target="_blank" rel="noopener">${I.tg}Telegram</a><button class="btn pri" data-close>${esc(t("close"))}</button></div></div>`;
    } catch { $("#oerr").textContent = t("errNet"); btn.disabled = false; btn.textContent = t("send"); }
  };
}

/* ---------- router ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, "");
  if (h.startsWith("#")) { const el = document.getElementById(h.slice(1)); if (el) el.scrollIntoView(); return; }
  const [path, q = ""] = h.split("?");
  const parts = path.split("/");
  chrome(path);
  $("#drawer").classList.remove("open");
  const app = $("#app"); app.oninput = app.onchange = null;
  let html;
  if (parts[0] === "katalog") html = pageCatalog(parts[1]);
  else if (parts[0] === "mato") html = pageProduct(parts[1]);
  else if (parts[0] === "fasonlar") html = pageStyles();
  else if (parts[0] === "kalkulyator") html = pageCalc(q);
  else html = pageHome();
  app.innerHTML = html;
  window.scrollTo(0, 0);
  if (parts[0] === "katalog") {
    fillCatalog(parts[1]);
    $("#q").oninput = (e) => { F.q = e.target.value; fillCatalog(parts[1]); };
    $("#sort").onchange = (e) => { F.sort = e.target.value; fillCatalog(parts[1]); };
  }
  if (parts[0] === "kalkulyator") bindCalc();
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  if (path === "" && location.hash === "#/#aloqa") $("#aloqa")?.scrollIntoView();
}

document.addEventListener("click", (e) => {
  const c = (sel) => e.target.closest(sel);
  let el;
  if ((el = c("[data-l]"))) { lang = el.dataset.l; store.set("lang", lang); route(); return; }
  if (c("#burger")) { $("#drawer").classList.toggle("open"); return; }
  if ((el = c("[data-ev]"))) ev(el.dataset.ev);
  if ((el = c("[data-img]"))) { $("#gm").src = el.dataset.img; el.parentNode.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === el)); return; }
  if ((el = c("[data-tog]"))) { const [i, k] = el.dataset.tog.split(":"); W[i].layers[k].on = !W[i].layers[k].on; saveW(); renderWins(); return; }
  if ((el = c("[data-st]"))) { const [i, k, id] = el.dataset.st.split(":"); W[i].layers[k].style_id = Number(id); saveW(); renderWins(); return; }
  if ((el = c("[data-fb]"))) { const [i, k, id] = el.dataset.fb.split(":"); W[i].layers[k].product_id = Number(id) || null; saveW(); renderWins(); return; }
  if ((el = c("[data-pn]"))) { const [i, n] = el.dataset.pn.split(":"); W[i].panels = Number(n); saveW(); renderWins(); return; }
  if ((el = c("[data-del]"))) { W.splice(Number(el.dataset.del), 1); saveW(); renderWins(); return; }
  if (c("[data-order]")) { openOrder(); return; }
  if (c("[data-close]") || e.target.id === "modal") { $("#modal").classList.remove("open"); return; }
  if ((el = c('a[href="#/#aloqa"]'))) { e.preventDefault(); if (location.hash.replace(/^#\/?/, "") !== "") { location.hash = "#/"; setTimeout(() => $("#aloqa")?.scrollIntoView({ behavior: "smooth" }), 80); } else $("#aloqa")?.scrollIntoView({ behavior: "smooth" }); }
});
window.addEventListener("hashchange", route);

fetch("/api/public").then((r) => r.json()).then((d) => { D = d; route(); }).catch(() => { $("#app").innerHTML = '<div class="wrap empty">Internet bilan bog\'lanishda xatolik. Sahifani yangilang.</div>'; });
})();
