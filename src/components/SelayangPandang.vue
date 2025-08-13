<template>
  <div class="row">
    <div class="col-md-8">
      <div class="detail-image-frame">
        <img :src="props.image" class="detail-image" />
      </div>
      <div class="headingtext">
        <span class="headingtext-title"> {{ props.title }} </span>
        <i class="bx bx-dots-horizontal-rounded detail-divider"></i>
      </div>
      <div class="detail-text">
        <article>
          <p>
            Kabupaten Kutai Kartanegara memiliki sejarah panjang, yang dimulai dari Kesultanan Kutai Kartanegara Ing
            Matadipura, selanjutnya pada tahun 1947 masuk dalam status Daerah Swaparaja Kutai yang menjadi bagian
            Federasi Kalimantan Timur bersama Kesultanan Bulungan, Sambaliung, Gunung Tabur dan Pasir.
          </p>

          <p>
            Pada tanggal 27 Desember 1949, Daerah Swapraja Kutai ditetapkan menjadi bagian dari Republik Indonesia
            Serikat. Seiring perubahan bentuk Negara, selanjutnya Daerah Swapraja Kutai diubah menjadi Daerah Istimewa
            Kutai berdasarkan UU Darurat Nomor 3 tahun 1953. Daerah Istimewa Kutai dipimpin Sultan Kutai Aji Muhammad
            Parikesit, hingga pada tahun 1959 Pemerintah Republik Indonesia menghapus status Daerah Istimewa melalui UU
            nomor 27 tahun 1959, menjadi Kabupaten Kutai dengan Ibu kota Tenggarong.
          </p>

          <p>
            Dengan adanya pemerintahan Daerah Tingkat II di wilayah bekas Kesultanan Kutai, maka berakhir pula era
            Pemerintahan Kesultanan Kutai Kartanegara ing Martadipura.
          </p>

          <p>
            Pada tahun 1999, melalui UU Nomor 47 Tahun 1999, Kabupaten Kutai dimekarkan menjadi 4 daerah otonom yakni
            Kabupaten Kutai dengan dengan ibu kota Tenggarong, Kabupaten Kutai Barat dengan ibukota Sendawar, Kabupaten
            Kutai Timur dengan ibukota Sengata, dan Kota Bontang dengan ibukota Bontang.
          </p>

          <p>
            Kemudian pada tahun 2000, Presiden RI Abdurrahman Wahid saat membuka Musyawarah Nasional APKASI ((Asosiasi
            Pemerintah Kabupaten Seluruh Indonesia) yang diadakan di Tenggarong pada mengusulkan agar Kabupaten Kutai
            hasil pemekaran menggunakan nama Kabupaten Kutai Kartanegara.
          </p>

          <p>
            Pada tahun 2002, Presiden RI Megawati Soekarnoputri menetapkan penggunaan nama Kabupaten Kutai Kartanegara
            melalui Peraturan Pemerintah RI No. 8 Tahun 2002 tentang "Perubahan Nama Kabupaten Kutai Menjadi Kabupaten
            Kutai Kartanegara".
          </p>
        </article>

        <slot name="content" />
      </div>
      <NavigationContent />
    </div>

    <div class="col-md-4">
      <BeritaSide />
    </div>
  </div>
</template>

<script setup lang="ts">
import BeritaSide from "@/components/BeritaSide.vue";
import NavigationContent from "@/components/NavigationContent.vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    image?: string;
    content?: string;
  }>(),
  {
    image: "/dummy.jpg",
    title: "SEKILAS SEJARAH KAB. KUTAI KARTANEGARA",
  },
);
</script>
