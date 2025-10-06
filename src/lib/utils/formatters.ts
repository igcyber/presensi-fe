/**
 * 💰 CURRENCY FORMATTERS
 * Helper functions untuk format mata uang
 */

/**
 * Format number ke format Rupiah Indonesia
 * @param amount - Angka yang akan diformat
 * @param options - Opsi formatting
 * @returns String format Rupiah
 *
 * @example
 * formatCurrency(1500000) // "Rp 1.500.000"
 * formatCurrency(1500000, { showSymbol: false }) // "1.500.000"
 * formatCurrency(1500000.50, { showDecimals: true }) // "Rp 1.500.000,50"
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    locale?: string;
    currency?: string;
  } = {},
): string {
  const { showSymbol = true, showDecimals = false, locale = "id-ID", currency = "IDR" } = options;

  // Handle null/undefined/empty values
  if (amount === null || amount === undefined || amount === "") {
    return showSymbol ? "Rp 0" : "0";
  }

  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return showSymbol ? "Rp 0" : "0";
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? "currency" : "decimal",
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(numericAmount);
}

/**
 * Format number ke format dengan separator ribuan
 * @param number - Angka yang akan diformat
 * @param locale - Locale untuk formatting
 * @returns String dengan separator ribuan
 *
 * @example
 * formatNumber(1500000) // "1.500.000"
 * formatNumber(1500.50) // "1.500,5"
 */
export function formatNumber(number: number | string | null | undefined, locale: string = "id-ID"): string {
  if (number === null || number === undefined || number === "") {
    return "0";
  }

  const numericValue = typeof number === "string" ? parseFloat(number) : number;

  if (isNaN(numericValue)) {
    return "0";
  }

  return new Intl.NumberFormat(locale).format(numericValue);
}

/**
 * Format persentase
 * @param value - Nilai yang akan diformat
 * @param total - Total untuk kalkulasi persentase
 * @param decimals - Jumlah desimal
 * @returns String persentase
 *
 * @example
 * formatPercentage(25, 100) // "25%"
 * formatPercentage(1, 3, 2) // "33.33%"
 */
