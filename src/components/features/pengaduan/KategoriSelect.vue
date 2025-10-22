<script setup lang="ts">
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { getKategoriPengaduan } from "@/lib/api/services/pengaduan";
import type { KategoriPengaduan } from "@/lib/api/types/pengaduan.types";

// Props
interface Props {
  modelValue?: string;
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  disabled: false,
  placeholder: "Pilih kategori...",
});

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// State
const open = ref(false);
const kategoriList = ref<KategoriPengaduan[]>([]);
const isLoading = ref(false);

// Computed
const selectedKategori = computed(() => {
  return kategoriList.value.find(kategori => kategori.kategori_aduan === props.modelValue);
});

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

const handleSelect = (kategori: string) => {
  emit("update:modelValue", kategori);
  open.value = false;
};

const handleAddNew = (value: string) => {
  if (value.trim()) {
    emit("update:modelValue", value.trim());
    open.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchKategoriList();
});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled"
        class="w-full justify-between"
      >
        {{ selectedKategori?.kategori_aduan || placeholder }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0" :style="{ width: 'var(--radix-popover-trigger-width)' }">
      <Command>
        <CommandInput
          placeholder="Cari kategori..."
          @keydown.enter="handleAddNew($event.target.value)"
        />
        <CommandList>
          <CommandEmpty>
            <div class="py-2 text-center text-sm text-muted-foreground">
              Kategori tidak ditemukan.
              <br />
              <span class="text-xs">Tekan Enter untuk menambah kategori baru</span>
            </div>
          </CommandEmpty>
          <CommandGroup v-if="!isLoading">
            <CommandItem
              v-for="kategori in kategoriList"
              :key="kategori.kategori_aduan"
              :value="kategori.kategori_aduan"
              @select="handleSelect(kategori.kategori_aduan)"
            >
              <Check
                :class="cn(
                  'mr-2 h-4 w-4',
                  modelValue === kategori.kategori_aduan ? 'opacity-100' : 'opacity-0'
                )"
              />
              {{ kategori.kategori_aduan }}
            </CommandItem>
          </CommandGroup>
          <div v-else class="py-2 text-center text-sm text-muted-foreground">
            Memuat kategori...
          </div>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
