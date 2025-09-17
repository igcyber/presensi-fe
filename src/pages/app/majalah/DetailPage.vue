<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import MajalahDialog from "@/components/dialogs/MajalahDialog.vue";
import MajalahDetailView from "@/components/features/majalah/MajalahDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteMajalah, getMajalahById } from "@/lib/api/services/majalah";
import type { MajalahDetailResponse } from "@/lib/api/types/majalah.types";
import { MONTH_OPTIONS } from "@/lib/api/types/majalah.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const majalahId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<MajalahDetailResponse>();
const confirmDialog = useDialog<MajalahDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<MajalahDetailResponse>,
  MajalahDetailResponse
>(() => getMajalahById(majalahId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail majalah", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.majalah" });
};

const handleEdit = (majalah: MajalahDetailResponse) => {
  dialog.openEdit(majalah);
};

const handleDelete = (majalah: MajalahDetailResponse) => {
  confirmDialog.openView(majalah);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const majalah = confirmDialog.state.value.data;
    await deleteMajalah(majalah.id);

    const monthName = MONTH_OPTIONS.find((m) => m.value === majalah.bulan)?.label || "Unknown";
    toast.success("Berhasil menghapus majalah", {
      description: `Majalah ${monthName} ${majalah.tahun} telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus majalah";
    toast.error("Gagal menghapus majalah", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle hooks
onMounted(() => {
  if (majalahId.value > 0) {
    fetchData();
  } else {
    toast.error("ID majalah tidak valid");
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
        <span class="text-muted-foreground">Memuat detail majalah...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail majalah'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <MajalahDetailView
        :majalah="data"
        :show-back-button="true"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit"> <Edit class="mr-2 h-4 w-4" /> Edit Majalah </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" /> Hapus Majalah
            </Button>
          </div>
        </template>
      </MajalahDetailView>
    </div>

    <!-- Edit Dialog -->
    <MajalahDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :majalah="dialog.state.value.data"
      widthClass="sm:max-w-[600px]"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Majalah"
      :description="`Apakah Anda yakin ingin menghapus majalah ini? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
