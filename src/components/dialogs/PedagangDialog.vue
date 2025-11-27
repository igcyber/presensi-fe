<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputDate from "@/components/forms/BaseInputDate.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createPedagang, updatePedagang } from "@/lib/api/services/pedagang";
import type { Pedagang } from "@/lib/api/types/pedagang.types";
import { createPedagangSchema, updatePedagangSchema } from "@/schemas/pedagangSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  pedagang?: Pedagang | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { pedagang: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? {
        nama: "",
        nik: "",
        noKk: "",
        tempatLahir: "",
        tanggalLahir: "",
        alamat: "",
      }
    : {
        nama: props.pedagang?.nama ?? "",
        nik: props.pedagang?.nik ?? "",
        noKk: props.pedagang?.noKk ?? "",
        tempatLahir: props.pedagang?.tempatLahir ?? "",
        tanggalLahir: props.pedagang?.tanggalLahir ?? "",
        alamat: props.pedagang?.alamat ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createPedagangSchema : updatePedagangSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPedagang(values);
    toast.success("Berhasil", { description: "Pedagang berhasil ditambahkan" });
  } else if (props.pedagang) {
    await updatePedagang(props.pedagang.id, values);
    toast.success("Berhasil", { description: "Pedagang berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Pedagang"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama" placeholder="Masukkan nama pedagang" required />

      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <BaseInput
          name="nik"
          label="NIK"
          placeholder="Masukkan NIK (16 digit)"
          type="text"
          maxlength="16"
          pattern="^\d+$"
          required
          description="NIK harus 16 digit angka"
        />

        <BaseInput
          name="noKk"
          label="No. KK"
          placeholder="Masukkan No. KK (16 digit)"
          type="text"
          maxlength="16"
          pattern="^\d+$"
          required
          description="No. KK harus 16 digit angka"
        />
      </div>

      <BaseInput name="tempatLahir" label="Tempat Lahir" placeholder="Masukkan tempat lahir" required />

      <div class="mt-3">
        <BaseInputDate name="tanggalLahir" label="Tanggal Lahir" placeholder="Pilih tanggal lahir" required />
      </div>

      <BaseTextarea name="alamat" label="Alamat" placeholder="Masukkan alamat lengkap" :rows="3" required />
    </div>
  </BaseFormDialog>
</template>
