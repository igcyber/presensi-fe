<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import MenuDialog from "@/components/dialogs/MenuDialog.vue";
import MenuDetailView from "@/components/features/menu/MenuDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteMenu, getMenuById } from "@/lib/api/services/menu";
import type { MenuDetailResponse } from "@/lib/api/types/menu.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const menuId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<MenuDetailResponse>();
const confirmDialog = useDialog<MenuDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<MenuDetailResponse>, MenuDetailResponse>(
  () => getMenuById(menuId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail menu", {
        description: error.message,
      });
    },
  },
);

// Event handlers
const handleBack = () => {
  router.push({ name: "app.menu" });
};

const handleEdit = (menu: MenuDetailResponse) => {
  dialog.openEdit(menu);
};

const handleDelete = (menu: MenuDetailResponse) => {
  confirmDialog.openView(menu);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const menu = confirmDialog.state.value.data;
    await deleteMenu(menu.id);

    toast.success("Berhasil menghapus menu", {
      description: `Menu "${menu.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus menu";
    toast.error("Gagal menghapus menu", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleMenuDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (menuId.value > 0) {
    fetchData();
  } else {
    toast.error("ID menu tidak valid");
    handleBack();
  }
});

watch(menuId, () => {
  if (menuId.value > 0) {
    fetchData();
  } else {
    toast.error("ID menu tidak valid");
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
        <span class="text-muted-foreground">Memuat detail menu...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail menu'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <MenuDetailView
        :menu="data"
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
              Edit Menu
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Menu
            </Button>
          </div>
        </template>
      </MenuDetailView>
    </div>

    <!-- Edit Dialog -->
    <MenuDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :menu="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleMenuDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Menu"
      :description="`Apakah Anda yakin ingin menghapus menu '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
