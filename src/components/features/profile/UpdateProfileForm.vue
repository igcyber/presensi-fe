<script setup lang="ts">
import { SaveIcon } from "lucide-vue-next";

import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import { Button } from "@/components/ui/button";

import { useFetch } from "@/composables/useFetch";
import { updateProfile } from "@/lib/api/services/auth";
import { getCurrentUser } from "@/lib/api/services/auth";
import type { UserAuth } from "@/lib/api/types/auth.types";
import { type UpdateProfileFormData, updateProfileSchema } from "@/schemas/authSchema";
import { useAuthStore } from "@/stores/authStore";

interface UpdateProfileFormProps {
  userData?: UserAuth;
  onSuccess?: () => void;
}

const props = withDefaults(defineProps<UpdateProfileFormProps>(), {
  onSuccess: () => {},
});

const authStore = useAuthStore();
const { fetchData } = useFetch(getCurrentUser, { immediate: false });

const handleSubmit = async (values: UpdateProfileFormData) => {
  try {
    await updateProfile(values);

    // Refresh user data
    await fetchData();

    // Update auth store
    if (authStore.user) {
      authStore.setUser({ ...authStore.user, ...values });
    }

    props.onSuccess?.();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
</script>

<template>
  <BaseForm
    :schema="updateProfileSchema"
    :initial-values="{
      fullName: userData?.fullName || '',
      username: userData?.username || '',
      nip: userData?.nip || '',
      email: userData?.email || '',
    }"
    :on-submit="handleSubmit"
    class="space-y-6"
  >
    <template #default="{ meta }">
      <div class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <BaseInput name="fullName" label="Nama Lengkap" placeholder="Masukkan nama lengkap" />
          </div>

          <div class="space-y-2">
            <BaseInput name="username" label="Username" placeholder="Masukkan username" />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <BaseInput name="nip" label="NIP" placeholder="Masukkan NIP" />
          </div>

          <div class="space-y-2">
            <BaseInput name="email" label="Email" type="email" placeholder="Masukkan email" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <Button type="submit" :disabled="!meta.valid">
          <SaveIcon class="mr-2 h-4 w-4" />
          Simpan Perubahan
        </Button>
      </div>
    </template>
  </BaseForm>
</template>
