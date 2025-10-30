<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import TindakLanjutDialog from "@/components/dialogs/TindakLanjutDialog.vue";
import TindakLanjutCard from "@/components/features/pengaduan/TindakLanjutCard.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useDialog } from "@/composables/useDialog";
import { deleteTindakLanjut } from "@/lib/api/services/tindakLanjut";
import type { Pengaduan } from "@/lib/api/types/pengaduan.types";
import type { TindakLanjut } from "@/lib/api/types/tindakLanjut.types";

interface Props {
  pengaduan: Pengaduan;
  loading?: boolean;
}

interface Emits {
  (e: "refresh"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Dialog states
const tindakLanjutDialog = useDialog<TindakLanjut>();
const confirmDialog = useDialog<TindakLanjut>();

// Computed properties
const tindakLanjuts = computed(() => {
  return props.pengaduan.tindakLanjuts || [];
});

const hasTindakLanjuts = computed(() => {
  return tindakLanjuts.value.length > 0;
});

// Methods
const handleCreate = () => {
  tindakLanjutDialog.openCreate();
};

const handleEdit = (tindakLanjut: TindakLanjut) => {
  tindakLanjutDialog.openEdit(tindakLanjut);
};

const handleDelete = (tindakLanjut: TindakLanjut) => {
  confirmDialog.openView(tindakLanjut);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const tindakLanjut = confirmDialog.state.value.data;
    await deleteTindakLanjut(tindakLanjut.id);

    toast.success("Berhasil menghapus tindak lanjut", {
      description: `Tindak lanjut #${tindakLanjut.id} telah dihapus`,
    });

    confirmDialog.closeDialog();
    emit("refresh");
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus tindak lanjut";
    toast.error("Gagal menghapus tindak lanjut", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleTindakLanjutDialogSuccess = () => {
  tindakLanjutDialog.closeDialog();
  emit("refresh");
};
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg">Tindak Lanjut</CardTitle>
        <Button @click="handleCreate" size="sm" :disabled="loading">
          <Plus class="mr-2 h-4 w-4" />
          Tambah Tindak Lanjut
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <!-- List Tindak Lanjut -->
      <div v-if="hasTindakLanjuts" class="space-y-4">
        <TindakLanjutCard
          v-for="(tindakLanjut, index) in tindakLanjuts"
          :key="tindakLanjut.id"
          :index="index + 1"
          :tindak-lanjut="tindakLanjut"
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="py-8 text-center">
        <div class="text-muted-foreground">
          <div class="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Plus class="h-6 w-6" />
          </div>
          <h3 class="mb-2 text-lg font-medium">Belum Ada Tindak Lanjut</h3>
          <p class="mb-4 text-sm">Belum ada tindak lanjut untuk pengaduan ini.</p>
          <Button @click="handleCreate" size="sm">
            <Plus class="mr-2 h-4 w-4" />
            Tambah Tindak Lanjut Pertama
          </Button>
        </div>
      </div>
    </CardContent>

    <!-- Tindak Lanjut Dialog -->
    <TindakLanjutDialog
      v-model:open="tindakLanjutDialog.state.value.open"
      :mode="tindakLanjutDialog.state.value.mode"
      :pengaduan-id="pengaduan.id"
      :tindak-lanjut="tindakLanjutDialog.state.value.data"
      @success="handleTindakLanjutDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Tindak Lanjut"
      :description="`Apakah Anda yakin ingin menghapus tindak lanjut #${confirmDialog.state.value.data?.id}? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </Card>
</template>