export function formatPercentage(value: number | null | undefined, total?: number, decimals: number = 0): string {
  if (value === null || value === undefined) {
    return "0%";
  }

  let percentage = value;

  if (total && total > 0) {
    percentage = (value / total) * 100;
  }

  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format file size
 * @param bytes - Ukuran dalam bytes
 * @param decimals - Jumlah desimal
 * @returns String ukuran file
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 * formatFileSize(1073741824, 2) // "1.00 GB"
 */
export function formatFileSize(bytes: number | null | undefined, decimals: number = 1): string {
  if (!bytes || bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * 📅 DATE FORMATTERS
 * Helper functions untuk format tanggal
 */

/**
 * Format tanggal ke format Indonesia
 * @param date - Tanggal yang akan diformat
 * @param options - Opsi formatting
 * @returns String tanggal terformat
 *
 * @example
 * formatDate('2024-01-15') // "15 Januari 2024"
 * formatDate(new Date(), { format: 'short' }) // "15/01/2024"
 * formatDate('2024-01-15T10:30:00', { includeTime: true }) // "15 Januari 2024, 10:30"
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: {
    format?: "long" | "short" | "medium";
    includeTime?: boolean;
    locale?: string;
  } = {},
): string {
  const { format = "long", includeTime = false, locale = "id-ID" } = options;

  if (!date) {
    return "-";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  let dateOptions: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "short":
      dateOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      break;
    case "medium":
      dateOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      break;
    case "long":
    default:
      dateOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      break;
  }

  if (includeTime) {
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
  }

  return new Intl.DateTimeFormat(locale, dateOptions).format(dateObj);
}

/**
 * Format tanggal relatif (berapa lama yang lalu)
 * @param date - Tanggal yang akan diformat
 * @param locale - Locale untuk formatting
 * @returns String tanggal relatif
 *
 * @example
 * formatRelativeDate('2024-01-14') // "1 hari yang lalu"
 * formatRelativeDate('2024-01-01') // "2 minggu yang lalu"
 */
export function formatRelativeDate(date: string | Date | null | undefined, _locale: string = "id-ID"): string {
  if (!date) {
    return "-";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Baru saja";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} minggu yang lalu`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} bulan yang lalu`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} tahun yang lalu`;
  }
}

/**
 * Format waktu saja dari tanggal
 * @param date - Tanggal yang akan diformat
 * @param locale - Locale untuk formatting
 * @returns String waktu terformat
 *
 * @example
 * formatTime('2024-01-15T10:30:00') // "10:30"
 * formatTime(new Date()) // "14:25"
 */
export function formatTime(date: string | Date | null | undefined, locale: string = "id-ID"): string {
  if (!date) {
    return "-";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

/**
 * Get month name from month number
 * @param monthNumber - Nomor bulan (1-12)
 * @param locale - Locale untuk formatting
 * @returns Nama bulan
 *
 * @example
 * formatMonthName(1) // "Januari"
 * formatMonthName(12) // "Desember"
 */
export function formatMonthName(monthNumber: number | null | undefined, locale: string = "id-ID"): string {
  if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
    return "-";
  }

  // Create a date object with the specified month
  const date = new Date(2024, monthNumber - 1, 1);

  return new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(date);
}

/**
 * 📝 TEXT FORMATTERS
 * Helper functions untuk format teks
 */

/**
 * Truncate text dengan ellipsis
 * @param text - Teks yang akan dipotong
 * @param maxLength - Panjang maksimal
 * @param suffix - Suffix yang ditambahkan
 * @returns Teks yang dipotong
 *
 * @example
 * truncateText('Lorem ipsum dolor sit amet', 10) // "Lorem ipsu..."
 * truncateText('Short text', 20) // "Short text"
 */
export function truncateText(text: string | null | undefined, maxLength: number = 50, suffix: string = "..."): string {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter of each word
 * @param text - Teks yang akan diformat
 * @returns Teks dengan huruf kapital di awal kata
 *
 * @example
 * capitalizeWords('hello world') // "Hello World"
 * capitalizeWords('HELLO WORLD') // "Hello World"
 */
export function capitalizeWords(text: string | null | undefined): string {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format nama rincian dari underscore/snake_case ke proper case
 * @param text - Teks dengan format underscore yang akan diformat
 * @returns Teks dengan format Nama Rincian
 *
 * @example
 * formatDetailName('nama_rincian') // "Nama Rincian"
 * formatDetailName('detail_produk_utama') // "Detail Produk Utama"
 */
export function formatDetailName(text: string | null | undefined): string {
  if (!text) {
    return "";
  }

  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Format nama dengan proper case
 * @param name - Nama yang akan diformat
 * @returns Nama dengan format yang benar
 *
 * @example
 * formatName('john doe') // "John Doe"
 * formatName('JANE SMITH') // "Jane Smith"
 */
export function formatName(name: string | null | undefined): string {
  if (!name) {
    return "";
  }

  return capitalizeWords(name.trim());
}

/**
 * Slugify title
 * @param title - Title to slugify
 * @returns Slugified title
 *
 * @example
 * slugify('Hello World') // "hello-world"
 */
export function slugify(title: string): string {
  return title.replace(/[ /%]/g, "-").toLowerCase();
}

/**
 * Convert slug to title
 * @param slug - Slug to convert
 * @returns Title from slug
 *
 * @example
 * slugToTitle('hello-world') // "Hello World"
 */
export function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * 📊 STATUS FORMATTERS
 * Helper functions untuk format status
 */

/**
 * Format status dengan styling
 * @param status - Status yang akan diformat
 * @param customLabels - Custom labels untuk status
 * @returns Object dengan label dan class CSS
 *
 * @example
 * formatStatus('diterima') // { label: 'Diterima', class: 'bg-green-100 text-green-800' }
 * formatStatus('pending', { pending: 'Menunggu' }) // { label: 'Menunggu', class: '...' }
 */
export function formatStatus(
  status: string | null | undefined,
  customLabels: Record<string, string> = {},
): { label: string; class: string } {
  if (!status) {
    return {
      label: "Tidak Diketahui",
      class: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
  }

  const statusLower = status.toLowerCase();

  // Default labels
  const defaultLabels: Record<string, string> = {
    diterima: "Diterima",
    diajukan: "Diajukan",
    ditolak: "Ditolak",
    proses: "Proses",
    pending: "Pending",
    active: "Aktif",
    inactive: "Tidak Aktif",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    draft: "Draft",
    published: "Dipublikasi",
    ...customLabels,
  };

  // Default classes
  const statusClasses: Record<string, string> = {
    diterima: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300",
    diajukan: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300",
    ditolak: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300",
    proses: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300",
    active: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300",
    inactive: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    published: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300",
  };

  return {
    label: defaultLabels[statusLower] || status,
    class: statusClasses[statusLower] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };
}

/**
 * Format boolean ke status aktif/tidak aktif
 * @param isActive - Boolean value
 * @param customLabels - Custom labels
 * @returns Object dengan label dan class CSS
 *
 * @example
 * formatActiveStatus(true) // { label: 'Aktif', class: 'bg-green-100 text-green-800' }
 * formatActiveStatus(false) // { label: 'Tidak Aktif', class: 'bg-red-100 text-red-800' }
 */
export function formatActiveStatus(
  isActive: boolean | null | undefined,
  customLabels: { active?: string; inactive?: string } = {},
): { label: string; class: string } {
  const labels = {
    active: customLabels.active || "Aktif",
    inactive: customLabels.inactive || "Tidak Aktif",
  };

  if (isActive === true) {
    return {
      label: labels.active,
      class: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300",
    };
  }

  return {
    label: labels.inactive,
    class: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300",
  };
}

/**
 * 📱 CONTACT FORMATTERS
 * Helper functions untuk format kontak
 */

/**
 * Format nomor telepon Indonesia
 * @param phone - Nomor telepon
 * @param includeCountryCode - Apakah menyertakan kode negara
 * @returns Nomor telepon terformat
 *
 * @example
 * formatPhoneNumber('08123456789') // "0812-3456-789"
 * formatPhoneNumber('8123456789', true) // "+62 812-3456-789"
 */
export function formatPhoneNumber(phone: string | null | undefined, includeCountryCode: boolean = false): string {
  if (!phone) {
    return "";
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Handle different formats
  let formatted = cleaned;

  if (includeCountryCode) {
    if (formatted.startsWith("0")) {
      formatted = "62" + formatted.substring(1);
    } else if (!formatted.startsWith("62")) {
      formatted = "62" + formatted;
    }

    // Format: +62 812-3456-789
    const match = formatted.match(/^62(\d{3})(\d{4})(\d+)$/);
    if (match) {
      return `+62 ${match[1]}-${match[2]}-${match[3]}`;
    }
  } else {
    if (!formatted.startsWith("0") && formatted.length >= 10) {
      formatted = "0" + formatted;
    }

    // Format: 0812-3456-789
    const match = formatted.match(/^0(\d{3})(\d{4})(\d+)$/);
    if (match) {
      return `0${match[1]}-${match[2]}-${match[3]}`;
    }
  }

  return phone;
}

/**
 * Mask email untuk privacy
 * @param email - Email yang akan di-mask
 * @returns Email yang di-mask
 *
 * @example
 * maskEmail('john.doe@example.com') // "j***@example.com"
 * maskEmail('a@test.com') // "a***@test.com"
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) {
    return "";
  }

  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) {
    return email;
  }

  const maskedLocal = localPart.charAt(0) + "*".repeat(Math.max(3, localPart.length - 1));
  return `${maskedLocal}@${domain}`;
}

/**
 * 🎬 MEDIA FORMATTERS
 * Helper functions untuk format media dan URL
 */

/**
 * Format youtube link to embed url and thumbnail
 * @param link - Youtube link
 * @returns Object with id, embedUrl, and thumb
 *
 * @example
 * youtubeInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // { id: 'dQw4w9WgXcQ', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' }
 */
export function youtubeInfo(link: string) {
  const ytWatch = /youtube\.com\/watch\?v=([^&]+)/;
  const ytShort = /youtu\.be\/([^?]+)/;
  const ytEmbed = /youtube\.com\/embed\/([^?]+)/;
  let id = "";
  let embedUrl = "";
  let thumb = "";
  const m1 = link.match(ytWatch);
  const m2 = link.match(ytShort);
  const m3 = link.match(ytEmbed);
  if (m1?.[1]) id = m1[1];
  else if (m2?.[1]) id = m2[1];
  else if (m3?.[1]) id = m3[1];
  if (id) {
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }

  return { id, embedUrl, thumb };
}

/**
 * Format facebook link to embed url
 * @param link - Facebook link
 * @returns Object with id and embedUrl
 *
 * @example
 * facebookInfo('https://www.facebook.com/watch?v=dQw4w9WgXcQ') // { id: 'dQw4w9WgXcQ', embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&autoplay=true&width=500&height=280' }
 */
export function facebookInfo(link: string) {
  // Jika sudah dalam format plugin embed, kembalikan langsung dengan perbaikan parameter
  if (link.includes("facebook.com/plugins/video.php")) {
    // Extract href parameter dari URL plugin
    const hrefMatch = link.match(/href=([^&]+)/);
    let id = "";

    if (hrefMatch) {
      const decodedHref = decodeURIComponent(hrefMatch[1]);
      // Extract video ID dari href yang sudah di-decode
      const videoIdMatch = decodedHref.match(/\/videos\/(\d+)/);
      if (videoIdMatch) {
        id = videoIdMatch[1];
      }
    }

    // Pastikan parameter yang diperlukan ada dan set autoplay
    const url = new URL(link);
    url.searchParams.set("autoplay", "true");
    url.searchParams.set("show_text", "false");

    return { id, embedUrl: url.toString() };
  }

  // Pattern untuk berbagai format URL Facebook
  const fbWatch = /facebook\.com\/.*\/videos\/(\d+)/;
  const fbPost = /facebook\.com\/.*\/posts\/(\d+)/;
  const fbShare = /facebook\.com\/share\/v\?.*video_id=(\d+)/;
  const fbReel = /facebook\.com\/reel\/(\d+)/;

  let id = "";
  let embedUrl = "";

  const m1 = link.match(fbWatch);
  const m2 = link.match(fbPost);
  const m3 = link.match(fbShare);
  const m4 = link.match(fbReel);

  if (m1?.[1]) id = m1[1];
  else if (m2?.[1]) id = m2[1];
  else if (m3?.[1]) id = m3[1];
  else if (m4?.[1]) id = m4[1];

  if (id) {
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(link)}&autoplay=true&width=500&height=280&show_text=false`;
  } else {
    // Jika tidak dapat mengekstrak ID, gunakan URL langsung dengan autoplay
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(link)}&autoplay=true&width=500&height=280&show_text=false`;
  }

  return { id, embedUrl };
}

/**
 * Convert url to embed url
 * @param url - Url yang akan dikonversi
 * @returns Embed url
 *
 * @example
 * toEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
 */
export function toEmbedUrl(url: string | null | undefined) {
  if (!url) {
    return "";
  }

  if (url.includes("youtube.com")) {
    return youtubeInfo(url).embedUrl;
  } else if (url.includes("facebook.com")) {
    return facebookInfo(url).embedUrl;
  } else if (url.includes("instagram.com")) {
    return url;
  } else if (url.includes("twitter.com")) {
    return url;
  } else if (url.includes("tiktok.com")) {
    return url;
  }

  return url;
}

/**
 * 🔗 URL FORMATTERS
 * Helper functions untuk format URL dan slug
 */

/**
 * Get news detail url
 * @param type - News type
 * @param id - News id
 * @param title - News title
 * @returns News detail url
 */
export function getSlugUrl(type: "berita" | "opd" | "perusahaan-daerah", id: number, title: string): string {
  const slug = slugify(title);
  return `https://kukarkab.go.id/${type}/${id}/${slug}`;
}

/**
 * Check if current path is active (starts with given path)
 * @param currentPath - Current route path
 * @param targetPath - Target path to check against
 * @returns Boolean indicating if path is active
 *
 * @example
 * isActive('/users/profile', '/users') // true
 * isActive('/admin/dashboard', '/users') // false
 * isActive('/home', '/home') // true
 */
export function isActivePath(currentPath: string, targetPath: string): boolean {
  if (!currentPath || !targetPath) {
    return false;
  }

  return currentPath.startsWith(targetPath);
}

/**
 * 🎯 UTILITY FUNCTIONS
 * Helper functions umum
 */

/**
 * Safe get nested object value
 * @param obj - Object
 * @param path - Path to value
 * @param defaultValue - Default value if not found
 * @returns Value atau default
 *
 * @example
 * safeGet({ user: { name: 'John' } }, 'user.name') // "John"
 * safeGet({ user: {} }, 'user.age', 0) // 0
 */
export function safeGet(obj: any, path: string, defaultValue: any = null): any {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }

  return result;
}

/**
 * Check if value is empty
 * @param value - Value to check
 * @returns Boolean
 *
 * @example
 * isEmpty('') // true
 * isEmpty(null) // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty('hello') // false
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}
