<script setup lang="ts">
import { Home, Search } from "lucide-vue-next";
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
    class="relative bg-black/60 bg-gradient-to-br bg-[url('/assets/images/backgrounds/bg-hero-dprd.png')] bg-cover bg-position-[top_-70px_center] bg-no-repeat py-30 text-white bg-blend-multiply sm:bg-position-[top_-70px_center]"
  >
    <div class="container">
      <div class="mx-auto max-w-4xl text-center">
        <p class="mb-4 flex items-center justify-center text-lg">
          <Home class="mr-2 h-5 w-5" />
          Selamat datang di portal resmi
        </p>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl">
          Dewan Perwakilan Rakyat Daerah<br />Kabupaten Kutai Kartanegara
        </h1>
        <p class="mb-8 text-xl text-green-100">"DPRD Kukar"</p>

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
              class="flex cursor-pointer items-center justify-center rounded-md bg-yellow-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-yellow-600/90 hover:shadow-xl"
            >
              <Search class="mr-2 h-5 w-5" />
              Cari
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
