import ProfilePage from "@/pages/app/profile/IndexPage.vue";

export default [
  {
    path: "profile",
    name: "app.profile",
    component: ProfilePage,
    meta: {
      requiresAuth: true,
      title: "Profile",
    },
  },
];
