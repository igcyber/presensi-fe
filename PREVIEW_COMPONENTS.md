# File Preview Components

Dokumentasi untuk component preview file yang reusable dan sesuai dengan best practice.

## 📁 Components

### 1. FilePreviewDialog

Component dialog modal untuk menampilkan preview berbagai jenis file.

#### Features:

- ✅ **Multi-format Support**: Image, Video, Audio, PDF
- ✅ **Responsive Design**: Mobile-friendly dengan fullscreen mode
- ✅ **Zoom Controls**: Zoom in/out untuk gambar
- ✅ **Download & External Link**: Aksi download dan buka di tab baru
- ✅ **File Information**: Tampilan detail file
- ✅ **Keyboard Navigation**: ESC untuk close, arrow keys untuk navigasi
- ✅ **Accessibility**: ARIA labels dan keyboard support

#### Props:

```typescript
interface Props {
  open: boolean; // Control dialog visibility
  file: FilePreviewData | null; // File data untuk preview
  title?: string; // Dialog title
  showDownload?: boolean; // Show download button
  showExternalLink?: boolean; // Show external link button
  showFileInfo?: boolean; // Show file information
  maxWidth?: string; // Max dialog width
  maxHeight?: string; // Max dialog height
}
```

#### File Data Interface:

```typescript
interface FilePreviewData {
  url: string; // File URL (required)
  name?: string; // File name
  size?: number; // File size in bytes
  type?: string; // MIME type
  lastModified?: string | Date; // Last modified date
  description?: string; // File description
}
```

#### Usage:

```vue
<template>
  <FilePreviewDialog
    v-model:open="isPreviewOpen"
    :file="selectedFile"
    title="Preview Dokumen"
    :show-download="true"
    :show-external-link="true"
    :show-file-info="true"
    @download="handleDownload"
    @external-link="handleExternalLink"
  />
</template>

<script setup>
import { ref } from "vue";

import { FilePreviewDialog } from "@/components/dialogs";

const isPreviewOpen = ref(false);
const selectedFile = ref({
  url: "https://example.com/document.pdf",
  name: "document.pdf",
  size: 1024000,
  type: "application/pdf",
});

const handleDownload = (file) => {
  // Handle download logic
};

const handleExternalLink = (file) => {
  // Handle external link logic
};
</script>
```

### 2. useFilePreview Composable

Composable untuk mengelola state dan logic FilePreviewDialog.

#### Features:

- ✅ **State Management**: Centralized state untuk dialog
- ✅ **Helper Methods**: Shortcut methods untuk berbagai jenis file
- ✅ **File Type Detection**: Auto-detect file type
- ✅ **Download Handler**: Built-in download functionality

#### Methods:

```typescript
const filePreview = useFilePreview();

// General preview
filePreview.previewFile(fileData, options);

// Specialized methods
filePreview.previewImage(imageUrl, imageName, options);
filePreview.previewPDF(pdfUrl, pdfName, options);
filePreview.previewVideo(videoUrl, videoName, options);

// Utilities
filePreview.detectFileType(fileData);
filePreview.canPreview(fileData);
filePreview.closePreview();
```

#### Usage:

```vue
<template>
  <div>
    <button @click="previewDocument">Preview PDF</button>
    <button @click="previewImage">Preview Image</button>

    <!-- Dialog akan muncul otomatis -->
    <FilePreviewDialog
      v-model:open="filePreview.isOpen.value"
      :file="filePreview.currentFile.value"
      :title="filePreview.options.value.title"
      @download="filePreview.handleDownload"
      @external-link="filePreview.handleExternalLink"
    />
  </div>
</template>

<script setup>
import { FilePreviewDialog } from "@/components/dialogs";

import { useFilePreview } from "@/composables/useFilePreview";

const filePreview = useFilePreview();

const previewDocument = () => {
  filePreview.previewPDF("https://example.com/doc.pdf", "Document.pdf");
};

const previewImage = () => {
  filePreview.previewImage("https://example.com/image.jpg", "Image.jpg");
};
</script>
```

