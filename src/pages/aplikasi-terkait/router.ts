import AppLayout from "@/layouts/AppLayout.vue";
import AplikasiTerkaitPage from "@/pages/aplikasi-terkait/IndexPage.vue";

export default [
  {
    path: "/aplikasi-terkait",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "aplikasi-terkait.index",
        component: AplikasiTerkaitPage,
        meta: {
          title: "Aplikasi Terkait",
        },
      },
    ],
  },
];
