<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { createInfografis, updateInfografis } from "@/lib/api/services/infografis";
import type { Infografis } from "@/lib/api/types/infografis.types";
import { createInfografisSchema, updateInfografisSchema } from "@/schemas/infografisSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  infografis?: Infografis | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { infografis: null });
const emit = defineEmits<Emits>();

// Status options
const statusOptions = [
  { label: "Aktif", value: "1" },
  { label: "Tidak Aktif", value: "0" },
];

const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", url: "", status: "1", isi: "", foto: "" }
    : {
        nama: props.infografis?.nama ?? "",
        url: props.infografis?.url ?? "",
        status: (props.infografis as any)?.status === "1" ? "1" : "0",
        isi: props.infografis?.isi ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createInfografisSchema : updateInfografisSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createInfografis(values);
    toast.success("Berhasil", { description: "Infografis berhasil ditambahkan" });
  } else if (props.infografis) {
    await updateInfografis(props.infografis.id, values);
    toast.success("Berhasil", { description: "Infografis berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Infografis"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Infografis" placeholder="Masukkan nama infografis" required />

      <BaseInput
        name="url"
        label="URL Infografis"
        placeholder="Masukkan URL infografis (opsional)"
        help-text="Link yang akan dibuka ketika infografis diklik"
      />

      <BaseSelect name="status" label="Status" :options="statusOptions" placeholder="Pilih status" required />

      <BaseTextEditorEcho
        name="isi"
        label="Isi Infografis"
        placeholder="Masukkan isi infografis (opsional)"
        help-text="Konten tambahan untuk infografis"
      />

      <BaseInputFile
        name="foto"
        label="Foto Infografis"
        accept="image/*"
        :required="mode === 'create'"
        help-text="Format: JPG, PNG, GIF, WebP. Maksimal 5MB"
        :existing-files="props.infografis?.fileUrl"
      />
    </div>
  </BaseFormDialog>
</template>
