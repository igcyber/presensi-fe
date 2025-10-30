<script setup lang="ts">
import { CheckCircle, Eye, Settings } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PengaduanDialog from "@/components/dialogs/PengaduanDialog.vue";
import PengaduanDetailView from "@/components/features/pengaduan/PengaduanDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import { getPengaduanById, markSelesai, toggleDprd } from "@/lib/api/services/pengaduan";
import type { Pengaduan, PengaduanDetailResponse } from "@/lib/api/types/pengaduan.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const pengaduanId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables

const { data, isLoading, isError, error, fetchData } = useFetch<any, PengaduanDetailResponse>(
  () => getPengaduanById(pengaduanId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail pengaduan", {
        description: error.message,
      });
    },
  },
);

// Dialog states
const dialog = useDialog<Pengaduan>();
const markSelesaiDialog = useDialog<Pengaduan>();
const toggleDprdDialog = useDialog<Pengaduan>();

// Event handlers
const handleBack = () => {
  router.push({ name: "app.pengaduan" });
};

const handleEdit = (pengaduan: Pengaduan) => {
  dialog.openEdit(pengaduan);
};

const handlePengaduanDialogSuccess = () => {
  dialog.closeDialog();
  fetchData();
  toast.success("Aksi berhasil", {
    description: "Pengaduan telah berhasil diupdate",
  });
};

const handleMarkSelesai = (pengaduan: Pengaduan) => {
  markSelesaiDialog.openView(pengaduan);
};

const handleToggleDprd = (pengaduan: Pengaduan) => {
  toggleDprdDialog.openView(pengaduan);
};

const confirmMarkSelesai = async () => {
  if (!markSelesaiDialog.state.value.data) return;

  try {
    markSelesaiDialog.setLoading(true);
    const pengaduan = markSelesaiDialog.state.value.data;
    await markSelesai(pengaduan.id);

    toast.success("Berhasil menandai pengaduan selesai", {
      description: `Pengaduan #${pengaduan.id} telah ditandai selesai`,
    });

    markSelesaiDialog.closeDialog();
    fetchData();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menandai pengaduan selesai";
    toast.error("Gagal menandai pengaduan selesai", { description: errorMessage });
  } finally {
    markSelesaiDialog.setLoading(false);
  }
};

const confirmToggleDprd = async () => {
  if (!toggleDprdDialog.state.value.data) return;

  try {
    toggleDprdDialog.setLoading(true);
    const pengaduan = toggleDprdDialog.state.value.data;
    await toggleDprd(pengaduan.id);

    toast.success("Berhasil mengubah status publish DPRD", {
      description: `Status publish DPRD pengaduan #${pengaduan.id} telah diubah`,
    });

    toggleDprdDialog.closeDialog();
    fetchData();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal mengubah status publish DPRD";
    toast.error("Gagal mengubah status publish DPRD", { description: errorMessage });
  } finally {
    toggleDprdDialog.setLoading(false);
  }
};

// Lifecycle hooks
onMounted(() => {
  if (pengaduanId.value > 0) {
    fetchData();
  } else {
    toast.error("ID pengaduan tidak valid");
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
        <span class="text-muted-foreground">Memuat detail pengaduan...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail pengaduan'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PengaduanDetailView
        :pengaduan="data"
        :show-back-button="true"
        @back="handleBack"
        @edit="handleEdit"
        @refresh="fetchData"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Settings class="mr-2 h-4 w-4" />
              Update Status
            </Button>
            <Button variant="outline" size="sm" @click="handleMarkSelesai(data)" :disabled="data.isSelesai">
              <CheckCircle class="mr-2 h-4 w-4" />
              {{ data.isSelesai ? "Sudah Selesai" : "Tandai Selesai" }}
            </Button>
            <Button variant="outline" size="sm" @click="handleToggleDprd(data)">
              <Eye class="mr-2 h-4 w-4" />
              {{ data.isPublicDprd ? "Unpublish DPRD" : "Publish DPRD" }}
            </Button>
          </div>
        </template>
      </PengaduanDetailView>
    </div>

    <!-- Pengaduan Dialog -->
    <PengaduanDialog
      v-model:open="dialog.state.value.open"
      mode="edit"
      :pengaduan="dialog.state.value.data"
      @success="handlePengaduanDialogSuccess"
    />

    <!-- Mark Selesai Confirm Dialog -->
    <BaseConfirmDialog
      v-model:open="markSelesaiDialog.state.value.open"
      title="Tandai Pengaduan Selesai"
      :description="`Apakah Anda yakin ingin menandai pengaduan #${markSelesaiDialog.state.value.data?.id} sebagai selesai?`"
      confirm-text="Tandai Selesai"
      variant="default"
      :loading="markSelesaiDialog.state.value.loading"
      @confirm="confirmMarkSelesai"
    />

    <!-- Toggle DPRD Confirm Dialog -->
    <BaseConfirmDialog
      v-model:open="toggleDprdDialog.state.value.open"
      title="Toggle Publish DPRD"
      :description="`Apakah Anda yakin ingin mengubah status publish DPRD untuk pengaduan #${toggleDprdDialog.state.value.data?.id}?`"
      confirm-text="Ubah Status"
      variant="default"
      :loading="toggleDprdDialog.state.value.loading"
      @confirm="confirmToggleDprd"
    />
  </div>
</template>
