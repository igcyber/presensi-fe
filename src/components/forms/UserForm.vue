<script setup lang="ts">
import { computed, ref } from "vue";

import { BaseForm, BaseFormField, BaseInput } from "@/components/forms";

import { type UserFormData, userSchema, type UserUpdateData, userUpdateSchema } from "@/schemas/userSchema";
import type { User } from "@/schemas/userSchema";
import { userService } from "@/services/userService";

interface Props {
  user?: User | null;
  mode?: "create" | "edit";
  onSuccess?: (user: User) => void;
  onError?: (error: any) => void;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  mode: "create",
  onSuccess: () => {},
  onError: () => {},
});

const emit = defineEmits<{
  (e: "success", user: User): void;
  (e: "error", error: any): void;
}>();

const loading = ref(false);

// Tentukan schema berdasarkan mode
const schema = computed(() => {
  return props.mode === "edit" ? userUpdateSchema : userSchema;
});

// Initial values berdasarkan mode dan user data
const initialValues = computed(() => {
  if (props.mode === "edit" && props.user) {
    return {
      full_name: props.user.full_name,
      name: props.user.name,
      email: props.user.email,
      nip: props.user.nip,
      // Password tidak diisi untuk mode edit
    };
  }

  return {
    full_name: "",
    name: "",
    email: "",
    nip: "",
    password: "",
  };
});

// Handle form submission
const handleSubmit = async (values: UserFormData | UserUpdateData) => {
  loading.value = true;

  try {
    let result;

    if (props.mode === "create") {
      result = await userService.createUser(values as UserFormData);
    } else {
      if (!props.user?.id) {
        throw new Error("User ID tidak ditemukan");
      }
      result = await userService.updateUser(props.user.id, values as UserUpdateData);
    }

    emit("success", result.data);
    props.onSuccess(result.data);
  } catch (error) {
    console.error("Form submission error:", error);
    emit("error", error);
    props.onError(error);
  } finally {
    loading.value = false;
  }
};

// Form akan di-reset otomatis oleh BaseForm
</script>

<template>
  <BaseForm
    :schema="schema"
    :initial-values="initialValues"
    :on-submit="handleSubmit"
    :loading="loading"
    :submit-label="mode === 'create' ? 'Buat User' : 'Update User'"
    @success="emit('success', $event)"
    @error="emit('error', $event)"
  >
    <template #default="{ errors, disabled }">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Nama Lengkap -->
        <BaseFormField name="full_name" label="Nama Lengkap" description="Masukkan nama lengkap user" :required="true">
          <template #default="{ field }">
            <BaseInput
              v-bind="field"
              type="text"
              placeholder="Masukkan nama lengkap"
              :disabled="disabled"
              :aria-invalid="!!errors.full_name"
              :aria-describedby="errors.full_name ? 'full_name-error' : 'full_name-description'"
            />
          </template>
        </BaseFormField>

        <!-- Username -->
        <BaseFormField
          name="name"
          label="Username"
          description="Username untuk login (huruf, angka, underscore)"
          :required="true"
        >
          <template #default="{ field }">
            <BaseInput
              v-bind="field"
              type="text"
              placeholder="Masukkan username"
              :disabled="disabled"
              :aria-invalid="!!errors.name"
              :aria-describedby="errors.name ? 'name-error' : 'name-description'"
            />
          </template>
        </BaseFormField>

        <!-- Email -->
        <BaseFormField name="email" label="Email" description="Alamat email yang valid" :required="true">
          <template #default="{ field }">
            <BaseInput
              v-bind="field"
              type="email"
              placeholder="Masukkan email"
              :disabled="disabled"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'email-error' : 'email-description'"
            />
          </template>
        </BaseFormField>

        <!-- NIP -->
        <BaseFormField name="nip" label="NIP" description="Nomor Induk Pegawai" :required="true">
          <template #default="{ field }">
            <BaseInput
              v-bind="field"
              type="text"
              placeholder="Masukkan NIP"
              :disabled="disabled"
              :aria-invalid="!!errors.nip"
              :aria-describedby="errors.nip ? 'nip-error' : 'nip-description'"
            />
          </template>
        </BaseFormField>

        <!-- Password -->
        <BaseFormField
          v-if="mode === 'create'"
          name="password"
          label="Password"
          description="Minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol"
          :required="true"
          class="md:col-span-2"
        >
          <template #default="{ field }">
            <BaseInput
              v-bind="field"
              type="password"
              placeholder="Masukkan password"
              :disabled="disabled"
              :aria-invalid="!!errors.password"
              :aria-describedby="errors.password ? 'password-error' : 'password-description'"
            />
          </template>
        </BaseFormField>
      </div>
    </template>
  </BaseForm>
</template>
