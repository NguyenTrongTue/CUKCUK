<template>
  <mpopup :headerTile="formHeader" :hasClose="true" @closePopup="closePopup">
    <template #content>
      <div class="dialog__container-content" ref="baseform">
        <div
          class="unit-form__item grid_row"
          v-for="(item, index) in formData"
          :key="index"
        >
          <minput
            style="width: 100%"
            :label="item.label"
            :name="item.name"
            :formName="formName"
            :ref="item.ref"
            :typeInput="item.typeInput"
            v-model="objectCreate[item.name]"
            :rules="item.rules"
            :tabIndex="startTabIndex + 1"
          />
        </div>
      </div>
      <div class="dialog-footer flex-between">
        <div>
          <mbutton
            icon="icon-help"
            :label="this.$MResources.HelpText"
            typeButton="primary"
            ref="buttonHelpRef"
            :tabindex="startTabIndex + formData.length + 2"
          ></mbutton>
        </div>
        <div class="flex-start dialog-footer__right">
          <mbutton
            img="/src/assets/imgs/save.webp"
            :label="this.$MResources.SaveText"
            :tabindex="startTabIndex + formData.length"
            typeButton="primary"
            @click="handleSaveForm"
          ></mbutton>
          <mbutton
            img="/src/assets/imgs/disable.webp"
            :label="'Hủy'"
            :tabindex="startTabIndex + formData.length + 1"
            typeButton="primary"
            @click="handleClose"
          ></mbutton>
        </div>
      </div>
    </template>
  </mpopup>
  <mdialog
    v-if="showDialog"
    :content="dialogContent"
    @onYes="handleYes"
    @onNo="hanleClickNo"
    @onCancel="hanleClickCancel"
  ></mdialog>
</template>

<script>
/**
 * Phần base chung cho các form detail.
 * @author: nttue (20/08/2023)
 */
import insertError from "@/utils/validate/insertError.js";
import GlobalDialog from "@/components/global-dialog/MGlobalDialog.vue";

