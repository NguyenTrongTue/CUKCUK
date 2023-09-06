import request from "@/utils/request.js";

class UnitConversionService {
  /**
   * @description hàm lấy dữ liệu theo id của material
   * @author: nttue (20/07/2023)
   */
  getListByMaterialId(materialId) {
    return request.get("UnitConversions/" + materialId);
  }
}

const instance = new UnitConversionService();

export default instance;
