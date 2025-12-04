<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";
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

import type { ApiError } from "@/lib/api/core/apiResponse";
import { cn } from "@/lib/utils";

export type DialogMode = "create" | "edit" | "view";

interface Props<TSchema extends ZodTypeAny = ZodTypeAny> {
  open: boolean;
  mode?: DialogMode;
  resourceName?: string;
  title?: string;
  description?: string;

  schema: TSchema;
  initialValues?: Partial<z.infer<TSchema>> | Record<string, any>;

  onSubmit?: (values: any) => Promise<void> | void;

  submitText?: string;
  cancelText?: string;
  hideFooter?: boolean;

  widthClass?: string;
  closeOnSuccess?: boolean;
}

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

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "success", payload: any): void;
  (e: "cancel"): void;
}>();

// Reactive state
const isSubmitting = ref(false);
const serverErrors = ref<Record<string, string | string[]>>({});
const formRef = ref<{ setFieldError?: (field: string, message: string) => void; resetForm?: () => void } | null>(null);

// Computed properties
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

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
    if (!value) {
      emit("cancel");
    }
  },
});

// Methods
function close() {
  open.value = false;
}

async function handleSubmit(values: any) {
  if (!props.onSubmit) return;
  try {
    isSubmitting.value = true;
    serverErrors.value = {};

    // Clear previous field errors
    if (formRef.value?.setFieldError) {
      // Get all field names from schema if possible, or clear all
      // For now, we'll set errors per field from the error response
    }

    await props.onSubmit(values);
    emit("success", values);

    if (props.closeOnSuccess) {
      open.value = false;
    }
  } catch (e: any) {
    const apiError = e as ApiError;
    if (apiError?.status === 422 && apiError?.errors) {
      const errs = apiError.errors;
      serverErrors.value = errs;

      // Set field-level errors using Vee-Validate setFieldError
      if (formRef.value?.setFieldError) {
        for (const [field, messages] of Object.entries(errs)) {
          const errorMessage = Array.isArray(messages) ? messages[0] : String(messages);
          formRef.value.setFieldError(field, errorMessage);
        }
      }
    } else {
      const errorMessage = apiError?.message || "Terjadi kesalahan saat menyimpan data";
      toast.error(errorMessage);
    }
  } finally {
    isSubmitting.value = false;
  }
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      isSubmitting.value = false;
      serverErrors.value = {};
      // Clear form errors when dialog closes
      if (formRef.value?.resetForm) {
        formRef.value.resetForm();
      }
    }
  },
);
</script>

<template>
  <Dialog :open="open" @update:open="(v) => (open = v)">
    <DialogContent
      :class="cn('flex max-h-[90vh] flex-col p-0', props.widthClass)"
      @open-auto-focus="(e) => e.preventDefault()"
    >
      <DialogHeader class="flex-shrink-0 p-6 pb-0">
        <DialogTitle>{{ computedTitle }}</DialogTitle>
        <DialogDescription>{{ computedDesc }}</DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto px-6">
        <BaseForm
          ref="formRef"
          :schema="schema"
          :initial-values="initialValues ?? {}"
          :on-submit="handleSubmit"
          class="space-y-4 py-4"
        >
          <div
            v-if="Object.keys(serverErrors).length"
            class="border-destructive/30 bg-destructive/10 rounded-md border p-3 text-sm"
          >
            <ul class="list-disc pl-5">
              <li v-for="(msg, key) in serverErrors" :key="key">
                {{ Array.isArray(msg) ? msg.join(", ") : msg }}
              </li>
            </ul>
          </div>

          <slot :disabled="isView" />

          <DialogFooter v-if="!hideFooter" class="pt-4">
            <Button type="button" variant="outline" @click="close">{{ cancelText }}</Button>
            <Button type="submit" :disabled="isSubmitting || isView">
              {{ submitText ?? (mode === "create" ? "Simpan" : "Update") }}
            </Button>
          </DialogFooter>
        </BaseForm>
      </div>
    </DialogContent>
  </Dialog>
</template>
