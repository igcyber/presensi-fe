<script setup lang="ts">
import { ArrowLeft, Calendar, Phone, User, UserCheck } from "lucide-vue-next";
import { computed, onMounted } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { getLayananSurvei } from "@/lib/api/services/survei";
import { getSurveyStatus } from "@/lib/api/services/surveiKepuasan";
import type { LayananSurveiListResponse } from "@/lib/api/types/survei.types";
import type {
  MappedSurveyAnswer,
  ParsedSurveyPayload,
  ParsedSurveyResult,
  SurveiKepuasan,
  SurveyQuestion,
  SurveyStatusResponse,
} from "@/lib/api/types/surveiKepuasan.types";

interface Props {
  surveiKepuasan: SurveiKepuasan;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

const { date } = useFormatters();

// Fetch survey questions
const { data, isLoading, fetchData } = useFetch<ApiResponse<SurveyStatusResponse>, SurveyStatusResponse>(
  () => getSurveyStatus(),
  {
    immediate: true,
    extractData: (response) => response.data,
  },
);

// Fetch survey layanan
const {
  data: surveyLayananData,
  isLoading: isLoadingSurveyLayanan,
  fetchData: fetchSurveyLayananData,
} = useFetch<ApiResponse<LayananSurveiListResponse>, LayananSurveiListResponse>(() => getLayananSurvei(), {
  immediate: true,
  extractData: (response) => response.data,
});

// Parse survey payload
const parsedPayload = computed((): ParsedSurveyPayload | null => {
  try {
    return JSON.parse(props.surveiKepuasan.surveyPayload);
  } catch {
    return null;
  }
});

// Parse survey result
const parsedResult = computed((): ParsedSurveyResult | null => {
  try {
    return JSON.parse(props.surveiKepuasan.surveyResult);
  } catch {
    return null;
  }
});

// Survey status
const surveyStatus = computed(() => {
  if (parsedResult.value?.success) {
    return { label: "Berhasil", variant: "default" as const };
  } else if (parsedResult.value?.error) {
    return { label: "Error", variant: "destructive" as const };
  }
  return { label: "Unknown", variant: "secondary" as const };
});

// Responden initials
const respondenInitials = computed(() => {
  const name = props.surveiKepuasan.nama || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

// Jenis kelamin display
const jenisKelaminDisplay = computed(() => {
  return props.surveiKepuasan.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";
});

// Get survey questions from status API
const surveyQuestions = computed((): SurveyQuestion[] => {
  return data.value?.userInfo?.data || [];
});

// Map survey answers with questions
const mappedSurveyAnswers = computed((): MappedSurveyAnswer[] => {
  if (!parsedPayload.value || !surveyQuestions.value.length) {
    return [];
  }

  return parsedPayload.value.survei.map((answer) => {
    const question = surveyQuestions.value.find((q) => q.id === answer.pertanyaan_id);
    const option = question?.pilihan.find((p) => p.id === answer.jawaban_id);

    return {
      pertanyaan: question || { id: 0, kategori: "Unknown", pertanyaan: "Pertanyaan tidak ditemukan", pilihan: [] },
      jawaban: option || { id: 0, label: "Jawaban tidak ditemukan", nilai: 0 },
      pertanyaan_id: answer.pertanyaan_id,
      jawaban_id: answer.jawaban_id,
    };
  });
});

// Group answers by category
const answersByCategory = computed(() => {
  const grouped: Record<string, MappedSurveyAnswer[]> = {};

  mappedSurveyAnswers.value.forEach((answer) => {
    const category = answer.pertanyaan.kategori;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(answer);
  });

  return grouped;
});

const handleBack = () => {
  emit("back");
};

onMounted(() => {
  fetchData();
  fetchSurveyLayananData();
});
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-6 p-4 lg:p-6">
    <!-- Back Button (Optional) -->
    <div v-if="showBackButton" class="flex items-center">
      <Button variant="ghost" size="sm" @click="handleBack" class="gap-2 px-0 hover:bg-transparent">
        <ArrowLeft class="h-4 w-4" />
        <span class="hidden sm:inline">Kembali</span>
      </Button>
    </div>

    <!-- Header Card -->
    <Card class="shadow-sm">
      <CardHeader class="space-y-4 pb-4">
        <!-- Title -->
        <CardTitle class="text-xl leading-tight font-bold sm:text-2xl lg:text-3xl">
          Detail Survei Kepuasan Masyarakat
        </CardTitle>

        <!-- Meta Information -->
        <div class="text-muted-foreground flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:gap-6">
          <!-- Responden -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6 flex-shrink-0">
              <AvatarFallback class="text-xs">
                {{ respondenInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex min-w-0 items-center gap-1">
              <User class="h-4 w-4 flex-shrink-0" />
              <span class="truncate">{{ surveiKepuasan.nama }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4 flex-shrink-0" />
            <span class="truncate">{{ date(surveiKepuasan.createdAt) }}</span>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-1">
            <UserCheck class="h-4 w-4 flex-shrink-0" />
            <Badge :variant="surveyStatus.variant">{{ surveyStatus.label }}</Badge>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- Responden Info Card -->
    <Card class="shadow-sm">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg">
          <User class="h-5 w-5" />
          Informasi Responden
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4 pt-4">
        <div class="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <!-- Nama -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Nama Lengkap</p>
            <p class="text-muted-foreground">{{ surveiKepuasan.nama }}</p>
          </div>

          <!-- No HP -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">No. HP</p>
            <div class="flex items-center gap-1">
              <Phone class="h-4 w-4" />
              <span class="text-muted-foreground">{{ surveiKepuasan.noHp }}</span>
            </div>
          </div>

          <!-- Jenis Kelamin -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Jenis Kelamin</p>
            <p class="text-muted-foreground">{{ jenisKelaminDisplay }}</p>
          </div>

          <!-- Usia -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Usia</p>
            <p class="text-muted-foreground">{{ surveiKepuasan.usia }} tahun</p>
          </div>

          <!-- Pendidikan -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Pendidikan</p>
            <p class="text-muted-foreground">{{ surveiKepuasan.pendidikan }}</p>
          </div>

          <!-- Pekerjaan -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Pekerjaan</p>
            <p class="text-muted-foreground">{{ surveiKepuasan.pekerjaan }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Survey Details Card -->
    <Card v-if="parsedPayload" class="shadow-sm">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg">
          <UserCheck class="h-5 w-5" />
          Detail Survei
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4 pt-4">
        <!-- Pelayanan Nama -->
        <div class="space-y-1">
          <p class="text-foreground font-medium">Nama Pelayanan</p>
          <template v-if="isLoadingSurveyLayanan">
            <div class="flex items-center justify-center gap-2">
              <div class="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
              <span class="text-muted-foreground text-sm">Memuat detail pelayanan...</span>
            </div>
          </template>
          <template v-else>
            <p class="text-muted-foreground">
              {{ surveyLayananData?.data.find((layanan) => layanan.id === parsedPayload?.pelayanan_id)?.nama }}
            </p>
          </template>
        </div>

        <!-- Jumlah Jawaban -->
        <div class="space-y-1">
          <p class="text-foreground font-medium">Jumlah Jawaban</p>
          <p class="text-muted-foreground">{{ parsedPayload.survei.length }} pertanyaan</p>
        </div>

        <!-- Masukkan -->
        <div v-if="parsedPayload.masukkan" class="space-y-1">
          <p class="text-foreground font-medium">Masukkan/Saran</p>
          <div class="bg-muted/50 rounded-lg p-3">
            <p class="text-muted-foreground text-sm">{{ parsedPayload.masukkan }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Survey Answers by Category -->
    <div v-if="mappedSurveyAnswers.length > 0" class="space-y-6">
      <Card v-for="(answers, category) in answersByCategory" :key="category" class="shadow-sm">
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-2 text-lg">
            <UserCheck class="h-5 w-5" />
            {{ category }}
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent class="space-y-4 pt-4">
          <div
            v-for="(answer, index) in answers"
            :key="`${answer.pertanyaan_id}-${answer.jawaban_id}`"
            class="space-y-3"
          >
            <!-- Question -->
            <div class="space-y-1">
              <p class="text-foreground text-sm font-medium">{{ index + 1 }}. {{ answer.pertanyaan.pertanyaan }}</p>
            </div>

            <!-- Answer -->
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <Badge variant="outline" class="text-xs"> Jawaban </Badge>
                <span class="text-muted-foreground text-sm">{{ answer.jawaban.label }}</span>
                <Badge variant="secondary" class="text-xs"> Nilai: {{ answer.jawaban.nilai }} </Badge>
              </div>
            </div>

            <!-- Separator between questions -->
            <Separator v-if="index < answers.length - 1" class="my-4" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading Survey Questions -->
    <Card v-else-if="isLoading" class="shadow-sm">
      <CardContent class="p-6">
        <div class="flex items-center justify-center gap-2">
          <div class="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
          <span class="text-muted-foreground text-sm">Memuat detail pertanyaan survei...</span>
        </div>
      </CardContent>
    </Card>

    <!-- Survey Result Card -->
    <Card v-if="parsedResult" class="shadow-sm">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg">
          <UserCheck class="h-5 w-5" />
          Hasil Survei
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4 pt-4">
        <!-- Status -->
        <div class="space-y-1">
          <p class="text-foreground font-medium">Status</p>
          <Badge :variant="surveyStatus.variant">{{ surveyStatus.label }}</Badge>
        </div>

        <!-- Message -->
        <div v-if="parsedResult.message" class="space-y-1">
          <p class="text-foreground font-medium">Pesan</p>
          <div class="bg-muted/50 rounded-lg p-3">
            <p class="text-muted-foreground text-sm">{{ parsedResult.message }}</p>
          </div>
        </div>

        <!-- Code -->
        <div v-if="parsedResult.code" class="space-y-1">
          <p class="text-foreground font-medium">Kode Response</p>
          <p class="text-muted-foreground">{{ parsedResult.code }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- Footer Information -->
    <Card class="bg-muted/30 shadow-sm">
      <CardContent class="p-4 lg:p-6">
        <div class="grid gap-4 text-sm sm:grid-cols-2 lg:gap-6">
          <!-- Created Info -->
          <div class="space-y-2">
            <p class="text-foreground font-medium">Informasi Pembuatan</p>
            <div class="text-muted-foreground space-y-1">
              <p class="break-words">
                <span class="font-medium">Tanggal:</span>
                {{ date(surveiKepuasan.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div
            v-if="surveiKepuasan.updatedAt && surveiKepuasan.updatedAt !== surveiKepuasan.createdAt"
            class="space-y-2"
          >
            <p class="text-foreground font-medium">Informasi Pembaruan</p>
            <div class="text-muted-foreground space-y-1">
              <p class="break-words">
                <span class="font-medium">Tanggal:</span>
                {{ date(surveiKepuasan.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
