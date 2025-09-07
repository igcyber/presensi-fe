<script setup lang="ts">
import { ArrowLeft, UserPlus } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { UserForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { ApiError } from "@/lib/api/apiResponse";
import type { User } from "@/schemas/userSchema";

const router = useRouter();

const error = ref<string | null>(null);
const success = ref<string | null>(null);

// Handle form success
const handleSuccess = (user: User) => {
  success.value = `User "${user.full_name}" berhasil dibuat!`;
  error.value = null;

  // Redirect ke halaman user list setelah 2 detik
  setTimeout(() => {
    router.push("/users");
  }, 2000);
};

// Handle form error
const handleError = (err: ApiError) => {
  error.value = err.message || "Terjadi kesalahan saat membuat user";
  success.value = null;
  console.error("User creation error:", err);
};

// Handle back navigation
const handleBack = () => {
  router.back();
};

// Handle go to user list
const handleGoToList = () => {
  router.push("/users");
};
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
        <UserPlus class="text-primary h-6 w-6" />
        <h1 class="text-2xl font-bold">Buat User Baru</h1>
      </div>
    </div>

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
          <UserPlus class="h-5 w-5" />
          Form Data User
        </CardTitle>
        <CardDescription>
          Lengkapi form di bawah ini untuk membuat user baru. Semua field yang bertanda (*) wajib diisi.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UserForm
          mode="create"
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
        <p>Setelah user dibuat, mereka akan menerima email verifikasi.</p>
      </div>

      <Button variant="outline" @click="handleGoToList" class="flex items-center gap-2"> Lihat Daftar User </Button>
    </div>
  </div>
</template>
