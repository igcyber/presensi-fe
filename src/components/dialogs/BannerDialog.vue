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
  { label: "Aktif", value: "active" },
  { label: "Tidak Aktif", value: "inactive" },
];

const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", url: "", status: "active", isi: "", foto: "" }
    : {
        nama: props.banner?.nama ?? "",
        url: props.banner?.url ?? "",
        status: props.banner?.status === "1" ? "active" : "inactive",
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
    toast.success("Berhasil", { description: "Banner berhasil ditambahkan" });
  } else if (props.banner) {
    await updateBanner(props.banner.id, values);
    toast.success("Berhasil", { description: "Banner berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Banner"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Banner" placeholder="Masukkan nama banner" required />

      <BaseInput
        name="url"
        label="URL Banner"
        placeholder="Masukkan URL banner (opsional)"
        description="Link yang akan dibuka ketika banner diklik"
      />

      <BaseSelect name="status" label="Status" :options="statusOptions" placeholder="Pilih status" required />

      <BaseTextEditorEcho
        name="isi"
        label="Isi Banner"
        placeholder="Masukkan isi banner (opsional)"
        description="Konten tambahan untuk banner"
      />

      <BaseInputFile
        name="foto"
        label="Foto Banner"
        accept="image/*"
        :required="mode === 'create'"
        description="Format: JPG, PNG, GIF, WebP. Maksimal 5MB"
        :existing-files="props.banner?.fileUrl"
      />
    </div>
  </BaseFormDialog>
</template>
