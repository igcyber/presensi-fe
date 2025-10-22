<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createKategoriDokumen, updateKategoriDokumen } from "@/lib/api/services/kategoriDokumen";
import type { KategoriDokumen } from "@/lib/api/types/kategoriDokumen.types";
import { createKategoriDokumenSchema, updateKategoriDokumenSchema } from "@/schemas/kategoriDokumenSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  kategoriDokumen?: KategoriDokumen | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { kategoriDokumen: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "" }
    : {
        nama: props.kategoriDokumen?.nama ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createKategoriDokumenSchema : updateKategoriDokumenSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createKategoriDokumen(values);
    toast.success("Berhasil", { description: "Kategori dokumen berhasil ditambahkan" });
  } else if (props.kategoriDokumen) {
    await updateKategoriDokumen(props.kategoriDokumen.id, values);
    toast.success("Berhasil", { description: "Kategori dokumen berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Kategori Dokumen"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Kategori" placeholder="Masukkan nama kategori dokumen" required />
    </div>
  </BaseFormDialog>
</template>
