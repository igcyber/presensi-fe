# Assets Images

Folder ini berisi gambar-gambar utama yang digunakan dalam portal.

## File yang Diperlukan

- `kukar-logo.png` - Logo resmi Kabupaten Kutai Kartanegara

## Format yang Didukung

- PNG (direkomendasikan untuk logo dan icon)
- JPG/JPEG (untuk foto)
- WebP (untuk optimasi performa)

## Ukuran yang Direkomendasikan

- Logo: 120px height (responsive)
- Icon: 40px x 40px
- Gambar background: sesuai kebutuhan

## Cara Penggunaan

```vue
<img class="main-logo" :src="getAssetUrl('images/kukar-logo.png')" alt="logo-kukarkab" />
```
