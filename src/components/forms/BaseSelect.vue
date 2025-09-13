<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { Loader2, Search, X } from "lucide-vue-next";
import type { AcceptableValue } from "reka-ui";
import { computed, nextTick, ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface definitions
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  valueAsNumber?: boolean;
  multiple?: boolean;
  emptyOption?: string;
  description?: string;
  searchable?: boolean;
  remote?: boolean;
  onSearch?: (query: string) => Promise<SelectOption[]>;
  searchPlaceholder?: string;
  loadingText?: string;
  emptyText?: string;
  minSearchLength?: number;
}

// Props dengan default values
const props = withDefaults(defineProps<Props>(), {
  valueAsNumber: false,
  multiple: false,
  placeholder: "Pilih opsi...",
  searchable: false,
  remote: false,
  searchPlaceholder: "Cari...",
  loadingText: "Memuat...",
  emptyText: "Tidak ada data",
  minSearchLength: 1,
});

// Search state
const searchQuery = ref("");
const isLoading = ref(false);
const remoteOptions = ref<SelectOption[]>([]);
const searchInputRef = ref<HTMLInputElement>();
const isSelectOpen = ref(false);

// Computed properties
const currentOptions = computed(() => {
  if (props.remote) {
    return remoteOptions.value;
  }
  return props.options;
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return currentOptions.value;
  }

  const query = searchQuery.value.toLowerCase().trim();

  return currentOptions.value.filter((option) => option.label.toLowerCase().includes(query));
});

const groupedOptions = computed(() => {
  const options = filteredOptions.value;
  const grouped = options.reduce(
    (acc, option) => {
      const group = option.group || "default";
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    },
    {} as Record<string, SelectOption[]>,
  );

  return grouped;
});

const hasGroups = computed(() => Object.keys(groupedOptions.value).length > 1 || !groupedOptions.value.default);

const showEmptyState = computed(() => {
  return !isLoading.value && filteredOptions.value.length === 0;
});

const showLoadingState = computed(() => {
  return isLoading.value && props.remote;
});

// Utility functions
const toStringValue = (val: string | number): string => String(val);

const normalizedValue = (modelValue: AcceptableValue) => {
  if (props.multiple) {
    if (!Array.isArray(modelValue)) return [];
    return modelValue.map(toStringValue);
  }
  return modelValue != null ? String(modelValue) : modelValue;
};

// Debounced search function
const debouncedSearch = useDebounceFn(async (query: string) => {
  if (!props.remote || !props.onSearch) return;

  if (query.length < props.minSearchLength) {
    remoteOptions.value = [];
    return;
  }

  try {
    isLoading.value = true;
    const results = await props.onSearch(query);
    remoteOptions.value = results || [];
  } catch (error) {
    console.error("Search error:", error);
    remoteOptions.value = [];
  } finally {
    isLoading.value = false;
  }
}, 300);

// Event handlers
const handleChange = (val: AcceptableValue, onChange: (val: any) => void) => {
  if (props.multiple) {
    const arr = Array.isArray(val) ? val : [];
    const result = props.valueAsNumber ? arr.map(Number) : arr;
    onChange(result.length > 0 ? result : null);
  } else {
    const stringValue = val as string | undefined;
    if (!stringValue) {
      onChange(null);
      return;
    }
    onChange(props.valueAsNumber ? Number(stringValue) : stringValue);
  }
};

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;

  if (props.remote) {
    debouncedSearch(target.value);
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  if (props.remote) {
    remoteOptions.value = [];
  }
};

const handleOpenChange = (open: boolean) => {
  isSelectOpen.value = open;

  if (open) {
    // Focus search input when dropdown opens
    if (props.searchable) {
      nextTick(() => {
        setTimeout(() => {
          searchInputRef.value?.focus();
        }, 10);
      });
    }

    // Load initial data for remote search
    if (props.remote && props.onSearch && remoteOptions.value.length === 0) {
      debouncedSearch("");
    }
  } else {
    // Clear search when dropdown closes
    clearSearch();
  }
};

// Watch for remote prop changes
watch(
  () => props.remote,
  (isRemote) => {
    if (isRemote) {
      remoteOptions.value = [];
    }
    clearSearch();
  },
  { immediate: true },
);
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, meta, errorMessage }">
    <FormItem>
      <FormLabel :custom-for="props.name">
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>

      <FormControl>
        <Select
          :multiple="props.multiple"
          :model-value="normalizedValue(componentField.modelValue)"
          :name="props.name"
          :disabled="props.disabled"
          @update:model-value="(val) => handleChange(val, componentField.onChange)"
          @update:open="handleOpenChange"
        >
          <SelectTrigger
            :id="props.name"
            class="w-full"
            :aria-invalid="!!(!meta.valid && errorMessage)"
            :aria-describedby="props.description ? `${props.name}-description` : undefined"
          >
            <SelectValue :placeholder="props.placeholder" />
          </SelectTrigger>

          <SelectContent>
            <!-- Search Input -->
            <div v-if="props.searchable" class="mb-2 flex items-center border-b px-3 pb-2" @click.stop>
              <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                :placeholder="props.searchPlaceholder"
                tabindex="0"
                class="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                @input="handleSearchInput"
                @keydown.escape="clearSearch"
                @keydown.stop
                @keypress.stop
                @keyup.stop
                @click.stop
              />
              <Button
                v-if="searchQuery"
                variant="ghost"
                size="sm"
                class="h-auto p-1 hover:bg-transparent"
                @click.stop="clearSearch"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>

            <!-- Loading State -->
            <div v-if="showLoadingState" class="flex items-center justify-center py-6">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              <span class="text-muted-foreground text-sm">{{ props.loadingText }}</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="showEmptyState" class="flex items-center justify-center py-6">
              <span class="text-muted-foreground text-sm">{{ props.emptyText }}</span>
            </div>

            <!-- Options -->
            <template v-else>
              <!-- Empty option if provided -->
              <SelectGroup v-if="props.emptyOption && !searchQuery">
                <SelectItem value="">
                  {{ props.emptyOption }}
                </SelectItem>
              </SelectGroup>

              <!-- Grouped options -->
              <template v-if="hasGroups">
                <SelectGroup v-for="(groupOptions, groupName) in groupedOptions" :key="groupName">
                  <SelectItem
                    v-for="opt in groupOptions"
                    :key="toStringValue(opt.value)"
                    :value="toStringValue(opt.value)"
                    :disabled="opt.disabled"
                  >
                    {{ opt.label }}
                  </SelectItem>
                </SelectGroup>
              </template>

              <!-- Ungrouped options -->
              <SelectGroup v-else>
                <SelectItem
                  v-for="opt in filteredOptions"
                  :key="toStringValue(opt.value)"
                  :value="toStringValue(opt.value)"
                  :disabled="opt.disabled"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectGroup>
            </template>
          </SelectContent>
        </Select>
      </FormControl>

      <FormDescription v-if="props.description">
        {{ props.description }}
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped>
[data-slot="select-trigger"] span[data-slot="select-value"][data-placeholder] {
  color: oklch(0.1884 0.0128 248.5103) !important;
}

.dark [data-slot="select-trigger"] span[data-slot="select-value"][data-placeholder] {
  color: oklch(0.5637 0.0078 247.9662) !important;
}
</style>
