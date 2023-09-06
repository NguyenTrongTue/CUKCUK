<template>
  <label v-click-outside="handleClickOutSide" :class="'checkbox-container'">
    <input
      type="checkbox"
      :checked="required ? true : isChecked"
      :required="required"
      @input="onInput"
      style="display: none"
      @click="onChange"
    />

    <div v-if="!isFocused && !isChecked" class="icon-checkbox-default"></div>
    <div
      v-if="isFocused && !isChecked"
      class="icon-checkbox-focus-nocheck"
    ></div>
    <div
      v-if="!isFocused && isChecked"
      class="icon-checkbox-nofocus-check"
    ></div>
    <div v-if="isFocused && isChecked" class="icon-checkbox-focus-check"></div>
  </label>
</template>

<script>
/**
 * Component checkbox.
 * @author: nttue (20/08/2023)
 */
export default {
  name: "MCheckbox",
  props: {
    // Prop checked
    checked: {
      type: Boolean,
      default: false,
    },

    // Prop có cho phép sửa được checkbox không.
    required: {
      type: Boolean,
      default: false,
    },

    // Giá trị của model value.
    modelValue: {
      type: [Boolean, Number],
      default: false,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Thuộc tính kiểm tra xem input có đang focus không.
       */
      isFocused: false,
      /**
       * Giá của của checkbox hiển thị.
       */
      isChecked: this.modelValue,
    };
  },
  watch: {
    // cập nhật giá trị của giá trị ô input khi modelValue thay đổi.
    modelValue(newValue) {
      this.isChecked = newValue;
    },
  },

  methods: {
    /**
     * Hàm xử lý sự kiện khi ô checkbox thay đổi giá trị.
     * @param {Object} event event của thẻ.
     * @author: nttue (20/08/2023)
     */
    onChange(event) {
      if (this.required) {
        event.preventDefault();
      }
    },
    /**
     * Hàm xử lý sự kiện khi ô checkbox được nhập liệu giá trị.
     * @author: nttue (20/08/2023)
     */
    onInput() {
      if (!this.required) {
        this.isFocused = true;
        this.isChecked = !this.isChecked;
        this.$emit("update:modelValue", this.isChecked);
      }
    },

    /**
     * Hàm xử lý sự kiện click ra ngoài phần tử checkbox.
     * @author: nttue (20/08/2023)
     */
    handleClickOutSide() {
      this.isFocused = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./checkbox.scss";
</style>
