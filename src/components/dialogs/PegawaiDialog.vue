<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import type { SelectOption } from "@/components/forms/BaseSelect.vue";

import { createPegawai, getPegawaiById, updatePegawai } from "@/lib/api/services/pegawai";
import type { Pegawai } from "@/lib/api/types/pegawai.types";
import { createPegawaiSchema, updatePegawaiSchema } from "@/schemas/pegawaiSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  pegawai?: Pegawai | null;
  tipePegawaiOptions?: SelectOption[];
  kantorOptions?: SelectOption[];
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  pegawai: null,
  tipePegawaiOptions: () => [],
  kantorOptions: () => [],
});

const emit = defineEmits<Emits>();

const checkRadiusOptions: SelectOption[] = [
  { label: "YA", value: "YA" },
  { label: "TIDAK", value: "TIDAK" },
];

const pegawaiDetail = ref<Pegawai | null>(null);
const isLoadingDetail = ref(false);

// Fetch detail pegawai when in edit mode
watch(
  () => [props.open, props.pegawai?.id],
  async ([isOpen, pegawaiId]) => {
    if (isOpen && props.mode === "edit" && pegawaiId && typeof pegawaiId === "number" && !pegawaiDetail.value) {
      try {
        isLoadingDetail.value = true;
        const response = await getPegawaiById(pegawaiId);
        pegawaiDetail.value = response.data;
      } catch (error) {
        console.error("Failed to load pegawai detail:", error);
      } finally {
        isLoadingDetail.value = false;
      }
    } else if (!isOpen) {
      // Reset when dialog closes
      pegawaiDetail.value = null;
    }
  },
  { immediate: true },
);

const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      tipe_pegawai_id: undefined as number | undefined,
      kantor_id: undefined as number | undefined,
      nama: "",
      check_radius: "TIDAK" as "YA" | "TIDAK",
      lat: "",
      long: "",
      no_hp: "",
      email: "",
      username: "",
      password: "",
      password_confirmation: "",
    };
  } else {
    // Use pegawaiDetail if available, otherwise fallback to props.pegawai
    const data = pegawaiDetail.value || props.pegawai;
    return {
      tipe_pegawai_id: data?.tipePegawaiId,
      kantor_id: data?.kantorId,
      nama: data?.nama ?? "",
      check_radius: data?.checkRadius ?? "TIDAK",
      lat: data?.lat ?? "",
      long: data?.long ?? "",
      no_hp: data?.user?.noHp ?? "",
      email: data?.user?.email ?? "",
      username: data?.user?.username ?? "",
    };
  }
});

