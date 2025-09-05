<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";

import { BaseForm, BaseFormField, BaseInput } from "@/components/forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Simple schema untuk demonstrasi
const contactSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").min(2, "Nama minimal 2 karakter"),

  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),

  message: z.string().min(1, "Pesan harus diisi").min(10, "Pesan minimal 10 karakter"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const loading = ref(false);
const success = ref(false);

const handleSubmit = async (values: ContactFormData) => {
  loading.value = true;

  // Simulasi API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Form submitted:", values);
  success.value = true;
  loading.value = false;
};

const handleSuccess = () => {
  success.value = true;
};

const handleError = (error: any) => {
  console.error("Form error:", error);
};
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">
    <Card>
      <CardHeader>
        <CardTitle>Contoh Form Sederhana</CardTitle>
        <CardDescription> Demonstrasi penggunaan BaseForm dengan validasi Zod </CardDescription>
      </CardHeader>

      <CardContent>
        <div v-if="success" class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <div class="flex items-center gap-2 text-green-800">
            <div class="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
              <span class="text-xs text-white">✓</span>
            </div>
            <span class="text-sm font-medium">Form berhasil dikirim!</span>
          </div>
        </div>

        <BaseForm
          :schema="contactSchema"
          :on-submit="handleSubmit"
          :loading="loading"
          submit-label="Kirim Pesan"
          @success="handleSuccess"
          @error="handleError"
        >
          <template #default="{ defineField, errors, isValid, loading, disabled }">
            <div class="space-y-4">
              <BaseFormField name="name" label="Nama Lengkap" description="Masukkan nama lengkap Anda" :required="true">
                <template #default="{ field }">
                  <BaseInput v-bind="field" type="text" placeholder="Masukkan nama lengkap" :disabled="disabled" />
                </template>
              </BaseFormField>

              <BaseFormField name="email" label="Email" description="Alamat email yang valid" :required="true">
                <template #default="{ field }">
                  <BaseInput v-bind="field" type="email" placeholder="Masukkan email" :disabled="disabled" />
                </template>
              </BaseFormField>

              <BaseFormField name="message" label="Pesan" description="Tuliskan pesan Anda" :required="true">
                <template #default="{ field }">
                  <textarea
                    v-bind="field"
                    placeholder="Tuliskan pesan Anda di sini..."
                    :disabled="disabled"
                    rows="4"
                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </template>
              </BaseFormField>
            </div>
          </template>
        </BaseForm>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
/* Custom styles jika diperlukan */
</style>
