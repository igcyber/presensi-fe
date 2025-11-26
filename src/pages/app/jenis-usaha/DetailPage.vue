<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import JenisUsahaDialog from "@/components/dialogs/JenisUsahaDialog.vue";
import JenisUsahaDetailView from "@/components/features/jenis-usaha/JenisUsahaDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteJenisUsaha, getJenisUsahaById } from "@/lib/api/services/usaha";
import type { JenisUsahaDetail } from "@/lib/api/types/usaha.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get jenis usaha ID from route params
const jenisUsahaId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<JenisUsahaDetail>();
const confirmDialog = useDialog<JenisUsahaDetail>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<JenisUsahaDetail>, JenisUsahaDetail>(
  () => getJenisUsahaById(jenisUsahaId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail jenis usaha", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.jenis-usaha" });
};

const handleEdit = (jenisUsaha: JenisUsahaDetail) => {
  editDialog.openEdit(jenisUsaha);
};

const handleDelete = (jenisUsaha: JenisUsahaDetail) => {
  confirmDialog.openView(jenisUsaha);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const jenisUsaha = confirmDialog.state.value.data;
    await deleteJenisUsaha(jenisUsaha.id);

    toast.success("Berhasil menghapus jenis usaha", {
      description: `Jenis usaha "${jenisUsaha.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus jenis usaha";
    toast.error("Gagal menghapus jenis usaha", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (jenisUsahaId.value > 0) {
    fetchData();
  } else {
    toast.error("ID jenis usaha tidak valid");
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
        <span class="text-muted-foreground">Memuat detail jenis usaha...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail jenis usaha'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <JenisUsahaDetailView
        :jenis-usaha="data"
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
              Edit Jenis Usaha
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Jenis Usaha
            </Button>
          </div>
        </template>
      </JenisUsahaDetailView>
    </div>

    <!-- Edit Dialog -->
    <JenisUsahaDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :jenis-usaha="editDialog.state.value.data"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Jenis Usaha"
      :description="`Apakah Anda yakin ingin menghapus jenis usaha '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
