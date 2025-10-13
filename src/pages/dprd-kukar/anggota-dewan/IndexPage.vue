<script setup lang="ts">
import { AlertCircle, Building, ChevronDown, Info, RefreshCw, User, UserX } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { getStrukturPublic } from "@/lib/api/services/struktur";
import type { Struktur } from "@/lib/api/types/struktur.types";

// Fetch struktur data
const { data, isLoading, error, isError, fetchData } = useFetch<ApiResponse<Struktur[]>, Struktur[]>(
  getStrukturPublic,
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

const strukturList = computed(() => data.value || []);

// Track open state for each collapsible
const openStates = ref<Record<string, boolean>>({});

const toggleCollapsible = (childId: number) => {
  openStates.value[childId] = !openStates.value[childId];
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="mb-4 text-3xl font-bold text-gray-900">Struktur Organisasi DPRD</h1>
          <p class="text-lg text-gray-600">Susunan Anggota Dewan DPRD Kutai Kartanegara</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
            <p class="text-gray-600">Memuat struktur organisasi...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle class="text-destructive mx-auto mb-4 h-10 w-10" />
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
            <button
              class="rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="fetchData"
            >
              <RefreshCw class="mr-2 h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="strukturList.length > 0" class="space-y-8">
          <!-- Loop Parent Structures -->
          <Card v-for="struktur in strukturList" :key="struktur.id" class="shadow-lg">
            <CardHeader class="bg-gradient-to-r from-yellow-50 to-yellow-100">
              <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
                  <Building class="h-5 w-5 text-white" />
                </div>
                {{ struktur.nama }}
              </CardTitle>
              <p class="mt-2 leading-relaxed text-gray-600">{{ struktur.tentang }}</p>
            </CardHeader>

            <CardContent class="p-6">
              <!-- Children Structures with Anggota -->
              <div v-if="struktur.children && struktur.children.length > 0" class="space-y-6">
                <Collapsible
                  v-for="child in struktur.children"
                  :key="child.id"
                  class="rounded-lg border"
                  v-model:open="openStates[child.id]"
                >
                  <CollapsibleTrigger
                    class="w-full p-4 transition-colors hover:bg-gray-50"
                    @click="toggleCollapsible(child.id)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <User class="h-4 w-4 text-blue-600" />
                        </div>
                        <div class="text-left">
                          <h3 class="text-lg font-semibold text-gray-800">{{ child.nama }}</h3>
                          <p class="text-sm text-gray-600">{{ child.tentang }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <Badge variant="secondary" class="bg-blue-100 text-blue-800">
                          {{ child.jabatanAnggota?.length || 0 }} Anggota
                        </Badge>
                        <ChevronDown
                          class="h-4 w-4 text-gray-400 transition-transform duration-200"
                          :class="{ 'rotate-180': openStates[child.id] }"
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent class="px-4 pb-4">
                    <Separator class="my-4" />

                    <!-- Grid Anggota -->
                    <div
                      v-if="child.jabatanAnggota && child.jabatanAnggota.length > 0"
                      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                      <Card
                        v-for="anggota in child.jabatanAnggota"
                        :key="anggota.id"
                        class="group transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                      >
                        <CardContent class="p-4">
                          <div class="flex flex-col items-center space-y-3 text-center">
                            <!-- Avatar -->
                            <Avatar class="h-20 w-20 shadow-lg ring-4 ring-white">
                              <AvatarImage :src="anggota.fotoUrl" :alt="anggota.nama" class="object-cover" />
                              <AvatarFallback class="bg-yellow-100 text-lg font-semibold text-yellow-800">
                                {{
                                  anggota.nama
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                }}
                              </AvatarFallback>
                            </Avatar>

                            <!-- Info -->
                            <div class="space-y-1">
                              <h4 class="line-clamp-2 leading-tight font-semibold text-gray-800">{{ anggota.nama }}</h4>
                              <p class="text-sm font-medium text-gray-600">{{ anggota.jabatan }}</p>
                            </div>

                            <!-- Decorative Element -->
                            <div
                              class="h-1 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-60"
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <!-- No Members -->
                    <div v-else class="py-8 text-center text-gray-500">
                      <UserX class="mx-auto mb-2 h-8 w-8" />
                      <p>Belum ada anggota untuk posisi ini</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <!-- No Children -->
              <div v-else class="py-8 text-center text-gray-500">
                <Info class="mx-auto mb-2 h-8 w-8" />
                <p>Belum ada struktur detail untuk {{ struktur.nama }}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <Building class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
            <h4 class="mb-4 text-xl font-semibold text-yellow-600">Data Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, data struktur organisasi tidak tersedia saat ini.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
