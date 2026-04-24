# IPTV PRO Player - Node.js Edition

تطبيق IPTV متقدم مع دعم كامل للبث المباشر والأفلام والمسلسلات.

## المميزات

✅ **بروكسي Node.js** - تجاوز CORS تلقائياً
✅ **دعم 4K/HEVC** - مع fallback تلقائي
✅ **محركات متعددة** - Hls.js, Video.js, Direct
✅ **بحث شامل** - في جميع القنوات والمحتوى
✅ **واجهة عربية** - RTL كاملة

## التشغيل المحلي

```bash
# تشغيل السيرفر
node server.js

# أو باستخدام npm
npm start
```

ثم افتح المتصفح على: **http://localhost:8000**

## النشر على Render.com

### الخطوات:

1. سجل حساب على [render.com](https://render.com)
2. اضغط **"New +"** → **"Web Service"**
3. اختر **"Connect Repository"** واربط هذا الـ repo
4. الإعدادات:
   - **Environment:** Node
   - **Build Command:** (اتركه فاضي)
   - **Start Command:** `node server.js`
5. اضغط **"Create Web Service"**

خلال دقيقتين سيكون التطبيق جاهز على رابط مثل:
`https://your-app.onrender.com`

## البنية التقنية

```
├── index.html      # الواجهة الرئيسية
├── style.css       # التصميم
├── api.js          # XtreamAPI wrapper
├── app.js          # المنطق الرئيسي + المشغل
├── server.js       # Node.js proxy server
└── package.json    # Node.js dependencies
```

## المحركات المتاحة

1. **⚡ Hls.js** - موصى به للبث المباشر (Live TV)
2. **🎬 Video.js** - للبث المتقدم مع VHS
3. **🔗 مباشر** - للأفلام والمسلسلات (VOD)

## استكشاف الأخطاء

### الفيديو لا يعمل
- جرب تغيير المحرك من القائمة
- للمحتوى 4K: استخدم Edge أو Safari (دعم H.265)

### CORS errors
- البروكسي يحل المشكلة تلقائياً

---

**Built with ❤️ for IPTV enthusiasts**
