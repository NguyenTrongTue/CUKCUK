import { createRouter, createWebHistory } from "vue-router";
import MaterialList from "@/views/material/material-list/MaterialList.vue";
import MaterialGroupList from "@/views/material-group/MaterialGroupList.vue";
import UnitList from "@/views/unit/UnitList.vue";
import StockList from "@/views/stock/StockList.vue";

const routes = [
  {
    name: "material-list",
    component: MaterialList,
    path: "/",
    meta: { requiresAuth: false, title: "CUKCUK" },
  },
  {
    name: "material-group",
    component: MaterialGroupList,
    path: "/material-group",
    meta: { requiresAuth: false, title: "CUKCUK" },
  },
  {
    name: "stock",
    component: StockList,
    path: "/stock",
    meta: { requiresAuth: false, title: "CUKCUK" },
  },
  {
    name: "unit",
    component: UnitList,
    path: "/unit",
    meta: { requiresAuth: false, title: "CUKCUK" },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