const schema = computed(() => (props.mode === "create" ? createPegawaiSchema : updatePegawaiSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    // Pastikan tipe_pegawai_id dan kantor_id sebagai number
    // Pastikan check_radius sebagai string
    const tipePegawaiId = typeof values.tipe_pegawai_id === "string" ? parseInt(values.tipe_pegawai_id, 10) : Number(values.tipe_pegawai_id);
    const kantorId = typeof values.kantor_id === "string" ? parseInt(values.kantor_id, 10) : Number(values.kantor_id);

    if (isNaN(tipePegawaiId) || isNaN(kantorId)) {
      toast.error("Error", { description: "Tipe pegawai dan kantor harus dipilih" });
      return;
    }

    const payload: any = {
      tipe_pegawai_id: tipePegawaiId,
      kantor_id: kantorId,
      nama: values.nama,
      check_radius: String(values.check_radius),
      lat: values.lat,
      long: values.long,
      no_hp: values.no_hp,
      email: values.email,
      username: values.username,
      password: values.password,
      password_confirmation: values.password_confirmation,
    };

    await createPegawai(payload);
    toast.success("Berhasil", { description: "Pegawai berhasil ditambahkan" });
  } else if (props.pegawai) {
    // Untuk update, hanya kirim field yang diisi atau diubah
    // Pastikan format yang benar dan tidak ada field yang tidak perlu
    const payload: any = {};

    // Get original data untuk comparison
    const originalData = pegawaiDetail.value || props.pegawai;

    // tipe_pegawai_id - hanya kirim jika ada dan berbeda dari original
    if (values.tipe_pegawai_id !== undefined && values.tipe_pegawai_id !== null && values.tipe_pegawai_id !== "") {
      const tipeId = typeof values.tipe_pegawai_id === "string" ? parseInt(values.tipe_pegawai_id, 10) : Number(values.tipe_pegawai_id);
      if (!isNaN(tipeId) && tipeId > 0 && tipeId !== Number(originalData?.tipePegawaiId || 0)) {
        payload.tipe_pegawai_id = tipeId;
      }
    }

    // kantor_id - hanya kirim jika ada dan berbeda dari original
    if (values.kantor_id !== undefined && values.kantor_id !== null && values.kantor_id !== "") {
      const kantorId = typeof values.kantor_id === "string" ? parseInt(values.kantor_id, 10) : Number(values.kantor_id);
      if (!isNaN(kantorId) && kantorId > 0 && kantorId !== Number(originalData?.kantorId || 0)) {
        payload.kantor_id = kantorId;
      }
    }

    // nama - hanya kirim jika ada dan berbeda
    if (values.nama !== undefined && values.nama !== null && values.nama.trim() !== "") {
      const trimmedNama = values.nama.trim();
      if (trimmedNama !== (originalData?.nama || "")) {
        payload.nama = trimmedNama;
      }
    }

    // check_radius - hanya kirim jika ada dan berbeda, pastikan format string
    if (values.check_radius !== undefined && values.check_radius !== null && values.check_radius !== "") {
      const checkRadius = String(values.check_radius);
      if (checkRadius === "YA" || checkRadius === "TIDAK") {
        if (checkRadius !== (originalData?.checkRadius || "")) {
          payload.check_radius = checkRadius;
        }
      }
    }

    // lat - hanya kirim jika ada dan berbeda
    if (values.lat !== undefined && values.lat !== null && values.lat.trim() !== "") {
      const trimmedLat = values.lat.trim();
      if (trimmedLat !== (originalData?.lat || "")) {
        payload.lat = trimmedLat;
      }
    }

    // long - hanya kirim jika ada dan berbeda
    if (values.long !== undefined && values.long !== null && values.long.trim() !== "") {
      const trimmedLong = values.long.trim();
      if (trimmedLong !== (originalData?.long || "")) {
        payload.long = trimmedLong;
      }
    }

    // no_hp - hanya kirim jika ada dan berbeda
    if (values.no_hp !== undefined && values.no_hp !== null && values.no_hp.trim() !== "") {
      const trimmedNoHp = values.no_hp.trim();
      const originalNoHp = originalData?.user?.noHp || "";
      if (trimmedNoHp !== originalNoHp) {
        payload.no_hp = trimmedNoHp;
      }
    }

    // email - hanya kirim jika ada dan berbeda
    if (values.email !== undefined && values.email !== null && values.email.trim() !== "") {
      const trimmedEmail = values.email.trim();
      const originalEmail = originalData?.user?.email || "";
      if (trimmedEmail !== originalEmail) {
        payload.email = trimmedEmail;
      }
    }

    // username - hanya kirim jika ada dan berbeda
    if (values.username !== undefined && values.username !== null && values.username.trim() !== "") {
      const trimmedUsername = values.username.trim();
      const originalUsername = originalData?.user?.username || "";
      if (trimmedUsername !== originalUsername) {
        payload.username = trimmedUsername;
      }
    }

    // Pastikan tidak ada field id yang terkirim
    delete payload.id;
    delete (payload as any).userId;

    await updatePegawai(props.pegawai.id, payload);
    toast.success("Berhasil", { description: "Pegawai berhasil diperbarui" });
    // Reset detail setelah update berhasil
    pegawaiDetail.value = null;
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Pegawai"
    :schema="schema"
    :initial-values="initialValues"
    :on-submit="onSubmit"
    @success="() => emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama" placeholder="Masukkan nama" :required="mode === 'create'" />

      <BaseSelect
        name="tipe_pegawai_id"
        label="Tipe Pegawai"
        :options="tipePegawaiOptions"
        placeholder="Pilih tipe pegawai"
        :required="mode === 'create'"
        :value-as-number="true"
      />

      <BaseSelect
        name="kantor_id"
        label="Kantor"
        :options="kantorOptions"
        placeholder="Pilih kantor"
        :required="mode === 'create'"
        :value-as-number="true"
      />

      <BaseSelect
        name="check_radius"
        label="Check Radius"
        :options="checkRadiusOptions"
        placeholder="Pilih check radius"
        :required="mode === 'create'"
      />

      <div class="grid grid-cols-2 gap-3">
        <BaseInput name="lat" label="Latitude" placeholder="Masukkan latitude" :required="mode === 'create'" />
        <BaseInput name="long" label="Longitude" placeholder="Masukkan longitude" :required="mode === 'create'" />
      </div>

      <BaseInput name="no_hp" label="Nomor HP" placeholder="Masukkan nomor HP" :required="mode === 'create'" />
      <BaseInput name="email" label="Email" type="email" placeholder="Masukkan email" :required="mode === 'create'" />
      <BaseInput name="username" label="Username" placeholder="Masukkan username" :required="mode === 'create'" />

      <template v-if="mode === 'create'">
        <BaseInput name="password" label="Password" type="password" placeholder="Masukkan password" required />
        <BaseInput
          name="password_confirmation"
          label="Konfirmasi Password"
          type="password"
          placeholder="Masukkan konfirmasi password"
          required
        />
      </template>
    </div>
  </BaseFormDialog>
</template>

