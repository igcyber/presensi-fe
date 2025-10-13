<script setup lang="ts">
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  RefreshCw,
  Search,
  X,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

import { useFetch } from "@/composables/useFetch";
import { usePagination } from "@/composables/usePagination";
import type { ApiResponse } from "@/lib/api/core";
import { getStandarPelayananPublic } from "@/lib/api/services/standarPelayanan";
import type { StandarPelayananListResponse } from "@/lib/api/types/standarPelayanan.types";

const route = useRoute();
const router = useRouter();

// Computed
const keyword = computed(() => (route.query.keyword as string) ?? "");

const {
  currentPage,
  totalPages: _totalPages,
  itemsPerPage: _itemsPerPage,
  totalItems: _totalItems,
  setPagination,
} = usePagination();

// Fetch standar pelayanan data
const { data, isLoading, error, isError, fetchData } = useFetch<
  ApiResponse<StandarPelayananListResponse>,
  StandarPelayananListResponse
>(() => getStandarPelayananPublic({ page: currentPage.value, search: keyword.value }), {
  immediate: false,
  extractData: (response) => response.data,
});

// State
const searchQuery = ref(keyword.value);
const expandedItems = ref<Set<number>>(new Set());

// Computed
const filteredStandarList = computed(() => {
  if (!data.value?.data) return [];

  if (!searchQuery.value.trim()) {
    return data.value.data;
  }

  const query = searchQuery.value.toLowerCase();
  return data.value.data.filter(
    (item) => item.nama.toLowerCase().includes(query) || item.deskripsi.toLowerCase().includes(query),
  );
});

const hasResults = computed(() => filteredStandarList.value.length > 0);

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: route.name as string,
      query: { keyword: searchQuery.value },
    });
  } else {
    router.push({
      name: route.name as string,
      query: {},
    });
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  router.push({
    name: route.name as string,
    query: {},
  });
};

const toggleExpanded = (id: number) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

const isExpanded = (id: number) => expandedItems.value.has(id);

// Watchers
watch(currentPage, () => {
  fetchData();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

watch(keyword, async () => {
  searchQuery.value = keyword.value;
  await fetchData();

  setPagination({
    currentPage: data.value?.meta?.current_page ?? 1,
    totalPages: data.value?.meta?.last_page ?? 1,
    totalItems: data.value?.meta?.total ?? 0,
    itemsPerPage: data.value?.meta?.per_page ?? 10,
  });
});

// Lifecycle
onMounted(async () => {
  await fetchData();

  setPagination({
    currentPage: data.value?.meta?.current_page ?? 1,
    totalPages: data.value?.meta?.last_page ?? 1,
    totalItems: data.value?.meta?.total ?? 0,
    itemsPerPage: data.value?.meta?.per_page ?? 10,
  });
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <!-- Search Results Info -->
      <div v-if="keyword" class="mx-auto mb-8 max-w-2xl">
        <div class="rounded border border-yellow-600 bg-yellow-600/10 p-8 text-center">
          <Search class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
          <h4 class="mb-2 text-xl font-semibold text-yellow-600">Pencarian</h4>
          <p class="mb-6 text-yellow-600">
            {{
              keyword
                ? `Menampilkan hasil pencarian untuk "${keyword}" dengan total ${filteredStandarList.length} standar pelayanan.`
                : "Maaf, belum ada standar pelayanan yang tersedia saat ini."
            }}
          </p>
          <button
            @click="clearSearch"
            class="inline-flex items-center rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-600/90"
          >
            <X class="mr-2 h-4 w-4" />
            Reset Pencarian
          </button>
        </div>
      </div>

      <div class="container">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="mb-4 text-3xl font-bold text-gray-900">Standar Pelayanan</h1>
          <p class="text-lg text-gray-600">Standar Pelayanan Publik DPRD Kutai Kartanegara</p>
        </div>

        <!-- Search -->
        <div class="mb-8 flex justify-center">
          <div class="w-full max-w-md">
            <form @submit.prevent="handleSearch" class="relative">
              <Input
                v-model="searchQuery"
                placeholder="Cari standar pelayanan..."
                class="border-yellow-600/50 pr-12 pl-10 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />
              <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </form>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
            <p class="text-gray-600">Memuat data standar pelayanan...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle class="mx-auto mb-4 h-10 w-10 text-red-600" />
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
            <button
              class="rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="fetchData"
            >
              <RefreshCw class="mr-2 inline h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="data">
          <template v-if="hasResults">
            <!-- List Standar Pelayanan -->
            <div class="space-y-6">
              <Card
                v-for="item in filteredStandarList"
                :key="item.id"
                class="group transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <CheckCircle class="h-5 w-5 text-yellow-600" />
                    </div>
                    <CardTitle class="text-lg">{{ item.nama }}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Collapsible>
                    <CollapsibleTrigger as-child>
                      <Button variant="outline" size="sm" class="w-full" @click="toggleExpanded(item.id)">
                        <ChevronDown v-if="!isExpanded(item.id)" class="mr-2 h-4 w-4" />
                        <ChevronUp v-else class="mr-2 h-4 w-4" />
                        {{ isExpanded(item.id) ? "Tutup Detail" : "Lihat Detail" }}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent class="mt-4">
                      <div class="rounded-lg bg-gray-50 p-4">
                        <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ item.deskripsi }}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </template>
          <template v-else>
            <div class="mx-auto max-w-2xl">
              <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
                <ClipboardCheck class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Tidak Ada Standar Pelayanan</h4>
                <p class="text-yellow-700">
                  {{
                    keyword
                      ? `Tidak ditemukan standar pelayanan dengan kata kunci "${keyword}".`
                      : "Maaf, belum ada standar pelayanan yang tersedia saat ini."
                  }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
