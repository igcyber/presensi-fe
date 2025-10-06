<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PPIDDialog from "@/components/dialogs/PPIDDialog.vue";
import PPIDDetailView from "@/components/features/ppid/PPIDDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deletePPID, getPPIDById } from "@/lib/api/services/ppid";
import type { PPIDDetailResponse, PPIDType } from "@/lib/api/types/ppid.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const ppidId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const ppidType = computed(() => {
  const type = route.params.type;
  return typeof type === "string" ? type : "informasiberkala";
});

// Composables
const dialog = useDialog<PPIDDetailResponse>();
const confirmDialog = useDialog<PPIDDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<PPIDDetailResponse>, PPIDDetailResponse>(
  () => getPPIDById(ppidId.value, ppidType.value as PPIDType),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail PPID", {
        description: error.message,
      });
    },
  },
);

// Event handlers
const handleBack = () => {
  router.push({ name: "app.ppid" });
};

const handleEdit = (ppid: PPIDDetailResponse) => {
  dialog.openEdit(ppid);
};

const handleDelete = (ppid: PPIDDetailResponse) => {
  confirmDialog.openView(ppid);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const ppid = confirmDialog.state.value.data;
    await deletePPID(ppid.id, ppidType.value as PPIDType);

    toast.success("Berhasil menghapus PPID", {
      description: `PPID "${ppid.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus PPID";
    toast.error("Gagal menghapus PPID", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePPIDDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (ppidId.value > 0) {
    fetchData();
  } else {
    toast.error("ID PPID tidak valid");
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
        <span class="text-muted-foreground">Memuat detail PPID...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail PPID'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PPIDDetailView
        :ppid="data"
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
              Edit PPID
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus PPID
            </Button>
          </div>
        </template>
      </PPIDDetailView>
    </div>

    <!-- PPID Dialog -->
    <PPIDDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :ppid="dialog.state.value.data"
      widthClass="sm:max-w-[800px]"
      @success="handlePPIDDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus PPID"
      :description="`Apakah Anda yakin ingin menghapus PPID '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
