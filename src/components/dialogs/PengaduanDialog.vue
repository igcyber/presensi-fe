<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { updatePengaduanStatus } from "@/lib/api/services/pengaduan";
import type { Pengaduan, UpdateStatusRequest } from "@/lib/api/types/pengaduan.types";
import { updateStatusSchema } from "@/schemas/pengaduanSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "edit";
  pengaduan?: Pengaduan | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { pengaduan: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() => ({
  status: props.pengaduan?.status ?? "belum",
  kategori_aduan: props.pengaduan?.kategoriAduan ?? "",
  keterangan: props.pengaduan?.keterangan ?? "",
}));

const schema = computed(() => updateStatusSchema);

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: UpdateStatusRequest) {
  if (props.pengaduan) {
    await updatePengaduanStatus(props.pengaduan.id, values);
    toast.success("Berhasil", { description: "Status pengaduan berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Pengaduan"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-4">
      <BaseSelect
        name="status"
        label="Status"
        placeholder="Pilih status"
        :options="[
          { label: 'Belum', value: 'belum' },
          { label: 'Diterima', value: 'diterima' },
        ]"
        required
      />

      <BaseInput
        name="kategori_aduan"
        label="Kategori Aduan"
        placeholder="Masukkan kategori aduan"
        description="Wajib diisi jika status diterima"
      />

      <BaseTextarea
        name="keterangan"
        label="Keterangan"
        placeholder="Masukkan keterangan tambahan (opsional)"
        :rows="3"
      />
    </div>
  </BaseFormDialog>
</template>
