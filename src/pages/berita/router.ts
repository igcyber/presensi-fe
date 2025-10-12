import AppLayout from "@/layouts/AppLayout.vue";
import BeritaDetailPage from "@/pages/berita/DetailPage.vue";
import BeritaPage from "@/pages/berita/IndexPage.vue";

export default [
  {
    path: "/media/berita",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "media.berita",
        component: BeritaPage,
        meta: {
          title: "Berita",
        },
      },
      {
        path: ":id/:slug?",
        name: "media.berita.detail",
        component: BeritaDetailPage,
        meta: {
          title: "Detail Berita",
        },
      },
    ],
  },
];
