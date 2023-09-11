<template></template>
<script>
export default {
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

      /**
       * Chế độ form.
       */
      formMode: this.$MEnum.formMode.add,

      /**
       * Đối tượng lọc cũ.
       */
      oldQueryFilterObject: {
        pageSize: 25,
        pageNumber: 1,
        filter: [],
        sort: [],
      },

      /**
       * Hàng đang được chọn trên bảng.
       */
      rowChoosed: null,

      /**
       * Thuộc tính hiển thị loading ở table.
       */
      isLoading: false,

      /**
       * Thuộc tính hiển thị khi không có dữ liệu.
       */
      noData: false,

      /**
       * Thuộc tính hiển thị form thêm mới.
       */
      showForm: false,
      /*
       * Thuộc tính hiển thị dialog cảnh báo khi xóa.
       */
      showDialogDelete: false,
      /*
       * Tổng số trang: mặc định là 0.
       */
      totalPage: 0,

      /*
       * Tổng số bản ghi: mặc định là 0.
       */
      length: 0,
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
  watch: {
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

    /**
     * Hàm kiểm tra xem có dữ liệu hay không.
     * @param {Number} newLength Hàm watch sự thay đổi của độ dài bản ghi.
     * @author: nttue (20/08/2023)
     */
    "data.length": function (newLength) {
      this.noData = newLength === 0;
    },
  },
  methods: {
    /**
     * Hàm thực hiện lọc, phân trang, sắp xếp.
     * @param object đối tượng lọc
     * @author: nttue (20/08/2023)
     */
    async filter(object) {
      try {
        this.isLoading = true;
        this.data = []; // Xóa dữ liệu hiện tại
        const res = await this.baseService.filterObject(object);

        this.data = res.Data.map((item) => {
          return {
            ...item,
            id: item[`${this.nameList}Id`],
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
     * Hàm xóa 1 bản ghi.
     * @param {String} id id của phần tử bị xóa
     * @author: nttue (20/08/2023)
     */
    async handleConfirmDelete() {
      try {
        // Thực hiện call API để xóa NVL.
        await this.baseService.delete(this.rowChoosed.id);
        // Gọi commit để hiện toast thông báo về tình trạng xóa.
        this.$store.dispatch("showToast", {
          label: this.$MResources.ToastMessage[this.nameList].delete,
        });
        this.handleReload();
        this.handleCloseDialogDelete();
      } catch (e) {
        this.handleCloseDialogDelete();
        console.log(e);
      }
    },
    /**
     * Hàm thực hiện mở dialog cảnh báo khi người dùng xóa một nguyên vật liệu.
     * @author: nttue (20/08/2023)
     */
    handleRemove() {
      this.showDialogDelete = true;
      const id = this.rowChoosed[`${this.nameList}Id`];
      this.deleteDialogContent = {
        label: `${this.$MResources.DeleteLabel[this.nameList]} <<${
          this.rowChoosed[`${this.nameList}Code`]
        }>> ${this.$MResources.noLabel}?`,
        id,
      };
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
    /**
     * Hàm thực hiện đóng dialog cảnh báo khi người dùng xóa một bản ghi.
     * @author: nttue (20/08/2023)
     */
    handleCloseDialogDelete() {
      this.showDialogDelete = false;
    },

    /**
     * Hàm thực hiện sự kiện đóng form.
     * @author: nttue (20/08/2023)
     */
    handleCloseForm() {
      this.showForm = false;
    },
    /**
     * Hàm xử lý sự kiện khi người dùng chọn 1 hàng.
     * @author: nttue (20/08/2023)
     */
    handleChooseRow(item) {
      this.rowChoosed = item;
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
      this.queryFilterObject.pageNumber = 1;
      this.queryFilterObject.filter = [...query];
    },

    /**
     * Hàm thực hiện reload lại dữ liệu.
     * @author: nttue (20/08/2023)
     */
    handleReload() {
      this.filter(this.queryFilterObject);
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
  },
};
</script>
