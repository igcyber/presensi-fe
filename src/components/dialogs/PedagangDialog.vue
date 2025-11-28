<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputDate from "@/components/forms/BaseInputDate.vue";
import BaseSelect, { type SelectOption } from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createPedagang, updatePedagang } from "@/lib/api/services/pedagang";
import { getJenisUsahas } from "@/lib/api/services/usaha";
import type { Pedagang } from "@/lib/api/types/pedagang.types";
import { createPedagangSchema, updatePedagangSchema } from "@/schemas/pedagangSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  pedagang?: Pedagang | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { pedagang: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? {
        nama: "",
        usahaId: null,
        nik: "",
        noKk: "",
        tempatLahir: "",
        tanggalLahir: "",
        alamat: "",
      }
    : {
        nama: props.pedagang?.nama ?? "",
        usahaId: props.pedagang?.usahaId ?? null,
        nik: props.pedagang?.nik ?? "",
        noKk: props.pedagang?.noKk ?? "",
        tempatLahir: props.pedagang?.tempatLahir ?? "",
        tanggalLahir: props.pedagang?.tanggalLahir ?? "",
        alamat: props.pedagang?.alamat ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createPedagangSchema : updatePedagangSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Initial options for edit mode
const initialJenisUsahaOptions = computed<SelectOption[]>(() => {
  if (props.mode === "edit" && props.pedagang?.jenisUsaha) {
    return [
      {
        label: props.pedagang.jenisUsaha.nama,
        value: props.pedagang.jenisUsaha.id,
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

// Store selected value to maintain display
const selectedJenisUsaha = ref<SelectOption | null>(null);

// Load initial data when dialog opens for edit mode
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      if (props.mode === "edit" && props.pedagang) {
        // Load jenis usaha if exists
        if (props.pedagang.usahaId && props.pedagang.jenisUsaha) {
          selectedJenisUsaha.value = {
            label: props.pedagang.jenisUsaha.nama,
            value: props.pedagang.jenisUsaha.id,
          };
        }
      } else if (props.mode === "create") {
        // Clear selected value for create mode
        selectedJenisUsaha.value = null;
      }
    } else if (!isOpen) {
      // Clear selected value when dialog closes
      selectedJenisUsaha.value = null;
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

// Enhanced search function that includes selected values
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

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPedagang(values);
    toast.success("Berhasil", { description: "Pedagang berhasil ditambahkan" });
  } else if (props.pedagang) {
    await updatePedagang(props.pedagang.id, values);
    toast.success("Berhasil", { description: "Pedagang berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Pedagang"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama" placeholder="Masukkan nama pedagang" required />

      <BaseSelect
        name="usahaId"
        label="Jenis Usaha"
        placeholder="Pilih jenis usaha (opsional)"
        :options="jenisUsahaOptions"
        remote
        searchable
        :on-search="searchJenisUsaha"
        search-placeholder="Cari jenis usaha..."
        loading-text="Mencari jenis usaha..."
        empty-text="Tidak ada jenis usaha ditemukan"
        :value-as-number="true"
        :min-search-length="0"
        @update:model-value="
          (val: string | number | (string | number)[] | null) =>
            updateSelectedJenisUsaha(Array.isArray(val) ? null : (val as number | null))
        "
      />

      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <BaseInput
          name="nik"
          label="NIK"
          placeholder="Masukkan NIK (16 digit)"
          type="text"
          maxlength="16"
          pattern="^\d+$"
          required
          description="NIK harus 16 digit angka"
        />

        <BaseInput
          name="noKk"
          label="No. KK"
          placeholder="Masukkan No. KK (16 digit)"
          type="text"
          maxlength="16"
          pattern="^\d+$"
          required
          description="No. KK harus 16 digit angka"
        />
      </div>

      <BaseInput name="tempatLahir" label="Tempat Lahir" placeholder="Masukkan tempat lahir" required />

      <div class="mt-3">
        <BaseInputDate name="tanggalLahir" label="Tanggal Lahir" placeholder="Pilih tanggal lahir" required />
      </div>

      <BaseTextarea name="alamat" label="Alamat" placeholder="Masukkan alamat lengkap" :rows="3" required />
    </div>
  </BaseFormDialog>
</template>
