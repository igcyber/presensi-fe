<script setup lang="ts">
import { ArrowLeft, Calendar, CalendarClock, CreditCard, Mail, Shield, User } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { User as UserType } from "@/lib/api/types/user.types";

interface Props {
  user: UserType;
  showBackButton?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", user: UserType): void;
  (e: "delete", user: UserType): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
});

const emit = defineEmits<Emits>();

const { date, capitalize } = useFormatters();

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.user);
};

const handleDelete = () => {
  emit("delete", props.user);
};
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-6 p-4">
    <!-- Back Button (Optional) -->
    <div v-if="showBackButton" class="flex items-center">
      <Button variant="ghost" size="sm" @click="handleBack" class="gap-2 px-0">
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </Button>
    </div>

    <!-- Main Content -->
    <Card>
      <CardHeader>
        <div class="flex items-start gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <User class="h-8 w-8 text-blue-600" />
          </div>
          <div class="flex-1">
            <CardTitle class="mb-2">{{ user.fullName }}</CardTitle>
            <CardDescription>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="role in user.roles"
                  :key="role.id"
                  class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  <Shield class="h-3 w-3" />
                  {{ capitalize(role.name) }}
                </span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :user="user" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Dasar</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-lg border p-3">
                <User class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Username</p>
                  <p class="font-medium">{{ user.username }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <Mail class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Email</p>
                  <p class="font-medium">{{ user.email }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <CreditCard class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">NIP</p>
                  <p class="font-medium">{{ user.nip }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- System Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Sistem</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-lg border p-3">
                <Calendar class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Dibuat</p>
                  <p class="font-medium">{{ date(user.createdAt) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <CalendarClock class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Terakhir Diupdate</p>
                  <p class="font-medium">{{ date(user.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles Section -->
        <div v-if="user.roles && user.roles.length > 0" class="mt-8">
          <hr class="my-6 border-gray-200" />
          <h3 class="mb-4 text-lg font-semibold">Role</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-for="role in user.roles"
              :key="role.id"
              class="flex items-center gap-3 rounded-lg border border-gray-200 p-4"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Shield class="h-4 w-4 text-blue-600" />
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ capitalize(role.name) }}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
