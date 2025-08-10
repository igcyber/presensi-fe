<template>
  <div>
    <!-- Meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>{{ pageTitle || "Kutai Kartanegara - www.kukarkab.go.id" }}</title>

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" :content="pageTitle || 'www.kukarkab.go.id'" />
    <meta property="og:image" itemprop="image" :content="pageImage || '/images/logo-sm.png'" />
    <meta property="og:image:width" content="650" />
    <meta property="og:image:height" content="366" />
    <meta property="og:type" content="article" />

    <!-- Favicon -->
    <link rel="icon" href="/images/logo-sm.png" type="image/png" />

    <!-- CSS Files -->
    <link rel="stylesheet" href="/synadmin/assets/css/bootstrap.css" />
    <link rel="stylesheet" href="/synadmin/assets/css/icons.css" />
    <link rel="stylesheet" href="/owl/assets/owl.carousel.min.css" />
    <link rel="stylesheet" href="/owl/assets/owl.theme.default.min.css" />
    <link rel="stylesheet" href="/css/style.css" />

    <!-- Google Analytics -->
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-1SS916GL41");
    </script>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pageTitle?: string;
  pageImage?: string;
}

defineProps<Props>();
</script>
