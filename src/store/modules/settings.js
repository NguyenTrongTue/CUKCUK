const state = () => ({
  collapse: false,
  lang: JSON.parse(localStorage.getItem("language-code")) || "vi",
  table: [],
});
const getters = {
  collapse: (state) => state.collapse,
  lang: () => {
    const code = localStorage.getItem("language-code");
    return code ? JSON.parse(code) : state.lang;
  },
  tableSetting: (state) => state.table,
};
const mutations = {
  /**
   * Thực hiện setting ngôn ngữ.
   * @author: nttue (20/08/2023)
   */
  setLanguage(state, payload) {
    state.lang = payload;
    localStorage.setItem("language-code", JSON.stringify(payload));
  },
  /**
   * Lưu lại những thay đổi của hiển thị bảng.
   * @author: nttue (20/08/2023)
   */
  saveSettingTable: (state, payload) => {
    state.table = payload.setting;
    localStorage.setItem("table-setting", JSON.stringify(state.table));
  },
  /**
   * Thực hiện toggle collapse sidebar.
   * @author: nttue (20/08/2023)
   */
  changeCollapse: (state) => {
    state.collapse = !state.collapse;
  },
  /**
   * Thực hiện hiện collapse sidebar.
   * @author: nttue (20/08/2023)
   */
  showCollapse: (state) => {
    state.collapse = true;
  },
  /**
   * Thực hiện ẩn collapse sidebar.
   * @author: nttue (20/08/2023)
   */
  hideCollapse: (state) => {
    state.collapse = false;
  },
};
const actions = {};
export default { state, getters, mutations, actions };
