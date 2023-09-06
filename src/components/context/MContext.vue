<template>
  <div class="context">
    <Teleport to="body">
      <div
        v-show="showContext"
        class="modal-context"
        :style="{
          left: leftContext + 'px',
          top: topContext + 'px',
        }"
        v-custom-outside="handleClickOutSideContext"
      >
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="modal-content__item"
          @click="
            () => {
              item.method();
              handleClickOutSideContext();
            }
          "
        >
          <div :class="item.icon"></div>
          <span class="modal-content__item-label">{{ item.text }} </span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
/**
 * Component MContext
 * Xử lý xử kiện khi người dùng nhấn chuột phải.
 * Hiển thị ra context menu cho phép người dùng chọn.
 * @author: nttue (20/08/2023)
 */
export default {
  name: "MContext",
  props: {
    /**
     * Mảng chứa thông tin của context menu bao gồm:
     * icon: icon của item trong context menu.
     * text: text của item trong context menu.
     * function: hàm kích hoạt khi click chuột vào item trong context menu.
     */
    dataListProp: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // vị trí của phần tử droplist so với left của cửa sổ
      leftContext: 0,

      // vị trí của phần tử droplist so với left của cửa sổ
      topContext: 0,

      // Thuộc tính hiển thị droplist hay không.
      showContext: false,

      // Mảng chứa thông tin của context menu.
      dataList: this.dataListProp,
    };
  },
  methods: {
    /**
     * Xử lý sự kiện click outside.
     * @author: nttue (20/08/2023)
     */
    handleClickOutSideContext() {
      this.showContext = false;
    },

    /**
     * Show context menu.
     * Thực hiện tính toán vị trí click chuột phải để gán thuộc tính left, top để hiển thị phần tử.
     * @author: nttue (20/08/2023)
     *
     */
    show(target) {
      this.topContext = target.clientY;
      this.leftContext = target.clientX;

      if (window.innerHeight - this.topContext < this.dataList.length * 24) {
        var distance = this.dataList.length * 24;
        this.topContext = target.clientY - distance;
      }

      this.showContext = true;
    },
  },
};
</script>
