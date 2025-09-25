<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Form Pencarian
const keyword = ref<string>("");

function submitSearch() {
  const query = keyword.value ? { keyword: keyword.value } : {};
  router.push({ path: "/berita", query });

  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <!-- Hero Banner Section -->
  <section
    class="relative bg-black/60 bg-gradient-to-br bg-[url('/assets/images/backgrounds/bg-hero.png')] bg-cover bg-position-[bottom_right_-100px] bg-no-repeat py-30 text-white bg-blend-multiply sm:bg-position-[bottom_right]"
  >
    <div class="container">
      <div class="mx-auto max-w-4xl text-center">
        <p class="mb-4 flex items-center justify-center text-lg">
          <i class="bx bx-home mr-2"></i>
          Selamat datang di portal resmi
        </p>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl">Pemerintah Kabupaten<br />Kutai Kartanegara</h1>
        <p class="mb-8 text-xl text-green-100">"Kukar Idaman Mitra Pembangunan IKN"</p>

        <!-- Search Form -->
        <form @submit.prevent="submitSearch" class="mx-auto max-w-2xl">
          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              v-model="keyword"
              type="text"
              name="keyword"
              placeholder="Apa yang ingin anda cari?"
              class="flex-1 rounded-md border-0 bg-white px-6 py-4 text-gray-900 placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button
              type="submit"
              class="bg-portal-green hover:bg-portal-green/90 cursor-pointer rounded-md px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <i class="bx bx-search mr-2"></i>
              Cari
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
