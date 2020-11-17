import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import firebase from "firebase/app";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      meta: { layout: "empty" },
      component: () => import("./views/Login.vue")
    },
    {
      path: "/",
      name: "home",
      meta: { layout: "main", admin: false },
      component: () => import("./views/Home.vue")
    },
    {
      path: "/register",
      name: "register",
      meta: { layout: "main", admin: true },
      component: () => import("./views/Register.vue")
    },
    {
      path: "/tenants",
      name: "tenants",
      meta: { layout: "main", admin: false },
      component: () => import("./views/Tenants.vue")
    },
    {
      path: "/detail/:type/:id/:date/:paymentId",
      name: "detail",
      meta: { layout: "main", admin: false },
      component: () => import("./views/Detail.vue")
    },
    {
      path: "/history",
      name: "history",
      meta: { layout: "main", admin: false },
      component: () => import("./views/History.vue")
    },
    {
      path: "/electricity",
      name: "electricity",
      meta: { layout: "main", admin: false },
      component: () => import("./views/Electricity.vue")
    },
    {
      path: "/mainelectricity",
      name: "mainelectricity",
      meta: { layout: "main", admin: false },
      component: () => import("./views/MainElectricity.vue")
    },
    {
      path: "/profile",
      name: "profile",
      meta: { layout: "main", admin: false },
      component: () => import("./views/Profile.vue")
    },
    {
      path: "/record",
      name: "record",
      meta: { layout: "main", admin: false },
      component: () => import("./views/Record.vue")
    }
  ]
});
router.beforeEach(async (to, from, next) => {
  const user = firebase.auth().currentUser;

  const requireAuth = to.matched.some(record => record.meta.layout === "main");
  const requireAdmin = to.matched.some(record => record.meta.admin);
  if (user) {
    await store.dispatch("fetchUser", user.uid);
  }
  if (requireAuth && !user) {
    next("/login?message=login");
  } else if (requireAdmin && !store.getters.user.admin) {
    next("/");
  } else next();
});
export default router;
