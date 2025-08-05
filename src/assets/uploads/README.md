# Uploads - Video Background

Folder ini berisi file-file upload seperti video background.

## File yang Diperlukan

- `background-video.webm` - Video background utama portal

## Format Video yang Didukung

- **WebM** (direkomendasikan untuk performa terbaik)
- MP4 (fallback untuk browser lama)
- OGV (untuk browser lama)

## Spesifikasi Video yang Direkomendasikan

- **Codec**: VP9 atau H.264
- **Resolution**: 1920x1080 (Full HD) atau 1280x720 (HD)
- **Frame Rate**: 24-30 fps
- **Bitrate**: 1-2 Mbps untuk WebM
- **Duration**: 10-30 detik (loop)
- **File Size**: < 5MB untuk performa optimal

## Cara Penggunaan

```vue
<video autoplay muted loop class="bg-video">
  <source :src="getAssetUrl(`uploads/${bgVideo.isi}`)" type="video/webm">
  <!-- Fallback untuk browser yang tidak mendukung WebM -->
  <source :src="getAssetUrl(`uploads/background-video.mp4`)" type="video/mp4">
</video>
```

## Optimasi Video

1. **Compress video** menggunakan tools seperti FFmpeg
2. **Gunakan WebM format** untuk performa terbaik
3. **Sesuaikan bitrate** dengan kebutuhan
4. **Gunakan loop** untuk video pendek
5. **Tambahkan fallback** untuk browser lama

## Contoh FFmpeg Command

```bash
# Convert ke WebM dengan optimasi
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm

# Convert ke MP4 dengan optimasi
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac output.mp4
```

## Best Practices

- Video harus **muted** untuk autoplay
- Gunakan **loop** untuk pengalaman yang konsisten
- Sediakan **fallback** untuk browser yang tidak mendukung
- Optimalkan **file size** untuk loading yang cepat
- Test di berbagai **browser** dan device
