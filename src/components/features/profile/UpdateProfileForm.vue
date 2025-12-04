<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";

import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import { Button } from "@/components/ui/button";

import { updateUser } from "@/lib/api/services/user";
import type { UserAuth } from "@/lib/api/types/auth.types";
import { updateUserSchema } from "@/schemas/userSchema";

interface Props {
  userData?: UserAuth;
  onSuccess?: () => void;
}

const props = defineProps<Props>();

const isLoading = ref(false);

const initialValues = {
  fullName: props.userData?.fullName ?? "",
  email: props.userData?.email ?? "",
  username: props.userData?.username ?? "",
  nip: props.userData?.nip ?? "",
};

async function onSubmit(values: any) {
  if (!props.userData?.id) return;

  try {
    isLoading.value = true;
    await updateUser(props.userData.id, values);
    toast.success("Profil berhasil diperbarui");
    props.onSuccess?.();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memperbarui profil";
    toast.error("Gagal", { description: errorMessage });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <BaseForm :schema="updateUserSchema" :initial-values="initialValues" :onSubmit="onSubmit">
    <div class="space-y-4">
      <BaseInput name="fullName" label="Nama Lengkap" placeholder="Masukkan nama lengkap" required />
      <BaseInput name="email" label="Email" type="email" placeholder="Masukkan email" required />
      <BaseInput name="username" label="Username" placeholder="Masukkan username" required />
      <BaseInput name="nip" label="NIP" placeholder="Masukkan NIP" required />

      <div class="flex justify-end gap-2">
        <Button type="submit" :disabled="isLoading">
          {{ isLoading ? "Menyimpan..." : "Simpan Perubahan" }}
        </Button>
      </div>
    </div>
  </BaseForm>
</template>
