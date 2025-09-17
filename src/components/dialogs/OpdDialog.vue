<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createOpd, updateOpd } from "@/lib/api/services/opd";
import type { Opd } from "@/lib/api/types/opd.types";
import { createOpdSchema, updateOpdSchema } from "@/schemas/opdSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  opd?: Opd | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { opd: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", alamat: "", maps: "", keterangan: "", foto: "", website: "" }
    : {
        nama: props.opd?.nama ?? "",
        alamat: props.opd?.alamat ?? "",
        maps: props.opd?.maps ?? "",
        keterangan: props.opd?.keterangan ?? "",
        website: props.opd?.website ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createOpdSchema : updateOpdSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createOpd(values);
    toast.success("Berhasil", { description: "OPD berhasil ditambahkan" });
  } else if (props.opd) {
    await updateOpd(props.opd.id, values);
    toast.success("Berhasil", { description: "OPD berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="OPD"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama OPD" placeholder="Masukkan nama OPD" required />

      <BaseTextarea name="alamat" label="Alamat" placeholder="Masukkan alamat OPD" :rows="3" required />

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BaseInput name="maps" label="Google Maps URL" placeholder="Masukkan URL Google Maps (opsional)" />
        <BaseInput name="website" label="Website" placeholder="Masukkan URL website (opsional)" />
      </div>

      <BaseInputFile
        name="foto"
        label="Foto OPD"
        accept="image/*"
        :required="false"
        description="Format: JPG, PNG, WebP. Maksimal 5MB"
        :existing-files="props.opd?.fotoUrl"
      />

      <BaseTextarea name="keterangan" label="Keterangan" placeholder="Masukkan keterangan OPD (opsional)" :rows="4" />
    </div>
  </BaseFormDialog>
</template>
