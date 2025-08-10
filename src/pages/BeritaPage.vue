<template>
  <div class="berita-page">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1 class="page-title">Berita Terkini</h1>
            <p class="page-subtitle">Informasi terbaru seputar Kabupaten Kutai Kartanegara</p>
          </div>
        </div>
      </div>
    </section>

    <!-- News Content -->
    <section class="news-content">
      <div class="container">
        <div class="row">
          <!-- News List -->
          <div class="col-lg-8">
            <div class="news-list">
              <div v-for="news in newsList" :key="news.id" class="news-item">
                <div class="news-image">
                  <img :src="news.image" :alt="news.title" />
                </div>
                <div class="news-details">
                  <div class="news-meta">
                    <span class="news-date">
                      <i class="bx bx-calendar"></i>
                      {{ formatters.date(news.date) }}
                    </span>
                    <span class="news-category">
                      <i class="bx bx-tag"></i>
                      {{ news.category }}
                    </span>
                  </div>
                  <h2 class="news-title">
                    <router-link :to="`/berita/${news.slug}`">
                      {{ news.title }}
                    </router-link>
                  </h2>
                  <p class="news-excerpt">{{ news.excerpt }}</p>
                  <router-link :to="`/berita/${news.slug}`" class="btn btn-primary btn-sm"> Baca Selengkapnya </router-link>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <nav class="pagination-wrapper">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                    <i class="bx bx-chevron-left"></i>
                  </a>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                  <a class="page-link" href="#" @click.prevent="changePage(page)">
                    {{ page }}
                  </a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                    <i class="bx bx-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="sidebar">
              <!-- Search -->
              <div class="sidebar-widget">
                <h3 class="widget-title">Cari Berita</h3>
                <div class="search-form">
                  <input v-model="searchQuery" type="text" class="form-control" placeholder="Cari berita..." @input="handleSearch" />
                  <button class="btn btn-primary" @click="handleSearch">
                    <i class="bx bx-search"></i>
                  </button>
                </div>
              </div>

              <!-- Categories -->
              <div class="sidebar-widget">
                <h3 class="widget-title">Kategori</h3>
                <ul class="category-list">
                  <li v-for="category in categories" :key="category.id">
                    <a href="#" @click.prevent="filterByCategory(category.id)" :class="{ active: selectedCategory === category.id }">
                      {{ category.name }}
                      <span class="count">({{ category.count }})</span>
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Latest News -->
              <div class="sidebar-widget">
                <h3 class="widget-title">Berita Terbaru</h3>
                <div class="latest-news-list">
                  <div v-for="news in latestNews" :key="news.id" class="latest-news-item">
                    <div class="latest-news-image">
                      <img :src="news.image" :alt="news.title" />
                    </div>
                    <div class="latest-news-content">
                      <h4>
                        <router-link :to="`/berita/${news.slug}`">
                          {{ news.title }}
                        </router-link>
                      </h4>
                      <span class="date">{{ formatters.date(news.date) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <AppLoading :is-loading="isLoading" loading-text="Memuat berita..." />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { useFormatters } from "@/composables/useFormatters";

import { AppBreadcrumb, AppLoading } from "../components/layout";

const formatters = useFormatters();

// Reactive data
const isLoading = ref(false);
const searchQuery = ref("");
const selectedCategory = ref<number | null>(null);
const currentPage = ref(1);
const itemsPerPage = 6;

// Sample data (in real app, this would come from API)
const newsList = ref([
  {
    id: 1,
    title: "Pembangunan Infrastruktur Jalan di Kukar",
    excerpt: "Pemerintah Kabupaten Kutai Kartanegara terus berkomitmen dalam pembangunan infrastruktur...",
    image: "/images/news-1.jpg",
    date: new Date("2024-01-15"),
    slug: "pembangunan-infrastruktur-jalan-kukar",
    category: "Infrastruktur",
  },
  {
    id: 2,
    title: "Program Pemberdayaan UMKM Kukar",
    excerpt: "Dinas Koperasi dan UMKM Kabupaten Kutai Kartanegara meluncurkan program baru...",
    image: "/images/news-2.jpg",
    date: new Date("2024-01-12"),
    slug: "program-pemberdayaan-umkm-kukar",
    category: "Ekonomi",
  },
  {
    id: 3,
    title: "Prestasi Tim Olahraga Kukar",
    excerpt: "Tim olahraga Kabupaten Kutai Kartanegara berhasil meraih prestasi gemilang...",
    image: "/images/news-3.jpg",
    date: new Date("2024-01-10"),
    slug: "prestasi-tim-olahraga-kukar",
    category: "Olahraga",
  },
  {
    id: 4,
    title: "Peluncuran Program Digitalisasi Desa",
    excerpt: "Program digitalisasi desa diluncurkan untuk meningkatkan akses teknologi...",
    image: "/images/news-4.jpg",
    date: new Date("2024-01-08"),
    slug: "peluncuran-program-digitalisasi-desa",
    category: "Teknologi",
  },
  {
    id: 5,
    title: "Kunjungan Kerja Bupati ke Desa Terpencil",
    excerpt: "Bupati melakukan kunjungan kerja ke desa-desa terpencil untuk melihat langsung...",
    image: "/images/news-5.jpg",
    date: new Date("2024-01-05"),
    slug: "kunjungan-kerja-bupati-desa-terpencil",
    category: "Pemerintahan",
  },
  {
    id: 6,
    title: "Festival Budaya Kutai Kartanegara",
    excerpt: "Festival budaya tahunan kembali digelar untuk melestarikan budaya lokal...",
    image: "/images/news-6.jpg",
    date: new Date("2024-01-03"),
    slug: "festival-budaya-kutai-kartanegara",
    category: "Budaya",
  },
]);

const categories = ref([
  { id: 1, name: "Infrastruktur", count: 15 },
  { id: 2, name: "Ekonomi", count: 12 },
  { id: 3, name: "Olahraga", count: 8 },
  { id: 4, name: "Teknologi", count: 6 },
  { id: 5, name: "Pemerintahan", count: 20 },
  { id: 6, name: "Budaya", count: 10 },
]);

const latestNews = ref([
  {
    id: 1,
    title: "Pembangunan Infrastruktur Jalan di Kukar",
    image: "/images/news-1.jpg",
    date: new Date("2024-01-15"),
    slug: "pembangunan-infrastruktur-jalan-kukar",
  },
  {
    id: 2,
    title: "Program Pemberdayaan UMKM Kukar",
    image: "/images/news-2.jpg",
    date: new Date("2024-01-12"),
    slug: "program-pemberdayaan-umkm-kukar",
  },
  {
    id: 3,
    title: "Prestasi Tim Olahraga Kukar",
    image: "/images/news-3.jpg",
    date: new Date("2024-01-10"),
    slug: "prestasi-tim-olahraga-kukar",
  },
]);

// Computed properties
const filteredNews = computed(() => {
  let filtered = newsList.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(
      (news) => news.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || news.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  // Filter by category
  if (selectedCategory.value) {
    const category = categories.value.find((cat) => cat.id === selectedCategory.value);
    if (category) {
      filtered = filtered.filter((news) => news.category === category.name);
    }
  }

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / itemsPerPage);
});

const handleSearch = () => {
  currentPage.value = 1;
  // In real app, this would trigger API call
};

const filterByCategory = (categoryId: number) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId;
  currentPage.value = 1;
  // In real app, this would trigger API call
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // In real app, this would trigger API call
  }
};

