import AppLayout from "@/layouts/AppLayout.vue";
import IndexPage from "@/pages/beranda/IndexPage.vue";

export default {
  path: "/",
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
