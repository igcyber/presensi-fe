import AppLayout from "@/layouts/AppLayout.vue";
import KontakKamiPage from "@/pages/kontak-kami/IndexPage.vue";

export default [
  {
    path: "/kontak-kami",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "kontak-kami.index",
        component: KontakKamiPage,
        meta: {
          title: "Kontak Kami",
        },
      },
    ],
  },
];
