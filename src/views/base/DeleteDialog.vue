<template>
  <mpopup :headerTile="'CUKCUK - Quản lý nhà hàng'">
    <template #content>
      <div class="dialog-global__container-content flex-start">
        <div class="dialog-icon flex-center">
          <img src="@/assets/imgs/icon-question.png" alt="" />
        </div>
        <div class="dialog-description">
          {{ content.label }}
        </div>
      </div>
      <div class="dialog-footer flex-end">
        <mbutton
          typeButton="primary no-icon"
          ref="buttonYesRef"
          :label="'Có'"
          @click="onOk()"
          tabindex="1"
        />
        <mbutton
          typeButton="primary no-icon"
          :label="'Không'"
          ref="buttonNoRef"
          @click="onNo()"
          tabindex="2"
        />
      </div>
    </template>
  </mpopup>
</template>

<script>
export default {
  emits: ["onCloseDialog"],
  props: {
    hasClose: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      required: true,
    },
    handleEvent: {
      type: [Object, Function],
      required: true,
    },
  },
  data() {
    return {
      buttonNoFocused: false,
      buttonYesFocused: false,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("focusin", this.handleFocusIn);
    this.$refs.buttonYesRef.focus();
  },
  beforeUnmount() {
    this.buttonNoFocused = false;
    this.buttonYesFocused = false;
  },

  watch: {
    buttonNoFocused(newValue) {
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
        if (this.buttonNoFocused) {
          this.buttonNoFocused = false;
          this.$refs.buttonYesRef.focus();
          event.preventDefault(); // Ngăn chặn hành vi mặc định của TAB
        }
      }
    },
    /**
     * Hàm xử lý sự kiện nhấn không.
     * @author: nttue (20/08/2023)
     */
    onNo() {
      this.$emit("onCloseDialog");
    },

    /**
     * Hàm xử lý sự kiện nhấn có.
     * @author: nttue (20/08/2023)
     */
    async onOk() {
      if (this.handleEvent) {
        this.handleEvent();
      }
    },
  },
};
</script>

<style lang="scss">
.dialog-global__container-content {
  width: 400px;
}
</style>
