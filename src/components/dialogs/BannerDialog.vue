<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { createBanner, updateBanner } from "@/lib/api/services/banner";
import type { Banner } from "@/lib/api/types/banner.types";
import { createBannerSchema, updateBannerSchema } from "@/schemas/bannerSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  banner?: Banner | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { banner: null });
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
        nama: props.banner?.nama ?? "",
        url: props.banner?.url ?? "",
        status: (props.banner as any)?.status === "1" ? "1" : "0",
        isi: props.banner?.isi ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createBannerSchema : updateBannerSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createBanner(values);
    toast.success("Berhasil", { description: "Infografis berhasil ditambahkan" });
  } else if (props.banner) {
    await updateBanner(props.banner.id, values);
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
        description="Link yang akan dibuka ketika infografis diklik"
      />

      <BaseSelect name="status" label="Status" :options="statusOptions" placeholder="Pilih status" required />

      <BaseTextEditorEcho
        name="isi"
        label="Isi Infografis"
        placeholder="Masukkan isi banner (opsional)"
        description="Konten tambahan untuk infografis"
      />

      <BaseInputFile
        name="foto"
        label="Foto Infografis"
        accept="image/*"
        :required="mode === 'create'"
        description="Format: JPG, PNG, GIF, WebP. Maksimal 5MB"
        :existing-files="props.banner?.fileUrl"
      />
    </div>
  </BaseFormDialog>
</template>