### 3. BaseInputFile (Enhanced with Preview)

BaseInputFile component yang sudah ditingkatkan dengan built-in preview functionality.

#### New Features:

- ✅ **Click to Preview**: Click pada file untuk preview
- ✅ **Preview Button**: Eye icon untuk preview action
- ✅ **Auto File Type Detection**: Otomatis detect dan preview sesuai jenis file
- ✅ **Existing Files Preview**: Preview file yang sudah ada
- ✅ **New Files Preview**: Preview file yang baru di-upload

#### Props:

```typescript
interface Props {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  required?: boolean;
  disabled?: boolean;
  showPreview?: boolean;
  previewType?: "image" | "file" | "both";
  description?: string;
  existingFiles?: string | string[];
  enableFilePreview?: boolean; // Enable/disable preview dialog (default: true)
}
```

#### Usage:

```vue
<template>
  <BaseInputFile
    name="document"
    label="Upload Dokumen"
    accept="application/pdf"
    :enable-file-preview="true"
    description="Upload PDF document, click to preview"
  />
</template>
```

## 🎯 Supported File Types

### Images

- **Formats**: JPG, JPEG, PNG, GIF, WebP, BMP, SVG
- **Features**: Zoom controls, click to zoom, high-quality preview

### Videos

- **Formats**: MP4, WebM, OGG, AVI, MOV, WMV, FLV
- **Features**: Native video controls, responsive player

### Audio

- **Formats**: MP3, WAV, OGG, AAC, FLAC, M4A
- **Features**: Audio player with controls, waveform preview

### Documents

- **PDF**: Full iframe preview, download support
- **Text**: TXT, MD, JSON, XML, HTML, CSS, JS, TS, Vue
- **Office**: DOC, DOCX, XLS, XLSX, PPT, PPTX (external link only)

## 📱 Responsive Design

### Mobile (< 768px)

- ✅ Full-width dialog
- ✅ Touch-friendly controls
- ✅ Optimized button sizes
- ✅ Swipe gestures (untuk gallery mode)

### Tablet (768px - 1024px)

- ✅ Adaptive dialog size
- ✅ Side-by-side file info
- ✅ Touch + mouse support

### Desktop (> 1024px)

- ✅ Large preview area
- ✅ Full feature set
- ✅ Keyboard shortcuts
- ✅ Multi-monitor support

## ⌨️ Keyboard Navigation

| Key       | Action                   |
| --------- | ------------------------ |
| `ESC`     | Close dialog             |
| `Space`   | Play/Pause (video/audio) |
| `+` / `=` | Zoom in (images)         |
| `-`       | Zoom out (images)        |
| `0`       | Reset zoom (images)      |
| `F`       | Toggle fullscreen        |
| `D`       | Download file            |
| `O`       | Open in external tab     |

## 🎨 Customization

### Theme Support

```vue
<!-- Light/Dark mode otomatis mengikuti sistem -->
<FilePreviewDialog v-model:open="isOpen" :file="file" class="custom-preview-dialog" />
```

### Custom Styling

```css
.custom-preview-dialog {
  /* Custom dialog styles */
}

.custom-preview-dialog .preview-content {
  /* Custom content styles */
}
```

### Size Variants

```vue
<!-- Small preview -->
<FilePreviewDialog max-width="60vw" max-height="60vh" />

<!-- Large preview -->
<FilePreviewDialog max-width="95vw" max-height="95vh" />

<!-- Full screen -->
<FilePreviewDialog max-width="100vw" max-height="100vh" />
```

## 🔧 Advanced Usage

### Custom Download Handler

```vue
<script setup>
const handleCustomDownload = async (file) => {
  try {
    // Custom download logic
    const response = await fetch(file.url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name || "download";
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
</script>

<template>
  <FilePreviewDialog v-model:open="isOpen" :file="file" @download="handleCustomDownload" />
</template>
```

