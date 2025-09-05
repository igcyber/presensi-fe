import AppLayout from "@/layouts/AppLayout.vue";
import BeritaDetailPage from "@/pages/berita/DetailPage.vue";
import BeritaPage from "@/pages/berita/IndexPage.vue";

export default [
  {
    path: "/berita",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "berita.index",
        component: BeritaPage,
        meta: {
          title: "Berita",
        },
      },
      {
        path: ":id/:slug?",
        name: "berita.detail",
        component: BeritaDetailPage,
        meta: {
          title: "Detail Berita",
        },
      },
    ],
  },
];
