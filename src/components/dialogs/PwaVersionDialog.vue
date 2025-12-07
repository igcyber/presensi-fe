<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createPwaVersion } from "@/lib/api/services/pwaVersion";
import type { PwaVersion } from "@/lib/api/types/pwaVersion.types";
import { createPwaVersionSchema } from "@/schemas/pwaVersionSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  pwaVersion?: PwaVersion | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { pwaVersion: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      version: "",
    };
  }

  return {
    version: props.pwaVersion?.version ?? "",
  };
});

const schema = computed(() => createPwaVersionSchema);

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPwaVersion(values);
    toast.success("Berhasil", { description: "PWA version berhasil ditambahkan" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="PWA Version"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput
        name="version"
        label="Version"
        placeholder="Masukkan version (contoh: V1.0.0.1)"
        required
      />
    </div>
  </BaseFormDialog>
</template>
