import AppLayout from "@/layouts/AppLayout.vue";
import AnggotaDewanPage from "@/pages/dprd-kukar/anggota-dewan/IndexPage.vue";
import DynamicMenuPage from "@/pages/dprd-kukar/DynamicPage.vue";

export default [
  {
    path: "/dprd-kukar",
    component: AppLayout,
    children: [
      {
        path: "anggota-dewan",
        name: "dprd-kukar.anggota-dewan",
        component: AnggotaDewanPage,
        meta: {
          title: "Anggota Dewan",
        },
      },
      {
        path: ":slug",
        name: "dprd-kukar.dynamic",
        component: DynamicMenuPage,
        meta: {
          title: "DPRD Kukar",
        },
      },
    ],
  },
];
