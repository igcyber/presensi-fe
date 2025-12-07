<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import MapPicker from "@/components/forms/MapPicker.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createKantor, updateKantor } from "@/lib/api/services/kantor";
import type { Kantor } from "@/lib/api/types/kantor.types";
import { createKantorSchema, updateKantorSchema } from "@/schemas/kantorSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  kantor?: Kantor | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { kantor: null });
const emit = defineEmits<Emits>();

const formatTime = (time: string | undefined): string => {
  if (!time) return "";
  if (time.includes(":")) {
    const parts = time.split(":");
    return `${parts[0]}:${parts[1]}`;
  }
  return time;
};

const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      nama: "",
      alamat: "",
      lat: "",
      long: "",
      deskripsi: "",
      radius_limit: 100,
      jam_masuk: "07:30",
      jam_pulang: "16:30",
    };
  }

  return {
    nama: props.kantor?.nama ?? "",
    alamat: props.kantor?.alamat ?? "",
    lat: props.kantor?.lat ?? "",
    long: props.kantor?.long ?? "",
    deskripsi: props.kantor?.deskripsi ?? "",
    radius_limit: (props.kantor as any)?.radiusLimit ?? (props.kantor as any)?.radius_limit ?? 100,
    jam_masuk: formatTime((props.kantor as any)?.jamMasuk ?? (props.kantor as any)?.jam_masuk),
    jam_pulang: formatTime((props.kantor as any)?.jamPulang ?? (props.kantor as any)?.jam_pulang),
  };
});

const schema = computed(() => (props.mode === "create" ? createKantorSchema : updateKantorSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

const formatTimeForApi = (time: string | undefined): string => {
  if (!time) return "";

  const trimmed = time.trim();
  if (!trimmed) return "";

  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").filter(p => p !== "");

    if (parts.length >= 2) {
      const hours = parts[0].padStart(2, "0");
      const minutes = parts[1].padStart(2, "0");
      return `${hours}:${minutes}:00`;
    }

    return trimmed;
  }

  return trimmed;
};

async function onSubmit(values: any) {
  const payload = { ...values };

  if (payload.jam_masuk && payload.jam_masuk.trim()) {
    payload.jam_masuk = formatTimeForApi(payload.jam_masuk);
  }
  if (payload.jam_pulang && payload.jam_pulang.trim()) {
    payload.jam_pulang = formatTimeForApi(payload.jam_pulang);
  }

  if (props.mode === "create") {
    await createKantor(payload);
    toast.success("Berhasil", { description: "Kantor berhasil ditambahkan" });
  } else if (props.kantor) {
    const updatePayload: Record<string, any> = {};

    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null && value !== "") {
        updatePayload[key] = value;
      }
    });

    await updateKantor(props.kantor.id, updatePayload);
    toast.success("Berhasil", { description: "Kantor berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Kantor"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    width-class="sm:max-w-[800px]"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Kantor" placeholder="Sample" required />

      <BaseTextarea name="alamat" label="Alamat" placeholder="Jl. Sample No. X RT. 01 RW. 00" :rows="3" />

      <MapPicker
        lat-name="lat"
        long-name="long"
        label=""
        :required="mode === 'create'"
        :disabled="mode === 'view'"
        description="Klik pada peta untuk menentukan lokasi atau isi koordinat secara manual"
        :default-center="[-0.4191422207962125, 117.16900524248992]"
        :default-zoom="16"
      />

      <BaseTextarea name="deskripsi" label="Deskripsi" placeholder="Kantor" :rows="3" />

      <BaseInput
        name="radius_limit"
        type="number"
        label="Radius Limit (meter)"
        placeholder="100"
        :min="1"
        :max="10000"
        required
        description="Batas radius untuk presensi dalam meter"
      />

      <div class="grid grid-cols-2 gap-3">
        <BaseInput
          name="jam_masuk"
          label="Jam Masuk"
          placeholder="07:30"
          required
          description="Format: HH:mm (contoh: 07:30)"
        />
        <BaseInput
          name="jam_pulang"
          label="Jam Pulang"
          placeholder="16:30"
          required
          description="Format: HH:mm (contoh: 16:30)"
        />
      </div>
    </div>
  </BaseFormDialog>
</template>

