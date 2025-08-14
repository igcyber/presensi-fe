<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div v-if="keyword && keyword !== ''" class="col-md-12">
                <div class="alert alert-success">
                  <i class="bx bx-search"></i>
                  {{ newsData.length }} hasil pencarian untuk <b>"{{ keyword }}"</b>.
                </div>
              </div>

              <div class="col-md-12">
                <div class="row">
                  <div v-for="news in newsData" :key="news.id" class="col-md-4">
                    <div class="post">
                      <div class="post-image-frame">
                        <img :src="news.foto" :alt="news.judul" class="post-image" />
                      </div>
                      <router-link :to="getNewsDetailUrl(news.id, news.judul)" class="post-link">
                        {{ news.judul }}
                      </router-link>
                      <div class="post-date-frame">
                        <span class="post-date">
                          <i class="bx bx-calendar"></i>
                          {{ formatDate(news.created_at) }}
                        </span>
                      </div>
                      <div class="post-text" v-html="news.isi"></div>
                      <hr />
                    </div>
                  </div>

                  <div v-if="newsData.length === 0" class="col-md-12">
                    <div class="p-4 text-center">
                      <i class="bx bx-news bx-lg text-muted"></i>
                      <p class="text-muted mt-2">Data kosong</p>
                    </div>
                  </div>

                  <div class="col-md-12 text-center">
                    <BasePagination
                      v-if="pagination.totalPages > 1"
                      :page="pagination.currentPage"
                      :items-per-page="pagination.perPage"
                      :total-items="pagination.totalItems"
                      :total-pages="pagination.totalPages"
                      @previous-page="handlePreviousPage"
                      @next-page="handleNextPage"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import { useFormatters } from "@/composables/useFormatters";

interface NewsItem {
  id: number;
  judul: string;
  isi: string;
  foto: string;
  created_at: string;
  opd_id?: number;
  opd?: {
    nama: string;
  };
}

interface PaginationData {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

// Composables
const route = useRoute();
const router = useRouter();
const { date: formatDate } = useFormatters();

// Reactive data
const newsData = ref<NewsItem[]>([]);
const pagination = ref<PaginationData>({
  currentPage: 1,
  perPage: 9,
  totalItems: 0,
  totalPages: 0,
});
const loading = ref(false);

// Computed
const keyword = computed(() => (route.query.search as string) || "");

const getNewsDetailUrl = (id: number, title: string): string => {
  const slug = title.replace(/[ /%]/g, "-").toLowerCase();
  return `/berita/${id}/${slug}`;
};

const fetchNews = async () => {
  loading.value = true;
  try {
    // Simulasi data berita - ganti dengan API call yang sebenarnya
    const mockNews: NewsItem[] = [
      {
        id: 1,
        judul: "Bupati Kutai Kartanegara Luncurkan Program Pembangunan Infrastruktur",
        isi: "Program pembangunan infrastruktur meliputi jalan...",
        foto: "/dummy.jpg",
        created_at: "2024-01-15T10:00:00Z",
        opd_id: 1,
        opd: { nama: "Bagian Humas" },
      },
      {
        id: 2,
        judul: "Festival Budaya Kutai Kartanegara 2024 Resmi Dibuka",
        isi: "Festival budaya tahunan yang menampilkan berbagai kesenian tradisional dan modern telah resmi dibuka oleh Bupati...",
        foto: "/dummy.jpg",
        created_at: "2024-01-14T09:30:00Z",
        opd_id: 2,
        opd: { nama: "Dinas Pariwisata" },
      },
      {
        id: 3,
        judul: "Bantuan Sosial untuk Masyarakat Terdampak Bencana",
        isi: "Pemerintah Kabupaten Kutai Kartanegara menyalurkan bantuan sosial berupa sembako dan peralatan untuk korban bencana...",
        foto: "/dummy.jpg",
        created_at: "2024-01-13T14:15:00Z",
        opd_id: 3,
        opd: { nama: "Dinas Sosial" },
      },
    ];

    // Filter berdasarkan keyword jika ada
    let filteredNews = mockNews;
    if (keyword.value && keyword.value !== "") {
      filteredNews = mockNews.filter(
        (news) =>
          news.judul.toLowerCase().includes(keyword.value.toLowerCase()) ||
          news.isi.toLowerCase().includes(keyword.value.toLowerCase()),
      );
    }

    // Simulasi pagination
    const currentPage = parseInt(route.query.page as string) || 1;
    const perPage = 9;
    const totalItems = filteredNews.length;
    const totalPages = Math.ceil(totalItems / perPage);

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;

    newsData.value = filteredNews.slice(startIndex, endIndex);
    pagination.value = {
      currentPage,
      perPage,
      totalItems,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    newsData.value = [];
  } finally {
    loading.value = false;
  }
};

const handlePreviousPage = () => {
  if (pagination.value.currentPage > 1) {
    const newPage = pagination.value.currentPage - 1;
    router.push({
      query: {
        ...route.query,
        page: newPage.toString(),
      },
    });
  }
};

const handleNextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    const newPage = pagination.value.currentPage + 1;
    router.push({
      query: {
        ...route.query,
        page: newPage.toString(),
      },
    });
  }
};

// Lifecycle
onMounted(() => {
  fetchNews();
});

watch(
  () => route.query,
  () => {
    fetchNews();
  },
);
</script>
