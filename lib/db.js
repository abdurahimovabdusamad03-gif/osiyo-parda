const path = require("node:path");
const fs = require("node:fs");
const { DatabaseSync } = require("node:sqlite");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, "parda.db"));
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '{}',
  kind TEXT NOT NULL DEFAULT 'parda',
  image TEXT DEFAULT '',
  sort INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '{}',
  code TEXT DEFAULT '',
  price REAL DEFAULT 0,
  old_price REAL DEFAULT 0,
  roll_height REAL DEFAULT 2.8,
  color TEXT DEFAULT '',
  composition TEXT DEFAULT '',
  country TEXT DEFAULT '',
  images TEXT NOT NULL DEFAULT '[]',
  in_stock INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  sort INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS styles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '{}',
  coefficient REAL DEFAULT 2,
  sewing_price REAL DEFAULT 0,
  sewing_unit TEXT DEFAULT 'meter',
  applies_to TEXT DEFAULT 'both',
  image TEXT DEFAULT '',
  active INTEGER DEFAULT 1,
  sort INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  name TEXT, phone TEXT, address TEXT, note TEXT, lang TEXT,
  want_visit INTEGER DEFAULT 1,
  windows TEXT DEFAULT '[]',
  result TEXT DEFAULT '{}',
  total REAL DEFAULT 0,
  status TEXT DEFAULT 'new',
  admin_note TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT DEFAULT (datetime('now')),
  type TEXT, ref INTEGER
);
`);

const DEFAULT_SETTINGS = {
  shop_name: "Osiyo Home Collection",
  currency: "so'm",
  phone: "+998 33 712 11 12",
  telegram: "https://t.me/abdurhimov_life",
  telegram_channel: "https://t.me/osiyohomecollectionuz",
  instagram: "https://www.instagram.com/osiyohomecollection",
  address: { uz: "Abu Saxiy bozori, V 12 do'kon · Chilonzor tumani, Bunyodkor shoh ko'chasi, 156A", ru: "Рынок Абу Сахий, магазин V 12 · Чиланзарский район, проспект Бунёдкор, 156A", en: "Abu Sakhiy bazaar, shop V 12 · Chilanzar district, Bunyodkor Ave, 156A" },
  map_url: "https://yandex.com/maps/org/osiyo_home_collection/72552727902",
  hours: { uz: "Seshanba – Yakshanba, 08:00 – 16:00 · Dushanba dam olish", ru: "Вторник – Воскресенье, 08:00 – 16:00 · Понедельник выходной", en: "Tue – Sun, 08:00 – 16:00 · Closed Mondays" },
  hem_top_cm: 5,
  hem_bottom_cm: 10,
  side_cm: 5,
  floor_gap_cm: 1,
  reserve_pct: 0,
  default_roll_height: 2.8,
  default_coefficient: 2,
  tg_bot_token: "",
  tg_chat_id: "",
};

function getSettings(includeSecret = false) {
  const s = { ...DEFAULT_SETTINGS };
  for (const row of db.prepare("SELECT key, value FROM settings").all()) {
    try { s[row.key] = JSON.parse(row.value); } catch { s[row.key] = row.value; }
  }
  if (!includeSecret) { delete s.tg_bot_token; delete s.tg_chat_id; delete s.session_secret; }
  return s;
}
function setSettings(obj) {
  const st = db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value");
  for (const [k, v] of Object.entries(obj)) st.run(k, JSON.stringify(v));
}

const J = (o) => JSON.stringify(o);
function seed() {
  if (db.prepare("SELECT COUNT(*) c FROM categories").get().c > 0) return;
  const cat = db.prepare("INSERT INTO categories(name,kind,sort) VALUES(?,?,?)");
  const c1 = cat.run(J({ uz: "Tyul", ru: "Тюль", en: "Sheer tulle" }), "tyul", 1).lastInsertRowid;
  const c2 = cat.run(J({ uz: "Parda (baxmal)", ru: "Портьеры (бархат)", en: "Velvet drapes" }), "parda", 2).lastInsertRowid;
  const c3 = cat.run(J({ uz: "Blekaut", ru: "Блэкаут", en: "Blackout" }), "parda", 3).lastInsertRowid;
  cat.run(J({ uz: "Aksessuarlar", ru: "Аксессуары", en: "Accessories" }), "other", 4);

  const p = db.prepare(`INSERT INTO products(category_id,name,description,code,price,roll_height,color,composition,country,images,featured,sort)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`);
  p.run(c1, J({ uz: "Krem tyul «Shampan»", ru: "Тюль «Шампань»", en: "Champagne sheer" }),
    J({ uz: "Yengil, yaltiroq ipli turk tyuli. Xonani yorug' va iliq qiladi.", ru: "Лёгкий турецкий тюль с мерцающей нитью. Делает комнату светлой и тёплой.", en: "Light Turkish sheer with a shimmering thread. Keeps the room bright and warm." }),
    "TY-101", 85000, 2.8, "Krem", "100% poliester", "Turkiya", J(["/img/demo/ish-1.jpg"]), 1, 1);
  p.run(c1, J({ uz: "Oq tyul «Klassik»", ru: "Белый тюль «Классик»", en: "Classic white sheer" }),
    J({ uz: "Har qanday interyerga mos keladigan sof oq tyul.", ru: "Чисто белый тюль, подходит к любому интерьеру.", en: "Pure white sheer that suits any interior." }),
    "TY-102", 70000, 3.0, "Oq", "100% poliester", "Turkiya", J(["/img/demo/ish-6.jpg"]), 1, 2);
  p.run(c2, J({ uz: "Baxmal «Oltin qum»", ru: "Бархат «Золотой песок»", en: "Golden sand velvet" }),
    J({ uz: "Og'ir, yumshoq baxmal. Mehmonxona va oshxona uchun hashamatli tanlov.", ru: "Плотный мягкий бархат. Роскошный выбор для гостиной и столовой.", en: "Heavy, soft velvet. A luxurious choice for living and dining rooms." }),
    "BX-201", 140000, 2.8, "Oltin", "Baxmal", "Turkiya", J(["/img/demo/ish-2.jpg"]), 1, 3);
  p.run(c2, J({ uz: "Baxmal «Kofe»", ru: "Бархат «Кофе»", en: "Coffee velvet" }),
    J({ uz: "To'q jigarrang baxmal, oq tyul bilan juda chiroyli uyg'unlashadi.", ru: "Тёмно-коричневый бархат, красиво сочетается с белым тюлем.", en: "Deep brown velvet that pairs beautifully with white sheer." }),
    "BX-202", 130000, 2.8, "Jigarrang", "Baxmal", "Xitoy", J(["/img/demo/ish-3.jpg"]), 0, 4);
  p.run(c3, J({ uz: "Blekaut «Mokko»", ru: "Блэкаут «Мокко»", en: "Mocha blackout" }),
    J({ uz: "Yorug'likni 95% gacha to'sadi. Yotoqxona uchun ideal.", ru: "Блокирует до 95% света. Идеально для спальни.", en: "Blocks up to 95% of light. Ideal for bedrooms." }),
    "BL-301", 110000, 2.8, "Mokko", "Blekaut", "Xitoy", J(["/img/demo/ish-5.jpg"]), 1, 5);

  const s = db.prepare("INSERT INTO styles(name,description,coefficient,sewing_price,sewing_unit,applies_to,image,sort) VALUES(?,?,?,?,?,?,?,?)");
  s.run(J({ uz: "Lenta (klassik)", ru: "Шторная лента", en: "Pencil pleat" }), J({ uz: "Eng ko'p tanlanadigan, bir tekis burmalar.", ru: "Самый популярный вариант, ровные складки.", en: "The most popular choice with even folds." }), 2, 15000, "meter", "both", "/img/styles/lenta.svg", 1);
  s.run(J({ uz: "To'lqin (Wave)", ru: "Волна (Wave)", en: "Wave" }), J({ uz: "Zamonaviy, yumshoq va bir xil to'lqinlar.", ru: "Современные мягкие одинаковые волны.", en: "Modern, soft and perfectly even waves." }), 2.5, 25000, "meter", "both", "/img/styles/wave.svg", 2);
  s.run(J({ uz: "Luvers (halqali)", ru: "Люверсы", en: "Eyelet" }), J({ uz: "Halqalar orqali trubaga o'tkaziladi, katta burmalar.", ru: "Кольца на штанге, крупные складки.", en: "Rings on a rod, generous folds." }), 2, 30000, "meter", "parda", "/img/styles/luvers.svg", 3);
  s.run(J({ uz: "Qalin burmali tyul", ru: "Тюль с густой сборкой", en: "Full gathered sheer" }), J({ uz: "Boy, zich burmalar — hashamatli ko'rinish.", ru: "Пышные густые складки — роскошный вид.", en: "Rich, dense folds for a luxurious look." }), 3, 15000, "meter", "tyul", "/img/styles/burma.svg", 4);
  s.run(J({ uz: "Rimskiy", ru: "Римская штора", en: "Roman blind" }), J({ uz: "Tekis mato, yuqoriga taxlanib ko'tariladi.", ru: "Плоское полотно, складывается вверх.", en: "Flat fabric that folds upward." }), 1.1, 60000, "karniz", "both", "/img/styles/rimskiy.svg", 5);
}
seed();

const parse = (row, fields) => {
  if (!row) return row;
  for (const f of fields) { try { row[f] = JSON.parse(row[f] || "null"); } catch { row[f] = null; } }
  return row;
};
const P_FIELDS = ["name", "description", "images"];
const S_FIELDS = ["name", "description"];

module.exports = { db, DATA_DIR, UPLOAD_DIR, getSettings, setSettings, parse, P_FIELDS, S_FIELDS };
