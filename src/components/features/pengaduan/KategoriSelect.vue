<script setup lang="ts">
import { onMounted, ref } from "vue";

import { getKategoriPengaduan } from "@/lib/api/services/pengaduan";
import type { KategoriPengaduan } from "@/lib/api/types/pengaduan.types";

// Props
interface Props {
  modelValue?: string;
  disabled?: boolean;
  placeholder?: string;
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  disabled: false,
  placeholder: "Pilih atau ketik kategori...",
});

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// State
const kategoriList = ref<KategoriPengaduan[]>([]);
const isLoading = ref(false);

// Methods
const fetchKategoriList = async () => {
  try {
    isLoading.value = true;
    const response = await getKategoriPengaduan();
    kategoriList.value = response.data;
  } catch (error) {
    console.error("Error fetching kategori:", error);
    kategoriList.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

// Lifecycle
onMounted(() => {
  fetchKategoriList();
});
</script>

<template>
  <div class="relative">
    <input
      :value="_props.modelValue"
      :placeholder="_props.placeholder"
      :disabled="_props.disabled"
      list="kategori-list"
      class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      @input="handleInput"
    />

    <!-- Datalist untuk autocomplete suggestions -->
    <datalist id="kategori-list">
      <option v-for="kategori in kategoriList" :key="kategori.kategori_aduan" :value="kategori.kategori_aduan" />
    </datalist>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="absolute top-1/2 right-3 -translate-y-1/2">
      <div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
    </div>
  </div>
</template>
