import AppLayout from "@/layouts/AppLayout.vue";
import KontakKamiPage from "@/pages/kontak-kami/IndexPage.vue";

export default [
  {
    path: "/kontak",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "kontak.index",
        component: KontakKamiPage,
        meta: {
          title: "Kontak",
        },
      },
    ],
  },
];
