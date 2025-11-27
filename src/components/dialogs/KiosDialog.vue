<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect, { type SelectOption } from "@/components/forms/BaseSelect.vue";

import { createKios, updateKios } from "@/lib/api/services/kios";
import { getPasars } from "@/lib/api/services/pasar";
import { getJenisUsahas } from "@/lib/api/services/usaha";
import type { Kios } from "@/lib/api/types/kios.types";
import { createKiosSchema, updateKiosSchema } from "@/schemas/kiosSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  kios?: Kios | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { kios: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? {
        kode: "",
        jenisUsahaId: null,
        pasarId: null,
      }
    : {
        kode: props.kios?.kode ?? "",
        jenisUsahaId: props.kios?.jenisUsahaId ?? null,
        pasarId: props.kios?.pasarId ?? null,
      },
);

const schema = computed(() => (props.mode === "create" ? createKiosSchema : updateKiosSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Initial options for edit mode
const initialJenisUsahaOptions = computed<SelectOption[]>(() => {
  if (props.mode === "edit" && props.kios?.jenisUsaha) {
    return [
      {
        label: props.kios.jenisUsaha.nama,
        value: props.kios.jenisUsaha.id,
      },
    ];
  }
  return [];
});

const initialPasarOptions = computed<SelectOption[]>(() => {
  if (props.mode === "edit" && props.kios?.pasar) {
    return [
      {
        label: props.kios.pasar.nama,
        value: props.kios.pasar.id,
      },
    ];
  }
  return [];
});

// Computed options that always include selected value for display
const jenisUsahaOptions = computed<SelectOption[]>(() => {
  if (selectedJenisUsaha.value) {
    return [selectedJenisUsaha.value];
  }
  return initialJenisUsahaOptions.value;
});

const pasarOptions = computed<SelectOption[]>(() => {
  if (selectedPasar.value) {
    return [selectedPasar.value];
  }
  return initialPasarOptions.value;
});

// Store selected values to maintain display
const selectedJenisUsaha = ref<SelectOption | null>(null);
const selectedPasar = ref<SelectOption | null>(null);

// Load initial data when dialog opens for edit mode
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      if (props.mode === "edit" && props.kios) {
        // Load jenis usaha if exists
        if (props.kios.jenisUsahaId && props.kios.jenisUsaha) {
          selectedJenisUsaha.value = {
            label: props.kios.jenisUsaha.nama,
            value: props.kios.jenisUsaha.id,
          };
        }

        // Load pasar if exists
        if (props.kios.pasarId && props.kios.pasar) {
          selectedPasar.value = {
            label: props.kios.pasar.nama,
            value: props.kios.pasar.id,
          };
        }
      } else if (props.mode === "create") {
        // Clear selected values for create mode
        selectedJenisUsaha.value = null;
        selectedPasar.value = null;
      }
    } else if (!isOpen) {
      // Clear selected values when dialog closes
      selectedJenisUsaha.value = null;
      selectedPasar.value = null;
    }
  },
  { immediate: true },
);

// Helper function to update selected value from search results
const updateSelectedJenisUsaha = async (value: number | null) => {
  if (!value) {
    selectedJenisUsaha.value = null;
    return;
  }

  // Fetch the item by ID to get the label
  try {
    const response = await getJenisUsahas({ page: 1, perPage: 100 });
    const item = response.data.data.find((item: any) => item.id === value);
    if (item) {
      selectedJenisUsaha.value = {
        label: item.nama,
        value: item.id,
      };
    }
  } catch (error) {
    console.error("Error fetching jenis usaha:", error);
  }
};

const updateSelectedPasar = async (value: number | null) => {
  if (!value) {
    selectedPasar.value = null;
    return;
  }

  // Fetch the item by ID to get the label
  try {
    const response = await getPasars({ page: 1, perPage: 100 });
    const item = response.data.data.find((item: any) => item.id === value);
    if (item) {
      selectedPasar.value = {
        label: item.nama,
        value: item.id,
      };
    }
  } catch (error) {
    console.error("Error fetching pasar:", error);
  }
};

