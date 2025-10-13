<script setup lang="ts">
import { Clock, Headphones, Mail, Map, MapPin, MessageCircle, Navigation, Phone, Share2 } from "lucide-vue-next";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Contact information
const contactInfo = {
  alamat: "Jl. Wolter Monginsidi No.1 Tenggarong 75511 - Kutai Kartanegara - Kaltim",
  telepon: "Telp. (0541) 661180 Fax. (0541) 661690",
  email: "info@dprdkutaikartanegara.go.id",
  jamKerja: "Senin - Jumat: 08.00 - 16.00 WITA",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.3245678901234!2d116.9876543210987!3d-0.1234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDPRD%20Kutai%20Kartanegara!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid",
};

const socialMedia = [
  {
    name: "Facebook",
    icon: "bx bxl-facebook",
    url: "https://facebook.com/dprdkutaikartanegara",
    color: "bg-blue-600",
  },
  {
    name: "Instagram",
    icon: "bx bxl-instagram",
    url: "https://instagram.com/dprdkutaikartanegara",
    color: "bg-pink-600",
  },
  {
    name: "Twitter",
    icon: "bx bxl-twitter",
    url: "https://twitter.com/dprdkutaikartanegara",
    color: "bg-blue-400",
  },
  {
    name: "YouTube",
    icon: "bx bxl-youtube",
    url: "https://youtube.com/@dprdkutaikartanegara",
    color: "bg-red-600",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900">Kontak Kami</h1>
          <p class="text-lg text-gray-600">Hubungi kami untuk informasi lebih lanjut</p>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <!-- Contact Info Cards -->
          <div class="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Map class="h-6 w-6 text-blue-600" />
                  </div>
                  Alamat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="leading-relaxed text-gray-700">{{ contactInfo.alamat }}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Phone class="h-6 w-6 text-green-600" />
                  </div>
                  Telepon & Fax
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-gray-700">{{ contactInfo.telepon }}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <Mail class="h-6 w-6 text-yellow-600" />
                  </div>
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a :href="`mailto:${contactInfo.email}`" class="text-blue-600 hover:underline">
                  {{ contactInfo.email }}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Clock class="h-6 w-6 text-purple-600" />
                  </div>
                  Jam Kerja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-gray-700">{{ contactInfo.jamKerja }}</p>
              </CardContent>
            </Card>

            <!-- Social Media -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <Share2 class="h-6 w-6 text-indigo-600" />
                  </div>
                  Media Sosial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap gap-3">
                  <a
                    v-for="social in socialMedia"
                    :key="social.name"
                    :href="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:opacity-90"
                    :class="social.color"
                  >
                    <i :class="social.icon"></i>
                    <span class="text-sm font-medium">{{ social.name }}</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Map -->
          <Card class="h-[600px]">
            <CardHeader>
              <CardTitle class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <MapPin class="h-5 w-5 text-red-600" />
                </div>
                Lokasi Kami
              </CardTitle>
            </CardHeader>
            <CardContent class="flex h-full flex-col">
              <div class="flex-1 overflow-hidden rounded-lg">
                <iframe
                  :src="contactInfo.mapEmbedUrl"
                  class="h-full w-full"
                  style="border: 0"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div class="mt-4 text-center">
                <a
                  href="https://maps.google.com/?q=DPRD+Kutai+Kartanegara"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Navigation class="h-4 w-4" />
                  Buka di Google Maps
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Additional Information -->
        <div class="mt-12">
          <Card>
            <CardHeader>
              <CardTitle class="text-center">Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="text-center">
                  <div class="mb-4 flex justify-center">
                    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Headphones class="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 class="mb-2 text-lg font-semibold">Layanan Pelanggan</h3>
                  <p class="text-sm text-gray-600">
                    Tim customer service kami siap membantu Anda dari Senin hingga Jumat, pukul 08.00 - 16.00 WITA.
                  </p>
                </div>
                <div class="text-center">
                  <div class="mb-4 flex justify-center">
                    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <MessageCircle class="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 class="mb-2 text-lg font-semibold">Kritik & Saran</h3>
                  <p class="text-sm text-gray-600">
                    Sampaikan kritik, saran, atau pertanyaan Anda melalui email atau media sosial kami.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
