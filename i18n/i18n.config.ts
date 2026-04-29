export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'id',
    fallbackLocale: 'id',
    messages: {
      id: {
        title: 'Bahasa Indonesia',
        lang: 'id',
        dir: 'ltr',
        nav: {
          home: 'Beranda',
          portfolio: 'Portfolio',
          experience: 'Pengalaman',
          about: 'Tentang Saya',
          education: 'Pendidikan',
          certifications: 'Sertifikasi',
          cv: 'CV'
        },
        home: {
          hello: 'Halo, saya'
        },
        experience: {
          heading: 'Pengalaman'
        },
        about: {
          connect: 'Hubungi Saya',
          specialize: 'Saya spesialis dalam membangun aplikasi web modern menggunakan teknologi terbaru. Fokus saya adalah pada performa, aksesibilitas, dan pengalaman pengguna.'
        },
        portfolio: {
          title: 'Portfolio',
          description: 'Lihat proyek-proyek yang pernah saya kerjakan.',
          details: 'Detail'
        },
        project: {
          title: 'Proyek',
          description: 'Deskripsi',
          role: 'Peran',
          stack: 'Stack Teknologi',
          contributions: 'Apa Saya Lakukan',
          outcomes: 'Hasil',
          github: 'GitHub',
          live: 'Live Demo',
          apiOnly: 'API-only / Tanpa UI',
          privateRepo: 'Repo Privat'
        },
        errors: {
          backendUnavailable: 'Data sedang tidak bisa dimuat karena backend bermasalah. Silakan coba lagi nanti.',
          retry: 'Coba lagi',
          backHome: 'Kembali ke Beranda',
          errorTitle: 'Terjadi kesalahan',
          errorDescription: 'Maaf, ada kendala pada layanan kami. Silakan coba lagi.'
        }
      },
      en: {
        title: 'English',
        lang: 'en',
        dir: 'ltr',
        nav: {
          home: 'Home',
          portfolio: 'Portfolio',
          experience: 'Experience',
          about: 'About Me',
          education: 'Education',
          certifications: 'Certifications',
          cv: 'CV'
        },
        home: {
          hello: "Hello, I'm"
        },
        experience: {
          heading: 'Experience'
        },
        about: {
          connect: 'Connect with me',
          specialize: 'I specialize in building modern web applications using the latest technologies. My focus is on performance, accessibility, and user experience.'
        },
        portfolio: {
          title: 'Portfolio',
          description: 'See projects I have worked on.',
          details: 'Details'
        },
        project: {
          title: 'Project',
          description: 'Description',
          role: 'Role',
          stack: 'Tech Stack',
          contributions: 'What I Did',
          outcomes: 'Outcomes',
          github: 'GitHub',
          live: 'Live Demo',
          apiOnly: 'API-only / No UI',
          privateRepo: 'Private Repo'
        },
        errors: {
          backendUnavailable: 'Data is temporarily unavailable because the backend is having an issue. Please try again later.',
          retry: 'Try again',
          backHome: 'Back to Home',
          errorTitle: 'Something went wrong',
          errorDescription: 'Sorry, we are having trouble right now. Please try again.'
        }
      }
    }
  }
})
