<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { createKonten, updateKonten } from "@/lib/api/services/konten";
import type { Konten } from "@/lib/api/types/konten.types";
import { createKontenSchema, updateKontenSchema } from "@/schemas/kontenSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  konten?: Konten | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { konten: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", isi: "", slug: "", foto: "" }
    : {
        nama: props.konten?.nama ?? "",
        isi: props.konten?.isi ?? "",
        slug: props.konten?.slug ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createKontenSchema : updateKontenSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createKonten(values);
    toast.success("Berhasil", { description: "Konten berhasil ditambahkan" });
  } else if (props.konten) {
    await updateKonten(props.konten.id, values);
    toast.success("Berhasil", { description: "Konten berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Konten"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Konten" placeholder="Masukkan nama konten" required />

      <BaseInput
        name="slug"
        label="Slug"
        placeholder="Masukkan slug (contoh: visi-dan-misi)"
        required
        description="Slug akan digunakan untuk URL. Hanya huruf kecil, angka, dan tanda hubung."
      />

      <BaseTextEditorEcho name="isi" label="Isi Konten" placeholder="Masukkan isi konten" required />

      <BaseInputFile
        name="foto"
        label="Foto Konten"
        accept="image/*"
        :required="false"
        description="Format: JPG, PNG, WebP. Maksimal 2MB"
        :existing-files="props.konten?.fotoUrl"
      />
    </div>
  </BaseFormDialog>
</template>
