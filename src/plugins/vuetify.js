import Vue from "vue";
import Vuetify from "vuetify/lib";

import fr from "./../locale/fr";
import en from "./../locale/en";

import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  lang: {
    locales: { fr, en },
    current: "fr"
  },
  theme: {
    themes: {
      light: {
        primary: "#4B22E9",
        secondary: "#F36B25",
        error: "#B71C1C"
      }
    }
  }
});
