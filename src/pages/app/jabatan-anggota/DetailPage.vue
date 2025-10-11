<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import JabatanAnggotaDialog from "@/components/dialogs/JabatanAnggotaDialog.vue";
import JabatanAnggotaDetailView from "@/components/features/jabatanAnggota/JabatanAnggotaDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteJabatanAnggota, getJabatanAnggotaById } from "@/lib/api/services/jabatanAnggota";
import type { JabatanAnggotaDetailResponse } from "@/lib/api/types/jabatanAnggota.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const jabatanAnggotaId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<JabatanAnggotaDetailResponse>();
const confirmDialog = useDialog<JabatanAnggotaDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<JabatanAnggotaDetailResponse>,
  JabatanAnggotaDetailResponse
>(() => getJabatanAnggotaById(jabatanAnggotaId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail jabatan anggota", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.jabatan-anggota" });
};

const handleEdit = (jabatanAnggota: JabatanAnggotaDetailResponse) => {
  dialog.openEdit(jabatanAnggota);
};

const handleDelete = (jabatanAnggota: JabatanAnggotaDetailResponse) => {
  confirmDialog.openView(jabatanAnggota);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const jabatanAnggota = confirmDialog.state.value.data;
    await deleteJabatanAnggota(jabatanAnggota.id);

    toast.success("Berhasil menghapus jabatan anggota", {
      description: `Jabatan anggota "${jabatanAnggota.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus jabatan anggota";
    toast.error("Gagal menghapus jabatan anggota", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleJabatanAnggotaDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (jabatanAnggotaId.value > 0) {
    fetchData();
  } else {
    toast.error("ID jabatan anggota tidak valid");
    handleBack();
  }
});

watch(jabatanAnggotaId, () => {
  if (jabatanAnggotaId.value > 0) {
    fetchData();
  } else {
    toast.error("ID jabatan anggota tidak valid");
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
        <span class="text-muted-foreground">Memuat detail jabatan anggota...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail jabatan anggota'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <JabatanAnggotaDetailView
        :jabatan-anggota="data"
        :show-back-button="true"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Edit class="mr-2 h-4 w-4" />
              Edit Anggota
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Anggota
            </Button>
          </div>
        </template>
      </JabatanAnggotaDetailView>
    </div>

    <!-- Edit Dialog -->
    <JabatanAnggotaDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :jabatan-anggota="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleJabatanAnggotaDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Jabatan Anggota"
      :description="`Apakah Anda yakin ingin menghapus jabatan anggota '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
