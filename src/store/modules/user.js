export default {
  namespaced: true,
  state: {
    roles: ["ROLE_ADMIN", "ROLE_SUPERVISOR"],
    periods: ["day", "week", "month"]
  },
  getters: {
    roles: state => {
      return state.roles;
    },
    periods: state => {
      return state.periods;
    }
  }
};
