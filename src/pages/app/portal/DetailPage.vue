<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PortalDialog from "@/components/dialogs/PortalDialog.vue";
import PortalKatDialog from "@/components/dialogs/PortalKatDialog.vue";
import PortalSubDialog from "@/components/dialogs/PortalSubDialog.vue";
import PortalDetailView from "@/components/features/portal/PortalDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import {
  deletePortalMenu,
  deletePortalMenuKat,
  deletePortalMenuSub,
  getPortalMenuById,
} from "@/lib/api/services/portal";
import type { PortalMenuDetailResponse, PortalMenuKat, PortalMenuSub } from "@/lib/api/types/portal.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const portalMenuId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const portalKatId = ref<number>(0);

// Composables
const dialog = useDialog<PortalMenuDetailResponse>();
const confirmDialog = useDialog<PortalMenuDetailResponse>();

// Dialogs for kategori and sub
const katDialog = useDialog<PortalMenuKat>();
const katConfirmDialog = useDialog<PortalMenuKat>();

const subDialog = useDialog<PortalMenuSub>();
const subConfirmDialog = useDialog<PortalMenuSub>();

// Data for dropdowns (tidak diperlukan lagi karena menggunakan hidden input)

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

// Event handlers for nested actions
const handleAddKat = async () => {
  try {
    // Open create dialog
    katDialog.openCreate();
  } catch (error) {
    console.error("Error loading portal kategori:", error);
    toast.error("Gagal memuat data portal menu");
  }
};

const handleEditKat = (kat: PortalMenuKat) => {
  katDialog.openEdit(kat);
};

const handleDeleteKat = (kat: PortalMenuKat) => {
  katConfirmDialog.openView(kat);
};

const handleAddSub = async (katId: number) => {
  try {
    // Open create dialog with default values
    portalKatId.value = katId;
    subDialog.openCreate();
  } catch (error) {
    console.error("Error loading data for sub dialog:", error);
    toast.error("Gagal memuat data");
  }
};

const handleEditSub = (sub: PortalMenuSub) => {
  subDialog.openEdit(sub);
};

const handleDeleteSub = (sub: PortalMenuSub) => {
  subConfirmDialog.openView(sub);
};

// Confirm delete handlers
const confirmDeleteKat = async () => {
  if (!katConfirmDialog.state.value.data) return;

  try {
    katConfirmDialog.setLoading(true);
    const kat = katConfirmDialog.state.value.data;
    await deletePortalMenuKat(kat.id);

    toast.success("Berhasil menghapus kategori", {
      description: `Kategori "${kat.judul}" telah dihapus`,
    });

    katConfirmDialog.closeDialog();
    fetchData(); // Refresh data
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus kategori";
    toast.error("Gagal menghapus kategori", { description: errorMessage });
  } finally {
    katConfirmDialog.setLoading(false);
  }
};

const confirmDeleteSub = async () => {
  if (!subConfirmDialog.state.value.data) return;

  try {
    subConfirmDialog.setLoading(true);
    const sub = subConfirmDialog.state.value.data;
    await deletePortalMenuSub(sub.id);

    toast.success("Berhasil menghapus sub kategori", {
      description: `Sub kategori "${sub.judul}" telah dihapus`,
    });

    subConfirmDialog.closeDialog();
    fetchData(); // Refresh data
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus sub kategori";
    toast.error("Gagal menghapus sub kategori", { description: errorMessage });
  } finally {
    subConfirmDialog.setLoading(false);
  }
};

// Dialog success handlers
const handleKatDialogSuccess = (): void => {
  katDialog.closeDialog();
  fetchData();
};

const handleSubDialogSuccess = (): void => {
  subDialog.closeDialog();
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
        @add-kat="handleAddKat"
        @edit-kat="handleEditKat"
        @delete-kat="handleDeleteKat"
        @add-sub="handleAddSub"
        @edit-sub="handleEditSub"
        @delete-sub="handleDeleteSub"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" @click="onEdit" class="w-full sm:w-auto">
              <Edit class="mr-2 h-4 w-4" />
              <span class="hidden sm:inline">Edit Portal</span>
              <span class="sm:hidden">Edit</span>
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete" class="w-full sm:w-auto">
              <Trash2 class="mr-2 h-4 w-4" />
              <span class="hidden sm:inline">Hapus Portal</span>
              <span class="sm:hidden">Hapus</span>
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

    <!-- Portal Kategori Dialog -->
    <PortalKatDialog
      v-model:open="katDialog.state.value.open"
      :mode="katDialog.state.value.mode"
      :portal-menu-kat="katDialog.state.value.data"
      :default-portal-menu-id="portalMenuId"
      widthClass="sm:max-w-[500px]"
      @success="handleKatDialogSuccess"
    />

    <!-- Portal Sub Kategori Dialog -->
    <PortalSubDialog
      v-model:open="subDialog.state.value.open"
      :mode="subDialog.state.value.mode"
      :portal-menu-sub="subDialog.state.value.data"
      :default-portal-menu-id="portalMenuId"
      :default-portal-kat-id="portalKatId"
      widthClass="sm:max-w-[600px]"
      @success="handleSubDialogSuccess"
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

    <!-- Confirm Delete Kategori Dialog -->
    <BaseConfirmDialog
      v-model:open="katConfirmDialog.state.value.open"
      title="Hapus Kategori"
      :description="`Apakah Anda yakin ingin menghapus kategori '${katConfirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="katConfirmDialog.state.value.loading"
      @confirm="confirmDeleteKat"
    />

    <!-- Confirm Delete Sub Kategori Dialog -->
    <BaseConfirmDialog
      v-model:open="subConfirmDialog.state.value.open"
      title="Hapus Sub Kategori"
      :description="`Apakah Anda yakin ingin menghapus sub kategori '${subConfirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="subConfirmDialog.state.value.loading"
      @confirm="confirmDeleteSub"
    />
  </div>
</template>
