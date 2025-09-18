<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import RadioDialog from "@/components/dialogs/RadioDialog.vue";
import RadioDetailView from "@/components/features/radio/RadioDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteRadio, getRadioById } from "@/lib/api/services/radio";
import type { RadioDetailResponse } from "@/lib/api/types/radio.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const radioId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<RadioDetailResponse>();
const confirmDialog = useDialog<RadioDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<RadioDetailResponse>, RadioDetailResponse>(
  () => getRadioById(radioId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail radio", {
        description: error.message,
      });
    },
  },
);

// Event handlers
const handleBack = () => {
  router.push({ name: "app.radio" });
};

const handleEdit = (radio: RadioDetailResponse) => {
  dialog.openEdit(radio);
};

const handleDelete = (radio: RadioDetailResponse) => {
  confirmDialog.openView(radio);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const radio = confirmDialog.state.value.data;
    await deleteRadio(radio.id);

    toast.success("Berhasil menghapus radio", {
      description: `Radio "${radio.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus radio";
    toast.error("Gagal menghapus radio", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleRadioDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (radioId.value > 0) {
    fetchData();
  } else {
    toast.error("ID radio tidak valid");
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
        <span class="text-muted-foreground">Memuat detail radio...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail radio'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <RadioDetailView
        :radio="data"
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
              Edit Radio
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Radio
            </Button>
          </div>
        </template>
      </RadioDetailView>
    </div>

    <!-- Edit Dialog -->
    <RadioDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :radio="dialog.state.value.data"
      widthClass="sm:max-w-[600px]"
      @success="handleRadioDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Radio"
      :description="`Apakah Anda yakin ingin menghapus radio '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
