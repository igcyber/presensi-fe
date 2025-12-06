<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { login } from "@/lib/api/services/auth";
import { type LoginFormData, loginSchema } from "@/schemas/authSchema";
import { useAuthStore } from "@/stores/authStore";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);

// Handle submit
async function handleSubmit(values: LoginFormData) {
  try {
    isLoading.value = true;

    // Call login API
    const response = await login(values);

    // Handle successful login
    authStore.handleLoginSuccess(response);

    // Tunggu state ter-update sebelum redirect
    await nextTick();

    // 👇 LOGIKA REDIRECT BERDASARKAN PERAN
    if (authStore.isAdmin) {
      // Asumsi: Admin memiliki dashboard utama untuk manajemen
      await router.replace({ name: "app.dashboard" });
    } else if (authStore.isPegawai) {
      // Asumsi: Pegawai memiliki halaman khusus (misal: Absensi Harian)
      // Kita akan buat rute ini di langkah 4.
      await router.replace({ name: "pegawai.absensi-harian" });
    } else {
      // Fallback untuk peran yang tidak dikenal
      await router.replace({ name: "app.dashboard" });
    }

    // Show success message
    toast.success(response.message || "Login berhasil!");
  } catch (error: any) {
    // Handle error response
    const errorMessage =
      error.status === 400 ? "Username atau password salah" : "Terjadi kesalahan saat login. Silakan coba lagi.";

    toast.error(errorMessage);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div :class="['flex flex-col gap-6', props.class]">
    <Card class="!shadow-login overflow-hidden py-0 dark:border-gray-700 dark:bg-gray-800">
      <CardContent class="grid p-0 md:grid-cols-2">
        <BaseForm
          :schema="loginSchema"
          :initial-values="{ username: 'admin', password: 'penjagaAbsen' }"
          :on-submit="handleSubmit"
          class="bg-white p-6 md:p-8 dark:bg-gray-800"
        >
          <div class="flex flex-col gap-6">
            <!-- Title -->
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Selamat Datang</h1>
              <p class="text-muted-foreground text-balance dark:text-gray-300">Login ke akun Anda</p>
            </div>

            <!-- Username -->
            <BaseInput name="username" label="Username" placeholder="Masukkan username" />

            <!-- Password -->
            <BaseInput name="password" label="Password" type="password" placeholder="Masukkan password" />

            <!-- Submit -->
            <Button type="submit" class="w-full" :disabled="isLoading">
              <span
                v-if="isLoading"
                class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              ></span>
              {{ isLoading ? "Memproses..." : "Login" }}
            </Button>

            <!-- Register Link -->
            <!--
            <div class="text-center text-sm">
              Belum punya akun?
              <a href="#" class="underline underline-offset-4">Daftar</a>
            </div>
            -->
          </div>
        </BaseForm>

        <!-- Right side image -->
        <div class="bg-muted relative hidden md:flex md:items-center md:justify-center dark:bg-gray-700">
          <img
            src="/assets/images/logos/logo-kukar.png"
            alt="Kukar Logo"
            class="max-h-80 max-w-xs object-contain dark:brightness-[0.8] dark:contrast-125"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Terms -->
    <div
      class="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance dark:text-gray-400 [&_a]:underline [&_a]:underline-offset-4 dark:hover:[&_a]:text-blue-400"
    >
      Dengan melanjutkan, Anda setuju dengan
      <a href="#" class="dark:text-gray-300">Ketentuan Layanan</a> dan
      <a href="#" class="dark:text-gray-300">Kebijakan Privasi</a>.
    </div>
  </div>
</template>