### Batch File Preview

```vue
<script setup>
const files = ref([
  { url: "image1.jpg", name: "Image 1" },
  { url: "image2.jpg", name: "Image 2" },
  { url: "document.pdf", name: "Document" },
]);

const currentIndex = ref(0);

const previewNext = () => {
  if (currentIndex.value < files.value.length - 1) {
    currentIndex.value++;
    filePreview.previewFile(files.value[currentIndex.value]);
  }
};

const previewPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    filePreview.previewFile(files.value[currentIndex.value]);
  }
};
</script>
```

### Integration dengan DataTable

```vue
<template>
  <DataTable :data="documents" :columns="columns">
    <template #file="{ item }">
      <button @click="filePreview.previewPDF(item.fileUrl, item.name)" class="text-blue-600 hover:underline">
        {{ item.name }}
      </button>
    </template>
  </DataTable>

  <FilePreviewDialog
    v-model:open="filePreview.isOpen.value"
    :file="filePreview.currentFile.value"
    @download="filePreview.handleDownload"
  />
</template>
```

## 🚀 Performance Tips

### 1. Lazy Loading

```vue
<!-- Component akan di-load hanya saat diperlukan -->
<FilePreviewDialog v-if="isPreviewOpen" />
```

### 2. Image Optimization

```typescript
// Auto-resize untuk preview
const optimizeImageForPreview = (file: File) => {
  if (file.size > 5 * 1024 * 1024) {
    // > 5MB
    // Show warning atau compress image
  }
};
```

### 3. Memory Management

```typescript
// Auto cleanup object URLs
onUnmounted(() => {
  previews.value.forEach((url) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
});
```

## 🧪 Testing

### Unit Tests

```typescript
import { mount } from "@vue/test-utils";

import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";

describe("FilePreviewDialog", () => {
  it("should render PDF preview", () => {
    const wrapper = mount(FilePreviewDialog, {
      props: {
        open: true,
        file: {
          url: "test.pdf",
          type: "application/pdf",
        },
      },
    });

    expect(wrapper.find("iframe").exists()).toBe(true);
  });
});
```

### E2E Tests

```typescript
// Cypress test
it("should preview and download file", () => {
  cy.visit("/documents");
  cy.get('[data-testid="file-preview-btn"]').click();
  cy.get('[data-testid="preview-dialog"]').should("be.visible");
  cy.get('[data-testid="download-btn"]').click();
  cy.readFile("cypress/downloads/document.pdf").should("exist");
});
```

## 📋 Best Practices

### 1. Error Handling

```vue
<script setup>
const handlePreviewError = (error) => {
  console.error("Preview error:", error);
  toast.error("Gagal memuat preview file");
};
</script>
```

### 2. Loading States

```vue
<template>
  <FilePreviewDialog v-model:open="isOpen" :file="file">
    <template #loading>
      <div class="flex items-center justify-center p-8">
        <Spinner />
        <span>Memuat preview...</span>
      </div>
    </template>
  </FilePreviewDialog>
</template>
```

### 3. Accessibility

```vue
<template>
  <FilePreviewDialog
    v-model:open="isOpen"
    :file="file"
    :aria-label="`Preview ${file.name}`"
    role="dialog"
    aria-modal="true"
  />
</template>
```

### 4. Security

```typescript
// Validate file URLs
const isValidFileUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return ["http:", "https:", "blob:", "data:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
};
```

## 🎉 Ready to Use!

Component FilePreviewDialog dan useFilePreview sudah siap digunakan dengan fitur lengkap dan mengikuti best practices untuk:

- ✅ **Reusability** - Dapat digunakan di berbagai tempat
- ✅ **Accessibility** - Support keyboard navigation dan screen readers
- ✅ **Performance** - Optimized loading dan memory management
- ✅ **Mobile-friendly** - Responsive design untuk semua device
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Extensibility** - Mudah di-customize dan extend
