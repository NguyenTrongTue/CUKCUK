import { ref } from "vue";

import store from "@/store";
import MResources from "@/helper/resources";
const langResources = ref(MResources[store.state.settings.lang]);
/**
 * Danh sách loại thời gian: ngày, tháng, năm.
 */
export const datetime = [
  {
    id: langResources.value.dayLabel,
    name: langResources.value.dayLabel,
  },
  { id: langResources.value.monthLabel, name: langResources.value.monthLabel },
  { id: langResources.value.yearLabel, name: langResources.value.yearLabel },
];

/**
 * Mảng chứa thông tin chuyển phần tính chất.
 */
export const categories = [
  { id: langResources.value.materials, name: langResources.value.materials },
  { id: langResources.value.otherItem, name: langResources.value.otherItem },
  {
    id: langResources.value.bottledDrinks,
    name: langResources.value.bottledDrinks,
  },
];
/**
 * Toán tử trong phần phép tính đơn vị chuyển đổi.
 */
export const operator = [
  { id: "*", name: "*", label: langResources.value.Divide },
  { id: "/", name: "/", label: langResources.value.Substract },
];
/**
 * Tiêu đề cột trong combobox của stock.
 */
export const columnsCombobox = [
  {
    field: "code",
    headerName: langResources.value.CodeText,
  },
  {
    field: "name",
    headerName: langResources.value.NameText,
  },
];
/**
 * Đối tượng mẫu của unitconversion.
 * Khi thêm hàng thì add đối tượng này vào mảng unitRows.
 */
export const unitRowTemplate = {
  Order: 1,
  UnitId: "",
  ConversionRate: 1.0,
  Calculation: "*",
  Description: "",
  Mode: 1,
};
