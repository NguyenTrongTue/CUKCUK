<template>
  <DefaultLayout>
    <div class="main-content__top flex-between">
      <div class="main-content__title">{{ this.$MResources.materials }}</div>
      <mbutton
        :style="{
          height: 28 + 'px',
        }"
        img="/src/assets/viewEmail.png"
        :label="this.$MResources.Notification"
        typeButton="primary"
      ></mbutton>
    </div>

    <div class="main-content__center">
      <MToolbar
        :noData="noData"
        @onReload="handleReload"
        @onAdd="handleAdd"
        @onUpdate="handleUpdate"
        @onDuplicate="handleDuplicate"
        @onRemove="handleRemove"
        @onExport="handleExport"
        @onImport="handleImport"
        @onSetting="handleSettingTable"
      />
      <div class="table-container" @contextmenu="handleContextMenu">
        <mtable
          :columnsProp="columns"
          :rows="data"
          :propsRowChoosed="rowChoosed"
          :loadingProp="isLoading"
          @onChooseRow="handleChooseRow"
          @filter="onFilter"
          @onSort="onSort"
          @onUpdateRow="onUpdateRow"
        ></mtable>
      </div>
      <MPaging
        @choosePageSize="handleChoosePageSize"
        @choosePageNumber="handleChoosePageNumber"
        @onReload="handleReload"
        :totalRecords="length"
        :pageSizeProps="queryFilterObject.pageSize"
        :pageNumberProps="queryFilterObject.pageNumber"
        :totalPageProps="totalPage"
      />
    </div>

    <MaterialForm
      v-if="showForm"
      :material="materialEdit"
      :formModeProp="formMode"
      @onClose="handleCloseForm"
      @onReload="handleReload"
    />
  </DefaultLayout>
  <DeleteDialog
    v-if="showDialogDelete"
    :content="deleteDialogContent"
    :handleEvent="handleConfirmDelete"
    @onCloseDialog="handleCloseDialogDelete"
  />
  <MaterialImport
    v-if="showFormImport"
    @closeFormImport="handleCloseFormImport"
  />
  <MSettingTable ref="settingTableRef" />
  <mcontext :dataListProp="contextList" ref="contextRef" />
</template>
<script>
import { saveAs } from "file-saver";

import MToolbar from "@/components/toolbar/MToolbar.vue";
import MPaging from "@/components/paging/MPaging.vue";
import MSettingTable from "@/components/setting-table/MSettingTable.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { materialColumns } from "@/resource/datatable.js";

import MaterialForm from "@/views/material/material-form/MaterialForm.vue";
import MaterialImport from "@/views/material/material-import/MaterialImport.vue";
import materialService from "@/service/material.js";
import MaterialExcelService from "@/service/materialexcel";
import DeleteDialog from "@/views/base/DeleteDialog.vue";
import baseListMixin from "@/mixins/baseListMixin.vue";
import { createPrefixCode } from "@/utils/common";

export default {
  mixins: [baseListMixin],
  components: {
    DefaultLayout,
    MToolbar,
    MPaging,
    MaterialForm,
    DeleteDialog,
    MaterialImport,
    MSettingTable,
  },
  data() {
    return {
      // Thuộc tính hiển thị form nhập khẩu.
      showFormImport: false,

      // Thông tin tiêu đề cột.
      columns:
        JSON.parse(localStorage.getItem("table-setting")) || materialColumns,

      // Danh sách thông tin nguyên vật liệu.
      data: [],

      // Nội dung hiển thị trong dialog xóa NVL.
      deleteDialogContent: null,

      // các service của những đầu api cơ bản: thêm, sửa, xóa, lấy dữ liệu.
      baseService: materialService,

      // Tên danh sách
      nameList: "Material",
    };
  },

  computed: {
    /**
     * Computed lấy phần setting table.
     */
    settingTable() {
      var result = this.$store.getters.tableSetting;
      return result;
    },
  },

  /**
   * Hàm lọc dữ liệu bảng và gán giá trị bảng với các giá trị được lọc
   * @param {} object đối tượng lọc
   * @author: nttue (14/07/2023)
   */
  methods: {
    /**
     * Hàm thực hiện mở form để thêm 1 bản ghi mới.
     * @author: nttue (20/08/2023)
     */
    handleAdd() {
      this.materialEdit = {
        ExpiryType: this.$MResources.dayLabel,
        Category: this.$MResources.materials,
      };
      this.formMode = this.$MEnum.formMode.add;
      this.showForm = true;
    },

    /**
     * Hàm thực hiện cập nhập bản ghi dựa vào một hàng đang được chọn ở table.
     * Mặc định thì là hàng đầu tiên.
     * @author: nttue (20/08/2023)
     */
    handleUpdate() {
      this.materialEdit = {
        ...this.rowChoosed,
        ExpiryType: this.rowChoosed.ExpiryType || this.$MResources.dayLabel,
        Category: this.rowChoosed.Category || this.$MResources.materials,
      };
      this.formMode = this.$MEnum.formMode.update;
      this.showForm = true;
    },

    /**
     * Hàm thực hiện nhân bản dữ liệu.
     * Lúc này cần lấy thêm mã mới dựa vào tên của mã vật liệu nhân bản.
     * @author: nttue (20/08/2023)
     */
    async handleDuplicate() {
      const newCode =
        createPrefixCode(this.rowChoosed.MaterialName) +
        (await this.baseService.getNewCode());
      this.materialEdit = {
        ...this.rowChoosed,
        ExpiryType: this.rowChoosed.ExpiryType || this.$MResources.dayLabel,
        MaterialCode: newCode,
        Category: this.rowChoosed.Category || this.$MResources.materials,
      };
      this.formMode = this.$MEnum.formMode.replication;
      this.showForm = true;
    },

    /**
     * Hàm xuất khẩu dữ liệu thành file.
     * @author: nttue (20/08/2023)
     */
    async handleExport() {
      const blob = await MaterialExcelService.exportFileAsync(
        this.queryFilterObject
      );
      saveAs(blob, `${this.$MResources.ExportFileName}.xlsx`);
    },

    /**
     * Hàm hiển thị form nhập khẩu
     * @author: nttue (20/08/2023)
     */
    handleImport() {
      this.showFormImport = true;
    },

    /**
     * Hàm xử lý sự kiện đóng form nhập khẩu.
     * @param {Boolean} success - Trạng thái import là thành công hoặc thất bại.
     * @author: nttue (20/08/2023)
     */
    handleCloseFormImport(success) {
      this.showFormImport = false;
      success && this.handleReload();
    },

    /**
     * Hàm mở phần setting table.
     * @author: nttue (20/08/2023)
     */
    handleSettingTable() {
      this.$refs.settingTableRef.show();
    },
  },
  watch: {
    /**
     * Hàm gán mảng cấu hình cột.
     * @param {Array} newSetting mảng setting table.
     * @author: nttue (20/08/2023)
     */
    settingTable(newSetting) {
      this.columns = newSetting;
    },
  },
};
</script>

<style lang="scss">
@import "./material-list.scss";
</style>
