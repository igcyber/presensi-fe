import { ref } from "vue";

// Types
export interface FilePreviewData {
  url: string;
  name?: string;
  size?: number;
  type?: string;
  lastModified?: string | Date;
  description?: string;
}

export interface FilePreviewOptions {
  title?: string;
  showDownload?: boolean;
  showExternalLink?: boolean;
  showFileInfo?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

/**
 * Composable untuk mengelola file preview dialog
 * Menyediakan state management dan helper functions untuk FilePreviewDialog
 *
 * @example
 * ```typescript
 * const filePreview = useFilePreview();
 *
 * // Preview gambar
 * filePreview.previewFile({
 *   url: 'https://example.com/image.jpg',
 *   name: 'image.jpg',
 *   size: 1024000,
 *   type: 'image/jpeg'
 * });
 *
 * // Preview dengan options custom
 * filePreview.previewFile(file, {
 *   title: 'Preview Dokumen',
 *   showDownload: false
 * });
 * ```
 */
export function useFilePreview() {
  // State
  const isOpen = ref(false);
  const currentFile = ref<FilePreviewData | null>(null);
  const options = ref<FilePreviewOptions>({});

  /**
   * Preview file dengan dialog
   * @param file - Data file yang akan di-preview
   * @param previewOptions - Opsi untuk customisasi dialog
   */
  const previewFile = (file: FilePreviewData, previewOptions?: FilePreviewOptions) => {
    currentFile.value = file;
    options.value = previewOptions || {};
    isOpen.value = true;
  };

  /**
   * Preview gambar dengan opsi yang sudah dioptimalkan untuk gambar
   * @param imageUrl - URL gambar
   * @param imageName - Nama gambar (optional)
   * @param previewOptions - Opsi tambahan
   */
  const previewImage = (imageUrl: string, imageName?: string, previewOptions?: FilePreviewOptions) => {
    previewFile(
      {
        url: imageUrl,
        name: imageName,
        type: "image/jpeg", // Default type
      },
      {
        title: "Preview Gambar",
        showFileInfo: false,
        ...previewOptions,
      },
    );
  };

  /**
   * Preview PDF dengan opsi yang sudah dioptimalkan untuk PDF
   * @param pdfUrl - URL PDF
   * @param pdfName - Nama PDF (optional)
   * @param previewOptions - Opsi tambahan
   */
  const previewPDF = (pdfUrl: string, pdfName?: string, previewOptions?: FilePreviewOptions) => {
    previewFile(
      {
        url: pdfUrl,
        name: pdfName,
        type: "application/pdf",
      },
      {
        title: "Preview PDF",
        maxWidth: "95vw",
        maxHeight: "95vh",
        ...previewOptions,
      },
    );
  };

  /**
   * Preview video dengan opsi yang sudah dioptimalkan untuk video
   * @param videoUrl - URL video
   * @param videoName - Nama video (optional)
   * @param previewOptions - Opsi tambahan
   */
  const previewVideo = (videoUrl: string, videoName?: string, previewOptions?: FilePreviewOptions) => {
    previewFile(
      {
        url: videoUrl,
        name: videoName,
        type: "video/mp4", // Default type
      },
      {
        title: "Preview Video",
        maxWidth: "90vw",
        maxHeight: "80vh",
        ...previewOptions,
      },
    );
  };

  /**
   * Tutup dialog preview
   */
  const closePreview = () => {
    isOpen.value = false;
    // Delay reset untuk animasi close
    setTimeout(() => {
      currentFile.value = null;
      options.value = {};
    }, 300);
  };

  /**
   * Handle download file
   * @param file - File data
   */
  const handleDownload = (file: FilePreviewData) => {
    try {
      // Create download link
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name || "download";
      link.target = "_blank";

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback: open in new tab
      window.open(file.url, "_blank");
    }
  };

  /**
   * Handle external link (open in new tab)
   * @param file - File data
   */
  const handleExternalLink = (file: FilePreviewData) => {
    window.open(file.url, "_blank", "noopener,noreferrer");
  };

  /**
   * Deteksi jenis file berdasarkan URL dan type
   * @param file - File data
   * @returns File type category
   */
  const detectFileType = (file: FilePreviewData): string => {
    const url = file.url.toLowerCase();
    const type = file.type?.toLowerCase() || "";

    // Image types
    if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)) {
      return "image";
    }

    // Video types
    if (type.startsWith("video/") || /\.(mp4|webm|ogg|avi|mov|wmv|flv)$/i.test(url)) {
      return "video";
    }

    // Audio types
    if (type.startsWith("audio/") || /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(url)) {
      return "audio";
    }

    // PDF
    if (type === "application/pdf" || url.endsWith(".pdf")) {
      return "pdf";
    }

    // Text files
    if (type.startsWith("text/") || /\.(txt|md|json|xml|html|css|js|ts|vue)$/i.test(url)) {
      return "text";
    }

    // Office documents
    if (/\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(url)) {
      return "office";
    }

    return "unknown";
  };

  /**
   * Check apakah file bisa di-preview
   * @param file - File data
   * @returns Boolean
   */
  const canPreview = (file: FilePreviewData): boolean => {
    const fileType = detectFileType(file);
    return ["image", "video", "audio", "pdf"].includes(fileType);
  };

  return {
    // State
    isOpen,
    currentFile,
    options,

    // Methods
    previewFile,
    previewImage,
    previewPDF,
    previewVideo,
    closePreview,
    handleDownload,
    handleExternalLink,

    // Utilities
    detectFileType,
    canPreview,
  };
}
