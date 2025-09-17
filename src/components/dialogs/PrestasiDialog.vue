<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { createPrestasi, updatePrestasi } from "@/lib/api/services/prestasi";
import type { Prestasi } from "@/lib/api/types/prestasi.types";
import { TINGKAT_OPTIONS } from "@/lib/api/types/prestasi.types";
import { generateYearOptions } from "@/lib/utils/helper";
import { createPrestasiSchema, updatePrestasiSchema } from "@/schemas/prestasiSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  prestasi?: Prestasi | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { prestasi: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { tahun: "", judul: "", tingkat: "", nama: "", keterangan: "" }
    : {
        tahun: props.prestasi?.tahun ?? "",
        judul: props.prestasi?.judul ?? "",
        tingkat: props.prestasi?.tingkat ?? "",
        nama: props.prestasi?.nama ?? "",
        keterangan: props.prestasi?.keterangan ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createPrestasiSchema : updatePrestasiSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Generate year options (from current year down to 2000)
const yearOptions = generateYearOptions(2000).filter((option) => option.value !== "");

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPrestasi(values);
    toast.success("Berhasil", { description: "Prestasi berhasil ditambahkan" });
  } else if (props.prestasi) {
    await updatePrestasi(props.prestasi.id, values);
    toast.success("Berhasil", { description: "Prestasi berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Prestasi"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BaseSelect name="tahun" label="Tahun" :options="yearOptions" placeholder="Pilih tahun" required />

        <BaseSelect
          name="tingkat"
          label="Tingkat"
          :options="TINGKAT_OPTIONS.filter((option) => option.value !== '')"
          placeholder="Pilih tingkat"
          required
        />
      </div>

      <BaseInput name="judul" label="Judul" placeholder="Masukkan judul prestasi" required />

      <BaseInput name="nama" label="Nama Prestasi" placeholder="Masukkan nama prestasi" required />

      <BaseTextEditorEcho name="keterangan" label="Keterangan" placeholder="Masukkan keterangan prestasi" required />
    </div>
  </BaseFormDialog>
</template>
