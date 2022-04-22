import Vue from "vue";
import Bearer from "./authbearer";
import URLPath from "../helpers/URL";
import Auth from "@websanova/vue-auth/src/index";
import vueRouter from "@websanova/vue-auth/drivers/router/vue-router.2.x";
import authAxios from "@websanova/vue-auth/drivers/http/axios.1.x";

const tokenName = process.env.VUE_APP_TOKEN_NAME;

Vue.use(Auth, {
  auth: Bearer,
  http: authAxios,
  router: vueRouter,
  stores: ["storage"],
  cookie: {
    Path: "/",
    Domain: null,
    Secure: false,
    Expires: 12096e5,
    SameSite: "None"
  },
  fetchData: {
    url: URLPath.SECURITY.ME.URI,
    method: URLPath.SECURITY.ME.METHOD,
    enabled: true
  },
  authRedirect: {
    path: "/login"
  },
  forbiddenRedirect: {
    name: "forbidden"
  },
  notFoundRedirect: {
    name: "notfound"
  },
  tokenDefaultKey: tokenName,
  rolesKey: "role",
  loginData: {
    url: URLPath.SECURITY.LOGIN.URI,
    method: URLPath.SECURITY.LOGIN.METHOD,
    redirect: "/",
    fetchUser: true
  },
  logoutData: {
    url: URLPath.SECURITY.LOGOUT.URI,
    method: URLPath.SECURITY.LOGOUT.METHOD,
    redirect: "/login",
    makeRequest: true,
    transformRequest: function(data) {
      data = JSON.stringify({
        refresh: JSON.parse(Vue.auth.token(tokenName)).refresh
      });
      return data;
    }
  },
  refreshData: {
    url: URLPath.SECURITY.REFRESH.URI,
    method: URLPath.SECURITY.REFRESH.METHOD,
    enabled: true,
    transformRequest: function(data) {
      data = JSON.stringify({
        refresh: JSON.parse(Vue.auth.token(tokenName)).refresh
      });
      return data;
    },
    interval: 20
  },
  parseUserData: data => data
});
