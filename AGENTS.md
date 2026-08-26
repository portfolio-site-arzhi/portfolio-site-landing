# Rules Workspace (ringkas & operasional)

## File rules
- Jangan membuat, menghapus, atau mengubah file aturan (`AGENTS.md`, `rules.md`, dan seluruh file dalam folder `rules/`) kecuali user meminta secara eksplisit.

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

## Taste dan Ritme UI
- Untuk perubahan visual, audit dahulu brand, layout, dan pola yang sudah ada; jangan mengubah struktur informasi, navigasi, atau copy tanpa permintaan eksplisit user.
- Wajib gunakan skill `design-taste-frontend` untuk perubahan substansial pada layout, typography, visual hierarchy, atau motion. Skill ini tidak diperlukan untuk task logic, data-only, atau perubahan visual kecil yang sepenuhnya mengikuti pola yang sudah ada.
- Terapkan prinsip taste skill secara kontekstual. Contoh React atau Tailwind di dalam skill tidak menggantikan stack utama project ini: Nuxt, Vue, dan Vuetify.
- Utamakan hierarki, spacing yang konsisten, serta state responsif dan aksesibel untuk fokus, helper text, dan error form.
- Hindari pola visual generik atau dekorasi yang tidak mendukung konten; perubahan desain harus memiliki alasan yang jelas dan tetap selaras dengan identitas landing yang ada.
- Motion harus memiliki fungsi storytelling, hierarchy, feedback, atau state transition. Gunakan CSS dan IntersectionObserver untuk motion umum yang ringan.
- GSAP hanya boleh digunakan untuk sequence scroll yang benar-benar membutuhkan scrub atau choreography. GSAP wajib di-lazy-load hanya di client, memiliki cleanup, menyediakan fallback responsif, dan menghormati `prefers-reduced-motion`.
- Dilarang memakai scroll hijacking, custom cursor, WebGL, autoplay video berukuran besar, animasi dekoratif tanpa tujuan, atau mengubah information architecture dan copy tanpa permintaan eksplisit user.

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
