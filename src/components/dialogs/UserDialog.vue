<script setup lang="ts">
import { computed, ref, watch } from "vue";

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

// import { useFormValidation } from "@/composables/useForm";
import {
  type CreateUserFormData,
  createUserSchema,
  type UpdateUserFormData,
  updateUserSchema,
} from "@/schemas/userSchema";
import { createUser, updateUser, type User } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

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

// Pinia store
const authStore = useAuthStore();

const emit = defineEmits<Emits>();

// Form initial values
const initialCreateValues: CreateUserFormData = {
  name: `User Test ${Math.floor(Math.random() * 1000)}`,
  username: `user${Math.floor(Math.random() * 10000)}`,
  email: `user${Math.floor(Math.random() * 10000)}@test.com`,
  no_hp: `081${Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0")}`,
  role: Math.random() > 0.5 ? 1 : 2,
  password: "password",
  password_confirmation: "password",
};

const initialUpdateValues: UpdateUserFormData = {
  id: "",
  name: "",
  username: "",
  email: "",
  no_hp: "",
  role: 0,
};

// Form validation setup
// const createForm = useFormValidation(createUserSchema, initialCreateValues);
// const updateForm = useFormValidation(updateUserSchema, initialUpdateValues);

// Computed values
const currentForm = computed(() => (props.mode === "create" ? createForm : updateForm));
const dialogTitle = computed(() => (props.mode === "create" ? "Tambah User Baru" : "Edit User"));
const submitButtonText = computed(() => (props.mode === "create" ? "Simpan" : "Update"));

// Role options (you can modify this based on your needs)
const roleOptions = ref([
  { value: 1, label: "Superadmin" },
  { value: 2, label: "Admin" },
]);

// Watch for user changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser && props.mode === "edit") {
      updateForm.setValues({
        id: newUser.id.toString() || "",
        name: newUser.name || "",
        username: newUser.username || "",
        email: newUser.email || "",
        no_hp: newUser.no_hp.toString() || "",
        role: roleOptions.value.find((role) => {
          return role.label === newUser?.user_roles[0]?.role?.nama;
        })?.value,
      });
    }
  },
  { immediate: true },
);

// Watch for dialog open/close
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      // Reset forms when dialog closes
      createForm.resetForm();
      updateForm.resetForm();
    } else if (isOpen && props.mode === "create") {
      // Reset create form when opening in create mode
      createForm.resetForm();
    }
  },
);

const onSubmit = async (values: CreateUserFormData | UpdateUserFormData) => {
  try {
    if (props.mode === "create") {
      await createUser(values as any, authStore.accessToken);
    } else {
      const updateValues = values as any;
      const id = parseInt(updateValues.id);
      // Hapus id dari updateValues
      delete updateValues.id;

      await updateUser(id, updateValues as any, authStore.accessToken);
    }

    emit("success");
  } catch (error) {
    throw error;
  } finally {
    emit("update:open", false);
  }
};

// Handle form submission
const handleSubmit = async () => {
  currentForm.value.handleSubmit(onSubmit, {
    showSuccessToast: true,
    successMessage: props.mode === "create" ? "User berhasil ditambahkan" : "User berhasil diperbarui",
  });
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
          name="name"
          label="Nama Lengkap"
          placeholder="John Doe"
          required
          :value="currentForm.fields.name.value"
          :error="currentForm.fields.name.error"
          :touched="currentForm.fields.name.touched"
          :disabled="currentForm.isSubmitting.value"
          @update:value="(value: string | number) => currentForm.setValue('name', value)"
          @blur="() => currentForm.touchField('name')"
        />

        <!-- Username -->
        <FormField
          name="username"
          label="Username"
          placeholder="Masukkan username"
          required
          :value="currentForm.fields.username.value"
          :error="currentForm.fields.username.error"
          :touched="currentForm.fields.username.touched"
          :disabled="currentForm.isSubmitting.value"
          @update:value="(value: string | number) => currentForm.setValue('username', value)"
          @blur="() => currentForm.touchField('username')"
        />

        <!-- Email -->
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="Masukkan email"
          required
          :value="currentForm.fields.email.value"
          :error="currentForm.fields.email.error"
          :touched="currentForm.fields.email.touched"
          :disabled="currentForm.isSubmitting.value"
          @update:value="(value: string | number) => currentForm.setValue('email', value)"
          @blur="() => currentForm.touchField('email')"
        />

        <!-- No HP -->
        <FormField
          name="no_hp"
          label="No HP"
          type="number"
          placeholder="Masukkan no hp"
          required
          :value="currentForm.fields.no_hp.value"
          :error="currentForm.fields.no_hp.error"
          :touched="currentForm.fields.no_hp.touched"
          :disabled="currentForm.isSubmitting.value"
          @update:value="(value: string | number) => currentForm.setValue('no_hp', value.toString())"
          @blur="() => currentForm.touchField('no_hp')"
        />

        <!-- Role -->
        <FormField
          name="role"
          label="Role"
          type="select"
          placeholder="Pilih role"
          required
          :options="roleOptions"
          option-group-label="Role"
          :value="currentForm.fields.role.value"
          :error="currentForm.fields.role.error"
          :touched="currentForm.fields.role.touched"
          :disabled="currentForm.isSubmitting.value"
          @update:value="(value: string | number) => currentForm.setValue('role', value)"
          @blur="() => currentForm.touchField('role')"
        />

        <!-- Password fields (only for create mode) -->
        <template v-if="mode === 'create'">
          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Masukkan password"
            required
            :value="currentForm.fields.password.value"
            :error="currentForm.fields.password.error"
            :touched="currentForm.fields.password.touched"
            :disabled="currentForm.isSubmitting.value"
            @update:value="(value: string | number) => currentForm.setValue('password', value)"
            @blur="() => currentForm.touchField('password')"
          />

          <FormField
            name="password_confirmation"
            label="Konfirmasi Password"
            type="password"
            placeholder="Konfirmasi password"
            required
            :value="currentForm.fields.password_confirmation.value"
            :error="currentForm.fields.password_confirmation.error"
            :touched="currentForm.fields.password_confirmation.touched"
            :disabled="currentForm.isSubmitting.value"
            @update:value="(value: string | number) => currentForm.setValue('password_confirmation', value)"
            @blur="() => currentForm.touchField('password_confirmation')"
          />
        </template>

        <DialogFooter>
          <Button type="button" variant="outline" @click="closeDialog"> Batal </Button>
          <Button type="submit" :disabled="currentForm.isSubmitting.value">
            {{ currentForm.isSubmitting.value ? "Loading..." : submitButtonText }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
