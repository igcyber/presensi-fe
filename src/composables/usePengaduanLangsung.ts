import { ref } from "vue";

import { createPengaduanPublic } from "@/lib/api/services/pengaduan";
import type { CreatePengaduanRequest } from "@/lib/api/types/pengaduan.types";

export function usePengaduanLangsung() {
  const isSubmitting = ref(false);
  const captchaQuestion = ref("");
  const captchaAnswer = ref("");
  const canSubmit = ref(true);
  const remainingTime = ref(0);

  // Generate simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaQuestion.value = `${num1} + ${num2}`;
    captchaAnswer.value = (num1 + num2).toString();
    localStorage.setItem("captcha_answer", captchaAnswer.value);
  };

  // Check rate limiting
  const checkRateLimit = () => {
    const lastSubmit = localStorage.getItem("last_pengaduan_submit");
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit);
      const fifteenMinutes = 15 * 60 * 1000;
      if (diff < fifteenMinutes) {
        canSubmit.value = false;
        remainingTime.value = Math.ceil((fifteenMinutes - diff) / 1000 / 60);
        return false;
      }
    }
    canSubmit.value = true;
    return true;
  };

  // Submit pengaduan
  const submitPengaduan = async (data: CreatePengaduanRequest) => {
    isSubmitting.value = true;
    try {
      const response = await createPengaduanPublic(data);
      localStorage.setItem("last_pengaduan_submit", Date.now().toString());
      return response;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    isSubmitting,
    captchaQuestion,
    canSubmit,
    remainingTime,
    generateCaptcha,
    checkRateLimit,
    submitPengaduan,
  };
}
