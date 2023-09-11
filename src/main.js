import "@/styles/main.scss";

import { createApp } from "vue";
import MyEmitter from "tiny-emitter/instance";

import App from "./App.vue";
import MIcon from "@/components/icon/MIcon.vue";
import MButton from "@/components/button/MButton.vue";
import MTable from "@/components/table/MTable.vue";
import MCombobox from "@/components/combobox/MCombobox.vue";
import MInputText from "@/components/input-text/MInputText.vue";
import MSeparate from "@/components/separate/MSeparate.vue";
import MCheckbox from "@/components/checkbox/MCheckbox.vue";
import MPopup from "@/components/popup/MPopup.vue";
import MDialog from "@/components/dialog/MDialog.vue";
import MDialogMessage from "@/components/dialog-message/MDialogMessage.vue";
import MDatePicker from "@/components/date-picker/MDatePicker.vue";
import MContext from "@/components/context/MContext.vue";

import MLoading from "@/components/loading/MLoading.vue";

import MResources from "@/helper/resources";
import Enum from "@/helper/enum.js";

import MActionDropdown from "@/components/action-dropdown/MActionDropdown.vue";
import { clickOutsideDirective } from "@/directives/clickOutside.js";
import { customOutsideDirective } from "@/directives/eventOutSide.js";

import { router } from "@/router";
import store from "@/store";

import { Tippy } from "vue-tippy";
import "tippy.js/dist/tippy.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App);

app.component("micon", MIcon);
app.component("mbutton", MButton);
app.component("mtable", MTable);
app.component("minput", MInputText);
app.component("mcombobox", MCombobox);
app.component("mseparate", MSeparate);
app.component("mcheckbox", MCheckbox);
app.component("mpopup", MPopup);
app.component("mdialog", MDialog);
app.component("mloading", MLoading);
app.component("mdialog-message", MDialogMessage);
app.component("mtooltip", Tippy);
app.component("mdate-picker", VueDatePicker);
app.component("mdate", MDatePicker);
app.component("mcontext", MContext);

app.component("action-dropdown", MActionDropdown);
app.directive("click-outside", clickOutsideDirective);
app.directive("custom-outside", customOutsideDirective);

app.config.errorHandler = (error) => {
  console.log(error);
  // store.commit("dialog/setErrorMessage", {
  //   message: MResources["vi"].notConnected,
  // });
};

app.config.globalProperties.$MResources = MResources["vi"];
app.config.globalProperties.$MEnum = Enum;
app.config.globalProperties.$emitter = MyEmitter;
app.use(router).use(store).mount("#app");
