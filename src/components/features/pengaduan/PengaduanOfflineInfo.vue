<script setup lang="ts">
import { CheckCircle, Clock, FileText, MapPin, Phone, Users } from "lucide-vue-next";
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <div class="rounded-lg bg-white p-8 shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">Tata Cara Pengaduan Offline</h2>

      <div class="space-y-8">
        <!-- Informasi Umum -->
        <div class="rounded-lg border border-gray-200 p-6">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <Users class="mr-2 h-5 w-5 text-yellow-600" />
            Informasi Umum
          </h3>
          <p class="text-gray-600">
            Pengaduan offline dapat dilakukan dengan mengunjungi kantor DPRD Kutai Kartanegara atau melalui surat resmi.
            Berikut adalah tata cara dan informasi yang diperlukan.
          </p>
        </div>

        <!-- Langkah-langkah -->
        <div class="rounded-lg border border-gray-200 p-6">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <CheckCircle class="mr-2 h-5 w-5 text-yellow-600" />
            Langkah-langkah Pengaduan
          </h3>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-sm font-bold text-white"
              >
                1
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Siapkan Dokumen</h4>
                <p class="text-sm text-gray-600">
                  Siapkan dokumen pendukung seperti foto, surat, atau bukti lainnya yang relevan dengan aduan Anda.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-sm font-bold text-white"
              >
                2
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Kunjungi Kantor DPRD</h4>
                <p class="text-sm text-gray-600">
                  Datang ke kantor DPRD Kutai Kartanegara pada jam operasional dengan membawa dokumen yang diperlukan.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-sm font-bold text-white"
              >
                3
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Isi Formulir</h4>
                <p class="text-sm text-gray-600">
                  Minta dan isi formulir pengaduan yang tersedia di kantor dengan data yang lengkap dan akurat.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-sm font-bold text-white"
              >
                4
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Serahkan Dokumen</h4>
                <p class="text-sm text-gray-600">
                  Serahkan formulir yang telah diisi beserta dokumen pendukung kepada petugas yang berwenang.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-sm font-bold text-white"
              >
                5
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Terima Bukti Penerimaan</h4>
                <p class="text-sm text-gray-600">
                  Pastikan Anda menerima bukti penerimaan pengaduan yang berisi nomor referensi untuk tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informasi Kontak -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="rounded-lg border border-gray-200 p-6">
            <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <MapPin class="mr-2 h-5 w-5 text-yellow-600" />
              Alamat Kantor
            </h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>DPRD Kutai Kartanegara</strong></p>
              <p>Jl. Diponegoro No. 1</p>
              <p>Tenggarong, Kutai Kartanegara</p>
              <p>Kalimantan Timur 75511</p>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-6">
            <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <Phone class="mr-2 h-5 w-5 text-yellow-600" />
              Kontak
            </h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>Telepon:</strong> (0541) 123456</p>
              <p><strong>Email:</strong> pengaduan@dprd-kukar.go.id</p>
              <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
            </div>
          </div>
        </div>

        <!-- Jam Operasional -->
        <div class="rounded-lg border border-gray-200 p-6">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <Clock class="mr-2 h-5 w-5 text-yellow-600" />
            Jam Operasional
          </h3>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 class="font-medium text-gray-900">Hari Kerja</h4>
              <p class="text-sm text-gray-600">Senin - Jumat: 08:00 - 16:00 WITA</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Hari Libur</h4>
              <p class="text-sm text-gray-600">Sabtu - Minggu: Tutup</p>
            </div>
          </div>
        </div>

        <!-- Dokumen yang Diperlukan -->
        <div class="rounded-lg border border-gray-200 p-6">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <FileText class="mr-2 h-5 w-5 text-yellow-600" />
            Dokumen yang Diperlukan
          </h3>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <CheckCircle class="h-4 w-4 text-green-600" />
              <span class="text-sm text-gray-600">KTP atau identitas diri yang valid</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckCircle class="h-4 w-4 text-green-600" />
              <span class="text-sm text-gray-600">Dokumen pendukung aduan (foto, surat, dll)</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckCircle class="h-4 w-4 text-green-600" />
              <span class="text-sm text-gray-600">Formulir pengaduan (tersedia di kantor)</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckCircle class="h-4 w-4 text-green-600" />
              <span class="text-sm text-gray-600">Surat kuasa (jika diwakilkan)</span>
            </div>
          </div>
        </div>

        <!-- Catatan Penting -->
        <div class="rounded-lg bg-yellow-50 p-6">
          <h3 class="mb-4 text-lg font-semibold text-yellow-800">Catatan Penting</h3>
          <ul class="space-y-2 text-sm text-yellow-700">
            <li>• Pastikan data yang disampaikan akurat dan dapat dipertanggungjawabkan</li>
            <li>• Bawa dokumen asli dan fotokopi untuk keperluan administrasi</li>
            <li>• Pengaduan akan diproses dalam waktu maksimal 14 hari kerja</li>
            <li>• Anda akan dihubungi melalui nomor telepon atau email yang terdaftar</li>
            <li>• Simpan baik-baik bukti penerimaan pengaduan untuk keperluan follow-up</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
