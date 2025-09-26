import AppLayout from "@/layouts/AppLayout.vue";
import SurveiPage from "@/pages/survei/IndexPage.vue";

export default [
  {
    path: "/survei",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "survei.index",
        component: SurveiPage,
        meta: {
          title: "Survei Kepuasan Masyarakat",
        },
      },
    ],
  },
];
