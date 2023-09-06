const state = () => ({
  sortArray: [],
  pinnedArray: [],
  queryString: "",
});

const getters = {
  /**
   * Thực hiện lấy ra chuỗi truy vấn lọc bảng.
   * @author: nttue (20/08/2023)
   */
  getQueryString(state) {
    var queryArray = state.sortArray
      .map((item) => {
        var query = `${item.value}${item.field}`;
        return query;
      })
      .join(",");

    return queryArray;
  },
  /**
   * Kiểm tra xem 1 cột có đang ở chế độ sắp xếp không dựa vào field của cột.
   * @author: nttue (20/08/2023)
   */
  checkIsSorting: (state) => (field) => {
    var index = state.sortArray.findIndex((item) => item.field === field);
    if (index !== -1) {
      return state.sortArray[index].value;
    } else {
      return "";
    }
  },
};

const mutations = {
  /**
   * Hàm thực hiện sort cột dựa vào tên trường của cột.
   * @param {String} field trường của bảng cần sort.
   * @author: nttue (20/08/2023)
   */
  onSort(state, field) {
    var index = state.sortArray.findIndex((item) => item.field === field);
    if (index === -1) {
      state.sortArray.push({
        field,
        value: "-",
      });
    } else {
      if (state.sortArray[index].value === "-") {
        state.sortArray[index].value = "+";
      } else {
        state.sortArray = state.sortArray.filter(
          (item) => item.field !== field
        );
      }
    }
  },

  /**
   * Hàm thực hiện ghim cột dựa vào tên trường của cột.
   * @param {String} field trường của bảng cần ghim.
   * @author: nttue (20/08/2023)
   */
  onPinned(state, field) {
    var index = state.pinnedArray.findIndex((item) => item === field);
    if (index !== -1) {
      state.pinnedArray.push(field);
    } else {
      state.pinnedArray = state.pinnedArray.filter((item) => item !== field);
    }
  },
};

const actions = {};
export default { state, getters, mutations, actions };
