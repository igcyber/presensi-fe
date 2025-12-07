<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KantorDialog from "@/components/dialogs/KantorDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteKantor, getKantorById } from "@/lib/api/services/kantor";
import type { Kantor } from "@/lib/api/types/kantor.types";
import { formatDate, formatTime } from "@/lib/utils/formatters";

const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: L.Map | null = null;
let markerInstance: L.Marker | null = null;
let circleInstance: L.Circle | null = null;

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

const route = useRoute();
const router = useRouter();

const kantorId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const editDialog = useDialog<Kantor>();
const confirmDialog = useDialog<Kantor>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<Kantor>, Kantor>(
  () => getKantorById(kantorId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onSuccess: () => {
      nextTick(() => {
        setTimeout(() => {
          if (data.value && mapContainer.value && data.value.lat && data.value.long) {
            initializeMap();
            nextTick(() => {
              if (mapInstance) {
                mapInstance.invalidateSize();
                setupMapObservers();
              }
            });
          }
        }, 300);
      });
    },
    onError: (error) => {
      toast.error("Gagal memuat detail kantor", {
        description: error.message,
      });
    },
  },
);

const handleBack = () => {
  router.push({ name: "app.kantor" });
};

const handleEdit = (kantor: Kantor) => {
  editDialog.openEdit(kantor);
};

const handleDelete = (kantor: Kantor) => {
  confirmDialog.openView(kantor);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const kantor = confirmDialog.state.value.data;
    await deleteKantor(kantor.id);

    toast.success("Berhasil menghapus kantor", {
      description: `Kantor "${kantor.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus kantor";
    toast.error("Gagal menghapus kantor", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const initializeMap = () => {
  if (!mapContainer.value || !data.value) {
    console.log("Map container or data not available", { mapContainer: !!mapContainer.value, data: !!data.value });
    return;
  }

  const lat = parseFloat(data.value.lat);
  const lng = parseFloat(data.value.long);
  const radius = data.value.radiusLimit || 20;

  if (isNaN(lat) || isNaN(lng)) {
    console.error("Invalid coordinates", { lat: data.value.lat, lng: data.value.long });
    return;
  }

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  try {
  mapInstance = L.map(mapContainer.value, {
    center: [lat, lng],
    zoom: 15,
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true,
    scrollWheelZoom: true,
    boxZoom: true,
    keyboard: true,
    zoomControl: true,
  });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    if (markerInstance) {
      markerInstance.remove();
      markerInstance = null;
    }

    markerInstance = L.marker([lat, lng], { icon: defaultIcon, draggable: false }).addTo(mapInstance);
    markerInstance.bindPopup(`<b>${data.value.nama}</b><br>${data.value.alamat || ""}`).openPopup();

    if (circleInstance) {
      circleInstance.remove();
      circleInstance = null;
    }

    circleInstance = L.circle([lat, lng], {
      color: "#3b82f6",
      fillColor: "#3b82f6",
      fillOpacity: 0.2,
      radius: radius,
    }).addTo(mapInstance);

    nextTick(() => {
      mapInstance?.invalidateSize();
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
};

const setupMapObservers = () => {
  if (!mapInstance || !mapContainer.value) return;

  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  resizeObserver = new ResizeObserver(() => {
    nextTick(() => {
      mapInstance?.invalidateSize();
    });
  });
  resizeObserver.observe(mapContainer.value);

  if (mutationObserver) {
    mutationObserver.disconnect();
  }
  mutationObserver = new MutationObserver(() => {
    nextTick(() => {
      mapInstance?.invalidateSize();
    });
  });
  mutationObserver.observe(mapContainer.value, {
    attributes: true,
    attributeFilter: ["style", "class"],
    childList: false,
    subtree: false,
  });
};

watch(
  () => [data.value, mapContainer.value],
  () => {
    if (data.value && mapContainer.value && data.value.lat && data.value.long) {
      nextTick(() => {
        setTimeout(() => {
          initializeMap();
          nextTick(() => {
            if (mapInstance) {
              mapInstance.invalidateSize();
              setupMapObservers();
            }
          });
        }, 300);
      });
    }
  },
  { immediate: false },
);

onMounted(() => {
  if (kantorId.value > 0) {
    fetchData();
  } else {
    toast.error("ID kantor tidak valid");
    handleBack();
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  if (markerInstance) {
    markerInstance.remove();
    markerInstance = null;
  }
  if (circleInstance) {
    circleInstance.remove();
    circleInstance = null;
  }
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span class="text-muted-foreground">Memuat detail kantor...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail kantor'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="p-4 md:p-6 lg:p-8">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <Button variant="ghost" @click="handleBack" class="mb-4">
              ← Kembali
            </Button>
            <h1 class="text-3xl font-bold tracking-tight">Detail Kantor</h1>
            <p class="text-muted-foreground">Informasi detail kantor</p>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" @click="handleEdit(data)">
              <Edit class="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" @click="handleDelete(data)">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>

        <!-- Detail Card -->
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kantor</CardTitle>
            <CardDescription>Detail lengkap kantor</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Nama</label>
              <p class="mt-1 text-lg">{{ data.nama || "-" }}</p>
            </div>
            <div v-if="data.alamat">
              <label class="text-sm font-medium text-muted-foreground">Alamat</label>
              <p class="mt-1 text-lg">{{ data.alamat }}</p>
            </div>
            <div v-if="data.deskripsi">
              <label class="text-sm font-medium text-muted-foreground">Deskripsi</label>
              <p class="mt-1 text-lg">{{ data.deskripsi }}</p>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Latitude</label>
                <p class="mt-1 text-lg">{{ data.lat || "-" }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Longitude</label>
                <p class="mt-1 text-lg">{{ data.long || "-" }}</p>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Radius Limit</label>
              <p class="mt-1 text-lg">{{ data.radiusLimit || "-" }} meter</p>
            </div>
            <div v-if="data.lat && data.long">
              <label class="text-sm font-medium text-muted-foreground mb-2 block">Lokasi Peta</label>
              <div class="overflow-hidden rounded-lg border">
                <div ref="mapContainer" class="h-[400px] w-full"></div>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Jam Masuk</label>
                <p class="mt-1 text-lg">{{ data.jamMasuk ? formatTime(data.jamMasuk) : "-" }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Jam Pulang</label>
                <p class="mt-1 text-lg">{{ data.jamPulang ? formatTime(data.jamPulang) : "-" }}</p>
              </div>
            </div>
            <div v-if="data.jumlah_pegawai !== undefined">
              <label class="text-sm font-medium text-muted-foreground">Jumlah Pegawai</label>
              <p class="mt-1 text-lg">{{ data.jumlah_pegawai }}</p>
            </div>
            <div v-if="data.createdAt">
              <label class="text-sm font-medium text-muted-foreground">Dibuat</label>
              <p class="mt-1 text-lg">{{ formatDate(data.createdAt, { includeTime: true }) }}</p>
            </div>
            <div v-if="data.updatedAt">
              <label class="text-sm font-medium text-muted-foreground">Diperbarui</label>
              <p class="mt-1 text-lg">{{ formatDate(data.updatedAt, { includeTime: true }) }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Edit Dialog -->
    <KantorDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :kantor="editDialog.state.value.data"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Kantor"
      :description="`Apakah Anda yakin ingin menghapus kantor '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
