import DetailPage from "@/pages/app/survei-kepuasan/DetailPage.vue";
import SurveiKepuasanPage from "@/pages/app/survei-kepuasan/IndexPage.vue";

export default [
  {
    path: "survei-kepuasan",
    name: "app.survei-kepuasan",
    component: SurveiKepuasanPage,
    meta: {
      requiresAuth: true,
      title: "Survei Kepuasan Masyarakat",
    },
  },
  {
    path: "survei-kepuasan/:id",
    name: "app.survei-kepuasan.detail",
    component: DetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Survei Kepuasan Masyarakat",
    },
  },
];
