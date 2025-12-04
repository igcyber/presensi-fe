<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import type { SelectOption } from "@/components/forms/BaseSelect.vue";

import { createUser, updateUser } from "@/lib/api/services/user";
import type { User } from "@/lib/api/types/user.types";
import { createUserSchema, updateUserSchema } from "@/schemas/userSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: User | null;
  roleOptions?: SelectOption[];
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  roleOptions: () => [],
});

const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? {
        fullName: "",
        username: "",
        email: "",
        nip: "",
        password: "",
        confirmPassword: "",
        roles: [] as number[],
      }
    : {
        fullName: props.user?.fullName ?? "",
        username: props.user?.username ?? "",
        email: props.user?.email ?? "",
        nip: props.user?.nip ?? "",
        roles: (props.user?.roles ?? []).map((r) => r.id),
      },
);

const schema = computed(() => (props.mode === "create" ? createUserSchema : updateUserSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createUser(values);
    toast.success("Berhasil", { description: "User berhasil ditambahkan" });
  } else if (props.user) {
    await updateUser(props.user.id, values);
    toast.success("Berhasil", { description: "User berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="User"
    :schema="schema"
    :initial-values="initialValues"
    :on-submit="onSubmit"
    @success="() => emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="fullName" label="Nama Lengkap" placeholder="John Doe" required />
      <BaseInput name="username" label="Username" placeholder="Masukkan username" required />
      <BaseInput name="email" label="Email" type="email" placeholder="Masukkan email" required />
      <BaseInput name="nip" label="NIP" placeholder="Masukkan NIP" required />

      <template v-if="mode === 'create'">
        <BaseInput name="password" label="Password" type="password" placeholder="Masukkan password" required />
        <BaseInput
          name="confirmPassword"
          label="Konfirmasi Password"
          type="password"
          placeholder="Masukkan konfirmasi password"
          required
        />
      </template>

      <BaseSelect
        name="roles"
        label="Role"
        :options="roleOptions"
        placeholder="Pilih role"
        required
        :value-as-number="true"
        :multiple="true"
      />
    </div>
  </BaseFormDialog>
</template>
