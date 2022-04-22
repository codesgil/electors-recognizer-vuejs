import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/vueaxios";
import "./plugins/vuecookie";
import "./plugins/vueauth";
import "./plugins/vuemoment";
import "./plugins/vuemeta";
import "./plugins/vuelidate";
import "./plugins/vuelodash";

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
