<template>
  <div class="container-fluid navbreaker">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div class="row">
          <div class="col-md-12">
            <a href="{{url('berita')}}" class="headingtext-back"><i class="bx bx-chevron-left"></i> Kembali</a>
            <br />
          </div>

          <div class="col-md-8">
            <div class="detail-image-frame">
              <img :src="newsItem?.foto" class="detail-image" />
            </div>
            <div class="post post-detail">
              <div class="post-date-frame">
                <span class="post-date"><i class="bx bx-calendar"></i> {{ formatDate(newsItem?.created_at) }}</span>
              </div>
              <p class="post-link">{{ newsItem?.judul }}</p>
              <div class="post-tag">
                <span class="post-tag-icon"><i class="bx bx-buildings"></i> </span>
                {{ newsItem?.opd_id == 0 ? "Kukarkab" : newsItem?.opd?.nama }}
              </div>
              <div class="post-text" v-html="newsItem?.isi"></div>
              <br />
              <hr />
              <ShareLink :url="`https://www.kukarkab.go.id/berita/${newsItem?.id}/${newsItem?.judul}`" />
            </div>
          </div>
          <div class="col-md-4">
            <BeritaSide />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import BeritaSide from "@/components/BeritaSide.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import ShareLink from "@/components/ShareLink.vue";

import { useFormatters } from "@/composables/useFormatters";

// Types
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

// Composables
const route = useRoute();
const { date: formatDate } = useFormatters();

// Reactive data
const newsItem = ref<NewsItem | null>(null);
const loading = ref(true);

// Computed
const newsId = computed(() => parseInt(route.params.id as string));

const fetchNewsDetail = async () => {
  loading.value = true;
  try {
    // Simulasi data detail berita - ganti dengan API call yang sebenarnya
    const mockNewsDetail: NewsItem = {
      id: newsId.value,
      judul: "Bupati Kutai Kartanegara Luncurkan Program Pembangunan Infrastruktur",
      isi: `
        <p>Pemerintah Kabupaten Kutai Kartanegara melalui Bupati Dr. Edi Damansyah, S.E., M.Si resmi meluncurkan program pembangunan infrastruktur yang komprehensif untuk tahun 2024. Program ini merupakan bagian dari komitmen pemerintah daerah dalam meningkatkan kesejahteraan masyarakat melalui pembangunan yang berkelanjutan.</p>

        <p>Program pembangunan infrastruktur ini meliputi berbagai sektor vital seperti jalan, jembatan, fasilitas kesehatan, pendidikan, dan sarana air bersih. Total anggaran yang dialokasikan mencapai Rp 500 miliar yang berasal dari APBD Kabupaten Kutai Kartanegara dan dana dukungan dari pemerintah pusat.</p>

        <h3>Prioritas Pembangunan</h3>
        <ul>
          <li>Pembangunan dan perbaikan jalan sepanjang 150 kilometer</li>
          <li>Konstruksi 25 jembatan baru di berbagai kecamatan</li>
          <li>Pembangunan 10 puskesmas pembantu</li>
          <li>Renovasi 50 sekolah dasar</li>
          <li>Instalasi jaringan air bersih untuk 15.000 KK</li>
        </ul>

        <p>Bupati Edi Damansyah menekankan bahwa program ini dirancang untuk merata di seluruh wilayah Kutai Kartanegara, terutama daerah-daerah terpencil yang selama ini masih mengalami keterbatasan akses infrastruktur.</p>

        <p>"Pembangunan infrastruktur ini bukan hanya tentang fisik semata, tetapi juga tentang membuka akses ekonomi, pendidikan, dan kesehatan bagi masyarakat kita. Kami berkomitmen untuk mewujudkan Kutai Kartanegara yang maju dan sejahtera," ujar Bupati dalam sambutannya.</p>

        <p>Pelaksanaan program ini akan dimulai pada bulan Februari 2024 dan ditargetkan selesai pada akhir tahun 2024. Pemerintah daerah juga akan melibatkan kontraktor lokal untuk mendorong perekonomian daerah.</p>
      `,
      foto: "/dummy.jpg",
      created_at: "2024-01-15T10:00:00Z",
      opd_id: 1,
      opd: { nama: "Bagian Humas" },
    };

    // Simulasi delay loading
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (newsId.value === mockNewsDetail.id) {
      newsItem.value = mockNewsDetail;
    } else {
      newsItem.value = null;
    }
  } catch (error) {
    console.error("Error fetching news detail:", error);
    newsItem.value = null;
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchNewsDetail();
});
</script>
