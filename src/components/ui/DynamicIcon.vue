<script setup lang="ts">
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Building,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  File,
  FileText,
  Folder,
  Globe,
  Headphones,
  Heart,
  Home,
  Image,
  Info,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Navigation,
  Newspaper,
  Phone,
  Play,
  PlayCircle,
  Printer,
  RefreshCw,
  Search,
  Share2,
  Smartphone,
  TrendingUp,
  User,
  Video,
  Wallet,
  X,
  ZoomIn,
} from "lucide-vue-next";
import { type Component, computed } from "vue";

interface Props {
  name: string;
  iconClass?: string;
  size?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  iconClass: "h-5 w-5",
  size: 20,
});

// Mapping boxicons names ke Lucide components
const iconMap: Record<string, Component> = {
  // Boxicons format (dengan prefix)
  "bx-search": Search,
  "bx-search-alt": Search,
  "bx-x": X,
  "bx-error-circle": AlertCircle,
  "bx-refresh": RefreshCw,
  "bx-info-circle": Info,
  "bx-home": Home,
  "bx-chevron-right": ChevronRight,
  "bx-chevron-left": ChevronLeft,
  "bx-calendar": Calendar,
  "bx-calendar-edit": Calendar,
  "bx-show": Eye,
  "bx-eye": Eye,
  "bx-map": Map,
  "bx-map-pin": MapPin,
  "bx-map-alt": MapPin,
  "bx-phone": Phone,
  "bx-phone-call": Phone,
  "bx-envelope": Mail,
  "bx-time": Clock,
  "bx-clock": Clock,
  "bx-share-alt": Share2,
  "bx-navigation": Navigation,
  "bx-support": Headphones,
  "bx-message-dots": MessageCircle,
  "bx-id-card": CreditCard,
  "bx-heart": Heart,
  "bx-money": DollarSign,
  "bx-link-external": ExternalLink,
  "bx-file-blank": File,
  "bx-file": File,
  "bx-file-pdf": FileText,
  "bx-news": Newspaper,
  "bx-folder": Folder,
  "bx-right-arrow-alt": ArrowRight,
  "bx-trending-up": TrendingUp,
  "bx-image": Image,
  "bx-zoom-in": ZoomIn,
  "bx-play": Play,
  "bx-play-circle": PlayCircle,
  "bx-download": Download,
  "bx-buildings": Building2,
  "bx-building": Building,
  "bx-globe": Globe,
  "bx-world": Globe,
  "bx-video": Video,
  "bx-printer": Printer,
  "bx-user-circle": User,
  "bx-user": User,
  "bx-book-open": BookOpen,
  "bx-trophy": Award,
  "bx-dots-horizontal-rounded": MoreHorizontal,
  "bx-mobile": Smartphone,
  "bx-chart": BarChart3,
  "bx-wallet": Wallet,
  "bx-chat": MessageSquare,
  "bx-devices": Building2,
  "bx-shield": Award,

  // Direct lucide names (lowercase)
  search: Search,
  x: X,
  "alert-circle": AlertCircle,
  "refresh-cw": RefreshCw,
  info: Info,
  home: Home,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  calendar: Calendar,
  eye: Eye,
  map: Map,
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  share: Share2,
  navigation: Navigation,
  headphones: Headphones,
  "message-circle": MessageCircle,
  "credit-card": CreditCard,
  heart: Heart,
  "dollar-sign": DollarSign,
  "external-link": ExternalLink,
  file: File,
  "file-text": FileText,
  newspaper: Newspaper,
  folder: Folder,
  "arrow-right": ArrowRight,
  "trending-up": TrendingUp,
  image: Image,
  "zoom-in": ZoomIn,
  play: Play,
  "play-circle": PlayCircle,
  download: Download,
  building: Building,
  "building-2": Building2,
  globe: Globe,
  video: Video,
  printer: Printer,
  user: User,
  "book-open": BookOpen,
  award: Award,
  "more-horizontal": MoreHorizontal,
  smartphone: Smartphone,
  "bar-chart-3": BarChart3,
  wallet: Wallet,
  "message-square": MessageSquare,
};

// Computed untuk mendapatkan icon component yang tepat
const iconComponent = computed<Component>(() => {
  // Clean name dari "bx bx-icon" format
  let cleanName = props.name.toLowerCase().trim();

  // Remove "bx bx-" prefix jika ada
  if (cleanName.startsWith("bx bx-")) {
    cleanName = cleanName.replace("bx bx-", "bx-");
  } else if (cleanName.startsWith("bx-")) {
    // already clean
  }

  // Cari di mapping
  const icon = iconMap[cleanName];

  // Default ke Info icon jika tidak ditemukan
  return icon || Info;
});
</script>

<template>
  <component :is="iconComponent" :class="iconClass" />
</template>
