// store/modules/error.js
const state = {
  isShowMessage: false,
  errorMessage: "",
  handleClose: null,
};

const mutations = {
  /**
   * Hàm thực hiện nhận nội dung thông báo và hiển thị lỗi lên dialog.
   * @param {Object} state
   * @param {String} message Thông báo lỗi
   * @author: nttue (20/08/2023)
   */
  setErrorMessage(state, payload) {
    state.isShowMessage = true;
    state.errorMessage = payload.message;
    state.handleClose = payload.handleClose;
  },
  /**
   * Hàm thực hiện ẩn dialog khi người dùng đóng dialog.
   * @author: nttue (20/08/2023)
   */
  hideErrorMessage(state) {
    state.isShowMessage = false;
    state.errorMessage = "";
    state.formName = "";
  },
};

const actions = {};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
