<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createJenisUsaha, updateJenisUsaha } from "@/lib/api/services/usaha";
import type { JenisUsaha } from "@/lib/api/types/usaha.types";
import { createJenisUsahaSchema, updateJenisUsahaSchema } from "@/schemas/usahaSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  jenisUsaha?: JenisUsaha | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { jenisUsaha: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? {
        nama: "",
        warna: "#000000",
      }
    : {
        nama: props.jenisUsaha?.nama ?? "",
        warna: props.jenisUsaha?.warna ?? "#000000",
      },
);

const schema = computed(() => (props.mode === "create" ? createJenisUsahaSchema : updateJenisUsahaSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createJenisUsaha(values);
    toast.success("Berhasil", { description: "Jenis usaha berhasil ditambahkan" });
  } else if (props.jenisUsaha) {
    await updateJenisUsaha(props.jenisUsaha.id, values);
    toast.success("Berhasil", { description: "Jenis usaha berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Jenis Usaha"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Jenis Usaha" placeholder="Masukkan jenis usaha" required />

      <FormField v-slot="{ componentField }" name="warna">
        <FormItem>
          <FormLabel>
            Warna
            <span class="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <div class="flex items-center gap-3">
              <!-- Color Picker dengan styling modern -->
              <input
                v-bind="componentField"
                :value="componentField.modelValue || '#000000'"
                type="color"
                class="color-picker-custom h-9 w-16 cursor-pointer rounded-md border-0 p-0 transition-all hover:shadow-md focus-visible:ring-0"
                :style="{
                  backgroundColor: componentField.modelValue || '#000000',
                }"
              />

              <!-- Hex Input -->
              <div class="relative flex-1">
                <div
                  class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm"
                >
                  #
                </div>
                <Input
                  :model-value="String(componentField.modelValue || '').replace('#', '')"
                  @update:model-value="(val) => componentField.onChange('#' + String(val).toUpperCase())"
                  type="text"
                  placeholder="000000"
                  class="pl-8 font-mono uppercase"
                  maxlength="6"
                  pattern="[0-9A-Fa-f]{6}"
                />
              </div>
            </div>
          </FormControl>
          <FormDescription class="flex items-center gap-2">
            <span>Pilih warna untuk jenis usaha</span>
            <span class="text-muted-foreground font-mono text-xs">(Format: #RRGGBB)</span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </BaseFormDialog>
</template>

<style scoped>
.color-picker-custom {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  outline: none;
}

.color-picker-custom::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 0.5rem;
}

.color-picker-custom::-webkit-color-swatch {
  border: none;
  border-radius: 0.5rem;
}

.color-picker-custom::-moz-color-swatch {
  border: none;
  border-radius: 0.5rem;
}
</style>
