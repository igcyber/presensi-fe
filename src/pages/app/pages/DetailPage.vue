<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PageDialog from "@/components/dialogs/PageDialog.vue";
import PageDetailView from "@/components/features/page/PageDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deletePage, getPageById } from "@/lib/api/services/page";
import type { PageDetailResponse } from "@/lib/api/types/page.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const pageId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<PageDetailResponse>();
const confirmDialog = useDialog<PageDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<PageDetailResponse>, PageDetailResponse>(
  () => getPageById(pageId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail page", {
        description: error.message,
      });
    },
  },
);

// Event handlers
const handleBack = () => {
  router.push({ name: "app.pages" });
};

const handleEdit = (page: PageDetailResponse) => {
  dialog.openEdit(page);
};

const handleDelete = (page: PageDetailResponse) => {
  confirmDialog.openView(page);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const page = confirmDialog.state.value.data;
    await deletePage(page.id);

    toast.success("Berhasil menghapus page", {
      description: `Page "${page.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus page";
    toast.error("Gagal menghapus page", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePageDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (pageId.value > 0) {
    fetchData();
  } else {
    toast.error("ID page tidak valid");
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
        <span class="text-muted-foreground">Memuat detail page...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail page'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PageDetailView
        :page="data"
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
              Edit Page
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Page
            </Button>
          </div>
        </template>
      </PageDetailView>
    </div>

    <!-- Edit Dialog -->
    <PageDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :page="dialog.state.value.data"
      widthClass="sm:max-w-[900px]"
      @success="handlePageDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Page"
      :description="`Apakah Anda yakin ingin menghapus page '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
