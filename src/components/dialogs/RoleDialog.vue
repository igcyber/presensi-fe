<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createRole, updateRole } from "@/lib/api/services/role";
import type { Role } from "@/lib/api/types/role.types";
import { createRoleSchema, updateRoleSchema } from "@/schemas/roleSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  role?: Role | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { role: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() => (props.mode === "create" ? { name: "" } : { name: props.role?.name ?? "" }));

const schema = computed(() => (props.mode === "create" ? createRoleSchema : updateRoleSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createRole(values);
    toast.success("Berhasil", { description: "Role berhasil ditambahkan" });
  } else if (props.role) {
    await updateRole(props.role.id, values);
    toast.success("Berhasil", { description: "Role berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Role"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="name" label="Nama Role" placeholder="Masukkan nama role" required />
    </div>
  </BaseFormDialog>
</template>
