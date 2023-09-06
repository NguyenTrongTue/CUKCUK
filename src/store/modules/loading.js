const state = () => ({
  isLoading: false,
  showBackground: true,
});

const mutations = {
  /**
   * Thực hiện loading khi đang thực hiện call api.
   * @author: nttue (20/08/2023)
   */
  showLoading(state) {
    state.isLoading = true;
  },

  /**
   * Thực hiện ẩn loading khi thực hiện call api xong.
   * @author: nttue (20/08/2023)
   */
  hideLoading(state) {
    state.isLoading = false;
  },

  /**
   * Thực hiện ẩn màn hình loading khi mở ứng dụng vue.
   * @param {Object} state biến lưu trữ toàn cục.
   * @author: nttue (20/08/2023)
   */
  hideBackground(state) {
    state.showBackground = false;
  },
};

const getters = {};

const actions = {
  /**
   * Thực hiện loading khi đang thực hiện call api.
   * @author: nttue (20/08/2023)
   */
  showLoading({ commit }) {
    commit("showLoading");
  },

  /**
   * Thực hiện ẩn loading khi thực hiện call api xong.
   * @author: nttue (20/08/2023)
   */
  hideLoading({ commit }) {
    commit("hideLoading");
  },
};
export default { state, getters, mutations, actions };
