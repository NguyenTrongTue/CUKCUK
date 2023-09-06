<template>
  <BaseList
    :listTitle="this.$MResources.UnitLabel"
    :formNameProp="'Unit'"
    :serviceProp="serviceProp"
    :formInput="formInput"
    :columnHeader="columnHeader"
  />
</template>
<script>
import unitService from "@/service/unit.js";
import { unitColumns } from "@/resource/datatable.js";
import BaseList from "@/views/base/BaseList.vue";
import { UnitFormInput } from "@/resource/dataform.js";
export default {
  name: "UnitList",
  components: {
    BaseList,
  },
  data() {
    return {
      serviceProp: unitService,
      formInput: UnitFormInput,
      columnHeader: unitColumns,
    };
  },
};
</script>
