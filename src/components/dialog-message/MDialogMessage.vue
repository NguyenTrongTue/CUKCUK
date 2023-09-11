<template>
  <mpopup
    :headerTile="this.$MResources.TitleDialog"
    :hasClose="true"
    @closePopup="onClose"
    v-if="isShowMessage"
  >
    <template #content>
      <div class="dialog-global__container-content flex-start">
        <div class="dialog-icon flex-center">
          <img src="@/assets/imgs/icon-warning.png" alt="" />
        </div>
        <div class="dialog-description">
          {{ content }}
        </div>
      </div>
      <div class="dialog-footer flex-end">
        <mbutton
          typeButton="primary no-icon"
          ref="buttonYesRef"
          :label="this.$MResources.OkText"
          @click="onClose()"
        />
      </div>
    </template>
  </mpopup>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MDialogMessage",
  data() {
    return {
      buttonYesFocused: false,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("focusin", this.handleFocusIn);
  },
  beforeUnmount() {
    this.offEventWindow();
  },
  watch: {
    isShowMessage(newValue) {
      this.$nextTick(() => {
        newValue && this.$refs.buttonYesRef?.focus();
      });
      if (!newValue) {
        this.offEventWindow();
      }
    },
  },
  methods: {
    /**
     * Hàm tắt sự kiện keydown, focusin của windown.
     * @author: nttue (07/07/2023)
     */
    offEventWindow() {
      window.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("focusin", this.handleFocusIn);
    },
    /**
     * @description xử lý sự kiện focusin
     * thực hiện check xem các button nào đang được focus
     * @param {event} nhận sự kiện đầu vào là event
     * @author: nttue (07/07/2023)
     */
    handleFocusIn(event) {
      const focusedElement = event.target;
      if (focusedElement === this.$refs.buttonYesRef?.$el) {
        this.buttonYesFocused = true;
      }
    },
    /**
     * Hàm lắng nghe sự kiện form
     * @param {} event event của sự kiện
     * @author nttue (20/07/2023)
     */
    handleKeyDown(event) {
      const keyCode = event.keyCode;
      if (keyCode === this.$MEnum.KEYBOARD.TAB) {
        if (this.buttonYesFocused) {
          this.$refs.buttonYesRef?.focus();
          event.preventDefault(); // Ngăn chặn hành vi mặc định của TAB
        }
      }
    },
    /**
     * @description hàm xử lý sự kiện nhấn nút đồng ý.
     * Thực hiện đóng dialog và kích hoạt hàm ở component chứa dialog này.
     * @author: nttue (20/07/2023)
     */
    onClose() {
      this.$store.commit("dialog/hideErrorMessage");
      if (this.handleClose) {
        this.handleClose();
      }
    },
  },
  /**
   * sử dụng map state để lấy ra các state của dialog.
   * @author: nttue (20/07/2023)
   */
  computed: mapState({
    content: (state) => state.dialog.errorMessage,
    isShowMessage: (state) => state.dialog.isShowMessage,
    handleClose: (state) => state.dialog.handleClose,
  }),
};
</script>
