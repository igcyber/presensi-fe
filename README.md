# Portal Admin - Kabupaten Kutai Kartanegara

Portal resmi Kabupaten Kutai Kartanegara yang dikembangkan menggunakan Vue 3 dengan TypeScript.

## 🚀 Fitur

- **Portal Menu**: Menu utama dengan submenu yang dapat dikategorikan
- **Responsive Design**: Desain yang responsif untuk berbagai ukuran layar
- **Background Video**: Video background yang otomatis diputar
- **Interactive Submenu**: Submenu yang dapat dibuka/tutup dengan animasi
- **External Link Handling**: Penanganan link eksternal yang otomatis

## 🛠️ Teknologi yang Digunakan

- **Vue 3** - Framework JavaScript progresif
- **TypeScript** - Superset JavaScript dengan type safety
- **Vite** - Build tool yang cepat
- **Composition API** - API Vue 3 untuk logic reuse
- **CSS3** - Styling dengan animasi dan responsive design

## 📁 Struktur Project

```
src/
├── assets/                 # Asset statis (gambar, icon, video)
│   ├── images/            # Gambar utama
│   ├── icon/              # Icon menu
│   ├── uploads/           # File upload (video background)
│   └── mini-img/          # Gambar mini
├── composables/           # Logic yang dapat digunakan kembali
│   ├── usePortal.ts       # Composable untuk portal
│   └── useFormatters.ts   # Composable untuk formatting
├── pages/                 # Halaman aplikasi
│   ├── portal/            # Halaman portal
│   └── dashboard/         # Halaman dashboard
├── stores/                # State management
└── router/                # Vue Router configuration
```

## 🎯 Composable: usePortal

Composable `usePortal` menyediakan fungsi-fungsi untuk mengelola portal:

### Interface

```typescript
interface MenuItem {
  id: number
  judul: string
  link: string
  icon: string
  created_at: string
  updated_at: string
}

interface SubMenuItem {
  id: number
  judul: string
  link: string
  icon?: string
}

interface Category {
  id: number
  judul: string
  sub: SubMenuItem[]
}

interface ContainerMenuItem extends MenuItem {
  sub: SubMenuItem[]
  kat: Category[]
}
```

### Fungsi yang Tersedia

- `menus` - Data menu utama
- `containerMenus` - Data container menu dengan submenu
- `openSubMenu` - State submenu yang sedang terbuka
- `hasOpenSubMenu` - Computed property untuk mengecek submenu terbuka
- `toggleSubMenu(id)` - Fungsi untuk membuka/menutup submenu
- `closeSubMenu()` - Fungsi untuk menutup submenu
- `getAssetUrl(path)` - Fungsi untuk mendapatkan URL asset
- `isExternalLink(link)` - Fungsi untuk mengecek link eksternal
- `getTargetAttribute(link)` - Fungsi untuk mendapatkan target attribute

## 🎨 Styling

Project menggunakan CSS custom dengan variabel CSS untuk konsistensi:

```css
:root {
  --green: #00A85F;
  --green2: #00884d;
  --blue4: rgba(13, 52, 85, 0.8);
  --blue5: #0d3455;
  --hr: rgb(224, 224, 224);
}
```

### Animasi

- `slideUp` - Animasi slide up untuk submenu
- `slideDown` - Animasi slide down untuk submenu
- `upDown` - Animasi up down untuk arrow

### Responsive Design

Project mendukung berbagai ukuran layar:
- Desktop (1000px+)
- Tablet (700px - 1000px)
- Mobile (450px - 700px)
- Small Mobile (< 450px)

## 🚀 Cara Menjalankan

### Instalasi Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build untuk Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 📝 Cara Penggunaan

### Menambahkan Menu Baru

1. Tambahkan data menu di `usePortal.ts`:

```typescript
const menus = ref<MenuItem[]>([
  {
    id: 6,
    judul: "Menu Baru",
    link: "#",
    icon: "icon-menu-baru.png",
    created_at: "2024-01-01 00:00:00",
    updated_at: "2024-01-01 00:00:00"
  }
])
```

2. Tambahkan container menu jika diperlukan:

```typescript
const containerMenus = ref<ContainerMenuItem[]>([
  {
    id: 6,
    judul: "Menu Baru",
    link: "#",
    icon: "icon-menu-baru.png",
    created_at: "2024-01-01 00:00:00",
    updated_at: "2024-01-01 00:00:00",
    sub: [
      {
        id: 1,
        judul: "Submenu 1",
        link: "https://example.com",
        icon: "icon-submenu.png"
      }
    ],
    kat: [
      {
        id: 1,
        judul: "Kategori 1",
        sub: [
          {
            id: 2,
            judul: "Submenu Kategori",
            link: "https://example.com",
            icon: "icon-submenu.png"
          }
        ]
      }
    ]
  }
])
```

### Menambahkan Asset

1. Letakkan gambar di `src/assets/images/`
2. Letakkan icon di `src/assets/icon/portal-menu/`
3. Letakkan video di `src/assets/uploads/`

## 🔧 Konfigurasi

### Vite Config

Project menggunakan Vite dengan konfigurasi untuk:
- Vue 3 support
- TypeScript support
- Path alias (@/ untuk src/)
- Asset handling

### TypeScript Config

TypeScript dikonfigurasi untuk:
- Strict mode
- Vue 3 support
- Path mapping
- Modern JavaScript features

## 📄 Lisensi

© 2024 Kabupaten Kutai Kartanegara All Rights Reserved - Developed by Diskominfo Kukar

## 🤝 Kontribusi

Untuk berkontribusi pada project ini:

1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi tim Diskominfo Kukar.
