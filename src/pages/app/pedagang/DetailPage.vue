<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PedagangDialog from "@/components/dialogs/PedagangDialog.vue";
import PedagangKiosDialog from "@/components/dialogs/PedagangKiosDialog.vue";
import PedagangDetailView from "@/components/features/pedagang/PedagangDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import {
  deletePedagang,
  deletePedagangKios,
  getPedagangById,
  getPedagangKios,
  updatePedagangKios,
} from "@/lib/api/services/pedagang";
import type { PedagangDetail, PedagangKios } from "@/lib/api/types/pedagang.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get pedagang ID from route params
const pedagangId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<PedagangDetail>();
const confirmDialog = useDialog<PedagangDetail>();
const kiosDialog = useDialog();
const kiosDeleteDialog = useDialog<PedagangKios>();

// Kios state
const pedagangKios = ref<PedagangKios[]>([]);
const isLoadingKios = ref(false);

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<PedagangDetail>, PedagangDetail>(
  () => getPedagangById(pedagangId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail pedagang", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.pedagang" });
};

const handleEdit = (pedagang: PedagangDetail) => {
  editDialog.openEdit(pedagang);
};

const handleDelete = (pedagang: PedagangDetail) => {
  confirmDialog.openView(pedagang);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const pedagang = confirmDialog.state.value.data;
    await deletePedagang(pedagang.id);

    toast.success("Berhasil menghapus pedagang", {
      description: `Pedagang "${pedagang.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus pedagang";
    toast.error("Gagal menghapus pedagang", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Kios methods
const fetchKios = async () => {
  if (pedagangId.value <= 0) return;

  try {
    isLoadingKios.value = true;
    const response = await getPedagangKios(pedagangId.value);
    pedagangKios.value = response.data || [];
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal memuat data kios";
    toast.error("Gagal memuat data kios", { description: errorMessage });
    pedagangKios.value = [];
  } finally {
    isLoadingKios.value = false;
  }
};

const handleAddKios = () => {
  kiosDialog.openCreate();
};

const handleKiosDialogSuccess = () => {
  kiosDialog.closeDialog();
  fetchKios();
};

const handleToggleActive = async (pedagangKiosItem: PedagangKios) => {
  try {
    const kiosIdToUse = pedagangKiosItem.kiosId || pedagangKiosItem.kios?.id;

    if (!kiosIdToUse) {
      toast.error("Gagal", { description: "ID kios tidak ditemukan" });
      return;
    }

    await updatePedagangKios(pedagangId.value, kiosIdToUse, {
      isActive: !pedagangKiosItem.isActive,
    });

    toast.success("Berhasil", {
      description: `Kios berhasil ${pedagangKiosItem.isActive ? "dinonaktifkan" : "diaktifkan"}`,
    });

    fetchKios();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal memperbarui status kios";
    toast.error("Gagal", { description: errorMessage });
  }
};

const handleDeleteKios = (pedagangKiosItem: PedagangKios) => {
  kiosDeleteDialog.openView(pedagangKiosItem);
};

const confirmDeleteKios = async () => {
  if (!kiosDeleteDialog.state.value.data) return;

  try {
    kiosDeleteDialog.setLoading(true);
    const pedagangKiosItem = kiosDeleteDialog.state.value.data;

    const kiosIdToUse = pedagangKiosItem.kiosId || pedagangKiosItem.kios?.id;

    if (!kiosIdToUse) {
      toast.error("Gagal", { description: "ID kios tidak ditemukan" });
      kiosDeleteDialog.setLoading(false);
      return;
    }

    await deletePedagangKios(pedagangId.value, kiosIdToUse);

    toast.success("Berhasil", {
      description: "Penetapan kios berhasil dihapus",
    });

    kiosDeleteDialog.closeDialog();
    fetchKios();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus penetapan kios";
    toast.error("Gagal", { description: errorMessage });
  } finally {
    kiosDeleteDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (pedagangId.value > 0) {
    fetchData();
    fetchKios();
  } else {
    toast.error("ID pedagang tidak valid");
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
        <span class="text-muted-foreground">Memuat detail pedagang...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail pedagang'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PedagangDetailView
        :pedagang="data"
        :show-back-button="true"
        :pedagang-kios="pedagangKios"
        :is-loading-kios="isLoadingKios"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
        @add-kios="handleAddKios"
        @toggle-active="handleToggleActive"
        @delete-kios="handleDeleteKios"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Edit class="mr-2 h-4 w-4" />
              Edit Pedagang
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Pedagang
            </Button>
          </div>
        </template>
      </PedagangDetailView>
    </div>

    <!-- Edit Dialog -->
    <PedagangDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :pedagang="editDialog.state.value.data"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Pedagang"
      :description="`Apakah Anda yakin ingin menghapus pedagang '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />

    <!-- Kios Dialog -->
    <PedagangKiosDialog
      v-model:open="kiosDialog.state.value.open"
      :pedagang-id="pedagangId"
      @success="handleKiosDialogSuccess"
    />

    <!-- Confirm Delete Kios Dialog -->
    <BaseConfirmDialog
      v-model:open="kiosDeleteDialog.state.value.open"
      title="Hapus Penetapan Kios"
      :description="`Apakah Anda yakin ingin menghapus penetapan kios '${kiosDeleteDialog.state.value.data?.kios?.kode || 'Kios #' + kiosDeleteDialog.state.value.data?.kiosId}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="kiosDeleteDialog.state.value.loading"
      @confirm="confirmDeleteKios"
    />
  </div>
</template>
