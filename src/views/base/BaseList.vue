<template>
  <DefaultLayout>
    <div class="main-content__top flex-between">
      <div class="main-content__title">{{ listTitle }}</div>
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
        :isBase="true"
        @onReload="handleReload"
        @onAdd="handleAdd"
        @onUpdate="handleUpdate"
        @onDuplicate="handleDuplicate"
        @onRemove="handleRemove"
      />
      <div class="table-container" @contextmenu="handleContextMenu">
        <mtable
          :columnsProp="columns"
          :rows="data"
          :propsRowChoosed="rowChoosed"
          :loadingProp="isLoading"
          :allowEditColumns="false"
          @onChooseRow="handleChooseRow"
          @onUpdateRow="onUpdateRow"
          @filter="onFilter"
          @onSort="onSort"
        ></mtable>
      </div>
      <MPaging
        :totalRecords="length"
        :pageSizeProps="pageSize"
        :pageNumberProps="pageNumber"
        :totalPageProps="totalPage"
        @onReload="handleReload"
      />
    </div>
  </DefaultLayout>
  <DeleteDialog
    v-if="showDialogDelete"
    :content="deleteDialogContent"
    :handleEvent="handleComfirmDelete"
    @onCloseDialog="handleCloseDialogDelete"
  />
  <MBaseForm
    v-if="showSubForm"
    :formHeader="objectForm.formHeader"
    :service="objectForm.service"
    :formData="objectForm.formData"
    :formName="objectForm.formName"
    :objectEdit="objectForm.objectEdit"
    :formMode="formMode"
    @closeForm="handleCloseSubForm"
    @updateList="handleUpdateList"
  />
</template>
<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import MToolbar from "@/components/toolbar/MToolbar.vue";
import MPaging from "@/components/paging/MPaging.vue";
import DeleteDialog from "./DeleteDialog.vue";
import MBaseForm from "@/components/base-form/MBaseForm.vue";

export default {
  components: {
    DefaultLayout,
    MToolbar,
    MPaging,
    DeleteDialog,
    MBaseForm,
  },
  props: {
    listTitle: {
      type: String,
      required: true,
    },
    serviceProp: {
      type: Object,
      required: true,
    },
    formNameProp: {
      type: String,
      required: true,
    },
    formInput: {
      type: Array,
      required: true,
    },
    columnHeader: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showSubForm: false,
      noData: false,
      showDialogDelete: false,
      isLoading: false,
      leftContext: 0,
      topContext: 0,
      length: 0,
      pageSize: 100,
      pageNumber: 1,
      totalPage: 1,
      columns: this.columnHeader,
      rowChoosed: null,
      data: [],
      objectForm: {
        formHeader: "",
        service: this.serviceProp,
        formData: this.formInput,
        formName: this.formNameProp,
        objectEdit: null,
      },
      // Đối tượng lọc cũ.
      oldQueryFilterObject: null,
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
      // Chế độ form.
      formMode: this.$MEnum.formMode.add,
      /**
       * Đối tượng để lọc dữ liệu.
       */
      queryFilterObject: {
        pageSize: 25,
        pageNumber: 1,
        filter: [],
        sort: [],
      },
    };
  },
  mounted() {
    this.filter(this.queryFilterObject);
  },
  methods: {
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
     * Hàm thực hiện sự kiện đóng subform.
     * @author: nttue (20/08/2023)
     */
    handleCloseSubForm() {
      this.showSubForm = false;
    },
    /**
     * Hàm thực hiện sự kiện cập nhật danh sách.
     * @author: nttue (20/08/2023)
     */
    handleUpdateList() {
      this.showSubForm = false;
      this.filter(this.queryFilterObject);
    },

    /**
     * Hàm xử lý sự kiện khi người dùng chọn 1 hàng.
     * @author: nttue (20/08/2023)
     */
    handleChooseRow(item) {
      this.rowChoosed = item;
    },

    /**
     * Hàm thực hiện lọc, phân trang, sắp xếp.
     * @param object đối tượng lọc
     * @author: nttue (20/08/2023)
     */
    async filter(object) {
      try {
        this.isLoading = true;
        this.data = []; // Xóa dữ liệu hiện tại
        const res = await this.serviceProp.filterObject(object);

        this.data = res.Data.map((item) => {
          return {
            ...item,
            id: item[`${this.formNameProp}Id`],
          };
        });

        // chuyển trạng thái loading về false.
        this.isLoading = false;

        // gán tổng số bản ghi
        this.length = res.TotalRecord;
        this.rowChoosed = this.data[0];
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
    handleOpenForm(formMode, formHeader, objectEdit = null) {
      this.showSubForm = true;
      if (objectEdit) {
        this.objectForm.objectEdit = { ...objectEdit };
      } else {
        this.objectForm.objectEdit = {};
      }
      this.formMode = formMode;
      this.objectForm.formHeader = formHeader;
    },

    /**
     * Hàm thực hiện mở form để thêm 1 bản ghi mới.
     * @author: nttue (20/08/2023)
     */
    handleAdd() {
      this.handleOpenForm(
        this.$MEnum.formMode.add,
        this.$MResources.FormName[this.formNameProp].add
      );
    },

    /**
     * Hàm thực hiện cập nhập bản ghi dựa vào một hàng đang được chọn ở table.
     * Mặc định thì là hàng đầu tiên.
     * @author: nttue (20/08/2023)
     */
    handleUpdate() {
      this.handleOpenForm(
        this.$MEnum.formMode.update,
        this.$MResources.FormName[this.formNameProp].edit,
        this.rowChoosed
      );
    },

    /**
     * Hàm thực hiện nhân bản dữ liệu.
     * Lúc này cần lấy thêm mã mới dựa vào tên của mã vật liệu nhân bản.
     * @author: nttue (20/08/2023)
     */
    async handleDuplicate() {
      this.handleOpenForm(
        this.$MEnum.formMode.add,
        this.$MResources.FormName[this.formNameProp].edit,
        this.rowChoosed
      );
    },

    /**
     * Hàm thực hiện mở dialog cảnh báo khi người dùng xóa một nguyên vật liệu.
     * @author: nttue (20/08/2023)
     */
    handleRemove() {
      this.showDialogDelete = true;
      const id = this.rowChoosed.id;
      this.deleteDialogContent = {
        label: `${this.$MResources.DeleteLabel[this.formNameProp]} <<${
          this.rowChoosed[this.formInput[0].name]
        }>> ${this.$MResources.noLabel}?`,
        id,
      };
    },

    /**
     * Hàm xử lý sự kiện xóa.
     * @author: nttue (20/08/2023)
     */
    handleDelete() {
      this.handleCloseDialogDelete();
      this.handleReload();
    },

    /**
     * Hàm xóa 1 bản ghi.
     * @param {String} id id của phần tử bị xóa
     * @author: nttue (20/08/2023)
     */
    async handleComfirmDelete() {
      try {
        await this.serviceProp.delete(this.rowChoosed.id);
        this.$store.commit("showToast", {
          label: this.$MResources.ToastMessage[this.formNameProp].delete,
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
     * Mỗi khi đối tượng lọc thay đổi.
     * Tiến hành gửi request để lọc dữ liệu theo những thay đổi đó.
     * @author: nttue (20/08/2023)
     */
    queryFilterObject: {
      handler(newObject) {
        console.log(newObject);
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
@import "./base.scss";
</style>
