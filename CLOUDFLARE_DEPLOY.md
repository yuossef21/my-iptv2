# نشر IPTV Player مع Cloudflare Workers

## المشكلة
Render.com يحظر الاتصالات الخارجية للـ streaming في الـ free tier.

## الحل: استخدام Cloudflare Workers + Pages

### الخطوة 1: نشر الـ Worker (Proxy)

1. سجل حساب على [cloudflare.com](https://cloudflare.com)
2. اذهب إلى **Workers & Pages**
3. اضغط **Create Application** → **Create Worker**
4. اختر اسم للـ worker (مثلاً: `iptv-proxy`)
5. اضغط **Deploy**
6. بعد النشر، اضغط **Edit Code**
7. احذف الكود الموجود والصق محتوى ملف `worker.js`
8. اضغط **Save and Deploy**
9. انسخ رابط الـ worker (مثلاً: `https://iptv-proxy.your-username.workers.dev`)

### الخطوة 2: تعديل الكود ليستخدم الـ Worker

افتح ملف `api.js` وعدّل السطر 8 و 25 و 44:

**قبل:**
```javascript
return `proxy.php?url=${encodeURIComponent(targetUrl)}`;
```

**بعد:**
```javascript
return `https://iptv-proxy.your-username.workers.dev/proxy?url=${encodeURIComponent(targetUrl)}`;
```

استبدل `iptv-proxy.your-username.workers.dev` برابط الـ worker الخاص بك.

### الخطوة 3: نشر الملفات الثابتة

**الخيار 1: Cloudflare Pages (موصى به)**
1. في Cloudflare، اذهب إلى **Workers & Pages**
2. اضغط **Create Application** → **Pages** → **Connect to Git**
3. اختر الـ repo: `yuossef21/my-iptv2`
4. الإعدادات:
   - **Build command:** (اتركه فاضي)
   - **Build output directory:** `/`
5. اضغط **Save and Deploy**

**الخيار 2: GitHub Pages**
1. في الـ repo على GitHub، اذهب إلى **Settings** → **Pages**
2. في **Source** اختر `main` branch
3. اضغط **Save**
4. الموقع سيكون: `https://yuossef21.github.io/my-iptv2/`

### الخطوة 4: تعديل رابط الـ Proxy في الكود

بعد نشر الـ Worker، عدّل ملف `api.js`:

```javascript
// استبدل كل "proxy.php" بـ رابط الـ worker
const PROXY_URL = 'https://iptv-proxy.your-username.workers.dev/proxy';
```

ثم ارفع التعديلات على GitHub:
```bash
git add .
git commit -m "Update proxy URL to Cloudflare Worker"
git push
```

---

## ملخص الحل

- **Cloudflare Worker** = الـ proxy (يتعامل مع CORS والـ streaming)
- **Cloudflare Pages أو GitHub Pages** = الملفات الثابتة (HTML, CSS, JS)

**المميزات:**
✅ مجاني 100%
✅ بدون حدود على الـ streaming
✅ سريع جداً (CDN عالمي)
✅ SSL مجاني

---

**هل تريد المساعدة في تطبيق هذه الخطوات؟**
