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
          :rows="materials"
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
        :pageSizeProps="this.queryFilterObject.pageSize"
        :pageNumberProps="this.queryFilterObject.pageNumber"
        :totalPageProps="this.totalPage"
      />
    </div>

    <MaterialForm
      v-if="showForm"
      :material="materialEdit"
      :formMode="formMode"
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

export default {
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
      /**
       * Mảng chứa thông tin của context menu bao gồm:
       * icon: icon của item trong context menu.
       * text: text của item trong context menu.
       * function: hàm kích hoạt khi click chuột vào item trong context menu.
       */
      contextList: [
        {
          icon: "icon-add",
          text: this.$MResources.AddText,
          method: this.handleAdd,
        },
        {
          icon: "icon-replication",
          text: this.$MResources.ReplicationText,
          method: this.handleDuplicate,
        },
        {
          icon: "icon-edit",
          text: this.$MResources.EditText,
          method: this.handleUpdate,
        },
        {
          icon: "icon-remove",
          text: this.$MResources.DeleteText,
          method: this.handleRemove,
        },
        {
          icon: "icon-add",
          text: this.$MResources.ReloadText,
          method: this.handleReload,
        },
      ],

      // Thuộc tính hiển thị form nhập khẩu.
      showFormImport: false,

      // Thuộc tính hiển thị loading ở table.
      isLoading: false,

      // Thuộc tính hiển thị không có dữ liệu.
      noData: false,

      // Thuộc tính hiển thị form thêm mới.
      showForm: false,

      // Thuộc tính hiển thị dialog cảnh báo khi xóa.
      showDialogDelete: false,

      // Thông tin tiêu đề cột.
      columns: [],

      // Danh sách thông tin nguyên vật liệu.
      materials: [],

      // Nội dung hiển thị trong dialog xóa NVL.
      deleteDialogContent: null,

      // Hàng đang được chọn trên bảng.
      rowChoosed: null,

      /**
       * Đối tượng để lọc dữ liệu.
       */
      queryFilterObject: {
        pageSize: 25,
        pageNumber: 1,
        filter: [],
        sort: [],
      },

      // Đối tượng lọc cũ.
      oldQueryFilterObject: null,

      // Tổng số trang: mặc định là 0.
      totalPage: 0,

      // Chế độ form.
      formMode: this.$MEnum.formMode.add,

      // Tổng số bản ghi: mặc định là 0.
      length: 0,
    };
  },
  // gán giá trị tiêu đề cột = EmployeeColumns được khai báo sẵn trong resouce
  created() {
    // Lấy thông tin tiêu đề cột được lưu ở localStorage
    const data = JSON.parse(localStorage.getItem("table-setting"));

    // Nếu không có thì lấy ở file lưu trữ ngầm định ban đầu.
    const array = data || materialColumns;
    this.columns = array.map((column) => {
      return {
        ...column,
        value: "",
      };
    });
  },
  // Thực hiện lấy dữ liệu khi component mounted và DOM.
  mounted() {
    this.filter(this.queryFilterObject);
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
    handleCloseFormImport(success) {
      this.showFormImport = false;
      success && this.handleReload();
    },
    /**
     * Hàm thực hiện đóng phần context ở table khi click outside ra khỏi phần tử đó.
     * @author: nttue (20/08/2023)
     */
    handleClickOutSideContext() {
      this.showContext = false;
    },

    /**
     * Hàm thực hiện mở phần context khi người dùng nhấn chuột phải.
     * @param {Object} event đối tượng event khi click.
     * @author: nttue (20/08/2023)
     */
    handleContextMenu(event) {
      event.stopPropagation();
      event.preventDefault();
      this.$refs.contextRef.show(event);
    },

    /**
     * Hàm xử lý sự kiện update 1 hàng từ component table.
     * @author: nttue (20/08/2023)
     */
    onUpdateRow(row) {
      this.rowChoosed = row;
      this.handleUpdate();
    },

    /**
     * Hàm xử lý sự kiện sắp xếp từ component table.
     * @author: nttue (20/08/2023)
     */
    onSort(query) {
      this.queryFilterObject.sort = [...query];
    },

    /**
     * Hàm xử lý sự kiện lọc từ component table.
     * @author: nttue (20/08/2023)
     */
    onFilter(query) {
      this.queryFilterObject.filter = [...query];
    },

    /**
     * Hàm xử lý sự kiện chọn kích thước trang.
     * @author: nttue (20/08/2023)
     */
    handleChoosePageSize(newPageSize) {
      this.queryFilterObject.pageSize = newPageSize;
    },

    /**
     * @param newPageSize vị trí trang mới
     * @author: nttue (20/08/2023)
     */
    handleChoosePageNumber(newPageNumber) {
      this.queryFilterObject.pageNumber = newPageNumber;
    },

    /**
     * Hàm xóa 1 bản ghi.
     * @param {String} id id của phần tử bị xóa
     * @author: nttue (20/08/2023)
     */
    async handleConfirmDelete() {
      try {
        // Thực hiện call API để xóa NVL.
        await materialService.delete(this.rowChoosed.id);
        // Gọi commit để hiện toast thông báo về tình trạng xóa.
        this.$store.commit("showToast", {
          label: this.$MResources.ToastMessage.MaterialDelete,
        });
        this.handleReload();
        this.handleCloseDialogDelete();
      } catch (e) {
        this.handleCloseDialogDelete();
        console.log(e);
      }
    },
    /**
     * Hàm thực hiện đóng dialog cảnh báo khi người dùng xóa một bản ghi.
     * @author: nttue (20/08/2023)
     */
    handleCloseDialogDelete() {
      this.showDialogDelete = false;
    },

    /**
     * Hàm thực hiện lọc, phân trang, sắp xếp.
     * @param object đối tượng lọc
     * @author: nttue (20/08/2023)
     */
    async filter(object) {
      try {
        this.isLoading = true;
        this.materials = []; // Xóa dữ liệu hiện tại
        const res = await materialService.filterObject(object);

        this.materials = res.Data.map((item) => {
          return {
            ...item,
            id: item.MaterialId,
            ExpiryType: item.ExpiryType ?? this.$MResources.dayLabel,
          };
        });

        // chuyển trạng thái loading về false.
        this.isLoading = false;

        // gán tổng số bản ghi
        this.length = res.TotalRecord;
        this.rowChoosed = this.materials[0];
        this.totalPage = res.TotalPage;
      } catch (e) {
        this.isLoading = false;
        console.log(e);
      }
    },

    /**
     * Hàm thực hiện reload lại dữ liệu.
     * @author: nttue (20/08/2023)
     */
    handleReload() {
      this.filter(this.queryFilterObject);
    },

    /**
     * Hàm thực hiện mở form để thêm 1 bản ghi mới.
     * @author: nttue (20/08/2023)
     */
    handleAdd() {
      this.materialEdit = { ExpiryType: this.$MResources.dayLabel };
      this.formMode = this.$MEnum.formMode.add;
      this.showForm = true;
    },

    /**
     * Hàm thực hiện cập nhập bản ghi dựa vào một hàng đang được chọn ở table.
     * Mặc định thì là hàng đầu tiên.
     * @author: nttue (20/08/2023)
     */
    handleUpdate() {
      this.materialEdit = { ...this.rowChoosed };
      this.formMode = this.$MEnum.formMode.update;
      this.showForm = true;
    },

    /**
     * Hàm thực hiện nhân bản dữ liệu.
     * Lúc này cần lấy thêm mã mới dựa vào tên của mã vật liệu nhân bản.
     * @author: nttue (20/08/2023)
     */
    async handleDuplicate() {
      const newCode = await materialService.getNewCode(
        this.rowChoosed.MaterialName
      );
      this.materialEdit = {
        ...this.rowChoosed,
        MaterialCode: newCode,
      };
      this.formMode = this.$MEnum.formMode.replication;
      this.showForm = true;
    },

    /**
     * Hàm thực hiện mở dialog cảnh báo khi người dùng xóa một nguyên vật liệu.
     * @author: nttue (20/08/2023)
     */
    handleRemove() {
      this.showDialogDelete = true;
      const id = this.rowChoosed.MaterialId;
      this.deleteDialogContent = {
        label: `${this.$MResources.deleteMaterialLabel} <<${this.rowChoosed.MaterialName} - ${this.rowChoosed.MaterialCode}>> ${this.$MResources.noLabel}?`,
        id,
      };
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
     * Hàm mở phần setting table.
     * @author: nttue (20/08/2023)
     */
    handleSettingTable() {
      this.$refs.settingTableRef.show();
    },
    /**
     * Hàm xử lý sự kiện khi người dùng chọn 1 hàng.
     * @author: nttue (20/08/2023)
     */
    handleChooseRow(item) {
      this.rowChoosed = item;
    },

    /**
     * Hàm thực hiện đóng form material.
     * @author: nttue (20/08/2023)
     */
    handleCloseForm() {
      this.showForm = false;
    },

    /**
     * Hàm thực hiện xử lý sự kiện khi người dùng lưu thông tin trong form.
     * @author: nttue (20/08/2023)
     */
    handleSaveForm(newObject) {
      this.showForm = false;
      if (newObject) {
        const existingIndex = this.materials.findIndex(
          (item) => item.id === newObject.MaterialId
        );

        const updatedObject = { ...newObject, id: newObject.MaterialId };

        if (existingIndex > -1) {
          this.materials[existingIndex] = updatedObject;
        } else {
          this.materials.unshift(updatedObject);
        }
      }
    },
    /**
     * Hàm so sánh 2 đối tượng.
     * @param {Object} obj1
     * @param {Object} obj2
     * @author: nttue (20/08/2023)
     */
    areObjectsEqual(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
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

    /**
     * Hàm kiểm tra xem có dữ liệu hay không.
     * @param {Number} newLength Hàm watch sự thay đổi của độ dài bản ghi.
     * @author: nttue (20/08/2023)
     */
    "materials.length": function (newLength) {
      this.noData = newLength === 0;
    },
    /**
     * Mỗi khi đối tượng lọc thay đổi.
     * Tiến hành gửi request để lọc dữ liệu theo những thay đổi đó.
     * @author: nttue (20/08/2023)
     */
    queryFilterObject: {
      handler(newObject) {
        // Thực hiện so sánh xem đối tượng lọc cũ và đối tượng lọc mới có khác nhau không
        // => có => filter dữ liệu
        // => không => không làm gì.
        if (!this.areObjectsEqual(this.oldQueryFilterObject, newObject)) {
          this.filter(newObject);
          this.oldQueryFilterObject = JSON.parse(JSON.stringify(newObject));
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
@import "./material-list.scss";
</style>
