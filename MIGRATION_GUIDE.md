# Panduan Migrasi: Blade ke Vue

Dokumen ini menjelaskan proses migrasi dari Laravel Blade ke Vue 3 dengan TypeScript untuk Portal Kabupaten Kutai Kartanegara.

## 🔄 Perubahan Utama

### 1. Struktur File

**Sebelum (Blade):**
```
resources/views/
├── portal.blade.php
public/
├── js/portal.js
├── css/portal.css
└── assets/
    ├── images/
    ├── icon/
    └── uploads/
```

**Sesudah (Vue):**
```
src/
├── pages/portal/IndexPage.vue
├── composables/usePortal.ts
├── lib/config/portal.ts
├── assets/
│   ├── images/
│   ├── icon/portal-menu/
│   ├── uploads/
│   └── mini-img/
└── __tests__/portal.spec.ts
```

### 2. Data Management

**Sebelum (Blade):**
```php
// Controller
$menu = Menu::all();
$containermenu = ContainerMenu::with(['sub', 'kat'])->get();
$bgvideo = BackgroundVideo::first();
```

**Sesudah (Vue):**
```typescript
// Composable
const {
  menus,
  containerMenus,
  openSubMenu,
  hasOpenSubMenu,
  toggleSubMenu,
  closeSubMenu,
  getAssetUrl,
  isExternalLink,
  getTargetAttribute,
  config
} = usePortal()
```

### 3. Template Syntax

**Sebelum (Blade):**
```blade
@forelse ($menu as $menulist)
<a class="menu-item-wrapper" href="{{ $menulist->link }}"
   @if($menulist->link === "#")
   onclick="toggleSubMenu({{ $menulist->id }})"
   @else
   target="__blank"
   @endif>
   <img class="menu-logo" src="{{ asset('icon/portal-menu/'. $menulist->icon ) }}" alt="" />
   <p class="menu-title">{{ $menulist->judul }}</p>
</a>
@empty
@endforelse
```

**Sesudah (Vue):**
```vue
<a 
  v-for="menulist in menus" 
  :key="menulist.id"
  class="menu-item-wrapper" 
  :href="menulist.link"
  @click="menulist.link === '#' ? toggleSubMenu(menulist.id) : null"
  :target="getTargetAttribute(menulist.link)"
>
  <img 
    class="menu-logo" 
    :src="getAssetUrl(`${config.assets.icons}${menulist.icon}`)" 
    :alt="menulist.judul" 
  />
  <p class="menu-title">{{ menulist.judul }}</p>
</a>
```

### 4. JavaScript Logic

**Sebelum (portal.js):**
```javascript
toggleSubMenu = function (id) {
  const subMenu = document.getElementById(`submenu-${id}`);
  const getSubMenuDisplay = subMenu.style.getPropertyValue('display');
  
  if(getSubMenuDisplay !== 'block'){
    subMenu.style.display = 'block';
    document.querySelector('.container').style.overflow = 'hidden'
  }
  else{
    subMenu.style.display = 'none';
    document.querySelector('.container').style.overflow = 'auto'
  }
}
```

**Sesudah (usePortal.ts):**
```typescript
const openSubMenu = ref<number | null>(null)

const toggleSubMenu = (id: number) => {
  if (openSubMenu.value === id) {
    openSubMenu.value = null
  } else {
    openSubMenu.value = id
  }
}

const closeSubMenu = () => {
  openSubMenu.value = null
}
```

## 🎯 Keuntungan Migrasi

### 1. Type Safety
- TypeScript memberikan type checking yang ketat
- Interface yang jelas untuk data structure
- Error detection pada compile time

### 2. Reusability
- Composable pattern untuk logic reuse
- Konfigurasi terpusat
- Helper functions yang dapat digunakan di seluruh aplikasi

### 3. Maintainability
- Kode yang lebih terstruktur
- Separation of concerns yang jelas
- Testing yang lebih mudah

### 4. Performance
- Reactive system Vue 3
- Optimized rendering
- Better memory management

## 📁 Struktur Baru

### Composable (`usePortal.ts`)
- Mengelola state aplikasi
- Menyediakan fungsi-fungsi helper
- Type definitions

### Configuration (`portal.ts`)
- Konfigurasi terpusat
- Asset paths
- Menu settings
- Helper functions

### Components (`IndexPage.vue`)
- Template yang reactive
- Logic yang terpisah
- Styling yang modular

### Assets
- Struktur folder yang terorganisir
- Dokumentasi untuk setiap folder
- Best practices untuk file management

## 🔧 Cara Penggunaan

### Menambahkan Menu Baru
1. Update data di `usePortal.ts`
2. Tambahkan icon di `src/assets/icon/portal-menu/`
3. Update konfigurasi jika diperlukan

### Mengubah Konfigurasi
1. Edit file `src/lib/config/portal.ts`
2. Semua perubahan akan otomatis teraplikasi

### Menambahkan Asset
1. Letakkan file di folder yang sesuai
2. Gunakan `getAssetUrl()` untuk referensi
3. Ikuti naming convention yang ada

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### Test Coverage
- Portal configuration
- Helper functions
- Composable logic
- Data structure validation

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 📝 Best Practices

### 1. Type Safety
- Selalu gunakan TypeScript interfaces
- Hindari `any` type
- Gunakan strict mode

### 2. Code Organization
- Pisahkan logic ke composables
- Gunakan konfigurasi terpusat
- Ikuti naming conventions

### 3. Performance
- Gunakan computed properties
- Optimasi asset loading
- Implementasi lazy loading jika diperlukan

### 4. Maintainability
- Dokumentasi yang jelas
- Testing yang komprehensif
- Code review yang teratur

## 🔄 Migration Checklist

- [x] Struktur file Vue
- [x] Data management dengan composables
- [x] Template migration
- [x] JavaScript logic migration
- [x] Asset organization
- [x] Configuration management
- [x] TypeScript implementation
- [x] Testing setup
- [x] Documentation
- [x] Best practices implementation

## 📞 Support

Untuk pertanyaan atau dukungan terkait migrasi, silakan hubungi tim Diskominfo Kukar. 