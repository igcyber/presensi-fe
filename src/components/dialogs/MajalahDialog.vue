<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";

import { createMajalah, updateMajalah } from "@/lib/api/services/majalah";
import type { Majalah } from "@/lib/api/types/majalah.types";
import { MONTH_OPTIONS } from "@/lib/api/types/majalah.types";
import { generateYearOptions } from "@/lib/utils/helper";
import { createMajalahSchema, updateMajalahSchema } from "@/schemas/majalahSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  majalah?: Majalah | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { majalah: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { bulan: 1, tahun: new Date().getFullYear(), link: "" }
    : {
        bulan: props.majalah?.bulan ?? 1,
        tahun: props.majalah?.tahun ?? new Date().getFullYear(),
      },
);

const schema = computed(() => (props.mode === "create" ? createMajalahSchema : updateMajalahSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

const yearOptions = computed(() => generateYearOptions(2020));

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createMajalah(values);
    toast.success("Berhasil", { description: "Majalah berhasil ditambahkan" });
  } else if (props.majalah) {
    await updateMajalah(props.majalah.id, values);
    toast.success("Berhasil", { description: "Majalah berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Majalah"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <BaseSelect
        name="bulan"
        label="Bulan"
        :options="MONTH_OPTIONS"
        placeholder="Pilih bulan"
        required
        :value-as-number="true"
      />

      <BaseSelect
        name="tahun"
        label="Tahun"
        :options="yearOptions"
        placeholder="Pilih tahun"
        searchable
        search-placeholder="Cari tahun..."
        required
        :value-as-number="true"
      />

      <div class="md:col-span-2">
        <BaseInputFile
          name="link"
          label="File Majalah"
          accept="application/pdf"
          :required="mode === 'create'"
          description="Format: PDF. Maksimal 10MB"
          :existing-files="props.majalah?.linkUrl"
        />
      </div>
    </div>
  </BaseFormDialog>
</template>
