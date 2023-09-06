<template>
  <BaseList
    :listTitle="this.$MResources.StockLabel"
    :formNameProp="'Stock'"
    :serviceProp="serviceProp"
    :formInput="formInput"
    :columnHeader="columnHeader"
  />
</template>
<script>
import stockService from "@/service/stock.js";
import { stockColumns } from "@/resource/datatable.js";
import BaseList from "@/views/base/BaseList.vue";
import { StockFormInput } from "@/resource/dataform.js";
export default {
  name: "StockList",
  components: {
    BaseList,
  },
  data() {
    return {
      serviceProp: stockService,
      formInput: StockFormInput,
      columnHeader: stockColumns,
    };
  },
};
</script>
