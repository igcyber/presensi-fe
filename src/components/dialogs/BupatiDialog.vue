<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";

import { createBupati, updateBupati } from "@/lib/api/services/bupati";
import type { Bupati } from "@/lib/api/types/bupati.types";
import { createBupatiSchema, updateBupatiSchema } from "@/schemas/bupatiSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  bupati?: Bupati | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { bupati: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? {
        namaBupati: "",
        namaWakil: "",
        tahunAwal: new Date().getFullYear(),
        tahunAkhir: new Date().getFullYear() + 5,
        foto: "",
      }
    : {
        namaBupati: props.bupati?.namaBupati ?? "",
        namaWakil: props.bupati?.namaWakil ?? "",
        tahunAwal: props.bupati?.tahunAwal ?? new Date().getFullYear(),
        tahunAkhir: props.bupati?.tahunAkhir ?? new Date().getFullYear() + 5,
      },
);

const schema = computed(() => (props.mode === "create" ? createBupatiSchema : updateBupatiSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createBupati(values);
    toast.success("Berhasil", { description: "Data bupati berhasil ditambahkan" });
  } else if (props.bupati) {
    await updateBupati(props.bupati.id, values);
    toast.success("Berhasil", { description: "Data bupati berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Bupati"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="namaBupati" label="Nama Bupati" placeholder="Masukkan nama bupati" required />

      <BaseInput name="namaWakil" label="Nama Wakil Bupati" placeholder="Masukkan nama wakil bupati" required />

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BaseInput
          name="tahunAwal"
          label="Tahun Mulai"
          type="number"
          placeholder="Masukkan tahun mulai"
          :min="1900"
          :max="2100"
          required
        />

        <BaseInput
          name="tahunAkhir"
          label="Tahun Selesai"
          type="number"
          placeholder="Masukkan tahun selesai"
          :min="1900"
          :max="2100"
          required
        />
      </div>

      <BaseInputFile
        name="foto"
        label="Foto Bupati & Wakil"
        accept="image/*"
        :required="mode === 'create'"
        description="Format: JPG, PNG, WebP. Maksimal 5MB"
        :existing-files="props.bupati?.fotoUrl"
      />
    </div>
  </BaseFormDialog>
</template>
