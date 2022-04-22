import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

// axios default configuration
Vue.axios.defaults.baseURL = document
  .getElementsByTagName("BODY")[0]
  .getAttribute("base-uri");
Vue.axios.defaults.headers.post["Content-Type"] = "application/json";
