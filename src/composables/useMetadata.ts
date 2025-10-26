import { computed, ref } from "vue";

export interface WebsiteMetadata {
  name: string;
  shortName: string;
  description: string;
  url: string;
  locale: string;
  themeColor: string;
}

export interface ContactMetadata {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  robots: string;
}

export interface OpenGraphMetadata {
  title: string;
  description: string;
  image: string;
  imageWidth: string;
  imageHeight: string;
  type: string;
}

export interface SiteMetadata {
  website: WebsiteMetadata;
  contact: ContactMetadata;
  seo: SEOMetadata;
  openGraph: OpenGraphMetadata;
}

const siteMetadata = ref<SiteMetadata | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useMetadata() {
  const loadMetadata = async (): Promise<void> => {
    if (siteMetadata.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("/site-metadata.json");
      if (!response.ok) {
        throw new Error(`Failed to load metadata: ${response.statusText}`);
      }
      siteMetadata.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error("Error loading site metadata:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const updatePageTitle = (title: string): void => {
    if (typeof document !== "undefined") {
      document.title = title;
    }
  };

  const updatePageDescription = (description: string): void => {
    if (typeof document !== "undefined") {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }
    }
  };

  const updateOpenGraphTag = (property: string, content: string): void => {
    if (typeof document !== "undefined") {
      const metaTag = document.querySelector(`meta[property="${property}"]`);
      if (metaTag) {
        metaTag.setAttribute("content", content);
      }
    }
  };

  const updateTwitterTag = (name: string, content: string): void => {
    if (typeof document !== "undefined") {
      const metaTag = document.querySelector(`meta[name="${name}"]`);
      if (metaTag) {
        metaTag.setAttribute("content", content);
      }
    }
  };

  const updatePageMetadata = (metadata: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    keywords?: string[];
  }): void => {
    if (metadata.title) {
      updatePageTitle(metadata.title);
      updateOpenGraphTag("og:title", metadata.title);
      updateTwitterTag("twitter:title", metadata.title);
    }

    if (metadata.description) {
      updatePageDescription(metadata.description);
      updateOpenGraphTag("og:description", metadata.description);
      updateTwitterTag("twitter:description", metadata.description);
    }

    if (metadata.image) {
      updateOpenGraphTag("og:image", metadata.image);
      updateTwitterTag("twitter:image", metadata.image);
    }

    if (metadata.url) {
      updateOpenGraphTag("og:url", metadata.url);
    }

    if (metadata.keywords && Array.isArray(metadata.keywords)) {
      if (typeof document !== "undefined") {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute("content", metadata.keywords.join(", "));
        }
      }
    }
  };

  const getFullTitle = (pageTitle?: string): string => {
    if (!siteMetadata.value) return pageTitle || "Sekretariat DPRD Kutai Kartanegara";

    if (pageTitle) {
      return `${pageTitle} - ${siteMetadata.value.website.name}`;
    }

    return siteMetadata.value.seo.title;
  };

  const getWebsiteUrl = (): string => {
    return siteMetadata.value?.website.url || "https://dprd.rizkipadhil.my.id";
  };

  const getThemeColor = (): string => {
    return siteMetadata.value?.website.themeColor || "#1e40af";
  };

  const getContactInfo = computed(() => {
    return siteMetadata.value?.contact || null;
  });

  const getSocialMedia = computed(() => {
    return siteMetadata.value?.contact.socialMedia || {};
  });

  return {
    // State
    siteMetadata: computed(() => siteMetadata.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Actions
    loadMetadata,
    updatePageMetadata,
    updatePageTitle,
    updatePageDescription,

    // Getters
    getFullTitle,
    getWebsiteUrl,
    getThemeColor,
    getContactInfo,
    getSocialMedia,
  };
}
