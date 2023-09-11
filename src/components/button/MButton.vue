<template>
  <button
    ref="button"
    class="button"
    :class="typeButton"
    :disabled="disabled"
    v-if="positonIcon"
  >
    <span class="button-label">{{ label }}</span>
    <img :src="img" v-if="img" />
  </button>
  <button
    ref="button"
    class="button"
    :class="typeButton"
    :disabled="disabled"
    v-else
  >
    <img :src="img" v-if="img" />
    <div v-else-if="icon" :class="icon"></div>
    <span class="button-label">{{ label }}</span>
  </button>
</template>

<script>
/**
 * Component button
 * @author: nttue (20/08/2023)
 */
export default {
  props: {
    /**
     * icon hiển thị trong button.
     */
    icon: {
      type: String,
    },
    /**
     * ảnh hiển thị trong button (trong trường hợp không có icon)
     */
    img: {
      type: String,
    },
    /**
     * Chữ hiển thị trong button.
     */
    label: { type: String },
    /**
     * Loại button bao gồm: outline, primary, secondary.
     */
    typeButton: { type: String },
    /**
     * Thuộc tính diabled của button.
     */
    disabledProps: {
      type: Boolean,
      default: false,
    },
    /**
     * Position của icon trong button.
     */
    positonIcon: {
      type: String,
    },
  },
  data() {
    return {
      disabled: this.disabledProps,
    };
  },
  methods: {
    /**
     * Hàm xử lý sự kiện focus của button
     * @author: nttue (06/09/2023)
     */
    focus() {
      this.$refs.button.focus();
    },
  },
  watch: {
    /**
     * Hàm xem sự thay đổi của thuộc tính disabled.
     * @param {String} newProps giá trị mới của disabled.
     * @author: nttue (20/08/2023)
     */
    disabledProps(newProps) {
      this.disabled = newProps;
    },
  },
};
</script>
<style lang="scss">
@import "./button.scss";
</style>
