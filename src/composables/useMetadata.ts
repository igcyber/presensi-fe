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

  const updateCanonicalUrl = (url: string): void => {
    if (typeof document !== "undefined") {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);
    }
  };

  const updatePageMetadata = (metadata: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    keywords?: string[];
    canonical?: string;
    robots?: string;
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
      const fullImageUrl = metadata.image.startsWith("http")
        ? metadata.image
        : `${getWebsiteUrl()}${metadata.image.startsWith("/") ? "" : "/"}${metadata.image}`;
      updateOpenGraphTag("og:image", fullImageUrl);
      updateTwitterTag("twitter:image", fullImageUrl);
    }

    if (metadata.url) {
      const fullUrl = metadata.url.startsWith("http") ? metadata.url : `${getWebsiteUrl()}${metadata.url}`;
      updateOpenGraphTag("og:url", fullUrl);
    }

    if (metadata.canonical) {
      const canonicalUrl = metadata.canonical.startsWith("http")
        ? metadata.canonical
        : `${getWebsiteUrl()}${metadata.canonical.startsWith("/") ? "" : "/"}${metadata.canonical}`;
      updateCanonicalUrl(canonicalUrl);
    }

    if (metadata.keywords && Array.isArray(metadata.keywords)) {
      if (typeof document !== "undefined") {
        let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
        if (!metaKeywords) {
          metaKeywords = document.createElement("meta");
          metaKeywords.setAttribute("name", "keywords");
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute("content", metadata.keywords.join(", "));
      }
    }

    if (metadata.robots) {
      if (typeof document !== "undefined") {
        let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
        if (!metaRobots) {
          metaRobots = document.createElement("meta");
          metaRobots.setAttribute("name", "robots");
          document.head.appendChild(metaRobots);
        }
        metaRobots.setAttribute("content", metadata.robots);
      }
    }
  };

  const injectStructuredData = (structuredData: Record<string, any>): void => {
    if (typeof document === "undefined") return;

    // Remove existing structured data with same type if any
    const existingScript = document.querySelector(
      `script[type="application/ld+json"][data-jsonld-type="${structuredData["@type"]}"]`,
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-jsonld-type", structuredData["@type"] || "Organization");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };

  const getOrganizationStructuredData = () => {
    if (!siteMetadata.value) return null;

    return {
      "@context": "https://schema.org",
      "@type": "GovernmentOrganization",
      name: siteMetadata.value.website.name,
      alternateName: siteMetadata.value.website.shortName,
      description: siteMetadata.value.website.description,
      url: siteMetadata.value.website.url,
      logo: `${siteMetadata.value.website.url}${siteMetadata.value.openGraph.image}`,
      contactPoint: {
        "@type": "ContactPoint",
        email: siteMetadata.value.contact.email,
        telephone: siteMetadata.value.contact.phone,
        contactType: "Customer Service",
        areaServed: "ID",
        availableLanguage: ["Indonesian", "Bahasa Indonesia"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kutai Kartanegara",
        addressRegion: "Kalimantan Timur",
        addressCountry: "ID",
      },
      sameAs: Object.values(siteMetadata.value.contact.socialMedia).filter(Boolean),
    };
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
    updateCanonicalUrl,
    injectStructuredData,
    getOrganizationStructuredData,

    // Getters
    getFullTitle,
    getWebsiteUrl,
    getThemeColor,
    getContactInfo,
    getSocialMedia,
  };
}
