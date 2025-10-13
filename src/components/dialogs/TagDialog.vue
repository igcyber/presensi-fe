<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createTag, updateTag } from "@/lib/api/services/tag";
import type { Tag } from "@/lib/api/types/tag.types";
import { createTagSchema, updateTagSchema } from "@/schemas/tagSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  tag?: Tag | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props and emits
const props = withDefaults(defineProps<Props>(), { tag: null });
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      namaTag: "",
    };
  }

  return {
    namaTag: props.tag?.namaTag ?? "",
  };
});

const schema = computed(() => (props.mode === "create" ? createTagSchema : updateTagSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createTag(values);
    toast.success("Berhasil", { description: "Tag berhasil ditambahkan" });
  } else if (props.tag) {
    await updateTag(props.tag.id, values);
    toast.success("Berhasil", { description: "Tag berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Tag"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="namaTag" label="Nama Tag" placeholder="Masukkan nama tag" required />
    </div>
  </BaseFormDialog>
</template>
