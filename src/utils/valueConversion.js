import {
  formatDate,
  convertNumberDecimalToString,
  formatMoney,
} from "@/utils/common";
import { ref } from "vue";
import MResources from "@/helper/resources";
const langResources = ref(MResources["vi"]);

/**
 *  Chuyển đổi giá trị dạng thô sang các giá trị hợp lên để hiện thị trong bảng
 * @param {String} value giá trị dữ liệu của một trường
 * @param {String} type định dạng loại dữ liệu đầu vào
 * @returns các giá trị đã được chuyển đổi hợp lên
 * @author Nguyễn Trọng Tuế
 * Modified at : 28/06/2023
 */
export default function valueConversion(value, type) {
  try {
    switch (type) {
      case "datetime":
        return value ? formatDate(value) : "";
      case "money":
        return value ? formatMoney(value) : "";
      case "decimal":
        return convertNumberDecimalToString(value);
      case "status":
        return value == 0
          ? langResources.value.Invalid
          : langResources.value.Valid;
      default:
        return value ? value : "";
    }
  } catch (e) {
    console.log(e);
  }
}