export default {
  emits: ["closeForm", "updateList"],
  components: {
    GlobalDialog,
  },
  props: {
    // tiêu đề form.
    formHeader: {
      type: String,
      required: true,
    },

    // mảng chứ thông tin các ô input.
    formData: {
      type: Array,
      required: true,
    },

    // api cung cấp method gọi api.
    service: {
      type: Object,
      required: true,
    },

    // Tên form => Đại diện cho bảng.
    formName: {
      type: String,
    },

    // Đối tượng của form
    objectEdit: {
      type: Object,
      default: {},
      required: false,
    },

    // Chế độ form: ví dụ 0 là thêm, 1 là sửa.
    formMode: {
      type: Number,
      default: 0,
      required: false,
    },

    // chỉ số đầu tiền của tabindex.
    startTabIndex: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      // Nếu đối tượng sửa truyền vào không có thì gán đối tượng rỗng.
      objectCreate: { ...this.objectEdit } || {},

      // chỉ số của ô input đầu tiên bị lỗi.
      firstError: this.$MEnum.maxIndex,

      // Nội dung của dialog cảnh báo lỗi.
      dialogContent: {
        label: "",
      },

      // dialog
      dialogContent: null,
      showDialog: false,
      buttonHelpFocused: false,
    };
  },

  /**
   * Thực hiện gán tên các trường cho form.
   * @author: nttue (20/08/2023)
   */
  created() {
    this.formData.forEach((item) => {
      if (!this.objectEdit) {
        this.objectCreate[item.name] = "";
      }
    });
  },

  beforeMount() {
    document.addEventListener("focusin", this.handleFocusIn);
  },

  /**
   * Thực hiện focus vào ô input đầu tiên khi mở form.
   * @author: nttue (20/08/2023)
   */
  mounted() {
    this.$refs[this.formData[0].name][0].focus();
    document.addEventListener("keydown", this.handleKeyDown);
  },

  beforeUnMount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.addEventListener("focusin", this.handleFocusIn);
  },

  methods: {
    /**
     * @description xử lý sự kiện focusin
     * thực hiện check xem các button nào đang được focus
     * @param {event} nhận sự kiện đầu vào là event
     * @author nttue  (07/07/2023)
     */
    handleFocusIn(event) {
      event.preventDefault();
      event.stopPropagation();
      const focusedElement = event.target;
      if (focusedElement === this.$refs.buttonHelpRef?.$el) {
        this.buttonHelpFocused = true;
      }
    },

    /**
     * Hàm lắng nghe sự kiện form
     * @param {} event event của sự kiện
     * @author nttue (20/07/2023)
     */
    handleKeyDown(event) {
      const keyCode = event.keyCode;
      event.stopPropagation();
      if (keyCode === this.$MEnum.KEYBOARD.TAB && this.buttonHelpFocused) {
        this.$nextTick(() => {
          if (
            this.$refs[this.formData[0].name] &&
            this.$refs[this.formData[0].name][0]
          )
            this.$refs[this.formData[0].name][0].focus();
        });
        event.preventDefault();
        this.buttonHelpFocused = false;
      }
    },

    /**
     * Hàm xử lý sự kiện khi người dùng click vào button có ở dialog.
     * @author: nttue (20/08/2023)
     */
    handleYes() {
      this.showDialog = false;
      this.handleSaveUnit();
    },

    /**
     * Hàm xử lý sự kiện khi người dùng click vào button không ở dialog.
     * @author: nttue (20/08/2023)
     */
    hanleClickNo() {
      this.handleClose();
    },

    /**
     * Hàm xử lý sự kiện khi người dùng click vào button bỏ quả ở dialog.
     * @author: nttue (20/08/2023)
     */
    hanleClickCancel() {
      this.showDialog = false;
    },

    /**
     * Hàm thực hiện lưu form.
     * @author: nttue (20/08/2023)
     */
    async handleSaveUnit() {
      try {
        // Thực hiện validate trước khi insert.
        if (this.validateData()) {
          // Nếu có lỗi thì thông báo ra 1 dialog cảnh báo cho người dùng.
          this.$store.commit("dialog/setErrorMessage", {
            message: this.$refs[this.refsList[this.firstError]][0].error,
            handleClose: this.handleFocusInputError,
          });
        } else {
          this.firstError = this.$MEnum.maxIndex;

          // Nếu chế độ form là thêm mới => thực hiện gọi api chèn.
          if (this.formMode === this.$MEnum.formMode.add) {
            const newObject = await this.service.post(this.objectCreate);

            this.$emit("updateList", newObject, this.formName);
            newObject &&
              this.$store.dispatch("showToast", {
                label: this.$MResources.ToastMessage[this.formName].create,
              });
          }

          // Ngược lại thì gọi api cập nhật bản ghi.
          else if (this.formMode === this.$MEnum.formMode.update) {
            if (this.isEdited()) {
              var result = await this.service.update(
                this.objectCreate.id,
                this.objectCreate
              );
              this.$emit("updateList", this.objectCreate, this.formName);
             
              result &&
                this.$store.dispatch("showToast", {
                  label: this.$MResources.ToastMessage[this.formName].update,
                });
            } else {
              this.$emit("closeForm");
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Hàm thực hiện focus vào ô input đầu tiên bị lỗi.
     * @author: nttue (20/08/2023)
     */
    handleFocusInputError() {
      this.$refs[this.refsList[this.firstError]][0].focus();
    },

    /**
     * Hàm thực hiện lưu form..
     * @author: nttue (20/08/2023)
     */
    handleSaveForm() {
      this.handleSaveUnit();
    },

    /**
     * Hàm thực hiện đóng form nhập liệu.
     * @author: nttue (20/08/2023)
     */
    handleClose() {
      this.objectCreate = {};
      this.$emit("closeForm");
    },

    /**
     * Hàm thực hiện focus vào ô input đầu tiên bị lỗi.
     * @author: nttue (20/08/2023)
     */
    closePopup() {
      this.isEdited()
        ? this.openDialog({
            label: this.$MResources.DataChanged,
          })
        : this.handleClose();
    },

    /**
     * Hàm thực hiện mở dialog.
     * @author: nttue (20/08/2023)
     */
    openDialog(content) {
      this.showDialog = true;
      this.dialogContent = content;
    },

    /**
     * Hàm validate dữ liệu của form
     * @return trả về isError là giá trị nếu form bị lỗi
     * @author Nguyễn Trọng Tuế
     * Modified at: 28/6/2023
     */
    validateData() {
      try {
        let isError = false;
        for (let i = 0; i < this.refsList.length; i++) {
          let input = this.refsList[i];

          if (
            this.$refs[input][0]?.rules?.includes("required") ||
            (this.$refs[input][0]?.error && this.$refs[input][0]?.rules)
          ) {
            const inputRef = this.$refs[input][0];
            var err = insertError(inputRef, this.formName);

            if (err) {
              isError = true;
              this.firstError = Math.min(this.firstError, i);
              this.$refs[inputRef.name][0].error = err;
            } else if (this.$refs[input][0]?.error && !err) {
              isError = true;
              this.firstError = Math.min(this.firstError, i);
            } else {
              this.$refs[inputRef.name][0].error = "";
            }
          }
        }
        return isError;
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Computed kiểm tra xem đối tượng đầu vào với đầu ra khác nhau không.
     * @author: nttue (20/08/2023)
     */
    isEdited() {
      const listKeys = Object.keys(this.objectCreate);
      const compareObject = this.objectEdit || {};

      for (let i = 0; i < listKeys.length; i++) {
        const key = listKeys[i];

        if (!compareObject?.hasOwnProperty(key)) {
          if (this.objectCreate[key]) {
            compareObject[key] = "";
          } else {
            compareObject[key] = this.objectCreate[key];
          }
        }
      }
      return (
        JSON.stringify(this.objectCreate) !== JSON.stringify(compareObject)
      );
    },
  },

  computed: {
    /**
     * @return trả vể 1 mảng chứa tên của các ref trong form.
     * @author nttue (07/07/2023)
     */
    refsList() {
      return Object.keys(this.$refs);
    },
  },
};
</script>

<style lang="scss">
@import "./base-form.scss";
</style>
