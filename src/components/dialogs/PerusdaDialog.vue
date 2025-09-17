<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";

import { createPerusda, updatePerusda } from "@/lib/api/services/perusda";
import type { Perusda } from "@/lib/api/types/perusda.types";
import { createPerusdaSchema, updatePerusdaSchema } from "@/schemas/perusdaSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  perusda?: Perusda | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { perusda: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", alamat: "", telepon: "", email: "", maps: "", foto: "" }
    : {
        nama: props.perusda?.nama ?? "",
        alamat: props.perusda?.alamat ?? "",
        telepon: props.perusda?.telepon ?? "",
        email: props.perusda?.email ?? "",
        maps: props.perusda?.maps ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createPerusdaSchema : updatePerusdaSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPerusda(values);
    toast.success("Berhasil", { description: "Perusda berhasil ditambahkan" });
  } else if (props.perusda) {
    await updatePerusda(props.perusda.id, values);
    toast.success("Berhasil", { description: "Perusda berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Perusda"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Perusda" placeholder="Masukkan nama perusda" required />

      <BaseInput name="alamat" label="Alamat" placeholder="Masukkan alamat perusda" required />

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BaseInput name="telepon" label="Telepon" placeholder="Masukkan nomor telepon" required />
        <BaseInput name="email" label="Email" type="email" placeholder="Masukkan email" required />
      </div>

      <BaseInput name="maps" label="Google Maps URL" placeholder="Masukkan URL Google Maps (opsional)" />

      <BaseInputFile
        name="foto"
        label="Foto Perusda"
        accept="image/*"
        :required="mode === 'create'"
        description="Format: JPG, PNG, WebP. Maksimal 2MB"
        :existing-files="props.perusda?.fotoUrl"
      />
    </div>
  </BaseFormDialog>
</template>