// Enhanced search functions that include selected values
const searchJenisUsaha = async (query: string): Promise<SelectOption[]> => {
  try {
    // If query is empty and we have a selected value, load it first
    if (!query && selectedJenisUsaha.value) {
      return [selectedJenisUsaha.value];
    }

    const response = await getJenisUsahas({
      page: 1,
      perPage: 10,
      search: query || undefined,
    });

    const results = response.data.data.map((item) => ({
      label: item.nama,
      value: item.id as number,
    }));

    // Always include selected value if exists and not already in results
    if (selectedJenisUsaha.value) {
      const exists = results.some((r) => r.value === selectedJenisUsaha.value!.value);
      if (!exists) {
        results.unshift({
          label: selectedJenisUsaha.value.label,
          value: selectedJenisUsaha.value.value as number,
        });
      }
    } else if (initialJenisUsahaOptions.value.length > 0) {
      const initialOption = initialJenisUsahaOptions.value[0];
      const exists = results.some((r) => r.value === initialOption.value);
      if (!exists) {
        results.unshift({
          label: initialOption.label,
          value: initialOption.value as number,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error searching jenis usaha:", error);
    // Return selected or initial options if search fails
    return selectedJenisUsaha.value ? [selectedJenisUsaha.value] : initialJenisUsahaOptions.value;
  }
};

const searchPasar = async (query: string): Promise<SelectOption[]> => {
  try {
    // If query is empty and we have a selected value, load it first
    if (!query && selectedPasar.value) {
      return [selectedPasar.value];
    }

    const response = await getPasars({
      page: 1,
      perPage: 10,
      search: query || undefined,
    });

    const results = response.data.data.map((item) => ({
      label: item.nama,
      value: item.id as number,
    }));

    // Always include selected value if exists and not already in results
    if (selectedPasar.value) {
      const exists = results.some((r) => r.value === selectedPasar.value!.value);
      if (!exists) {
        results.unshift({
          label: selectedPasar.value.label,
          value: selectedPasar.value.value as number,
        });
      }
    } else if (initialPasarOptions.value.length > 0) {
      const initialOption = initialPasarOptions.value[0];
      const exists = results.some((r) => r.value === initialOption.value);
      if (!exists) {
        results.unshift({
          label: initialOption.label,
          value: initialOption.value as number,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error searching pasar:", error);
    // Return selected or initial options if search fails
    return selectedPasar.value ? [selectedPasar.value] : initialPasarOptions.value;
  }
};

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createKios(values);
    toast.success("Berhasil", { description: "Kios berhasil ditambahkan" });
  } else if (props.kios) {
    await updateKios(props.kios.id, values);
    toast.success("Berhasil", { description: "Kios berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Kios"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="kode" label="Kode" placeholder="Masukkan kode kios" required />

      <BaseSelect
        name="jenisUsahaId"
        label="Jenis Usaha"
        placeholder="Pilih jenis usaha"
        :options="jenisUsahaOptions"
        remote
        searchable
        :on-search="searchJenisUsaha"
        search-placeholder="Cari jenis usaha..."
        loading-text="Mencari jenis usaha..."
        empty-text="Jenis usaha tidak ditemukan"
        :value-as-number="true"
        :min-search-length="0"
        required
        @update:model-value="
          (val: string | number | (string | number)[] | null) =>
            updateSelectedJenisUsaha(Array.isArray(val) ? null : (val as number | null))
        "
      />

      <BaseSelect
        name="pasarId"
        label="Pasar"
        placeholder="Pilih pasar"
        :options="pasarOptions"
        remote
        searchable
        :on-search="searchPasar"
        search-placeholder="Cari pasar..."
        loading-text="Mencari pasar..."
        empty-text="Pasar tidak ditemukan"
        :value-as-number="true"
        :min-search-length="0"
        required
        @update:model-value="
          (val: string | number | (string | number)[] | null) =>
            updateSelectedPasar(Array.isArray(val) ? null : (val as number | null))
        "
      />
    </div>
  </BaseFormDialog>
</template>
