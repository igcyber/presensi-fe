# Public Assets - Portal Admin

Folder ini berisi asset statis yang dapat diakses langsung dari browser.

## 📁 Struktur File

```
public/
├── kukar-logo.png          # Logo utama portal
├── portal-video.webm       # Video background
├── favicon.ico             # Favicon website
└── README.md               # Dokumentasi ini
```

## 🖼️ Images

### Logo
- **File**: `kukar-logo.png`
- **Ukuran**: 120px height (responsive)
- **Format**: PNG dengan transparansi
- **Usage**: `<img src="/kukar-logo.png" alt="logo-kukarkab" />`

### Favicon
- **File**: `favicon.ico`
- **Ukuran**: 16x16, 32x32, 48x48 pixels
- **Format**: ICO (multiple sizes)
- **Usage**: Otomatis digunakan oleh browser

## 🎥 Video

### Background Video
- **File**: `portal-video.webm`
- **Format**: WebM (VP9 codec)
- **Duration**: 10-30 detik (loop)
- **Resolution**: 1920x1080 atau 1280x720
- **File Size**: < 5MB
- **Usage**: `<video src="/portal-video.webm" autoplay muted loop />`

## 📝 Best Practices

### 1. File Naming
- Gunakan kebab-case untuk nama file
- Deskriptif dan mudah dipahami
- Hindari spasi dan karakter khusus

### 2. Optimization
- Compress images sebelum upload
- Gunakan format yang sesuai (WebP untuk images, WebM untuk video)
- Optimize file size untuk performa

### 3. Accessibility
- Selalu gunakan alt text untuk images
- Sediakan fallback untuk video
- Test dengan screen readers

### 4. Performance
- Lazy load images jika diperlukan
- Use appropriate image sizes
- Consider CDN untuk production

## 🔧 Development

### Adding New Assets
1. Letakkan file di folder `public/`
2. Gunakan path absolut dari root
3. Update dokumentasi jika diperlukan

### Example Usage
```html
<!-- Image -->
<img src="/kukar-logo.png" alt="Logo Kukar" />

<!-- Video -->
<video autoplay muted loop>
  <source src="/portal-video.webm" type="video/webm">
  <source src="/portal-video.mp4" type="video/mp4">
</video>

<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

## 🚀 Production

### Build Process
- Assets di folder `public/` akan di-copy ke `dist/`
- Path tetap sama seperti development
- Optimized untuk production

### CDN Setup
Untuk production, pertimbangkan menggunakan CDN:
```html
<!-- Development -->
<img src="/kukar-logo.png" />

<!-- Production with CDN -->
<img src="https://cdn.example.com/kukar-logo.png" />
```

## 📊 File Optimization

### Images
```bash
# Optimize PNG
pngquant --quality=65-80 kukar-logo.png

# Convert to WebP
cwebp -q 80 kukar-logo.png -o kukar-logo.webp
```

### Video
```bash
# Optimize WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm

# Create MP4 fallback
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac output.mp4
```

## 🔍 Troubleshooting

### Common Issues
1. **File not found**: Periksa path dan nama file
2. **Large file size**: Optimize file sebelum upload
3. **Video not playing**: Periksa format dan codec support
4. **Image not loading**: Periksa file permissions

### Debug Tips
- Gunakan browser DevTools untuk inspect network requests
- Periksa console untuk error messages
- Test di berbagai browser dan devices

## 📚 Resources

- [WebP Image Format](https://developers.google.com/speed/webp)
- [WebM Video Format](https://www.webmproject.org/)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Video Optimization](https://web.dev/fast/#optimize-your-videos) 