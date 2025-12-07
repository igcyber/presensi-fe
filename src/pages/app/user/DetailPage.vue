<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PegawaiDialog from "@/components/dialogs/PegawaiDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import { getKantor } from "@/lib/api/services/kantor";
import { deletePegawai, getPegawaiById } from "@/lib/api/services/pegawai";
import { getTipePegawai } from "@/lib/api/services/tipePegawai";
import type { ApiResponse } from "@/lib/api/core";
import type { Kantor } from "@/lib/api/types/kantor.types";
import type { Pegawai } from "@/lib/api/types/pegawai.types";
import type { TipePegawai } from "@/lib/api/types/tipePegawai.types";
import { formatDate } from "@/lib/utils/formatters";

const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: L.Map | null = null;
let markerInstance: L.Marker | null = null;

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

const route = useRoute();
const router = useRouter();

const pegawaiId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const editDialog = useDialog<Pegawai>();
const confirmDialog = useDialog<Pegawai>();

const tipePegawaiList = ref<{ label: string; value: string; id: number }[]>([]);
const kantorOptions = ref<{ label: string; value: number }[]>([]);

const tipePegawaiOptions = computed(() =>
  tipePegawaiList.value.map((item) => ({
    label: item.label,
    value: item.id,
  })),
);

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<Pegawai>, Pegawai>(
  () => getPegawaiById(pegawaiId.value),
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
      toast.error("Gagal memuat detail pegawai", {
        description: error.message,
      });
    },
  },
);

const loadTipePegawaiOptions = async (): Promise<void> => {
  try {
    const response = await getTipePegawai();
    tipePegawaiList.value = response.data.map((item: TipePegawai) => ({
      label: item.nama,
      value: item.nama,
      id: item.id,
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data tipe pegawai";
    toast.error("Gagal", { description: errorMessage });
  }
};

const loadKantorOptions = async (): Promise<void> => {
  try {
    const response = await getKantor();
    kantorOptions.value = response.data.data.map((item: Kantor) => ({
      label: item.nama,
      value: item.id,
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data kantor";
    toast.error("Gagal", { description: errorMessage });
  }
};

const getTipePegawaiNama = (id: number): string => {
  const tipePegawai = tipePegawaiList.value.find((opt) => opt.id === id);
  return tipePegawai?.label || `ID: ${id}`;
};

const getKantorNama = (id: number): string => {
  const kantor = kantorOptions.value.find((opt) => opt.value === id);
  return kantor?.label || `ID: ${id}`;
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
    markerInstance.bindPopup(`<b>${data.value.nama}</b><br>${data.value.user?.email || ""}`).openPopup();

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

const handleBack = () => {
  router.push({ name: "app.pegawai" });
};

const handleEdit = (pegawai: Pegawai) => {
  editDialog.openEdit(pegawai);
};

const handleDelete = (pegawai: Pegawai) => {
  confirmDialog.openView(pegawai);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const pegawai = confirmDialog.state.value.data;
    await deletePegawai(pegawai.id);

    toast.success("Berhasil menghapus pegawai", {
      description: `Pegawai "${pegawai.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus pegawai";
    toast.error("Gagal menghapus pegawai", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

onMounted(async () => {
  if (pegawaiId.value > 0) {
    await loadTipePegawaiOptions();
    await loadKantorOptions();
    fetchData();
  } else {
    toast.error("ID pegawai tidak valid");
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
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span class="text-muted-foreground">Memuat detail pegawai...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail pegawai'" @retry="fetchData" />
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
            <h1 class="text-3xl font-bold tracking-tight">Detail Pegawai</h1>
            <p class="text-muted-foreground">Informasi detail pegawai</p>
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
            <CardTitle>Informasi Pegawai</CardTitle>
            <CardDescription>Detail lengkap pegawai</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Nama</label>
              <p class="mt-1 text-lg">{{ data.nama || "-" }}</p>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Tipe Pegawai</label>
                <p class="mt-1 text-lg">{{ getTipePegawaiNama(data.tipePegawaiId) }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Kantor</label>
                <p class="mt-1 text-lg">{{ getKantorNama(data.kantorId) }}</p>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Check Radius</label>
              <p class="mt-1">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    data.checkRadius === 'YA' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ data.checkRadius }}
                </span>
              </p>
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
            <div v-if="data.lat && data.long">
              <label class="text-sm font-medium text-muted-foreground mb-2 block">Lokasi Peta</label>
              <div class="overflow-hidden rounded-lg border">
                <div ref="mapContainer" class="h-[400px] w-full"></div>
              </div>
            </div>
            <div v-if="data.user">
              <label class="text-sm font-medium text-muted-foreground">Informasi User</label>
              <div class="mt-2 space-y-2 rounded-lg border p-4">
                <div>
                  <span class="text-sm text-muted-foreground">Email:</span>
                  <p class="mt-1">{{ data.user.email || "-" }}</p>
                </div>
                <div>
                  <span class="text-sm text-muted-foreground">Username:</span>
                  <p class="mt-1">{{ data.user.username || "-" }}</p>
                </div>
                <div v-if="data.user.noHp">
                  <span class="text-sm text-muted-foreground">No. HP:</span>
                  <p class="mt-1">{{ data.user.noHp }}</p>
                </div>
              </div>
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
    <PegawaiDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :pegawai="editDialog.state.value.data"
      :tipe-pegawai-options="tipePegawaiOptions"
      :kantor-options="kantorOptions"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Pegawai"
      :description="`Apakah Anda yakin ingin menghapus pegawai '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
