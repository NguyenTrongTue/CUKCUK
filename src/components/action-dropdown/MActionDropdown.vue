<template>
  <div class="select" v-custom-outside="handleClickOutside">
    <div :class="show ? 'show dropdown ' + sizeType : 'dropdown ' + sizeType">
      <input type="text" :value="selectedLabel" readonly ref="inputSelect" />
      <div class="dropdown-icon flex-center" @click="showDropdown">
        <div
          v-if="sizeType === 'small'"
          class="icon-arrow icon-arrowdown-gray"
        ></div>
        <div v-else class="icon-arrow icon-triangle"></div>
      </div>
      <div
        class="dropdown-list"
        v-if="show"
        :style="{
          width: widthDropdown + 'px',
          left: left + 'px',
          top: top + 'px',
        }"
      >
        <div
          class="dropdown-item"
          :class="item === selectedValue ? 'selected' : ''"
          v-for="item in list"
          :key="item"
          @click="onSelect(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Component droplist, chỉ cho phép chọn các item xổ xuống
 * Không cho phép nhập liệu vào ô input.
 * @author: nttue (20/08/2023)
 */
export default {
  name: "MDropdown",
  props: {
    // Mảng chứa danh sách dữ liệu.
    list: {
      type: Array,
      required: true,
    },

    // Giá trị của model value.
    modelValue: {
      required: true,
    },

    // Loại kích thước của component.
    sizeType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectedValue: this.modelValue,

      // Thuộc tính hiển thị droplist hay không
      show: false,

      // vị trí của phần tử droplist so với top của cửa sổ
      top: 0,

      // vị trí của phần tử droplist so với left của cửa sổ
      left: 0,

      // kích thước chiều rộng của phần tử
      widthDropdown: 0,
    };
  },

  watch: {
    // cập nhật giá trị của giá trị ô input khi modelValue thay đổi.
    modelValue(newValue) {
      this.selectedValue = newValue;
    },
  },

  computed: {
    /**
     * Cập nhật lại text trong input khi người dùng chọn 1 item ở dropdown.
     * @author: nttue (20/08/2023)
     */
    selectedLabel() {
      const selectedItem = this.list.find(
        (item) => item === this.selectedValue
      );
      return selectedItem ? selectedItem : "";
    },
  },

  // MARK: method
  methods: {
    /**
     * Show dropdown.
     * @author: nttue (20/08/2023)
     *
     */
    showDropdown() {
      const input = this.$refs.inputSelect;

      this.top =
        input.getBoundingClientRect().top +
        input.getBoundingClientRect().height;
      this.left = input.getBoundingClientRect().left;

      if (window.innerHeight - this.top < 170) {
        var distance =
          this.list.length >= 6
            ? 170
            : this.list.length > 0
            ? 2 + this.list.length * 24
            : 30;

        this.top = input.getBoundingClientRect().top - distance - 6;
      }

      this.widthDropdown = input.getBoundingClientRect().width;
      this.show = !this.show;
    },

    /**
     * Chọn item trong dropdown.
     * @param {} item  mục được chọn
     * @author: nttue (20/08/2023)
     *
     */
    onSelect(item) {
      this.selectedValue = item;
      this.$emit("update:modelValue", this.selectedValue);
      this.show = false;
    },

    /**
     * Xử lý sự kiện click outside.
     * @author: nttue (20/08/2023)
     */
    handleClickOutside() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
@import "./action-dropdown.scss";
</style>
