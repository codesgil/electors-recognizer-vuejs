import Vue from "vue";
import Vuex from "vuex";
import * as types from "./mutations-type";
import user from "./modules/user";
import elector from "./modules/elector";

Vue.use(Vuex);

const defaultNotification = {
  status: false,
  timeout: 6000,
  multiLine: true,
  left: true,
  bottom: true,
  right: false,
  top: false,
  vertical: false,
  color: "rgba(0, 0, 0, 1)",
  absolute: false,
  message: ""
};

export default new Vuex.Store({
  state: {
    notification: defaultNotification,
    snackbar: null
  },
  getters: {
    notification: state => {
      return state.notification;
    },
    snackbar: state => {
      return state.snackbar;
    }
  },
  mutations: {
    [types.SNACKBAR](state, snackbar) {
      state.snackbar = snackbar;
    },
    [types.NOTIFICATION](state, notification) {
      state.notification = notification;
    }
  },
  actions: {
    setNotification: (store, options) => {
      // clear old snackbar
      clearTimeout(store.getters.snackbar);

      // merge default notifications options with current options and set notification
      let currentOptions = Object.assign({}, defaultNotification, options);
      store.commit(types.NOTIFICATION, currentOptions);

      // set snackbar
      let snackbar = window.setTimeout(function() {
        store.commit(types.NOTIFICATION, defaultNotification);
      }, currentOptions.timeout);

      store.commit(types.SNACKBAR, snackbar);
    },
    request: (store, params) => {
      return new Promise((resolve, reject) => {
        Vue.axios({
          ...params
        })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          })
          .then(() => {
            resolve();
          });
      });
    }
  },
  modules: {
    user: user,
    elector: elector,
  }
});
