# Portfolio Site Landing

Landing page portfolio berbasis Nuxt 4 dengan dukungan SSR, i18n, dan UI Vuetify.

## Stack Utama

- Nuxt 4
- Vue 3
- Vuetify (`vuetify-nuxt-module`)
- `@nuxtjs/i18n`
- Vitest (`unit` dan `e2e`)
- Docker + reverse proxy host

## Prasyarat

- Node.js 24.x
- npm 11+
- Docker Desktop (opsional, untuk jalur container)
- Backend API yang dapat diakses (untuk data landing)

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Siapkan konfigurasi runtime lokal secara private sesuai kebutuhan environment Anda.

3. Jalankan development server:

```bash
npm run dev
```

Akses aplikasi di `http://localhost:3000`.

## Scripts

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan server development Nuxt. |
| `npm run build` | Build production (`nuxt build`). |
| `npm run preview` | Menjalankan hasil build secara lokal. |
| `npm run generate` | Static generate. |
| `npm run lint` | Lint dan auto-fix dengan ESLint. |
| `npm run typecheck` | Type checking dengan `nuxi typecheck`. |
| `npm run test:run` | Menjalankan unit test. |
| `npm run test:e2e` | Menjalankan e2e test. |

## Quality Checks

Minimal sebelum merge/perubahan besar:

```bash
npm run lint
npm run typecheck
npm run test:run
```

## Menjalankan Dengan Docker

Repo ini sekarang hanya mempertahankan jalur container untuk `local/default` dan `production`.
Reverse proxy `nginx` diasumsikan berada di host/server, bukan di dalam Docker Compose project ini.

1. Pastikan external network tersedia:

```bash
docker network create global_portfolio_site_network
```

2. Pastikan konfigurasi runtime container Anda sudah disiapkan secara private dan sesuai topologi backend Anda.

3. Build dan jalankan:

```bash
docker compose down
docker compose up --build -d
```

4. Akses aplikasi di `http://localhost:3000`.
   Default compose langsung mengekspos container Nuxt ke host pada `127.0.0.1:3000`, jadi cocok jika reverse proxy `nginx` sudah ada di host/server.

Untuk production, gunakan override berikut:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

5. Cek log jika diperlukan:

```bash
docker compose logs -f portfolio_site_landing
```

## Troubleshooting

- `network global_portfolio_site_network not found`:
  jalankan `docker network create global_portfolio_site_network`.
- Build menampilkan log `503 Service Unavailable` saat prerender:
  build tetap bisa selesai, namun backend tidak merespons saat proses prerender route.
- Halaman fail hard saat backend error:
  periksa konfigurasi runtime backend handling di environment Anda.

## Referensi

- Nuxt Docs: https://nuxt.com/docs/4.x/getting-started/introduction
- Nuxt Deployment: https://nuxt.com/docs/4.x/getting-started/deployment
- Vuetify Nuxt Module: https://nuxt.vuetifyjs.com/
