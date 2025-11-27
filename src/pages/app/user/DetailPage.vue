<script setup lang="ts">
import { Edit, Shield, Trash2 } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import UserDialog from "@/components/dialogs/UserDialog.vue";
import UserRolesDialog from "@/components/dialogs/UserRolesDialog.vue";
import UserDetailView from "@/components/features/user/UserDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { getRoles } from "@/lib/api/services/role";
import { deleteUser, getUserById } from "@/lib/api/services/user";
import type { Role } from "@/lib/api/types/role.types";
import type { User } from "@/lib/api/types/user.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get user ID from route params
const userId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<User>();
const confirmDialog = useDialog<User>();
const rolesDialog = ref({ open: false });

// Reactive state
const roleOptions = ref<{ label: string; value: number }[]>([]);

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<User>, User>(
  () => getUserById(userId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail user", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.user" });
};

const handleEdit = (user: User) => {
  editDialog.openEdit(user);
};

const handleDelete = (user: User) => {
  confirmDialog.openView(user);
};

const handleManageRoles = () => {
  rolesDialog.value.open = true;
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const user = confirmDialog.state.value.data;
    await deleteUser(user.id);

    toast.success("Berhasil menghapus user", {
      description: `User "${user.fullName}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus user";
    toast.error("Gagal menghapus user", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const loadRoleOptions = async (): Promise<void> => {
  try {
    const roles = await getRoles();
    roleOptions.value = roles.data.data.map((role: Role) => ({ label: role.name, value: role.id }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data role";
    toast.error("Gagal", { description: errorMessage });
  }
};

// Lifecycle
onMounted(() => {
  if (userId.value > 0) {
    fetchData();
    loadRoleOptions();
  } else {
    toast.error("ID user tidak valid");
    handleBack();
  }
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span class="text-muted-foreground">Memuat detail user...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail berita'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <UserDetailView
        :user="data"
        :show-back-button="true"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Edit class="mr-2 h-4 w-4" />
              Edit User
            </Button>
            <Button variant="outline" size="sm" @click="handleManageRoles">
              <Shield class="mr-2 h-4 w-4" />
              Kelola Role
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus User
            </Button>
          </div>
        </template>
      </UserDetailView>
    </div>

    <!-- Edit Dialog -->
    <UserDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :user="editDialog.state.value.data"
      :role-options="roleOptions"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus User"
      :description="`Apakah Anda yakin ingin menghapus user '${confirmDialog.state.value.data?.fullName}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />

    <!-- Manage Roles Dialog -->
    <UserRolesDialog v-model:open="rolesDialog.open" :user="data" :role-options="roleOptions" @success="fetchData" />
  </div>
</template>
