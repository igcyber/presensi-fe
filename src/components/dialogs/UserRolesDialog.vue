<script setup lang="ts">
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

import BaseForm from "@/components/forms/BaseForm.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { updateUserRoles } from "@/lib/api/services/user";
import type { User } from "@/lib/api/types/user.types";

// Schema untuk form
const updateRolesSchema = z.object({
  roles: z.array(z.number()).min(1, "Pilih minimal 1 role"),
});

// Interface
interface Props {
  open: boolean;
  user: User | null;
  roleOptions: { label: string; value: number }[];
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// State
const isSubmitting = ref(false);

// Computed
const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const currentRoleIds = computed(() => {
  return props.user?.roles?.map((r) => r.id) || [];
});

// Methods
const handleUpdateRoles = async (values: { roles: number[] }) => {
  if (!props.user) return;

  try {
    isSubmitting.value = true;
    await updateUserRoles(props.user.id, { roles: values.roles });
    toast.success("Berhasil", { description: "Role berhasil diperbarui" });
    emit("success");
    open.value = false;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memperbarui role";
    toast.error("Gagal", { description: errorMessage });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Update Role</DialogTitle>
        <DialogDescription>
          Pilih role untuk <strong>{{ user?.fullName }}</strong>
        </DialogDescription>
      </DialogHeader>

      <div v-if="user">
        <BaseForm
          :schema="updateRolesSchema"
          :initial-values="{ roles: currentRoleIds }"
          :on-submit="handleUpdateRoles"
          class="space-y-4"
        >
          <BaseSelect
            name="roles"
            label="Role"
            :options="roleOptions"
            placeholder="Pilih role"
            :multiple="true"
            :value-as-number="true"
          />

          <DialogFooter>
            <Button type="button" variant="outline" @click="open = false"> Batal </Button>
            <Button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
            </Button>
          </DialogFooter>
        </BaseForm>
      </div>
    </DialogContent>
  </Dialog>
</template>
