import AppLayout from "@/layouts/AppLayout.vue";
import IndexPage from "@/pages/beranda/IndexPage.vue";

export default {
  path: "/beranda",
  component: AppLayout,
  children: [
    {
      path: "",
      name: "beranda.index",
      component: IndexPage,
      meta: {
        title: "Beranda",
      },
    },
  ],
};
