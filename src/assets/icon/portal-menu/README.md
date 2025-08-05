# Portal Menu Icons

Folder ini berisi icon-icon yang digunakan untuk menu portal.

## File yang Diperlukan

- `icon-c60abfabe8d2c855a4c84b8d11d0c3c0.png` - Icon BUMD
- `icon-f8d4d45d4106e2ebc0a99c41391cdc78.png` - Icon Layanan
- `icon-9fafcc2358042db7209cc2a063a508d0.png` - Icon OPD
- `icon-5aab3a929d3625a85b1607076d6923ff.png` - Icon Pengaduan
- `icon-443529ab0c3176961b7aa395d81be378.png` - Icon PPID

## Icon Submenu (Contoh)

- `icon-health.png` - Icon kesehatan
- `icon-transport.png` - Icon transportasi
- `icon-general.png` - Icon layanan umum
- `icon-hospital.png` - Icon rumah sakit
- `icon-school.png` - Icon sekolah

## Format yang Didukung

- PNG (direkomendasikan)
- SVG (untuk icon yang scalable)
- WebP (untuk optimasi)

## Ukuran yang Direkomendasikan

- Menu utama: 40px x 40px
- Submenu: 40px x 40px
- Maksimal: 100px x 100px

## Cara Penggunaan

```vue
<img class="menu-logo" :src="getAssetUrl(`icon/portal-menu/${menulist.icon}`)" :alt="menulist.judul" />
```

## Naming Convention

- Gunakan prefix `icon-` untuk semua icon
- Gunakan nama yang deskriptif
- Gunakan lowercase dan dash untuk pemisah kata
- Contoh: `icon-bumd-kesehatan.png`
