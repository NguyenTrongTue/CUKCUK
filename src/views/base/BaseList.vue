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
          @onChooseRow="handleChooseRow"
          @onUpdateRow="onUpdateRow"
          @filter="onFilter"
          @onSort="onSort"
        ></mtable>
      </div>
      <MPaging
        :totalRecords="length"
        :pageSizeProps="queryFilterObject.pageSize"
        :pageNumberProps="queryFilterObject.pageNumber"
        :totalPageProps="totalPage"
        @onReload="handleReload"
        @choosePageSize="handleChoosePageSize"
        @choosePageNumber="handleChoosePageNumber"
      />
    </div>
  </DefaultLayout>
  <DeleteDialog
    v-if="showDialogDelete"
    :content="deleteDialogContent"
    :handleEvent="handleConfirmDelete"
    @onCloseDialog="handleCloseDialogDelete"
  />
  <MBaseForm
    v-if="showForm"
    :formHeader="objectForm.formHeader"
    :service="objectForm.service"
    :formData="objectForm.formData"
    :formName="objectForm.formName"
    :objectEdit="objectForm.objectEdit"
    :formMode="formMode"
    @closeForm="handleCloseForm"
    @updateList="handleUpdateList"
  />
  <mcontext :dataListProp="contextList" ref="contextRef" />
</template>
<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import MToolbar from "@/components/toolbar/MToolbar.vue";
import MPaging from "@/components/paging/MPaging.vue";
import DeleteDialog from "@/views/base/DeleteDialog.vue";
import MBaseForm from "@/components/base-form/MBaseForm.vue";
import baseListMixin from "@/mixins/baseListMixin.vue";

export default {
  mixins: [baseListMixin],
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
      // Thông tin tiêu đề cột.
      columns: this.columnHeader,

      // Danh sách thông tin dữ liệu.
      data: [],
      // các service của những đầu api cơ bản: thêm, sửa, xóa, lấy dữ liệu.
      baseService: this.serviceProp,

      // Đối tượng khi mở form lên.
      objectForm: {
        formHeader: "",
        service: this.serviceProp,
        formData: this.formInput,
        formName: this.formNameProp,
        objectEdit: null,
      },
      // Tên danh sách
      nameList: this.formNameProp,
    };
  },
  methods: {
    /**
     * Hàm thực hiện sự kiện cập nhật danh sách.
     * @author: nttue (20/08/2023)
     */
    handleUpdateList() {
      this.showForm = false;
      this.filter(this.queryFilterObject);
    },

    /**
     * Mở form với chế độ và dữ liệu cụ thể.
     * @param {string} formMode Chế độ của form (add, edit, view, etc.).
     * @param {string} formHeader Tiêu đề của form.
     * @param {object|null} objectEdit Đối tượng cần chỉnh sửa (nếu có).
     */
    handleOpenForm(formMode, formHeader, objectEdit = null) {
      // Hiển thị form.
      this.showForm = true;

      // Đặt chế độ form.
      this.formMode = formMode;

      // Đặt tiêu đề form.
      this.objectForm.formHeader = formHeader;

      // Đặt đối tượng cần chỉnh sửa, hoặc đặt là một đối tượng trống nếu không có đối tượng được truyền vào.
      this.objectForm.objectEdit = objectEdit ? { ...objectEdit } : {};
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
     * Xử lý việc sao chép dữ liệu của dòng đã chọn và mở form trong chế độ thêm mới với dữ liệu sao chép.
     * Hàm này thường được gọi khi người dùng muốn tạo một bản sao của dòng dữ liệu hiện tại.
     * @author: nttue (20/08/2023)
     */
    async handleDuplicate() {
      // Lấy mã mới dựa trên mã cũ và in ra console
      const newCode = this.createNewCode(
        this.rowChoosed[`${this.nameList}Code`]
      );

      // Tạo một bản sao của dòng dữ liệu đã chọn với mã mới
      const duplicatedRow = {
        ...this.rowChoosed,
      };
      duplicatedRow[`${this.nameList}Code`] = newCode;

      // Mở form với chế độ thêm mới và dữ liệu sao chép
      this.handleOpenForm(
        this.$MEnum.formMode.add,
        this.$MResources.FormName[this.formNameProp].edit,
        duplicatedRow
      );
    },

    /**
     * Hàm tạo mã mới từ mã cũ của bản ghi.
     * @param {String} oldCode - Code cũ của bản ghi.
     * @returns {String} - Trả về mã mới.
     * @author: nttue (20/08/2023)
     */
    createNewCode(oldCode) {
      let numbers = "";
      let remaining = oldCode;

      // Bắt đầu từ cuối chuỗi và kiểm tra từng ký tự
      for (let i = oldCode.length - 1; i >= 0; i--) {
        const char = oldCode[i];

        // Kiểm tra xem ký tự có phải là số hay không
        if (!isNaN(parseInt(char))) {
          numbers = char + numbers; // Thêm ký tự số vào chuỗi số
          remaining = remaining.slice(0, -1); // Loại bỏ ký tự số khỏi chuỗi còn lại
        } else {
          // Nếu gặp ký tự không phải số, dừng vòng lặp
          break;
        }
      }

      return remaining + (+numbers + 1);
    },
  },
};
</script>
