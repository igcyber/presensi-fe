<script setup lang="ts">
import { ArrowLeft, Building2, Calendar, CalendarClock, Tag } from "lucide-vue-next";
import { computed } from "vue";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { KiosDetail } from "@/lib/api/types/kios.types";

interface Props {
  kios: KiosDetail;
  showBackButton?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", kios: KiosDetail): void;
  (e: "delete", kios: KiosDetail): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
});

const emit = defineEmits<Emits>();

const { date } = useFormatters();

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.kios);
};

const handleDelete = () => {
  emit("delete", props.kios);
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
          <div class="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <Building2 class="text-primary h-8 w-8" />
          </div>
          <div class="flex-1">
            <CardTitle class="mb-2">Kios {{ kios.kode }}</CardTitle>
            <CardDescription>Kios ID: {{ kios.id }}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :kios="kios" :onEdit="handleEdit" :onDelete="handleDelete">
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
                <Building2 class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Kode Kios</p>
                  <p class="font-medium">{{ kios.kode }}</p>
                </div>
              </div>

              <div v-if="kios.jenisUsaha" class="flex items-center gap-3 rounded-lg border p-3">
                <Tag class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Jenis Usaha</p>
                  <div class="flex items-center gap-2">
                    <div
                      v-if="kios.jenisUsaha.warna"
                      class="h-4 w-4 rounded border"
                      :style="{ backgroundColor: kios.jenisUsaha.warna }"
                    ></div>
                    <p class="font-medium">{{ kios.jenisUsaha.nama }}</p>
                  </div>
                </div>
              </div>

              <div v-if="kios.pasar" class="flex items-center gap-3 rounded-lg border p-3">
                <Building2 class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Pasar</p>
                  <p class="font-medium">{{ kios.pasar.nama }}</p>
                  <p v-if="kios.pasar.jenisPasar" class="text-sm text-gray-500">{{ kios.pasar.jenisPasar }}</p>
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
                  <p class="font-medium">{{ kios.createdAt ? date(kios.createdAt) : "-" }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <CalendarClock class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Terakhir Diupdate</p>
                  <p class="font-medium">{{ kios.updatedAt ? date(kios.updatedAt) : "-" }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
