<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import HariLiburDialog from "@/components/dialogs/HariLiburDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteHariLibur, getHariLiburById } from "@/lib/api/services/hariLibur";
import type { HariLibur } from "@/lib/api/types/hariLibur.types";
import { formatDate } from "@/lib/utils/formatters";

const route = useRoute();
const router = useRouter();

const hariLiburId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const editDialog = useDialog<HariLibur>();
const confirmDialog = useDialog<HariLibur>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<HariLibur>, HariLibur>(
  () => getHariLiburById(hariLiburId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail hari libur", {
        description: error.message,
      });
    },
  },
);

const handleBack = () => {
  router.push({ name: "app.hari-libur" });
};

const handleEdit = (hariLibur: HariLibur) => {
  editDialog.openEdit(hariLibur);
};

const handleDelete = (hariLibur: HariLibur) => {
  confirmDialog.openView(hariLibur);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const hariLibur = confirmDialog.state.value.data;
    await deleteHariLibur(hariLibur.id);

    toast.success("Berhasil menghapus hari libur", {
      description: `Hari libur "${hariLibur.keterangan || formatDate(hariLibur.tanggal)}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus hari libur";
    toast.error("Gagal menghapus hari libur", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

onMounted(() => {
  if (hariLiburId.value > 0) {
    fetchData();
  } else {
    toast.error("ID hari libur tidak valid");
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
        <span class="text-muted-foreground">Memuat detail hari libur...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail hari libur'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="p-4 md:p-6 lg:p-8">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <Button variant="ghost" @click="handleBack" class="mb-4">
              ← Kembali
            </Button>
            <h1 class="text-3xl font-bold tracking-tight">Detail Hari Libur</h1>
            <p class="text-muted-foreground">Informasi detail hari libur</p>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" @click="handleEdit(data)">
              <Edit class="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" @click="handleDelete(data)">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>

        <!-- Detail Card -->
        <Card>
          <CardHeader>
            <CardTitle>Informasi Hari Libur</CardTitle>
            <CardDescription>Detail lengkap hari libur</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Tanggal</label>
              <p class="mt-1 text-lg">{{ formatDate(data.tanggal) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Keterangan</label>
              <p class="mt-1 text-lg">{{ data.keterangan || "-" }}</p>
            </div>
            <div v-if="data.createdAt">
              <label class="text-sm font-medium text-muted-foreground">Dibuat</label>
              <p class="mt-1 text-lg">{{ formatDate(data.createdAt) }}</p>
            </div>
            <div v-if="data.updatedAt">
              <label class="text-sm font-medium text-muted-foreground">Diperbarui</label>
              <p class="mt-1 text-lg">{{ formatDate(data.updatedAt) }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Edit Dialog -->
    <HariLiburDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :hari-libur="editDialog.state.value.data"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Hari Libur"
      :description="`Apakah Anda yakin ingin menghapus hari libur '${confirmDialog.state.value.data?.keterangan || formatDate(confirmDialog.state.value.data?.tanggal)}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
