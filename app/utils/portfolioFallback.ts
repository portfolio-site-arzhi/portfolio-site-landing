import type { Project } from '../models/Project'

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const renderListHtml = (items: string[]): string | undefined => {
  if (items.length === 0) return undefined

  const list = items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')

  return `<ul>${list}</ul>`
}

export const createFallbackProjects = (): Project[] => [
  {
    id: 1,
    slug: 'ecommerce-dashboard',
    title: 'Dashboard E-Commerce',
    description: 'Dashboard analitik komprehensif untuk pemilik toko e-commerce untuk melacak penjualan dan inventaris.',
    image: 'https://picsum.photos/seed/project1/600/400',
    role: 'Frontend Lead',
    contribution: renderListHtml([
      'Merancang arsitektur informasi dashboard dan komponen chart yang dapat digunakan ulang',
      'Mengimplementasikan caching dan deduplikasi request untuk pengalaman pengguna yang lebih lancar',
      'Memperkenalkan gerbang testing dan linting untuk pengiriman yang konsisten'
    ]),
    stack: ['Vue 3', 'TypeScript', 'Chart.js', 'Vite'],
    outcome: renderListHtml(['Meningkatkan performansi loading data dan responsivitas yang dirasakan']),
    link: 'https://example.com',
    github: 'https://github.com'
  },
  {
    id: 2,
    slug: 'task-management-app',
    title: 'Aplikasi Manajemen Tugas',
    description: 'Alat manajemen tugas kolaboratif real-time dengan papan kanban drag-and-drop.',
    image: 'https://picsum.photos/seed/project2/600/400',
    role: 'Senior Frontend',
    contribution: renderListHtml([
      'Membangun halaman dengan prioritas SSR dan UI kanban terkomponen untuk kemudahan pemeliharaan',
      'Mengimplementasikan update optimistik dan state UI yang toleran terhadap konflik',
      'Menambahkan event analitik dan error boundary untuk observabilitas'
    ]),
    stack: ['Nuxt', 'Vue 3', 'Vuetify', 'Firebase'],
    outcome: renderListHtml(['Mengurangi regresi UI dengan cakupan test pada utilitas kritis']),
    link: 'https://example.com',
    github: 'https://github.com'
  },
  {
    id: 3,
    slug: 'portfolio-website',
    title: 'Website Portfolio',
    description: 'Website portfolio modern yang dibangun dengan Nuxt dan Vuetify.',
    image: 'https://picsum.photos/seed/project3/600/400',
    role: 'Owner',
    contribution: renderListHtml([
      'Membangun halaman yang ramah SEO dengan SSR dan hierarki informasi yang bersih',
      'Membuat lapisan data yang dapat digunakan ulang untuk mempersiapkan integrasi CMS',
      'Mengimplementasikan halaman detail portfolio untuk proyek privat atau API-only'
    ]),
    stack: ['Nuxt', 'Vuetify', 'TypeScript'],
    outcome: renderListHtml(['Visual yang profesional dan jelas dengan gerakan yang halus'])
  },
  {
    id: 4,
    slug: 'payments-api',
    title: 'API Pembayaran',
    description: 'Layanan backend untuk orkestrasi pembayaran, webhooks, dan rekonsiliasi transaksi.',
    image: 'https://picsum.photos/seed/project4/600/400',
    role: 'Backend / API Developer',
    contribution: renderListHtml([
      'Merancang endpoint REST dan alur verifikasi signature webhook',
      'Mengimplementasikan strategi idempotensi untuk mencegah penagihan ganda',
      'Menambahkan logging terstruktur dan tracing untuk triase insiden yang lebih cepat'
    ]),
    stack: ['Node.js', 'PostgreSQL', 'Redis', 'OpenTelemetry'],
    outcome: renderListHtml(['Meningkatkan keandalan selama lalu lintas puncak dengan pemrosesan idempoten'])
  }
]
