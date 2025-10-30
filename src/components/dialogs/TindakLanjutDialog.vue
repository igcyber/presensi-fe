<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInputDate from "@/components/forms/BaseInputDate.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createTindakLanjut, updateTindakLanjut } from "@/lib/api/services/tindakLanjut";
import type { TindakLanjut } from "@/lib/api/types/tindakLanjut.types";
import { createTindakLanjutSchema, updateTindakLanjutSchema } from "@/schemas/tindakLanjutSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  pengaduanId?: number;
  tindakLanjut?: TindakLanjut | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), {
  pengaduanId: 0,
  tindakLanjut: null,
});

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() => {
  if (props.mode === "edit" && props.tindakLanjut) {
    return {
      tanggalMulai: props.tindakLanjut.tanggalMulai,
      tanggalTindakLanjut: props.tindakLanjut.tanggalTindakLanjut || "",
      deskripsi: props.tindakLanjut.deskripsi,
      dokumenDukung: null,
    };
  }

  return {
    pengaduanId: props.pengaduanId,
    tanggalMulai: "",
    tanggalTindakLanjut: "",
    deskripsi: "",
    dokumenDukung: null,
  };
});

const schema = computed(() => {
  return props.mode === "create" ? createTindakLanjutSchema : updateTindakLanjutSchema;
});

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  try {
    if (props.mode === "create") {
      await createTindakLanjut({
        pengaduanId: props.pengaduanId!,
        tanggalMulai: values.tanggalMulai,
        tanggalTindakLanjut: values.tanggalTindakLanjut || undefined,
        deskripsi: values.deskripsi,
        dokumenDukung: values.dokumenDukung,
      });
      toast.success("Berhasil", { description: "Tindak lanjut berhasil dibuat" });
    } else if (props.mode === "edit" && props.tindakLanjut) {
      await updateTindakLanjut(props.tindakLanjut.id, {
        tanggalMulai: values.tanggalMulai,
        tanggalTindakLanjut: values.tanggalTindakLanjut || undefined,
        deskripsi: values.deskripsi,
        dokumenDukung: values.dokumenDukung,
      });
      toast.success("Berhasil", { description: "Tindak lanjut berhasil diperbarui" });
    }
  } catch (error: any) {
    toast.error("Gagal", { description: error.message || "Terjadi kesalahan" });
    throw error;
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Tindak Lanjut"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-4">
      <BaseInputDate name="tanggalMulai" label="Tanggal Mulai" placeholder="Pilih tanggal mulai" required />

      <BaseInputDate
        name="tanggalTindakLanjut"
        label="Tanggal Tindak Lanjut"
        placeholder="Pilih tanggal tindak lanjut (opsional)"
      />

      <BaseTextarea
        name="deskripsi"
        label="Deskripsi"
        placeholder="Jelaskan tindak lanjut yang telah dilakukan..."
        :rows="4"
        required
      />

      <BaseInputFile
        name="dokumenDukung"
        label="Dokumen Pendukung"
        accept="application/pdf"
        :max-size="5"
        description="Upload dokumen pendukung dalam format PDF (maksimal 5MB, opsional)"
      />
    </div>
  </BaseFormDialog>
</template>
