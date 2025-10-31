import { watch } from "vue";
import { useRoute } from "vue-router";
import { useMetadata } from "./useMetadata";

/**
 * Composable untuk handle SEO metadata updates berdasarkan route
 * Gunakan ini di App.vue atau layout component
 */
export function useSEO() {
  const route = useRoute();
  const { loadMetadata, updatePageMetadata, getFullTitle, getWebsiteUrl, injectStructuredData, getOrganizationStructuredData } = useMetadata();

  const updateSEOFromRoute = async () => {
    // Load metadata jika belum loaded
    await loadMetadata();

    // Get route metadata
    const routeMeta = route.meta as {
      title?: string;
      description?: string;
      keywords?: string[];
      image?: string;
      robots?: string;
      noindex?: boolean;
    } | undefined;

    // Get full title
    const fullTitle = routeMeta?.title ? getFullTitle(routeMeta.title) : getFullTitle();

    // Get full URL
    const fullUrl = `${getWebsiteUrl()}${route.fullPath}`;

    // Build metadata object
    const metadata: Parameters<typeof updatePageMetadata>[0] = {
      title: fullTitle,
      url: fullUrl,
      canonical: route.fullPath,
      robots: routeMeta?.noindex ? "noindex, nofollow" : routeMeta?.robots || "index, follow",
    };

    // Add description if available
    if (routeMeta?.description) {
      metadata.description = routeMeta.description;
    }

    // Add keywords if available
    if (routeMeta?.keywords && Array.isArray(routeMeta.keywords)) {
      metadata.keywords = routeMeta.keywords;
    }

    // Add image if available
    if (routeMeta?.image) {
      metadata.image = routeMeta.image;
    }

    // Update page metadata
    updatePageMetadata(metadata);

    // Inject structured data for organization (only on public pages)
    if (!route.meta?.requiresAuth) {
      const orgData = getOrganizationStructuredData();
      if (orgData) {
        injectStructuredData(orgData);
      }
    }
  };

  // Watch route changes and update SEO
  watch(
    () => route.path,
    () => {
      updateSEOFromRoute();
    },
    { immediate: true }
  );

  return {
    updateSEOFromRoute,
  };
}
