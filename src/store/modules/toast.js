const state = () => ({
  isShowToast: false,
  content: {
    label: "",
    type: "",
  },
});

const mutations = {
  /**
   * Thực hiện show toast message khi thực hiện 1 tác vụ thành công.
   * @author: nttue (20/08/2023)
   */
  showToast(state, payload) {
    state.isShowToast = true;
    state.content = { ...state.content, ...payload };
    setTimeout(() => {
      state.isShowToast = false;
    }, 4000);
  },
};

const getters = {};

const actions = {
  /**
   * Thực hiện show toast message khi thực hiện 1 tác vụ thành công.
   * @author: nttue (20/08/2023)
   */
  async showToast({ commit }, payload) {
    await new Promise(() => {
      setTimeout(() => {
        commit("showToast", payload);
      }, 500);
    });
  },
};
export default { state, getters, mutations, actions };
