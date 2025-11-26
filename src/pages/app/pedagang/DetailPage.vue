<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PedagangDialog from "@/components/dialogs/PedagangDialog.vue";
import PedagangDetailView from "@/components/features/pedagang/PedagangDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deletePedagang, getPedagangById } from "@/lib/api/services/pedagang";
import type { PedagangDetail } from "@/lib/api/types/pedagang.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get pedagang ID from route params
const pedagangId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<PedagangDetail>();
const confirmDialog = useDialog<PedagangDetail>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<PedagangDetail>, PedagangDetail>(
  () => getPedagangById(pedagangId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail pedagang", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.pedagang" });
};

const handleEdit = (pedagang: PedagangDetail) => {
  editDialog.openEdit(pedagang);
};

const handleDelete = (pedagang: PedagangDetail) => {
  confirmDialog.openView(pedagang);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const pedagang = confirmDialog.state.value.data;
    await deletePedagang(pedagang.id);

    toast.success("Berhasil menghapus pedagang", {
      description: `Pedagang "${pedagang.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus pedagang";
    toast.error("Gagal menghapus pedagang", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (pedagangId.value > 0) {
    fetchData();
  } else {
    toast.error("ID pedagang tidak valid");
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
        <span class="text-muted-foreground">Memuat detail pedagang...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail pedagang'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PedagangDetailView
        :pedagang="data"
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
              Edit Pedagang
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Pedagang
            </Button>
          </div>
        </template>
      </PedagangDetailView>
    </div>

    <!-- Edit Dialog -->
    <PedagangDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :pedagang="editDialog.state.value.data"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Pedagang"
      :description="`Apakah Anda yakin ingin menghapus pedagang '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
