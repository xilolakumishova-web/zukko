# ⭐ Zukko — Prezident maktabiga tayyorlov ilovasi (3–4 sinf)

O'yin shaklidagi interaktiv ilova: **matematika, ingliz tili, mantiq va tanqidiy fikrlash** hamda **14 ta aqlli o'yin**.
Savollar Prezident, Al-Xorazmiy va ixtisoslashtirilgan maktablar 1-bosqich imtihoni formatida tuzilgan va **har safar yangidan yaratiladi** (generatorlar).

## Nimalar bor
| Bo'lim | Tarkibi |
|---|---|
| 🧮 Matematika (17 mavzu) | Hisoblash, ketma-ketliklar, tenglama/tengsizlik, matnli masalalar, vaqt, o'lchov birliklari, geometriya, kasrlar, sonlar xossalari, diagrammalar, xona birliklari, qoldiq/EKUB/EKUK, kombinatorika, harakat va ish, soat burchaklari, koordinata va yo'nalish, kub va yoyilmalar |
| 🇬🇧 Ingliz tili (9 mavzu) | So'z boyligi (110+ so'z, rasm va talaffuz 🔊), plurals, to be/have got, artikllar, zamonlar, predloglar, sifatlar, muloqot, reading |
| 🧠 Mantiq (17 mavzu) | Ulug'bek jumboqlari, rost-yolg'on, tanqidiy fikrlash, tartib, ortiqchasini top, analogiya, shakl qonuniyatlari, Eyler–Venn, hafta kunlari mantiqi, jadval mantiqi, qatordagi tartib, sandiq kodi, shartli mulohaza, shifrlar, eng yomon holat; **Zukko oila sirlari** (33) va **Sho'rqo'rg'on sarguzashtlari** (68) hikoyali jumboqlari |
| 📝 Imtihon | PM 1-bosqich sinovi (30 savol, 45 daqiqa), Al-Xorazmiy darajasi (25 savol, qiyin), ingliz tili testi, mini-test; javoblar tahlili |
| 🎮 O'yinlar | Sudoku (4×4 mevali → 9×9 usta), Tangram (17 shakl), Mantiqiy zanjir + Sonli piramida, Saralash (ball sort), Konstruktor (polimino), Shaxmat va Shashka (3 darajali kompyuter), Qwirkle, SET (Junior/Klassik), Xotira (English), Tezkor hisob, Kod buzar, Hanoy minorasi, 15 jumboq |
| 🏆 Rag'bat | Tangalar 🪙, XP va darajalar, 8 ta unvon, 22 ta nishon, yulduzlar ⭐, baho (2–5), kunlik vazifalar va sovg'a, kunlik seriya 🔥, do'kon (26 qahramon, 5 mavzu-rang) |
| 👨‍👩‍👧 Ota-onalar | Mavzular bo'yicha aniqlik, kuchsiz mavzular tavsiyasi, 7 kunlik faollik, sozlamalar |

Har bir mavzuda 3 daraja (Oson / O'rta / Qiyin) — 2 ta ⭐ olinsa keyingisi ochiladi. Xato javoblar "Xatolar ustida ishlash" bo'limiga tushadi.

## Ishga tushirish
Hech qanday build kerak emas — oddiy statik sayt (HTML/CSS/JS).
- Lokal: papkada `python3 -m http.server` → `http://localhost:8000`
- **GitHub Pages:** repoga yuklang → Settings → Pages → Branch: `main`, folder: `/ (root)` → Save. Bir daqiqadan so'ng `https://<username>.github.io/<repo>/` manzilida ochiladi.
- Telefonga o'rnatish: saytni Chrome'da oching → "Bosh ekranga qo'shish" (PWA, oflayn ham ishlaydi).

## Tuzilishi
```
index.html          css/style.css        manifest.json  sw.js  icons/icon.svg
js/core.js          — holat, tangalar, nishonlar, ovoz, navigatsiya
js/q-math.js        — matematika generatorlari
js/q-eng.js         — ingliz tili
js/q-logic.js       — mantiq va tanqidiy fikrlash
js/q-story.js       — hikoyali jumboqlar banki
js/q-extra.js       — qo'shimcha mavzular (yagona yechim kompyuterda tekshiriladi)
js/quiz.js          — dars va imtihon dvigateli
js/app.js           — ekranlar
js/games/*.js       — o'yinlar
```
Yangi mavzu qo'shish: `Z.MATH` / `Z.ENG` / `Z.LOGIC` ro'yxatiga `{id, n, e, c, g(level)}` qo'shing — `g` funksiyasi `{q, opts, a, exp}` qaytaradi.
Progress brauzerning `localStorage`ida saqlanadi.

## 📱 Android ilova (APK)
Repoda `.github/workflows/android.yml` bor: `main` branchga har safar o'zgarish yuklanganda GitHub o'zi APK yig'adi (Capacitor yordamida).
1. Repo → **Actions** bo'limi → "Android APK" → oxirgi ishga tushirish (yashil ✔).
2. Pastdagi **Artifacts** → `zukko-apk` → yuklab oling (zip ichida `app-debug.apk`).
3. Telefonga o'tkazib o'rnating (sozlamalarda "noma'lum manbalardan o'rnatish"ga ruxsat bering).

Lokal yig'ish (Android Studio bo'lsa): `npm install && npm run build && npx cap add android && npx cap sync android && npx cap open android`.