const fetchNews = async () => {
  try {
    isLoading.value = true;
    // TODO: Replace with actual API call
    // const response = await fetch('/api/news')
    // const data = await response.json()
    // newsList.value = data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    console.error("Error fetching news:", err);
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchNews();
});
</script>

<style scoped>
.berita-page {
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* News Content */
.news-content {
  padding: 60px 0;
}

/* News List */
.news-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.news-item:hover {
  transform: translateY(-5px);
}

.news-image {
  height: 250px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-details {
  padding: 1.5rem;
}

.news-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.news-meta i {
  margin-right: 0.25rem;
}

.news-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.news-title a {
  color: #2c3e50;
  text-decoration: none;
}

.news-title a:hover {
  color: #667eea;
}

.news-excerpt {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Pagination */
.pagination-wrapper {
  margin-top: 3rem;
}

.pagination .page-link {
  color: #667eea;
  border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #667eea;
  border-color: #667eea;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 120px;
}

.sidebar-widget {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.widget-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2c3e50;
}

/* Search Form */
.search-form {
  display: flex;
  gap: 0.5rem;
}

.search-form .form-control {
  flex: 1;
}

/* Category List */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  margin-bottom: 0.5rem;
}

.category-list a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6c757d;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.category-list a:hover,
.category-list a.active {
  color: #667eea;
}

.count {
  font-size: 0.875rem;
  color: #adb5bd;
}

/* Latest News */
.latest-news-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.latest-news-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.latest-news-image {
  width: 80px;
  height: 60px;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
}

.latest-news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.latest-news-content h4 {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.latest-news-content h4 a {
  color: #2c3e50;
  text-decoration: none;
}

.latest-news-content h4 a:hover {
  color: #667eea;
}

.latest-news-content .date {
  font-size: 0.75rem;
  color: #6c757d;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .news-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .sidebar {
    position: static;
    margin-top: 2rem;
  }
}
</style>
