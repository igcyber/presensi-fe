<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PPIDDialog from "@/components/dialogs/PPIDDialog.vue";
import PPIDDetailView from "@/components/features/ppid/PPIDDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { deletePPID, getPPIDById } from "@/lib/api/services/ppid";
import type { PPID } from "@/lib/api/types/ppid.types";

// Route dan Router
const route = useRoute();
const router = useRouter();

// State
const ppid = ref<PPID | null>(null);
const isLoading = ref(true);
const isError = ref(false);
const error = ref<string | null>(null);

// Dialogs
const dialog = useDialog<PPID>();
const confirmDialog = useDialog<PPID>();

// Methods
const fetchPPID = async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    error.value = null;

    const id = parseInt(route.params.id as string);
    const response = await getPPIDById(id);
    ppid.value = response.data;
  } catch (err: unknown) {
    isError.value = true;
    error.value = err instanceof Error ? err.message : "Gagal memuat data PPID";
    toast.error("Gagal memuat data PPID", {
      description: error.value,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleBack = () => {
  router.push({ name: "app.ppid.index" });
};

const handleEdit = (ppidData: PPID) => {
  dialog.openEdit(ppidData);
};

const handleDelete = (ppidData: PPID) => {
  confirmDialog.openView(ppidData);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const ppidData = confirmDialog.state.value.data;

    await deletePPID(ppidData.id);

    toast.success("Berhasil menghapus PPID", {
      description: `PPID "${ppidData.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    router.push({ name: "app.ppid.index" });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus PPID";
    toast.error("Gagal menghapus PPID", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePPIDDialogSuccess = () => {
  dialog.closeDialog();
  fetchPPID(); // Refresh data
};

// Lifecycle
onMounted(() => {
  fetchPPID();
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <p class="text-muted-foreground">Memuat data PPID...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error || 'Gagal memuat data PPID'" @retry="fetchPPID" />
    </div>

    <!-- Content -->
    <div v-else-if="ppid">
      <PPIDDetailView
        :ppid="ppid"
        :show-back-button="true"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #actions="{ ppid: ppidData, onEdit, onDelete }">
          <Button variant="outline" size="sm" @click="onEdit"> Edit </Button>
          <Button variant="destructive" size="sm" @click="onDelete"> Hapus </Button>
        </template>
      </PPIDDetailView>
    </div>

    <!-- Not Found State -->
    <div v-else class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <h1 class="mb-4 text-2xl font-bold">PPID Tidak Ditemukan</h1>
        <p class="text-muted-foreground mb-6">PPID yang Anda cari tidak ditemukan atau telah dihapus.</p>
        <Button @click="handleBack"> Kembali ke Daftar PPID </Button>
      </div>
    </div>

    <!-- PPID Dialog -->
    <PPIDDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :ppid="dialog.state.value.data"
      widthClass="sm:max-w-[600px]"
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
