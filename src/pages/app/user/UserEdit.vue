<script setup lang="ts">
import { ArrowLeft, Loader2, User as UserIcon } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { UserForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { ApiError } from "@/lib/api/apiResponse";
import type { User } from "@/schemas/userSchema";
import { userService } from "@/services/userService";

const router = useRouter();
const route = useRoute();

const loadingUser = ref(true);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const user = ref<User | null>(null);

const userId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id) : Number(id);
});

// Load user data
const loadUser = async () => {
  if (!userId.value) {
    error.value = "ID user tidak valid";
    loadingUser.value = false;
    return;
  }

  try {
    loadingUser.value = true;
    const response = await userService.getUserById(userId.value);
    user.value = response.data;
  } catch (err: any) {
    error.value = err.message || "Gagal memuat data user";
    console.error("Load user error:", err);
  } finally {
    loadingUser.value = false;
  }
};

// Handle form success
const handleSuccess = (updatedUser: User) => {
  success.value = `User "${updatedUser.full_name}" berhasil diperbarui!`;
  error.value = null;

  // Update local user data
  user.value = updatedUser;

  // Redirect ke halaman user list setelah 2 detik
  setTimeout(() => {
    router.push("/users");
  }, 2000);
};

// Handle form error
const handleError = (err: ApiError) => {
  error.value = err.message || "Terjadi kesalahan saat memperbarui user";
  success.value = null;
  console.error("User update error:", err);
};

// Handle back navigation
const handleBack = () => {
  router.back();
};

// Handle go to user list
const handleGoToList = () => {
  router.push("/users");
};

// Load user data on mount
onMounted(() => {
  loadUser();
});
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <!-- Header -->
    <div class="mb-6 flex items-center gap-4">
      <Button variant="outline" size="sm" @click="handleBack" class="flex items-center gap-2">
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </Button>

      <div class="flex items-center gap-2">
        <UserIcon class="text-primary h-6 w-6" />
        <h1 class="text-2xl font-bold">Edit User</h1>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingUser" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <Loader2 class="text-primary h-5 w-5 animate-spin" />
        <span class="text-muted-foreground">Memuat data user...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !user" class="mb-6">
      <Card>
        <CardContent class="pt-6">
          <div class="bg-destructive/15 border-destructive/20 text-destructive rounded-lg border px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="bg-destructive flex h-4 w-4 items-center justify-center rounded-full">
                <span class="text-destructive-foreground text-xs">!</span>
              </div>
              <span class="text-sm font-medium">{{ error }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Form Content -->
    <template v-else-if="user">
      <!-- Alert Messages -->
      <div v-if="error" class="mb-6">
        <div class="bg-destructive/15 border-destructive/20 text-destructive rounded-lg border px-4 py-3">
          <div class="flex items-center gap-2">
            <div class="bg-destructive flex h-4 w-4 items-center justify-center rounded-full">
              <span class="text-destructive-foreground text-xs">!</span>
            </div>
            <span class="text-sm font-medium">{{ error }}</span>
          </div>
        </div>
      </div>

      <div v-if="success" class="mb-6">
        <div class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <div class="flex items-center gap-2">
            <div class="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
              <span class="text-xs text-white">✓</span>
            </div>
            <span class="text-sm font-medium">{{ success }}</span>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserIcon class="h-5 w-5" />
            Edit Data User: {{ user.full_name }}
          </CardTitle>
          <CardDescription>
            Perbarui informasi user di bawah ini. Field password tidak wajib diisi untuk mode edit.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UserForm
            :user="user"
            mode="edit"
            :on-success="handleSuccess"
            :on-error="handleError"
            @success="handleSuccess"
            @error="handleError"
          />
        </CardContent>
      </Card>

      <!-- Additional Actions -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-muted-foreground text-sm">
          <p>User ID: {{ user.id }} | Dibuat: {{ new Date(user.created_at).toLocaleDateString("id-ID") }}</p>
        </div>

        <Button variant="outline" @click="handleGoToList" class="flex items-center gap-2"> Lihat Daftar User </Button>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
