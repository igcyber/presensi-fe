<script setup lang="ts">
import { AlertCircle, Building, ChevronDown, Info, RefreshCw, User, Users, UserX } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { getStrukturPublic } from "@/lib/api/services/struktur";
import type { Struktur } from "@/lib/api/types/struktur.types";

// Tab state management
const activeTab = ref<"struktur" | "fraksi">("struktur");

// Struktur navigation state
const selectedStrukturId = ref<number | null>(null);

// Fraksi navigation state
const selectedFraksiId = ref<number | null>(null);

// Track open state for each collapsible
const openStates = ref<Record<string, boolean>>({});

// Fetch struktur data
const { data, isLoading, error, isError, fetchData } = useFetch<ApiResponse<Struktur[]>, Struktur[]>(
  getStrukturPublic,
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

// Computed properties for filtered data
const strukturOrganisasi = computed(() => {
  const allData = data.value || [];
  return allData.filter((item) => item.tipe === "struktur" && item.strukturId === null);
});

const fraksiList = computed(() => {
  const allData = data.value || [];
  return allData.filter((item) => item.tipe === "fraksi");
});

const displayedStruktur = computed(() => {
  if (selectedStrukturId.value === null) {
    return strukturOrganisasi.value;
  }
  return strukturOrganisasi.value.filter((s) => s.id === selectedStrukturId.value);
});

const displayedFraksi = computed(() => {
  if (selectedFraksiId.value === null) {
    return fraksiList.value;
  }
  return fraksiList.value.filter((f) => f.id === selectedFraksiId.value);
});

// Helper functions
const hasChildren = (struktur: Struktur) => {
  return struktur.children && struktur.children.length > 0;
};

const toggleCollapsible = (childId: number) => {
  openStates.value[childId] = !openStates.value[childId];
};

const isActiveStruktur = (strukturId: number | null) => {
  return selectedStrukturId.value === strukturId;
};

const isActiveFraksi = (fraksiId: number | null) => {
  return selectedFraksiId.value === fraksiId;
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
          <p class="text-lg text-gray-600">Susunan Anggota Dewan Sekretariat DPRD Kutai Kartanegara</p>
        </div>

        <!-- Tab Navigation -->
        <div class="mb-8 flex justify-center">
          <div class="inline-flex rounded-lg bg-white p-1 shadow-sm">
            <Button
              :variant="activeTab === 'struktur' ? 'default' : 'ghost'"
              class="px-6 py-2 transition-all duration-200"
              @click="activeTab = 'struktur'"
            >
              <Building class="mr-2 h-4 w-4" />
              Struktur Organisasi
            </Button>
            <Button
              :variant="activeTab === 'fraksi' ? 'default' : 'ghost'"
              class="px-6 py-2 transition-all duration-200"
              @click="activeTab = 'fraksi'"
            >
              <Users class="mr-2 h-4 w-4" />
              Fraksi
            </Button>
          </div>
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
            <Button variant="destructive" class="px-6 py-3" @click="fetchData">
              <RefreshCw class="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        </div>

        <!-- Tab Content -->
        <div v-else>
          <!-- Struktur Organisasi Tab -->
          <div v-if="activeTab === 'struktur'">
            <div v-if="strukturOrganisasi.length > 0" class="space-y-8">
              <!-- Struktur Navigation -->
              <div class="mb-8">
                <div class="mb-4 text-center">
                  <h3 class="text-lg font-semibold text-gray-700">Pilih Struktur</h3>
                </div>
                <div class="flex flex-wrap justify-center gap-3">
                  <!-- Button Semua Struktur -->
                  <button
                    @click="selectedStrukturId = null"
                    :class="[
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                      isActiveStruktur(null)
                        ? 'bg-yellow-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700',
                    ]"
                  >
                    <Users class="h-4 w-4" />
                    <span>Semua Struktur</span>
                  </button>

                  <!-- Button untuk setiap struktur -->
                  <button
                    v-for="struktur in strukturOrganisasi"
                    :key="struktur.id"
                    @click="selectedStrukturId = struktur.id"
                    :class="[
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                      isActiveStruktur(struktur.id)
                        ? 'bg-yellow-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700',
                    ]"
                  >
                    <Users class="h-4 w-4" />
                    <span>{{ struktur.nama }}</span>
                  </button>
                </div>
              </div>

              <!-- Loop Parent Structures -->
              <Card v-for="struktur in displayedStruktur" :key="struktur.id" class="shadow-lg">
                <CardHeader class="bg-gradient-to-r from-yellow-50 to-yellow-100 py-6">
                  <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
                      <Building class="h-5 w-5 text-white" />
                    </div>
                    {{ struktur.nama }}
                  </CardTitle>
                  <p class="mt-2 leading-relaxed text-gray-600">{{ struktur.tentang }}</p>
                </CardHeader>

                <CardContent class="p-6">
                  <!-- Parent Anggota (if any) -->
                  <div v-if="struktur.jabatanAnggota && struktur.jabatanAnggota.length > 0" class="mb-8">
                    <h3 class="mb-4 text-center text-2xl font-semibold text-gray-800">Anggota</h3>
                    <div class="flex flex-wrap justify-center gap-4">
                      <Card
                        v-for="anggota in struktur.jabatanAnggota"
                        :key="anggota.id"
                        class="group w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:w-64"
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
                                    .map((n: string) => n[0])
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
                  </div>

                  <!-- Children Structures -->
                  <div v-if="hasChildren(struktur)" class="space-y-6">
                    <Separator v-if="struktur.jabatanAnggota && struktur.jabatanAnggota.length > 0" class="my-6" />
                    <h3 class="text-lg font-semibold text-gray-800">Struktur Detail</h3>
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
                          class="flex flex-wrap justify-center gap-4"
                        >
                          <Card
                            v-for="anggota in child.jabatanAnggota"
                            :key="anggota.id"
                            class="group w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:w-64"
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
                                        .map((n: string) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()
                                    }}
                                  </AvatarFallback>
                                </Avatar>

                                <!-- Info -->
                                <div class="space-y-1">
                                  <h4 class="line-clamp-2 leading-tight font-semibold text-gray-800">
                                    {{ anggota.nama }}
                                  </h4>
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

                  <!-- No Children and No Parent Members -->
                  <div
                    v-else-if="!struktur.jabatanAnggota || struktur.jabatanAnggota.length === 0"
                    class="py-8 text-center text-gray-500"
                  >
                    <Info class="mx-auto mb-2 h-8 w-8" />
                    <p>Belum ada struktur detail untuk {{ struktur.nama }}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Empty State for Struktur -->
            <div v-else class="mx-auto max-w-2xl">
              <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
                <Building class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
                <h4 class="mb-4 text-xl font-semibold text-yellow-600">Data Tidak Ditemukan</h4>
                <p class="text-yellow-700">Maaf, data struktur organisasi tidak tersedia saat ini.</p>
              </div>
            </div>
          </div>

          <!-- Fraksi Tab -->
          <div v-else-if="activeTab === 'fraksi'">
            <div v-if="fraksiList.length > 0" class="space-y-8">
              <!-- Fraksi Navigation -->
              <div class="mb-8">
                <div class="mb-4 text-center">
                  <h3 class="text-lg font-semibold text-gray-700">Pilih Fraksi</h3>
                </div>
                <div class="flex flex-wrap justify-center gap-3">
                  <!-- Button Semua Fraksi -->
                  <button
                    @click="selectedFraksiId = null"
                    :class="[
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                      isActiveFraksi(null)
                        ? 'bg-yellow-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700',
                    ]"
                  >
                    <Users class="h-4 w-4" />
                    <span>Semua Fraksi</span>
                  </button>

                  <!-- Button untuk setiap fraksi -->
                  <button
                    v-for="fraksi in fraksiList"
                    :key="fraksi.id"
                    @click="selectedFraksiId = fraksi.id"
                    :class="[
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                      isActiveFraksi(fraksi.id)
                        ? 'bg-yellow-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700',
                    ]"
                  >
                    <Users class="h-4 w-4" />
                    <span>{{ fraksi.nama }}</span>
                  </button>
                </div>
              </div>

              <!-- Loop Fraksi -->
              <Card v-for="fraksi in displayedFraksi" :key="fraksi.id" class="shadow-lg">
                <CardHeader class="bg-gradient-to-r from-blue-50 to-blue-100 py-6">
                  <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                      <Users class="h-5 w-5 text-white" />
                    </div>
                    {{ fraksi.nama }}
                  </CardTitle>
                  <p class="mt-2 leading-relaxed text-gray-600">{{ fraksi.tentang }}</p>
                </CardHeader>

                <CardContent class="p-6">
                  <!-- Anggota Fraksi -->
                  <div v-if="fraksi.anggotaFraksi && fraksi.anggotaFraksi.length > 0" class="mb-8">
                    <h3 class="mb-4 text-center text-2xl font-semibold text-gray-800">Anggota Fraksi</h3>
                    <div class="flex flex-wrap justify-center gap-4">
                      <Card
                        v-for="anggota in fraksi.anggotaFraksi"
                        :key="anggota.id"
                        class="group w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:w-64"
                      >
                        <CardContent class="p-4">
                          <div class="flex flex-col items-center space-y-3 text-center">
                            <!-- Avatar -->
                            <Avatar class="h-20 w-20 shadow-lg ring-4 ring-white">
                              <AvatarImage :src="anggota.fotoUrl" :alt="anggota.nama" class="object-cover" />
                              <AvatarFallback class="bg-blue-100 text-lg font-semibold text-blue-800">
                                {{
                                  anggota.nama
                                    .split(" ")
                                    .map((n: string) => n[0])
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
                              class="h-1 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <!-- No Members -->
                  <div v-else class="py-8 text-center text-gray-500">
                    <UserX class="mx-auto mb-2 h-8 w-8" />
                    <p>Belum ada anggota untuk fraksi ini</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Empty State for Fraksi -->
            <div v-else class="mx-auto max-w-2xl">
              <div class="rounded border border-blue-200 bg-blue-50 p-8 text-center">
                <Users class="mx-auto mb-4 h-10 w-10 text-blue-600" />
                <h4 class="mb-4 text-xl font-semibold text-blue-600">Data Fraksi Tidak Ditemukan</h4>
                <p class="text-blue-700">Maaf, data fraksi tidak tersedia saat ini.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
