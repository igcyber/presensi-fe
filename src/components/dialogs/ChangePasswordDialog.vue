<script setup lang="ts">
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { changePassword } from "@/lib/api/services/auth";
import { changePasswordSchema } from "@/schemas/authSchema";

// Interface definitions
interface Props {
  open: boolean;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), {});

// Emits
const emit = defineEmits<Emits>();

const initialValues = ref({
  oldPassword: "",
  password: "",
  password_confirmation: "",
});

const schema = ref(changePasswordSchema);

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  await changePassword(values);
  toast.success("Berhasil", { description: "Password berhasil diubah" });
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    mode="edit"
    resource-name="Change Password"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="oldPassword" label="Password Lama" placeholder="Masukkan password lama" required />
      <BaseInput name="password" label="Password Baru" placeholder="Masukkan password baru" required />
      <BaseInput
        name="password_confirmation"
        label="Konfirmasi Password"
        placeholder="Masukkan konfirmasi password"
        required
      />
    </div>
  </BaseFormDialog>
</template>
