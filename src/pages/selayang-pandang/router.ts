import AppLayout from "@/components/layout/AppLayout.vue";

import SejarahPage from "@/pages/selayang-pandang/sejarah/IndexPage.vue";

export default {
  path: "/selayang-pandang",
  component: AppLayout,
  children: [
    {
      path: "sejarah",
      name: "selayang-pandang.sejarah",
      component: SejarahPage,
      meta: {
        requiresAuth: true,
        title: "Sejarah",
      },
    },
  ],
};
