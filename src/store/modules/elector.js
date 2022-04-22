export default {
  namespaced: true,
  state: {
    gender: ["MALE", "FEMALE"],
  },
  getters: {
    gender: state => {
      return state.gender;
    }
  }
};
