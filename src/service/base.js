import request from "@/utils/request.js";
import store from "@/store";

class BaseService {
  /**
   * @param {*} url base URL config
   * @author: nttue (20/07/2023)
   */
  constructor(url) {
    this.url = url;
  }
  /**
   * @description hàm lấy dữ liệu
   * @author: nttue (20/07/2023)
   */
  get() {
    return request.get(this.url);
  }
  /**
   * @description hàm cập nhật dữ liệu
   * @author: nttue (20/07/2023)
   */
  async update(id, object) {
    try {
      store.dispatch("showLoading");
      const res = await request.put(this.url + id, object);
      store.dispatch("hideLoading");

      return res;
    } catch (e) {
      store.dispatch("hideLoading");
      console.log(e);
    }
  }
  /**
   * @description hàm thêm mới dữ liệu
   * @author: nttue (20/07/2023)
   */
  async post(object) {
    try {
      store.dispatch("showLoading");
      const res = await request.post(this.url, object);
      store.dispatch("hideLoading");
      return res;
    } catch (e) {
      store.dispatch("hideLoading");
      console.log(e);
    }
  }
  /**
   * @description hàm xóa dữ liệu
   * @author: nttue (20/07/2023)
   */
  delete(id) {
    return request.delete(this.url + id);
  }

  /**
   * Hàm lọc dữ liệu
   * @param {Object} filterObject Đối tượng lọc dữ liệu
   * @returns Các bản ghi theo kết quả lọc
   * @author: nttue (20/07/2023)
   */
  filterObject(filterObject) {
    return request.post(this.url + "Filter", filterObject);
  }
}

export default BaseService;
