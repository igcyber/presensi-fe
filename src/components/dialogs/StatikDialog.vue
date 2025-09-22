<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createStatik, updateStatik } from "@/lib/api/services/statik";
import type { Statik } from "@/lib/api/types/statik.types";
import { JENIS_OPTIONS } from "@/lib/api/types/statik.types";
import { createStatikSchema, updateStatikSchema } from "@/schemas/statikSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  statik?: Statik | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props and emits
const props = withDefaults(defineProps<Props>(), { statik: null });
const emit = defineEmits<Emits>();

// Reactive variables
const selectedJenis = ref("");

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", jenis: "", icon: "", isiText: "", isiFile: "" }
    : {
        nama: props.statik?.nama ?? "",
        jenis: props.statik?.jenis ?? "",
        icon: props.statik?.icon ?? "",
        isiText: props.statik?.isi ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createStatikSchema : updateStatikSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

const showFileInput = computed(() => {
  return ["video", "file"].includes(selectedJenis.value);
});

const showTextInput = computed(() => {
  return ["emergency", "operasional", "alamat", "email", "telepon"].includes(selectedJenis.value);
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createStatik(values);
    toast.success("Berhasil", { description: "Statik berhasil ditambahkan" });
  } else if (props.statik) {
    await updateStatik(props.statik.id, values);
    toast.success("Berhasil", { description: "Statik berhasil diperbarui" });
  }
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      selectedJenis.value = "";
    } else {
      selectedJenis.value = props.statik?.jenis ?? "";
    }
  },
);
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Statik"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Statik" placeholder="Masukkan nama statik" required />

      <BaseSelect
        name="jenis"
        label="Jenis"
        :options="JENIS_OPTIONS"
        placeholder="Pilih jenis statik"
        required
        @update:model-value="selectedJenis = $event"
      />

      <BaseInput
        name="icon"
        label="Icon"
        placeholder="Masukkan nama icon (opsional)"
        description="Nama icon dari library icon (contoh: street-view, water, dll)"
      />

      <!-- Text Input for non-file types -->
      <BaseTextarea
        v-if="showTextInput"
        name="isiText"
        label="Isi"
        placeholder="Masukkan isi statik"
        :rows="3"
        required
      />

      <!-- File Input for file/video types -->
      <BaseInputFile
        v-if="showFileInput"
        name="isiFile"
        label="File"
        :required="true"
        description="Format: JPG, PNG, WebP, PDF, DOC, DOCX, MP4, MOV. Maksimal 50MB"
        :existing-files="props.statik?.fileUrl ?? []"
        :max-size="50"
      />
    </div>
  </BaseFormDialog>
</template>
