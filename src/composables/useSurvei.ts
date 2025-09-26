import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import { getKuesionerSurvei, getLayananSurvei, submitSurveiKepuasan } from "@/lib/api/services/survei";
import type {
  CooldownStatus,
  DataResponden,
  JawabanSurvei,
  Kuesioner,
  LayananSurvei,
  SubmitSurveiRequest,
} from "@/lib/api/types/survei.types";
import { type SubmitSurveiFormData, submitSurveiSchema } from "@/schemas/surveiSchema";

// Constants
const COOLDOWN_DURATION = 30 * 60 * 1000; // 30 menit dalam milliseconds
const COOLDOWN_STORAGE_KEY = "survei_cooldown_until";

export function useSurvei() {
  // State
  const layananList = ref<LayananSurvei[]>([]);
  const kuesionerList = ref<Kuesioner[]>([]);
  const selectedLayanan = ref<LayananSurvei | null>(null);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);

  // Form data
  const respondenData = ref<DataResponden>({
    nama: "",
    hp: "",
    jenis_kelamin: "L",
    usia: 0,
    pendidikan: "",
    pekerjaan: "",
  });

  const jawabanSurvei = ref<JawabanSurvei[]>([]);
  const masukkan = ref("");

  // Cooldown state
  const cooldownStatus = ref<CooldownStatus>({
    isOnCooldown: false,
    remainingTime: 0,
  });

  // Cooldown timer
  let cooldownInterval: ReturnType<typeof setInterval> | null = null;

  // Computed
  const cooldownTimeFormatted = computed(() => {
    const minutes = Math.floor(cooldownStatus.value.remainingTime / 60);
    const seconds = cooldownStatus.value.remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  // Validation methods
  const validateSubmitData = (): { isValid: boolean; errors: string[] } => {
    if (!selectedLayanan.value) {
      return { isValid: false, errors: ["Layanan harus dipilih"] };
    }

    try {
      const submitData: SubmitSurveiFormData = {
        pelayanan_id: selectedLayanan.value.id,
        responden: respondenData.value,
        survei: jawabanSurvei.value.map((j) => ({
          pertanyaan_id: parseInt(j.pertanyaan_id.toString()),
          jawaban_id: parseInt(j.jawaban_id.toString()),
        })),
        masukkan: masukkan.value.trim() || undefined,
      };

      submitSurveiSchema.parse(submitData);
      return { isValid: true, errors: [] };
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => err.message) || ["Data survei tidak valid"];
      return { isValid: false, errors };
    }
  };

  // API methods
  const fetchLayananList = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await getLayananSurvei();
      layananList.value = response.data.data;
    } catch (err) {
      console.error("Error fetching layanan list:", err);
      error.value = "Gagal memuat daftar layanan";
      toast.error("Gagal memuat daftar layanan");
    } finally {
      isLoading.value = false;
    }
  };

  const fetchKuesionerList = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await getKuesionerSurvei();
      kuesionerList.value = response.data.data;

      // Initialize jawaban array
      jawabanSurvei.value = kuesionerList.value.map((kuesioner) => ({
        pertanyaan_id: kuesioner.id,
        jawaban_id: 0,
      }));
    } catch (err) {
      console.error("Error fetching kuesioner list:", err);
      error.value = "Gagal memuat daftar kuesioner";
      toast.error("Gagal memuat daftar kuesioner");
    } finally {
      isLoading.value = false;
    }
  };

  const submitSurvei = async () => {
    // Validasi data sebelum submit
    const validation = validateSubmitData();
    if (!validation.isValid) {
      toast.error("Data tidak valid", {
        description: validation.errors.join(", "),
      });
      return;
    }

    try {
      isSubmitting.value = true;

      const payload: SubmitSurveiRequest = {
        pelayanan_id: selectedLayanan.value!.id,
        responden: respondenData.value,
        survei: jawabanSurvei.value,
        masukkan: masukkan.value.trim() || undefined,
      };

      const response = await submitSurveiKepuasan(payload);

      if (response.success) {
        toast.success("Terima kasih!", {
          description: "Survei kepuasan Anda telah berhasil disubmit",
        });

        // Set cooldown
        const cooldownUntil = new Date(Date.now() + COOLDOWN_DURATION).toISOString();
        localStorage.setItem(COOLDOWN_STORAGE_KEY, cooldownUntil);

        cooldownStatus.value = {
          isOnCooldown: true,
          remainingTime: COOLDOWN_DURATION / 1000,
          cooldownUntil,
        };

        // Reset form
        resetForm();
      } else {
        throw new Error(response.message || "Gagal submit survei");
      }
    } catch (err) {
      console.error("Error submitting survei:", err);
      toast.error("Gagal submit survei", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat submit survei",
      });
    } finally {
      isSubmitting.value = false;
    }
  };

  // Cooldown methods
  const checkCooldownStatus = () => {
    // Check localStorage for existing cooldown
    const storedCooldown = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (storedCooldown) {
      const cooldownUntilTime = new Date(storedCooldown).getTime();
      const now = Date.now();
      const remainingTime = Math.max(0, Math.floor((cooldownUntilTime - now) / 1000));

      cooldownStatus.value = {
        isOnCooldown: remainingTime > 0,
        remainingTime,
        cooldownUntil: storedCooldown,
      };

      // Clean up expired cooldown
      if (remainingTime <= 0) {
        localStorage.removeItem(COOLDOWN_STORAGE_KEY);
        cooldownStatus.value = {
          isOnCooldown: false,
          remainingTime: 0,
        };
      }
    } else {
      cooldownStatus.value = {
        isOnCooldown: false,
        remainingTime: 0,
      };
    }
  };

  const startCooldownTimer = () => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }

    cooldownInterval = setInterval(() => {
      if (cooldownStatus.value.isOnCooldown && cooldownStatus.value.remainingTime > 0) {
        cooldownStatus.value.remainingTime--;
      } else {
        cooldownStatus.value.isOnCooldown = false;
        cooldownStatus.value.remainingTime = 0;
        localStorage.removeItem(COOLDOWN_STORAGE_KEY);
        if (cooldownInterval) {
          clearInterval(cooldownInterval);
          cooldownInterval = null;
        }
      }
    }, 1000);
  };

  const stopCooldownTimer = () => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
  };

  // Form methods
  const resetForm = () => {
    respondenData.value = {
      nama: "",
      hp: "",
      jenis_kelamin: "L",
      usia: 0,
      pendidikan: "",
      pekerjaan: "",
    };
    jawabanSurvei.value = kuesionerList.value.map((kuesioner) => ({
      pertanyaan_id: kuesioner.id,
      jawaban_id: 0,
    }));
    masukkan.value = "";
  };

  const updateJawaban = (pertanyaanId: number, jawabanId: number) => {
    const index = jawabanSurvei.value.findIndex((j) => j.pertanyaan_id === pertanyaanId);
    if (index !== -1) {
      jawabanSurvei.value[index].jawaban_id = jawabanId as number;
    }
  };

  const getJawabanForPertanyaan = (pertanyaanId: number) => {
    const jawaban = jawabanSurvei.value.find((j) => j.pertanyaan_id === pertanyaanId);
    return jawaban?.jawaban_id || 0;
  };

  // Watchers
  watch(
    () => cooldownStatus.value.isOnCooldown,
    (isOnCooldown) => {
      if (isOnCooldown) {
        startCooldownTimer();
      } else {
        stopCooldownTimer();
      }
    },
    { immediate: true },
  );

  return {
    // State
    layananList,
    kuesionerList,
    selectedLayanan,
    isLoading,
    isSubmitting,
    error,
    respondenData,
    jawabanSurvei,
    masukkan,
    cooldownStatus,

    // Computed
    cooldownTimeFormatted,

    // Methods
    fetchLayananList,
    fetchKuesionerList,
    checkCooldownStatus,
    submitSurvei,
    resetForm,
    updateJawaban,
    getJawabanForPertanyaan,
    validateSubmitData,
  };
}
