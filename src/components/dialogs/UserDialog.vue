<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form";

import { createUser, updateUser } from "@/lib/api/services/user";
import type { User } from "@/lib/api/types/user.types";
import { type CreateUserFormData, type UpdateUserFormData } from "@/schemas/userSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: User | null;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
});

const emit = defineEmits<Emits>();

// Form state
const isSubmitting = ref(false);
const formErrors = ref<Record<string, string>>({});

// Form data
const createFormData = ref<CreateUserFormData>({
  fullName: "",
  email: "",
  username: "",
  nip: "",
  password: "",
  confirmPassword: "",
  roleIds: [],
});

const updateFormData = ref<UpdateUserFormData>({
  fullName: "",
  email: "",
  username: "",
  nip: "",
  roleIds: [],
});

// Computed values
const currentFormData = computed(() => (props.mode === "create" ? createFormData.value : updateFormData.value));
const dialogTitle = computed(() => (props.mode === "create" ? "Tambah User Baru" : "Edit User"));
const submitButtonText = computed(() => (props.mode === "create" ? "Simpan" : "Update"));

// Watch for user changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser && props.mode === "edit") {
      updateFormData.value = {
        fullName: newUser.fullName || "",
        username: newUser.username || "",
        email: newUser.email || "",
        nip: newUser.nip || "",
        roleIds: newUser.roles.map((role) => role.id),
      };
    }
  },
  { immediate: true },
);

// Watch for dialog open/close
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      formErrors.value = {};

      if (props.mode === "create") {
        // Reset create form
        createFormData.value = {
          fullName: "",
          email: "",
          username: "",
          nip: "",
          password: "",
          confirmPassword: "",
          roleIds: [],
        };
      }
    }
  },
);

// Handle form submission
const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    formErrors.value = {};

    if (props.mode === "create") {
      await createUser(createFormData.value);
      toast.success("Berhasil", {
        description: "User berhasil ditambahkan",
      });
    } else if (props.user) {
      await updateUser(props.user.id, updateFormData.value);
      toast.success("Berhasil", {
        description: "User berhasil diperbarui",
      });
    }

    emit("success");
    emit("update:open", false);
  } catch (error: any) {
    console.error("Form submission error:", error);

    // Handle validation errors
    if (error.response?.data?.errors) {
      formErrors.value = error.response.data.errors;
    } else {
      const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan";
      toast.error("Gagal", {
        description: errorMessage,
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Close dialog
const closeDialog = () => {
  emit("update:open", false);
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          {{ mode === "create" ? "Isi form berikut untuk menambah user baru" : "Edit informasi user" }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Fullname -->
        <FormField
          name="fullName"
          label="Nama Lengkap"
          placeholder="John Doe"
          required
          :value="currentFormData.fullName"
          :error="formErrors.fullName"
          :disabled="isSubmitting"
          @update:value="
            (value: string | number) => {
              if (mode === 'create') createFormData.fullName = value.toString();
              else updateFormData.fullName = value.toString();
            }
          "
        />

        <!-- Username -->
        <FormField
          name="username"
          label="Username"
          placeholder="Masukkan username"
          required
          :value="currentFormData.username"
          :error="formErrors.username"
          :disabled="isSubmitting"
          @update:value="
            (value: string | number) => {
              if (mode === 'create') createFormData.username = value.toString();
              else updateFormData.username = value.toString();
            }
          "
        />

        <!-- Email -->
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="Masukkan email"
          required
          :value="currentFormData.email"
          :error="formErrors.email"
          :disabled="isSubmitting"
          @update:value="
            (value: string | number) => {
              if (mode === 'create') createFormData.email = value.toString();
              else updateFormData.email = value.toString();
            }
          "
        />

        <!-- NIP -->
        <FormField
          name="nip"
          label="NIP"
          placeholder="Masukkan NIP"
          required
          :value="currentFormData.nip"
          :error="formErrors.nip"
          :disabled="isSubmitting"
          @update:value="
            (value: string | number) => {
              if (mode === 'create') createFormData.nip = value.toString();
              else updateFormData.nip = value.toString();
            }
          "
        />

        <!-- Password fields (only for create mode) -->
        <template v-if="mode === 'create'">
          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Masukkan password"
            required
            :value="createFormData.password"
            :error="formErrors.password"
            :disabled="isSubmitting"
            @update:value="(value: string | number) => (createFormData.password = value.toString())"
          />

          <FormField
            name="confirmPassword"
            label="Konfirmasi Password"
            type="password"
            placeholder="Konfirmasi password"
            required
            :value="createFormData.confirmPassword"
            :error="formErrors.confirmPassword"
            :disabled="isSubmitting"
            @update:value="(value: string | number) => (createFormData.confirmPassword = value.toString())"
          />
        </template>

        <DialogFooter>
          <Button type="button" variant="outline" @click="closeDialog"> Batal </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Loading..." : submitButtonText }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
