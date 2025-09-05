<script setup lang="ts">
import { ArrowLeft, Calendar, CheckCircle, Edit, Hash, Loader2, Mail, Shield, User, XCircle } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { User as UserType } from "@/schemas/userSchema";
import { userService } from "@/services/userService";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const error = ref<string | null>(null);
const user = ref<UserType | null>(null);

const userId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id) : id;
});

// Load user data
const loadUser = async () => {
  if (!userId.value) {
    error.value = "ID user tidak valid";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const response = await userService.getUserById(userId.value as number);
    user.value = response.data;
  } catch (err: any) {
    error.value = err.message || "Gagal memuat data user";
    console.error("Load user error:", err);
  } finally {
    loading.value = false;
  }
};

// Handle edit user
const handleEditUser = () => {
  router.push(`/users/${userId.value}/edit`);
};

// Handle back navigation
const handleBack = () => {
  router.back();
};

// Handle go to user list
const handleGoToList = () => {
  router.push("/users");
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
        <User class="text-primary h-6 w-6" />
        <h1 class="text-2xl font-bold">Detail User</h1>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <Loader2 class="text-primary h-5 w-5 animate-spin" />
        <span class="text-muted-foreground">Memuat data user...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mb-6">
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

    <!-- User Detail Content -->
    <template v-else-if="user">
      <!-- User Info Card -->
      <Card class="mb-6">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <User class="h-5 w-5" />
                {{ user.full_name }}
              </CardTitle>
              <CardDescription> @{{ user.name }} • ID: {{ user.id }} </CardDescription>
            </div>

            <div class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                ]"
              >
                <CheckCircle v-if="user.is_active" class="mr-1 h-4 w-4" />
                <XCircle v-else class="mr-1 h-4 w-4" />
                {{ user.is_active ? "Aktif" : "Tidak Aktif" }}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h3 class="flex items-center gap-2 text-lg font-semibold">
                <User class="h-4 w-4" />
                Informasi Personal
              </h3>

              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <Mail class="text-muted-foreground h-4 w-4" />
                  <div>
                    <div class="text-sm font-medium">Email</div>
                    <div class="text-muted-foreground text-sm">{{ user.email }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <Hash class="text-muted-foreground h-4 w-4" />
                  <div>
                    <div class="text-sm font-medium">NIP</div>
                    <div class="text-muted-foreground text-sm">{{ user.nip }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <Shield class="text-muted-foreground h-4 w-4" />
                  <div>
                    <div class="text-sm font-medium">Role</div>
                    <div class="text-muted-foreground text-sm">{{ user.role || "User" }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Information -->
            <div class="space-y-4">
              <h3 class="flex items-center gap-2 text-lg font-semibold">
                <Calendar class="h-4 w-4" />
                Informasi Akun
              </h3>

              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <Calendar class="text-muted-foreground h-4 w-4" />
                  <div>
                    <div class="text-sm font-medium">Dibuat</div>
                    <div class="text-muted-foreground text-sm">{{ formatDate(user.created_at) }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <Calendar class="text-muted-foreground h-4 w-4" />
                  <div>
                    <div class="text-sm font-medium">Diperbarui</div>
                    <div class="text-muted-foreground text-sm">{{ formatDate(user.updated_at) }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <CheckCircle class="text-muted-foreground h-4 w-4" />
                  <div>
                    <div class="text-sm font-medium">Email Terverifikasi</div>
                    <div class="text-muted-foreground text-sm">
                      {{ user.email_verified_at ? formatDate(user.email_verified_at) : "Belum terverifikasi" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <div class="text-muted-foreground text-sm">
          <p>Terakhir diakses: {{ formatDate(user.updated_at) }}</p>
        </div>

        <div class="flex gap-3">
          <Button variant="outline" @click="handleGoToList"> Lihat Daftar User </Button>

          <Button @click="handleEditUser" class="flex items-center gap-2">
            <Edit class="h-4 w-4" />
            Edit User
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
