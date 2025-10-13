<script setup lang="ts">
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-vue-next";
import { computed, ref, watch } from "vue";

import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseRadio from "@/components/forms/BaseRadio.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";
import { Button } from "@/components/ui/button";

import { useSurvei } from "@/composables/useSurvei";
import type { Kuesioner, LayananSurvei } from "@/lib/api/types/survei.types";
import { JENIS_KELAMIN_OPTIONS, PENDIDIKAN_OPTIONS } from "@/lib/api/types/survei.types";
import { kuesionerFormSchema, respondenSchema } from "@/schemas/surveiSchema";

// Interface
interface Props {
  layananList: LayananSurvei[];
  kuesionerList: Kuesioner[];
}

// Props & Emits
const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [];
}>();

// Composable
const { respondenData, jawabanSurvei, masukkan, isSubmitting, selectedLayanan, submitSurvei, updateJawaban } =
  useSurvei();

// Local state
const currentStep = ref(1);
const totalSteps = 3;

// Computed properties
const stepProgress = computed(() => (currentStep.value / totalSteps) * 100);

const canProceedToStep3 = computed(() => {
  return selectedLayanan.value !== null;
});

// Methods
const selectLayanan = (layanan: LayananSurvei) => {
  selectedLayanan.value = layanan;
};

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleRespondenSubmit = async (values: any) => {
  respondenData.value = values;
  nextStep();
};

const handleKuesionerSubmit = async (values: any) => {
  masukkan.value = values.masukkan || "";

  await submitSurvei();

  emit("submit");
};

// Watchers
watch(currentStep, (newStep) => {
  if (newStep === 3) {
    // Initialize jawaban when entering step 3
    jawabanSurvei.value = props.kuesionerList.map((kuesioner) => ({
      pertanyaan_id: kuesioner.id,
      jawaban_id: 0,
    }));
  }
});
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <!-- Progress Bar -->
    <div class="mb-8">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Langkah {{ currentStep }} dari {{ totalSteps }}</span>
        <span class="text-sm text-gray-500">{{ Math.round(stepProgress) }}%</span>
      </div>
      <div class="h-2 w-full rounded-full bg-gray-200">
        <div
          class="h-2 rounded-full bg-yellow-600 transition-all duration-300"
          :style="{ width: `${stepProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- Step 1: Data Responden -->
    <div v-if="currentStep === 1" class="rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">Data Responden</h2>

      <BaseForm
        v-slot="{ meta }"
        :schema="respondenSchema"
        :initial-values="respondenData"
        :on-submit="handleRespondenSubmit"
      >
        <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <BaseInput
            name="nama"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            required
            customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
          />

          <BaseInput
            name="hp"
            label="Nomor HP"
            placeholder="Masukkan nomor HP"
            type="tel"
            required
            customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
          />

          <BaseSelect
            name="jenis_kelamin"
            label="Jenis Kelamin"
            :options="JENIS_KELAMIN_OPTIONS"
            placeholder="Pilih jenis kelamin"
            required
            customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
          />

          <BaseInput
            name="usia"
            label="Usia"
            placeholder="Masukkan usia"
            type="number"
            required
            customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
          />

          <BaseSelect
            name="pendidikan"
            label="Pendidikan Terakhir"
            :options="PENDIDIKAN_OPTIONS"
            placeholder="Pilih pendidikan"
            required
            customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
          />

          <BaseInput
            name="pekerjaan"
            label="Pekerjaan"
            placeholder="Masukkan pekerjaan"
            required
            customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
          />
        </div>

        <div class="mt-8 flex justify-end">
          <Button
            type="submit"
            :disabled="!meta.valid"
            class="bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-400"
            size="lg"
          >
            <ChevronRight class="ml-2 h-4 w-4" />
            Selanjutnya
          </Button>
        </div>
      </BaseForm>
    </div>

    <!-- Step 2: Pilih Layanan -->
    <div v-if="currentStep === 2" class="rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">Pilih Layanan</h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="layanan in layananList"
          :key="layanan.id"
          @click="selectLayanan(layanan)"
          class="cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md"
          :class="{
            'border-yellow-600 bg-yellow-50': selectedLayanan?.id === layanan.id,
            'border-gray-200 hover:border-gray-300': selectedLayanan?.id !== layanan.id,
          }"
        >
          <div class="mb-2">
            <h3 class="font-semibold text-gray-900">{{ layanan.nama }}</h3>
            <p class="text-sm text-gray-600">{{ layanan.perangkat_daerah }}</p>
            <p class="text-xs text-gray-500">{{ layanan.perangkat_daerah_unit }}</p>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-between">
        <Button @click="prevStep" variant="outline" size="lg">
          <ChevronLeft class="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <Button
          @click="nextStep"
          :disabled="!canProceedToStep3"
          class="bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-400"
          size="lg"
        >
          <ChevronRight class="ml-2 h-4 w-4" />
          Selanjutnya
        </Button>
      </div>
    </div>

    <!-- Step 3: Kuesioner -->
    <div v-if="currentStep === 3" class="rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">Kuesioner Survei</h2>

      <BaseForm
        v-slot="{ meta }"
        :schema="kuesionerFormSchema"
        :initial-values="{ masukkan: masukkan }"
        :on-submit="handleKuesionerSubmit"
      >
        <div class="space-y-8">
          <div
            v-for="(kuesioner, index) in kuesionerList"
            :key="kuesioner.id"
            class="rounded-lg border border-gray-200 p-6"
          >
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ index + 1 }}. {{ kuesioner.pertanyaan }}</h3>
              <p class="text-sm text-gray-600">{{ kuesioner.kategori }}</p>
            </div>

            <BaseRadio
              :name="`pertanyaan_${kuesioner.id}`"
              :label="`Jawaban untuk pertanyaan ${index + 1}`"
              :options="kuesioner.pilihan.map((p) => ({ label: p.label, value: p.id }))"
              :required="true"
              @update:model-value="updateJawaban(kuesioner.id, $event)"
            />
          </div>
        </div>

        <!-- Masukkan Tambahan -->
        <div class="mt-8">
          <BaseTextarea
            name="masukkan"
            label="Masukkan dan Saran (Opsional)"
            placeholder="Berikan masukkan dan saran untuk perbaikan layanan..."
            :rows="4"
            customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
          />
        </div>

        <div class="mt-8 flex justify-between">
          <Button type="button" @click="prevStep" variant="outline" size="lg">
            <ChevronLeft class="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button
            type="submit"
            :disabled="!meta.valid || isSubmitting"
            class="bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-400"
            size="lg"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            <Send v-else class="mr-2 h-4 w-4" />
            {{ isSubmitting ? "Mengirim..." : "Kirim Survei" }}
          </Button>
        </div>
      </BaseForm>
    </div>
  </div>
</template>
