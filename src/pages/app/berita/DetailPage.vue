<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BeritaDetailView from "@/components/berita/BeritaDetail.vue";
import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BeritaDialog from "@/components/dialogs/BeritaDialog.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteBerita, getBeritaById } from "@/lib/api/services/berita";
import type { BeritaDetailResponse } from "@/lib/api/types/berita.types";

// Router
const route = useRoute();
const router = useRouter();

// Get berita ID from route params
const beritaId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Fetch berita data
const {
  data: berita,
  isLoading,
  isError,
  error,
  fetchData,
} = useFetch<ApiResponse<BeritaDetailResponse>, BeritaDetailResponse>(() => getBeritaById(beritaId.value), {
  extractData: (response) => response.data,
  immediate: false,
  onError: (error) => {
    toast.error("Gagal memuat detail berita", {
      description: error.message,
    });
  },
});

// Composables
const editDialog = useDialog<BeritaDetailResponse>();
const confirmDialog = useDialog<BeritaDetailResponse>();

// Methods
const handleBack = () => {
  router.push({ name: "app.berita" });
};

const handleEdit = (berita: BeritaDetailResponse) => {
  editDialog.openEdit(berita);
};

const handleDelete = (berita: BeritaDetailResponse) => {
  confirmDialog.openView(berita);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const berita = confirmDialog.state.value.data;
    await deleteBerita(berita.id);

    toast.success("Berhasil menghapus berita", {
      description: `Berita "${berita.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus berita";
    toast.error("Gagal menghapus berita", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (beritaId.value > 0) {
    fetchData();
  } else {
    toast.error("ID berita tidak valid");
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
        <span class="text-muted-foreground">Memuat detail berita...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail berita'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="berita" class="py-6">
      <BeritaDetailView
        :berita="berita"
        :show-back-button="true"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit"> <Edit class="mr-2 h-4 w-4" /> Edit Berita </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" /> Hapus Berita
            </Button>
          </div>
        </template>

        <!-- Footer actions -->
        <template #footer-actions>
          <div class="flex gap-2">
            <Button variant="ghost" @click="handleBack">Kembali ke Daftar</Button>
          </div>
        </template>
      </BeritaDetailView>
    </div>

    <!-- Edit Dialog -->
    <BeritaDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :berita="editDialog.state.value.data"
      widthClass="sm:max-w-[1000px]"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Berita"
      :description="`Apakah Anda yakin ingin menghapus berita '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
