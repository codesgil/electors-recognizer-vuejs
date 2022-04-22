import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout.vue";
import Home from "../views/Home.vue";

VueRouter.prototype.open = function (routeObject) {
  const {href} = this.resolve(routeObject);
  window.open(href, "_blank");
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    name: "home",
    meta: {
      auth: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_SUPERVISOR", "ROLE_USER"]
    },
  },
  {
    path: "/private",
    component: Layout,
    meta: {
      auth: true
    },
    children: [
      {
        path: "/electors",
        name: "electors",
        meta: {roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_SUPERVISOR"]},
        component: () => import("../views/Elector/Index.vue")
      },
      {
        path: "/settings/users",
        name: "users",
        meta: {roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]},
        component: () => import("../views/User/Index.vue")
      },
      {
        path: "/settings/campaigns",
        name: "campaigns",
        meta: {roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]},
        component: () => import("../views/Campaign/Index.vue")
      },
      {
        path: "/settings/votes-offices",
        name: "voteOffice",
        meta: {roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]},
        component: () => import("../views/VoteOffice/Index.vue")
      },
      {
        path: "/settings/votes",
        name: "votes",
        meta: {roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_SUPERVISOR"]},
        component: () => import("../views/Vote/Index.vue")
      }
    ]
  },
  {
    path: "/403",
    name: "forbidden",
    meta: {
      auth: true
    },
    component: () => import("../views/Exception/403")
  },
  {
    path: "/404",
    name: "notfound",
    component: () => import("../views/Exception/404")
  },
  {
    path: "/login",
    component: () => import("../views/Security/Login.vue"),
    name: "login"
  },
  {
    path: "*",
    redirect: {
      name: "notfound"
    }
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

Vue.router = router;

export default router;
