# Rules Workspace (ringkas & operasional)

## Referensi & dokumentasi
- Selalu gunakan Context7 saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API (resolve Library ID lalu ambil dokumentasi otomatis).
- Selalu gunakan Nuxt MCP saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API.
- Selalu gunakan Vuetify MCP saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API.

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

## Struktur folder project
```
portfolio-site-landing/
  app/
    app.vue
    components/
    composables/
    layouts/
    models/
    pages/
    plugins/
    utils/
  i18n/
  public/
  tests/
    utils/
    e2e/
  sample/
  docker/
    nginx/
  .trae/
    rules/
    skills/
  nuxt.config.ts
  vitest.config.ts
  eslint.config.mjs
  package.json
```

- `app/`: source utama Nuxt (UI + logika).
- `app/app.vue`: root app; setup global head/theme.
- `app/pages/`: routing berbasis file (halaman publik).
- `app/layouts/`: layout wrapper untuk halaman (navbar/footer, dsb).
- `app/components/`: komponen UI reusable (section/partial).
- `app/composables/`: reusable data fetching/state (SSR-friendly). Orkestrasi data lintas halaman di sini.
- `app/models/`: type/interface untuk data domain (hindari define interface di komponen).
- `app/utils/`: helper murni (formatting, mapping, transform).
- `app/plugins/`: plugin Nuxt (client/server hook, side effects terkontrol).
- `i18n/`: konfigurasi i18n (locale, message, strategy).
- `public/`: aset statis yang diserve apa adanya (favicon, robots, sw, dsb).
- `tests/utils/`: unit test untuk utilitas (Vitest).
- `tests/e2e/`: e2e test berbasis `@nuxt/test-utils/e2e` (jalanin server Nuxt test).
- `sample/`: dokumen/spec contoh untuk kebutuhan backend/CMS dan catatan teknis.
- `docker/`: konfigurasi container & nginx untuk environment deploy.
- `.trae/`: rules/skill internal untuk asistensi di IDE.
- `nuxt.config.ts`: konfigurasi Nuxt (module, runtimeConfig, build).
- `vitest.config.ts`: konfigurasi Vitest multi-project (unit & e2e).
- `eslint.config.mjs`: konfigurasi linting.
- `package.json`: scripts & dependency (lihat `test:run` unit-only dan `test:e2e`).
