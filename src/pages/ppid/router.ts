import AppLayout from "@/layouts/AppLayout.vue";
import PpidPage from "@/pages/ppid/IndexPage.vue";

export default [
  {
    path: "/ppid",
    component: AppLayout,
    children: [
      {
        path: ":type",
        name: "ppid.index",
        component: PpidPage,
        meta: {
          title: "PPID",
        },
      },
    ],
  },
];
