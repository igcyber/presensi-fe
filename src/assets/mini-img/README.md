# Mini Images

Folder ini berisi gambar-gambar mini yang digunakan dalam portal.

## File yang Diperlukan

- `Kantor_Bupati_Kutai_Kartanegara.png` - Gambar kantor bupati (saat ini dinonaktifkan)

## Format yang Didukung

- PNG (direkomendasikan untuk transparansi)
- JPG/JPEG (untuk foto)
- WebP (untuk optimasi performa)

## Ukuran yang Direkomendasikan

- Mini images: 100px height
- Aspect ratio: 16:9 atau 4:3
- File size: < 100KB

## Cara Penggunaan

```vue
<!-- Saat ini dinonaktifkan dalam template -->
<div class="backround-bottom-wrapper">
  <div class="bg-image-wrapper">
    <img
      class="bg-bottom-image"
      id="bg-bottom-1"
      :src="getAssetUrl('mini-img/Kantor_Bupati_Kutai_Kartanegara.png')"
      alt="Kantor Bupati Kutai Kartanegara"
    />
  </div>
</div>
```

## CSS Styling

```css
.bg-image-wrapper {
  width: max-content;
  height: 200px;
}

.bg-bottom-image {
  height: 100px;
}
```

## Optimasi

- Gunakan format WebP untuk performa terbaik
- Compress gambar tanpa mengurangi kualitas
- Sediakan fallback untuk browser lama
- Gunakan lazy loading untuk gambar yang tidak critical
