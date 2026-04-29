---
name: Skill Project
description: Every you change file or add file
---

## Referensi & dokumentasi
- Selalu gunakan Context7 saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API (resolve Library ID lalu ambil dokumentasi otomatis).
- Selalu gunakan Nuxt MCP saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API.
- Selalu gunakan Vuetify MCP saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API.
- Jika menggunakan model GLM 4.7, gunakan tools MCP zai-mcp-server untuk melihat image.

## Testing & verifikasi
- Perintah dasar menjalankan unit test: `npm run test:run`.
- Setelah mengubah sesuatu di project ini, selalu jalankan: `npm run lint` dan `npm run typecheck`. Kalau ada error lint atau typescript di check dan fix.
- Jangan jalankan aplikasi/dev server; sudah berjalan. Cukup jalankan unit test dan perbaiki jika ada error.
- Jika ada perubahan pada flow/komponen, buat unit test untuk alur tersebut, jalankan test, dan perbaiki jika ada error.
- Periksa apakah komponen atau file JS/TS yang diubah sudah memiliki unit test. Jika belum dan memungkinkan, buat unit test untuk memastikan skrip berjalan lancar.

## Arsitektur & struktur kode
- Jangan terlalu banyak baris dalam 1 file. Prefer struktur dengan banyak file kecil yang penting, spesifik, mudah di-maintenance, dan di-debug.
- Jika sudah ada composable/model/helper untuk suatu endpoint atau flow, selalu reuse (jangan duplikasi logic atau fetch yang sama di tempat lain). Buat file/komponen baru hanya jika benar-benar perlu.
- Jika perlu call endpoint/service baru, buat composable khusus di `app/composables` (dan type/response di `app/model`) agar SSR-friendly, reusable, dan mudah dites.
- Untuk data yang dipakai lintas halaman (contoh: landing data), orkestrasi call service dilakukan di `app/composables/useLandingData.ts` agar konsisten dan mudah di-cache/SSR.

## Kualitas & UI/SEO
- Hindari penggunaan tipe data `any` sebisa mungkin.
- Jangan buat interface di komponen; letakkan di folder khusus `model`.
- Tampilan harus responsif di berbagai ukuran layar dan enak dilihat.
- Pastikan aplikasi SEO-friendly.
- Pastikan tidak ada error atau warning di console browser.