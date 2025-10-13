<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import TagDialog from "@/components/dialogs/TagDialog.vue";
import TagDetailView from "@/components/features/tag/TagDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteTag, getTagById } from "@/lib/api/services/tag";
import type { TagDetailResponse } from "@/lib/api/types/tag.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const tagId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<TagDetailResponse>();
const confirmDialog = useDialog<TagDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<TagDetailResponse>, TagDetailResponse>(
  () => getTagById(tagId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail tag", {
        description: error.message,
      });
    },
  },
);

// Event handlers
const handleBack = () => {
  router.push({ name: "app.tags" });
};

const handleEdit = (tag: TagDetailResponse) => {
  dialog.openEdit(tag);
};

const handleDelete = (tag: TagDetailResponse) => {
  confirmDialog.openView(tag);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const tag = confirmDialog.state.value.data;
    await deleteTag(tag.id);

    toast.success("Berhasil menghapus tag", {
      description: `Tag "${tag.namaTag}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus tag";
    toast.error("Gagal menghapus tag", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleTagDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (tagId.value > 0) {
    fetchData();
  } else {
    toast.error("ID tag tidak valid");
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
        <span class="text-muted-foreground">Memuat detail tag...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail tag'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <TagDetailView :tag="data" :show-back-button="true" @back="handleBack" @edit="handleEdit" @delete="handleDelete">
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Edit class="mr-2 h-4 w-4" />
              Edit Tag
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Tag
            </Button>
          </div>
        </template>
      </TagDetailView>
    </div>

    <!-- Edit Dialog -->
    <TagDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :tag="dialog.state.value.data"
      @success="handleTagDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Tag"
      :description="`Apakah Anda yakin ingin menghapus tag '${confirmDialog.state.value.data?.namaTag}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
