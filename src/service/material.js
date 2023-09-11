import request from "@/utils/request.js";
import BaseService from "@/service/base";

class materialService extends BaseService {
  constructor() {
    super("Materials/");
  }
  /**
   * Hàm lấy mã nhân viên mới từ be
   * @returns Trả về mã nhân viên mới nhát
   * @author: nttue (20/07/2023)
   */
  getNewCode() {
    return request.get(this.url + "GetNewCode");
  }

  /**
   * Hàm lấy ra các đơn vị chuyển đổi theo ID của material.
   * @author: nttue (20/08/2023)
   */
  getUnitConversion(materialId) {
    return request.get(this.url + "UnitConversion", {
      params: {
        materialId,
      },
    });
  }
}

const instance = new materialService();

export default instance;
