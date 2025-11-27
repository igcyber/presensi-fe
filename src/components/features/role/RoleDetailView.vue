<script setup lang="ts">
import { ArrowLeft, Calendar, CalendarClock, Shield } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { Role } from "@/lib/api/types/role.types";

interface Props {
  role: Role;
  showBackButton?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", role: Role): void;
  (e: "delete", role: Role): void;
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
  emit("edit", props.role);
};

const handleDelete = () => {
  emit("delete", props.role);
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
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Shield class="h-8 w-8 text-purple-600" />
          </div>
          <div class="flex-1">
            <CardTitle class="mb-2">{{ capitalize(role.name) }}</CardTitle>
            <CardDescription>Role ID: {{ role.id }}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :role="role" :on-edit="handleEdit" :on-delete="handleDelete">
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
                <Shield class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Nama Role</p>
                  <p class="font-medium">{{ capitalize(role.name) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <Shield class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">ID</p>
                  <p class="font-medium">{{ role.id }}</p>
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
                  <p class="font-medium">{{ role.createdAt ? date(role.createdAt) : "-" }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <CalendarClock class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Terakhir Diupdate</p>
                  <p class="font-medium">{{ role.updatedAt ? date(role.updatedAt) : "-" }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
