<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createRapat, updateRapat } from "@/lib/api/services/rapat";
import type { Rapat } from "@/lib/api/types/rapat.types";
import { createRapatSchema, updateRapatSchema } from "@/schemas/rapatSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  rapat?: Rapat | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props and emits
const props = withDefaults(defineProps<Props>(), { rapat: null });
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      judul: "",
      lokasi: "",
      isi: "",
      tanggal: "",
      waktuMulai: "",
      waktuBerakhir: "",
    };
  }

  // Format tanggal untuk form (YYYY-MM-DD)
  const tanggal = props.rapat?.tanggal ? props.rapat.tanggal.split("T")[0] : "";

  return {
    judul: props.rapat?.judul ?? "",
    lokasi: props.rapat?.lokasi ?? "",
    isi: props.rapat?.isi ?? "",
    tanggal,
    waktuMulai: props.rapat?.waktuMulai ?? "",
    waktuBerakhir: props.rapat?.waktuBerakhir ?? "",
  };
});

const schema = computed(() => (props.mode === "create" ? createRapatSchema : updateRapatSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createRapat(values);
    toast.success("Berhasil", { description: "Rapat berhasil ditambahkan" });
  } else if (props.rapat) {
    await updateRapat(props.rapat.id, values);
    toast.success("Berhasil", { description: "Rapat berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Rapat"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Rapat" placeholder="Masukkan judul rapat" required />

      <BaseInput name="lokasi" label="Lokasi" placeholder="Masukkan lokasi rapat" />

      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <BaseInput
          name="tanggal"
          label="Tanggal"
          type="text"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          required
          description="Format: YYYY-MM-DD (contoh: 2024-09-15)"
        />

        <BaseInput
          name="waktuMulai"
          label="Waktu Mulai"
          type="text"
          placeholder="HH:mm:ss"
          pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?"
          description="Format: HH:mm:ss"
        />

        <BaseInput
          name="waktuBerakhir"
          label="Waktu Berakhir"
          type="text"
          placeholder="HH:mm:ss"
          pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?"
          description="Format: HH:mm:ss"
        />
      </div>

      <BaseTextarea name="isi" label="Isi/Agenda Rapat" placeholder="Masukkan isi atau agenda rapat" :rows="5" />
    </div>
  </BaseFormDialog>
</template>
