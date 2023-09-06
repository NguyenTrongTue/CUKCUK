import { createStore } from "vuex";

import toast from "./modules/toast";
import dialog from "./modules/dialog";
import settings from "./modules/settings";
import date from "./modules/date";
import table from "./modules/table";
import loading from "./modules/loading";

const store = createStore({
  modules: {
    toast,
    dialog,
    settings,
    date,
    table,
    loading,
  },
});

export default store;
