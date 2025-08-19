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
  isActivePath,
  isEmpty,
  maskEmail,
  safeGet,
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

    // Date formatters
    date: formatDate,
    time: formatTime,
    relativeDate: formatRelativeDate,
    monthName: formatMonthName,

    // Status formatters
    status: formatStatus,
    activeStatus: formatActiveStatus,

    // Text formatters
    truncate: truncateText,
    capitalize: capitalizeWords,
    detailName: formatDetailName,
    name: formatName,

    // Contact formatters
    phone: formatPhoneNumber,
    maskEmail,

    // Calculation formatters
    percentage: formatPercentage,
    fileSize: formatFileSize,

    // Utilities
    safeGet,
    isEmpty,

    // Path formatters
    isActivePath,

    // Youtube & Facebook formatters
    youtubeInfo,
    facebookInfo,
    toEmbedUrl,
  };
}
