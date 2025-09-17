<script setup lang="ts">
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createLayanan, updateLayanan } from "@/lib/api/services/layanan";
import { getOpds } from "@/lib/api/services/opd";
import type { Layanan } from "@/lib/api/types/layanan.types";
import type { Opd } from "@/lib/api/types/opd.types";
import { createLayananSchema, updateLayananSchema } from "@/schemas/layananSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  layanan?: Layanan | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { layanan: null });
const emit = defineEmits<Emits>();

// Reactive state
const opdOptions = ref<{ label: string; value: number }[]>([]);

const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", jenis: "", opdId: 0, alamat: "", keterangan: "", logo: "" }
    : {
        nama: props.layanan?.nama ?? "",
        jenis: props.layanan?.jenis ?? "",
        opdId: props.layanan?.opdId ?? 0,
        alamat: props.layanan?.alamat ?? "",
        keterangan: props.layanan?.keterangan ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createLayananSchema : updateLayananSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
    if (value && opdOptions.value.length === 0) {
      loadOpdOptions();
    }
  },
});

// Load OPD options
const loadOpdOptions = async (): Promise<void> => {
  try {
    const opds = await getOpds();
    opdOptions.value = opds.data.data.map((opd: Opd) => ({ label: opd.nama, value: opd.id }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data OPD";
    toast.error("Gagal", { description: errorMessage });
  }
};

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createLayanan(values);
    toast.success("Berhasil", { description: "Layanan berhasil ditambahkan" });
  } else if (props.layanan) {
    await updateLayanan(props.layanan.id, values);
    toast.success("Berhasil", { description: "Layanan berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Layanan"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Layanan" placeholder="Masukkan nama layanan" required />

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BaseInput name="jenis" label="Jenis Layanan" placeholder="Masukkan jenis layanan" required />

        <BaseSelect
          name="opdId"
          label="OPD"
          :options="opdOptions"
          placeholder="Pilih OPD"
          searchable
          search-placeholder="Cari OPD..."
          required
          :value-as-number="true"
        />
      </div>

      <BaseInput name="alamat" label="Alamat" placeholder="Masukkan alamat layanan" required />

      <BaseInputFile
        name="logo"
        label="Logo Layanan"
        accept="image/*"
        :required="mode === 'create'"
        description="Format: JPG, PNG, WebP. Maksimal 5MB"
        :existing-files="props.layanan?.logoUrl"
      />

      <BaseTextarea
        name="keterangan"
        label="Keterangan"
        placeholder="Masukkan keterangan layanan (opsional)"
        :rows="4"
      />
    </div>
  </BaseFormDialog>
</template>
