<template>
  <mpopup :headerTile="this.$MResources.TitleDialog">
    <template #content>
      <div class="dialog__container-content flex-start">
        <div class="dialog-icon flex-center">
          <img
            src="@/assets/imgs/icon-warning.png"
            alt=""
            v-if="content.type === 'warning'"
          />

          <img src="@/assets/imgs/icon-question.png" alt="" v-else />
        </div>
        <div class="dialog-description">
          {{ content.label }}
        </div>
      </div>
      <div class="dialog-footer flex-end" v-if="content.type === 'warning'">
        <mbutton
          typeButton="primary no-icon"
          :label="this.$MResources.OkText"
          @click="onCancel()"
        />
      </div>
      <div class="dialog-footer flex-end" v-else>
        <mbutton
          typeButton="primary no-icon"
          :label="this.$MResources.Yes"
          ref="buttonYesRef"
          @click="onYes()"
        />
        <mbutton
          typeButton="primary no-icon"
          :label="this.$MResources.No"
          ref="buttonNoRef"
          @click="onNo()"
        />
        <mbutton
          typeButton="primary no-icon"
          :label="'Hủy'"
          ref="buttonCancelRef"
          @click="onCancel()"
        />
      </div>
    </template>
  </mpopup>
</template>

<script>
export default {
  emits: ["onNo", "onCancel", "onYes"],
  props: {
    /**
     * Thuộc tính prop hiển thị nút close ở phần header của dialog.
     * Mặc đinh không có.
     */
    hasClose: {
      type: Boolean,
      default: false,
    },
    /**
     * Nội dụng hiển thị trong dialog.
     */
    content: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      buttonNoFocused: false,
      buttonYesFocused: false,
      buttonCancelFocused: false,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("focusin", this.handleFocusIn);
    this.$refs.buttonYesRef.focus();
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("focusin", this.handleFocusIn);
  },
  watch: {
    buttonCancelFocused(newValue) {
      !newValue && this.$refs.buttonYesRef.focus();
    },
  },
  methods: {
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
      } else if (focusedElement === this.$refs.buttonNoRef?.$el) {
        this.buttonNoFocused = true;
      } else if (focusedElement === this.$refs.buttonCancelRef?.$el) {
        this.buttonCancelFocused = true;
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
        if (this.buttonCancelFocused) {
          this.buttonCancelFocused = false;
          this.$refs.buttonYesRef.focus();
          event.preventDefault(); // Ngăn chặn hành vi mặc định của TAB
        }
      }
    },
    /**
     * @description hàm xử lý sự kiện nhấn nút có.
     * @author nttue (20/07/2023)
     */
    onYes() {
      this.$emit("onYes");
    },

    /**
     * @description hàm xử lý sự kiện nhấn nút không.
     * @author nttue (20/07/2023)
     */
    onNo() {
      this.$emit("onNo");
    },

    /**
     * @description hàm xử lý sự kiện nhấn nút hủy.
     * @author nttue (20/07/2023)
     */

    onCancel() {
      this.$emit("onCancel");
    },
  },
};
</script>

<style lang="scss">
@import "./dialog.scss";
</style>
