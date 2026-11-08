# Osiyo Home Collection — parda sayti

Mijozlar uchun parda katalogi, fasonlar, onlayn kalkulyator va buyurtma; do'kon egasi uchun admin panel.

- **Sayt:** `/` — 3 tilda (o'zbek, rus, ingliz)
- **Admin panel:** `/admin`
- Tashqi kutubxona yo'q: faqat Node.js 22.13+ (ichki `node:sqlite` bazasi)

## Ishga tushirish (kompyuterda)

```bash
npm start            # http://localhost:3000
```

## Render'ga joylash

1. Render → **New → Web Service** → shu repo'ni tanlang.
2. Sozlamalar:
   - Runtime: **Node**
   - Build command: `echo no build`
   - Start command: `npm start`
   - Instance type: **Starter** (disk faqat pullik rejada ishlaydi)
3. **Environment** bo'limida:
   - `NODE_VERSION` = `22.13.0`
   - `DATA_DIR` = `/var/data`
   - `ADMIN_PASSWORD` = admin paroli (o'zingiz o'ylab toping)
4. **Disks** bo'limida disk qo'shing: Mount path `/var/data`, hajmi 1 GB.
   Baza va yuklangan rasmlar shu yerda saqlanadi — disk bo'lmasa, har qayta ishga tushganda yo'qoladi.
5. Deploy. Keyin `/admin` ga kirib parolni almashtiring va matolarni kiriting.

## Telegram xabarnoma

Admin → Sozlamalar → Telegram xabarnoma: @BotFather'dan bot token, @userinfobot'dan chat ID.
Har bir yangi buyurtma Telegram'ga keladi.

## Hisob-kitob qoidasi (`lib/calc.js`)

```
metr = karniz uzunligi × fason koeffitsienti + chetlar
```

Agar mato balandligi (rulon eni) deraza balandligiga yetmasa, mato bo'laklarga bo'linib
hisoblanadi. Barcha zapaslar admin paneldagi "Hisoblash qoidalari" bo'limida o'zgartiriladi.

## 2-bosqich: AI tahlilchi (rejada)

- Xona rasmini tahlil qilish va maslahat
- Mijoz bilan chat (katalogdan mato tavsiya qiladi)
- Ega uchun savdo tahlili
- Mato rasmidan parda dizaynini chizish

Buning uchun Claude API kaliti kerak bo'ladi (`ANTHROPIC_API_KEY` muhit o'zgaruvchisi).
