import {
  capitalizeWords,
  facebookInfo,
  formatActiveStatus,
  formatCurrency,
  formatDate,
  formatDetailName,
  formatFileSize,
  formatMonthName,
  formatName,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatRelativeDate,
  formatStatus,
  formatTime,
  getSlugUrl,
  isActivePath,
  isEmpty,
  maskEmail,
  safeGet,
  slugify,
  slugToTitle,
  toEmbedUrl,
  truncateText,
  youtubeInfo,
} from "@/lib/utils/formatters";

/**
 * Composable untuk menggunakan formatters dengan mudah
 * Menyediakan akses ke semua formatter functions dalam satu tempat
 */
export function useFormatters() {
  return {
    // Currency & Number formatters
    currency: formatCurrency,
    number: formatNumber,
    percentage: formatPercentage,

    // Date & Time formatters
    date: formatDate,
    time: formatTime,
    relativeDate: formatRelativeDate,
    monthName: formatMonthName,

    // Text formatters
    truncate: truncateText,
    capitalize: capitalizeWords,
    name: formatName,
    detailName: formatDetailName,

    // Status formatters
    status: formatStatus,
    activeStatus: formatActiveStatus,

    // Contact formatters
    phone: formatPhoneNumber,
    maskEmail,

    // File & Size formatters
    fileSize: formatFileSize,

    // Path & URL formatters
    isActivePath,
    getSlugUrl,
    slugify,
    slugToTitle,
    toEmbedUrl,

    // Social Media formatters
    youtubeInfo,
    facebookInfo,

    // Utilities
    safeGet,
    isEmpty,
  };
}
