import { ref } from "vue";
import store from "@/store";
import MResources from "@/helper/resources";

const langResources = ref(MResources[store.state.settings.lang]);

/**
 * Phần tiêu đề cho các cột setting table.
 */
const settingHeader = [
  {
    field: "dragRowTable",
    headerName: "",
    textAlign: "center",
    width: 50,
    type: "icon",
    iconName: "icon-drop",
  },
  {
    field: "isShow",
    headerName: langResources.value.ShowColumnText,
    textAlign: "center",
    width: 100,
    type: "checkbox",
  },
  {
    field: "pinned",
    headerName: langResources.value.PinColumnText,
    textAlign: "center",
    width: 100,
    type: "checkbox",
  },

  {
    field: "dataColumnName",
    headerName: langResources.value.DataColumnText,
    textAlign: "left",
    type: "string",
    width: 200,
  },
  {
    field: "headerName",
    headerName: langResources.value.ColumnNameOnInterface,
    textAlign: "left",
    type: "input",
    width: 200,
  },
  {
    field: "width",
    headerName: langResources.value.WidthText,
    textAlign: "left",
    type: "input",
  },
];

export { settingHeader };
