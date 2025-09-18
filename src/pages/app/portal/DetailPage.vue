<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PortalDialog from "@/components/dialogs/PortalDialog.vue";
import PortalDetailView from "@/components/features/portal/PortalDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deletePortalMenu, getPortalMenuById } from "@/lib/api/services/portal";
import type { PortalMenuDetailResponse } from "@/lib/api/types/portal.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const portalMenuId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<PortalMenuDetailResponse>();
const confirmDialog = useDialog<PortalMenuDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<PortalMenuDetailResponse>,
  PortalMenuDetailResponse
>(() => getPortalMenuById(portalMenuId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail portal menu", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.portal" });
};

const handleEdit = (portalMenu: PortalMenuDetailResponse) => {
  dialog.openEdit(portalMenu);
};

const handleDelete = (portalMenu: PortalMenuDetailResponse) => {
  confirmDialog.openView(portalMenu);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const portalMenu = confirmDialog.state.value.data;
    await deletePortalMenu(portalMenu.id);

    toast.success("Berhasil menghapus portal menu", {
      description: `Portal menu "${portalMenu.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus portal menu";
    toast.error("Gagal menghapus portal menu", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePortalDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (portalMenuId.value > 0) {
    fetchData();
  } else {
    toast.error("ID portal menu tidak valid");
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
        <span class="text-muted-foreground">Memuat detail portal menu...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail portal menu'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PortalDetailView
        :portal-menu="data"
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
              Edit Portal
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Portal
            </Button>
          </div>
        </template>
      </PortalDetailView>
    </div>

    <!-- Edit Dialog -->
    <PortalDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :portal-menu="dialog.state.value.data"
      widthClass="sm:max-w-[600px]"
      @success="handlePortalDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Portal Menu"
      :description="`Apakah Anda yakin ingin menghapus portal menu '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
