<template>
  <BaseList
    :listTitle="this.$MResources.MaterialLabel"
    :formNameProp="'MaterialGroup'"
    :serviceProp="serviceProp"
    :formInput="formInput"
    :columnHeader="columnHeader"
  />
</template>
<script>
import BaseList from "@/views/base/BaseList.vue";
import materialGroupService from "@/service/materialGroup.js";
import { materialGroupColumns } from "@/resource/datatable.js";
import { MaterialGroupFormInput } from "@/resource/dataform.js";
export default {
  name: "MaterialGroupList",
  components: {
    BaseList,
  },
  data() {
    return {
      serviceProp: materialGroupService,
      formInput: MaterialGroupFormInput,
      columnHeader: materialGroupColumns,
    };
  },
};
</script>
