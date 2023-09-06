export const UnitFormInput = [
  {
    label: "Đơn vị tính",
    ref: "UnitCode",
    name: "UnitCode",
    rules: "required",
    typeInput: "input",
  },
  {
    label: "Mô tả",
    ref: "Description",
    name: "Description",
    typeInput: "textarea",
  },
];

export const StockFormInput = [
  {
    label: "Mã kho",
    ref: "StockCode",
    name: "StockCode",
    rules: "required",
    typeInput: "input",
  },
  {
    label: "Tên kho",
    ref: "StockName",
    name: "StockName",
    rules: "required",
    typeInput: "input",
  },
  {
    label: "Địa chỉ",
    ref: "Address",
    name: "Address",
    typeInput: "textarea",
  },
];

export const MaterialGroupFormInput = [
  {
    label: "Mã nhóm",
    ref: "MaterialGroupCode",
    name: "MaterialGroupCode",
    rules: "required",
    typeInput: "input",
  },
  {
    label: "Tên nhóm",
    ref: "MaterialGroupName",
    name: "MaterialGroupName",
    rules: "required",
    typeInput: "input",
  },
  {
    label: "Mô tả",
    ref: "Description",
    name: "Description",
    typeInput: "textarea",
  },
];
