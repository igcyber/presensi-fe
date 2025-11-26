<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";
import BaseSelect, { type SelectOption } from "@/components/forms/BaseSelect.vue";

import { getKioses } from "@/lib/api/services/kios";
import { createPedagangKios } from "@/lib/api/services/pedagang";
import { createPedagangKiosSchema } from "@/schemas/pedagangKiosSchema";

// Interface definitions
interface Props {
  open: boolean;
  pedagangId: number;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

// Props
const props = defineProps<Props>();

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() => ({
  kiosId: null,
  isActive: false,
}));

const schema = computed(() => createPedagangKiosSchema);

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Store selected value to maintain display
const selectedKios = ref<SelectOption | null>(null);

// Initial options
const kiosOptions = computed<SelectOption[]>(() => {
  if (selectedKios.value) {
    return [selectedKios.value];
  }
  return [];
});

// Helper function to update selected value from search results
const updateSelectedKios = async (value: number | null) => {
  if (!value) {
    selectedKios.value = null;
    return;
  }

  // Fetch the item by ID to get the label
  try {
    const response = await getKioses({ page: 1, perPage: 100 });
    const item = response.data.data.find((item: any) => item.id === value);
    if (item) {
      selectedKios.value = {
        label: `${item.kode}${item.jenisUsaha ? ` - ${item.jenisUsaha.nama}` : ""}${item.pasar ? ` (${item.pasar.nama})` : ""}`,
        value: item.id,
      };
    }
  } catch (error) {
    console.error("Error fetching kios:", error);
  }
};

// Enhanced search function that includes selected values
const searchKios = async (query: string): Promise<SelectOption[]> => {
  try {
    // If query is empty and we have a selected value, load it first
    if (!query && selectedKios.value) {
      return [selectedKios.value];
    }

    const response = await getKioses({
      page: 1,
      perPage: 10,
      search: query || undefined,
    });

    const results = response.data.data.map((item: any) => ({
      label: `${item.kode}${item.jenisUsaha ? ` - ${item.jenisUsaha.nama}` : ""}${item.pasar ? ` (${item.pasar.nama})` : ""}`,
      value: item.id as number,
    }));

    // Always include selected value if exists and not already in results
    if (selectedKios.value) {
      const exists = results.some((r) => r.value === selectedKios.value!.value);
      if (!exists) {
        results.unshift({
          label: selectedKios.value.label,
          value: selectedKios.value.value as number,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error searching kios:", error);
    // Return selected options if search fails
    return selectedKios.value ? [selectedKios.value] : [];
  }
};

// Methods
async function onSubmit(values: any) {
  await createPedagangKios(props.pedagangId, values);
  toast.success("Berhasil", { description: "Kios berhasil ditetapkan ke pedagang" });
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      // Clear selected values when dialog closes
      selectedKios.value = null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    mode="create"
    resource-name="Penetapan Kios"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseSelect
        name="kiosId"
        label="Kios"
        placeholder="Pilih kios"
        :options="kiosOptions"
        remote
        searchable
        :on-search="searchKios"
        search-placeholder="Cari kios..."
        loading-text="Mencari kios..."
        empty-text="Kios tidak ditemukan"
        :value-as-number="true"
        :min-search-length="0"
        required
        @update:model-value="(val: string | number | (string | number)[] | null) => updateSelectedKios(Array.isArray(val) ? null : (val as number | null))"
      />

      <BaseCheckbox
        name="isActive"
        label="Aktif"
        description="Centang untuk mengaktifkan penetapan kios ini"
      />
    </div>
  </BaseFormDialog>
</template>

