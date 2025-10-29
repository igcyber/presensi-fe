<script setup lang="ts">
import { Settings } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import PengaduanDialog from "@/components/dialogs/PengaduanDialog.vue";
import PengaduanDetailView from "@/components/features/pengaduan/PengaduanDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import { getPengaduanById } from "@/lib/api/services/pengaduan";
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

// Dialog state
const dialog = useDialog<Pengaduan>();

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
      <PengaduanDetailView :pengaduan="data" :show-back-button="true" @back="handleBack" @edit="handleEdit">
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Settings class="mr-2 h-4 w-4" />
              Update Status
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
  </div>
</template>
