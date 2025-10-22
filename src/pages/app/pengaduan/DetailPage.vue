<script setup lang="ts">
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Settings, User } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import PengaduanActionForm from "@/components/features/pengaduan/PengaduanActionForm.vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useFetch } from "@/composables/useFetch";
import { getPengaduanById } from "@/lib/api/services/pengaduan";
import type { PengaduanDetailResponse } from "@/lib/api/types/pengaduan.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const pengaduanId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables

const { data, isLoading, isError, error, fetchData } = useFetch<
  any,
  PengaduanDetailResponse
>(() => getPengaduanById(pengaduanId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail pengaduan", {
      description: error.message,
    });
  },
});

// State
const showActionForm = ref(false);
const actionType = ref<'status' | 'kategori'>('status');

// Event handlers
const handleBack = () => {
  router.push({ name: "app.pengaduan" });
};

const handleUpdateStatus = () => {
  actionType.value = 'status';
  showActionForm.value = true;
};

const handleUpdateKategori = () => {
  actionType.value = 'kategori';
  showActionForm.value = true;
};

const handleActionSuccess = () => {
  showActionForm.value = false;
  fetchData();
  toast.success("Aksi berhasil", {
    description: "Pengaduan telah berhasil diupdate",
  });
};

const handleActionCancel = () => {
  showActionForm.value = false;
};

// Lifecycle hooks
onMounted(() => {
  if (pengaduanId.value > 0) {
    fetchData();
  } else {
    toast.error("ID pengaduan tidak valid");
    handleBack();
  }
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span class="text-muted-foreground">Memuat detail pengaduan...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail pengaduan'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="mb-6 flex items-center gap-4">
          <Button variant="outline" size="sm" @click="handleBack">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h1 class="text-2xl font-bold">Detail Pengaduan</h1>
            <p class="text-muted-foreground">ID: #{{ data.id }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Pengaduan Information -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <User class="h-5 w-5" />
                  Informasi Pengadu
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label class="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                    <p class="text-sm">{{ data.nama }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-muted-foreground">NIK</label>
                    <p class="text-sm font-mono">{{ data.nik }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-muted-foreground">No. HP</label>
                    <p class="text-sm flex items-center gap-1">
                      <Phone class="h-4 w-4" />
                      {{ data.noHp }}
                    </p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-muted-foreground">Email</label>
                    <p class="text-sm flex items-center gap-1">
                      <Mail class="h-4 w-4" />
                      {{ data.email }}
                    </p>
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Alamat</label>
                  <p class="text-sm flex items-start gap-1">
                    <MapPin class="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {{ data.alamat }}
                  </p>
                </div>
              </CardContent>
            </Card>

            <!-- Aduan Details -->
            <Card>
              <CardHeader>
                <CardTitle>Aduan</CardTitle>
                <CardDescription>Detail aduan yang disampaikan</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Jenis Aduan</label>
                  <p class="text-sm font-medium">{{ data.aduan }}</p>
                </div>
                <Separator />
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Deskripsi</label>
                  <p class="text-sm whitespace-pre-wrap">{{ data.deskripsi }}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Status & Actions -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Settings class="h-5 w-5" />
                  Status & Aksi
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Status</label>
                  <div class="mt-1">
                    <Badge :variant="data.status === 'diterima' ? 'default' : 'secondary'">
                      {{ data.status === 'diterima' ? 'Diterima' : 'Belum' }}
                    </Badge>
                  </div>
                </div>

                <div v-if="data.kategoriAduan">
                  <label class="text-sm font-medium text-muted-foreground">Kategori</label>
                  <p class="text-sm">{{ data.kategoriAduan }}</p>
                </div>

                <div v-if="data.keterangan">
                  <label class="text-sm font-medium text-muted-foreground">Keterangan</label>
                  <p class="text-sm whitespace-pre-wrap">{{ data.keterangan }}</p>
                </div>

                <Separator />

                <div class="space-y-2">
                  <Button @click="handleUpdateStatus" class="w-full" size="sm">
                    <Settings class="mr-2 h-4 w-4" />
                    Update Status
                  </Button>
                  <Button @click="handleUpdateKategori" variant="outline" class="w-full" size="sm">
                    <Settings class="mr-2 h-4 w-4" />
                    Update Kategori
                  </Button>
                </div>
              </CardContent>
            </Card>

            <!-- Timeline -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Calendar class="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Dibuat</label>
                  <p class="text-sm">{{ new Date(data.createdAt).toLocaleString('id-ID') }}</p>
                </div>
                <div v-if="data.updatedAt !== data.createdAt">
                  <label class="text-sm font-medium text-muted-foreground">Terakhir Diupdate</label>
                  <p class="text-sm">{{ new Date(data.updatedAt).toLocaleString('id-ID') }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Form Modal -->
    <div v-if="showActionForm && data" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="mx-4 w-full max-w-md">
        <PengaduanActionForm
          :pengaduan="data"
          :action-type="actionType"
          @success="handleActionSuccess"
          @cancel="handleActionCancel"
        />
      </div>
    </div>
  </div>
</template>
