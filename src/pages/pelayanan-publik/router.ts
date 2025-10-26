import AppLayout from "@/layouts/AppLayout.vue";
import StandarPage from "@/pages/pelayanan-publik/standar/IndexPage.vue";
import SurveiPage from "@/pages/pelayanan-publik/survei/IndexPage.vue";

export default [
  {
    path: "/pelayanan-publik",
    component: AppLayout,
    children: [
      {
        path: "survey",
        name: "pelayanan-publik.survey",
        component: SurveiPage,
        meta: {
          title: "Survey Kepuasan Pelayanan Publik",
        },
      },
      {
        path: "standar",
        name: "pelayanan-publik.standar",
        component: StandarPage,
        meta: {
          title: "Standar Pelayanan",
        },
      },
    ],
  },
];
