<template>
  <div class="modal">
    <div
      class="dialog modal-container"
      ref="form"
      :style="{ left: leftModal + '%', top: topModal + '%' }"
    >
      <div class="dialog__header flex-between" @mousedown="handleMoveForm">
        <span class="dialog__header-content">{{ headerTile }}</span>
        <div v-if="hasClose" class="popup__header-icon pointer" @click="onExit">
          <div class="icon-close-white"></div>
        </div>
      </div>

      <div class="dialog__container">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["closePopup"],
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
    headerTile: {
      type: String,
    },
  },
  data() {
    return {
      topModal: 50,
      leftModal: 50,
    };
  },

  /**
   * Hàm lắng nghe sự kiện resize của windown
   */
  beforeMount() {
    window.addEventListener("resize", this.handleResize);
  },

  /**
   * Hàm hủy sự kiện resize của windown
   */
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    /**
     * Hàm xử lý sự kiện resize cửa sổ => đặt lại vị trí cho form.
     * @author: nttue (20/07/2023)
     */
    handleResize() {
      this.leftModal = 50;
      this.topModal = 50;
    },

    /**
     * Hàm di chuyển chuột trên cửa sổ.
     * @param {Event} event sự kiện di chuyển chuột.
     * @author: nttue (20/07/2023)
     */
    handleMoveForm(event) {
      event.preventDefault();
      const startX = event.pageX;
      const startY = event.pageY;
      const formRect = this.$refs.form.getBoundingClientRect();
      const maxTop = Math.ceil(
        ((window.innerHeight - formRect.height / 2) / window.innerHeight) * 100
      );
      const maxLeft = Math.ceil(
        ((window.innerWidth - formRect.width / 2) / window.innerWidth) * 100
      );
      const minTop = Math.ceil(
        ((0.5 * formRect.height) / window.innerHeight) * 100
      );
      const minLeft = Math.ceil(
        ((0.5 * formRect.width) / window.innerWidth) * 100
      );

      const handleMouseMove = (event) => {
        const diffX = event.pageX - startX;
        const diffY = event.pageY - startY;

        const percentY = Math.ceil(
          ((formRect.top + diffY + formRect.height / 2) / window.innerHeight) *
            100
        );
        const percentX = Math.ceil(
          ((formRect.left + diffX + formRect.width / 2) / window.innerWidth) *
            100
        );

        this.leftModal = Math.min(Math.max(percentX, minLeft), maxLeft);
        this.topModal = Math.min(Math.max(percentY, minTop), maxTop);
      };

      const mouseUpHandler = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", mouseUpHandler);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", mouseUpHandler);
    },
    /**
     * @description hàm xử lý sự kiện nhấn nút thoát.
     * @author: nttue (20/07/2023)
     */
    onExit() {
      this.$emit("closePopup");
    },
  },
};
</script>

<style lang="scss">
@import "./popup.scss";
</style>
