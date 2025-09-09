// components/dialogs/BaseFormDialog.vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { z, ZodTypeAny } from "zod";

import BaseForm from "@/components/forms/BaseForm.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types
export type DialogMode = "create" | "edit" | "view";

interface Props<TSchema extends ZodTypeAny = ZodTypeAny> {
  /** v-model */
  open: boolean;
  mode?: DialogMode;
  /** Optional resource name for auto title */
  resourceName?: string; // e.g., "User"
  title?: string; // override title
  description?: string; // override desc

  /** VeeValidate/Zod */
  schema: TSchema; // optional for simple dialogs
  initialValues?: Partial<z.infer<TSchema>> | Record<string, any>;

  /** Submit handler: return Promise to show loading */
  onSubmit?: (values: any, ctx: { mode: DialogMode }) => Promise<void> | void;

  /** Buttons */
  submitText?: string; // defaults by mode
  cancelText?: string; // defaults: "Batal"
  hideFooter?: boolean;

  /** UX */
  widthClass?: string; // e.g., 'sm:max-w-[550px]'
  closeOnSuccess?: boolean; // default true

  /** Optional simple config-driven fields */
}

// Props
const props = withDefaults(defineProps<Props>(), {
  mode: "create",
  resourceName: undefined,
  title: undefined,
  description: undefined,
  submitText: undefined,
  cancelText: "Batal",
  hideFooter: false,
  widthClass: "sm:max-w-[520px]",
  closeOnSuccess: true,
});

// Emits
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "success", payload: any): void;
  (e: "cancel"): void;
}>();

// Reactive State
const isSubmitting = ref(false);
const serverErrors = ref<Record<string, string | string[]>>({});

// Computed Properties
const computedTitle = computed(
  () =>
    props.title ??
    (props.mode === "create"
      ? `Tambah ${props.resourceName ?? "Data"}`
      : props.mode === "edit"
        ? `Edit ${props.resourceName ?? "Data"}`
        : `Detail ${props.resourceName ?? "Data"}`),
);

const computedDesc = computed(
  () =>
    props.description ??
    (props.mode === "create"
      ? `Isi form untuk menambahkan ${props.resourceName ?? "data"}.`
      : props.mode === "edit"
        ? `Perbarui informasi ${props.resourceName ?? "data"}.`
        : `Lihat informasi ${props.resourceName ?? "data"}.`),
);

const isView = computed(() => props.mode === "view");

// Methods
function close() {
  emit("update:open", false);
  emit("cancel");
}

async function handleSubmit(values: any) {
  if (!props.onSubmit) return;
  try {
    isSubmitting.value = true;
    serverErrors.value = {};

    await props.onSubmit(values, { mode: props.mode! });
    emit("success", values);

    if (props.closeOnSuccess) emit("update:open", false);
  } catch (e: any) {
    // Normalize 422 errors if shape is { errors: { field: [msg] }}
    const errs = e?.response?.data?.errors || e?.errors;
    if (errs && typeof errs === "object") serverErrors.value = errs;
    // optionally you can toast outside
  } finally {
    isSubmitting.value = false;
  }
}

// Watchers
watch(
  () => props.open,
  (open) => {
    if (!open) {
      isSubmitting.value = false;
      serverErrors.value = {};
    }
  },
);
</script>

<template>
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent :class="widthClass">
      <DialogHeader>
        <DialogTitle>{{ computedTitle }}</DialogTitle>
        <DialogDescription>{{ computedDesc }}</DialogDescription>
      </DialogHeader>
      <BaseForm :schema="schema" :initial-values="initialValues ?? {}" :on-submit="handleSubmit" class="space-y-4">
        <!-- server side errors -->
        <div
          v-if="Object.keys(serverErrors).length"
          class="border-destructive/30 bg-destructive/10 rounded-md border p-3 text-sm"
        >
          <ul class="list-disc pl-5">
            <li v-for="(msg, key) in serverErrors" :key="key">{{ Array.isArray(msg) ? msg.join(", ") : msg }}</li>
          </ul>
        </div>

        <!-- Slot-based fields (full control) -->
        <slot :disabled="isView" />

        <DialogFooter v-if="!hideFooter">
          <Button type="button" variant="outline" @click="close">{{ cancelText }}</Button>
          <Button type="submit" :disabled="isSubmitting || isView">{{
            submitText ?? (mode === "create" ? "Simpan" : "Update")
          }}</Button>
        </DialogFooter>
      </BaseForm>
    </DialogContent>
  </Dialog>
</template>
