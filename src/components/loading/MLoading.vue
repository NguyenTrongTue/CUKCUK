<template>
  <div
    class="loading-container"
    :style="{ height: 'calc(100% - ' + paddingTop + 'px)' }"
    v-if="typeLoading === 0"
  >
    <div class="loading-content flex-center">
      <img class="loading" src="@/assets/imgs/loading.gif" alt="" />
      <div class="loading__label">Đang lấy dữ liệu...</div>
    </div>
  </div>
  <div class="modal" style="z-index: 9999" v-else>
    <div class="loading-container flex-center">
      <img class="loading-secondary" src="@/assets/loading.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MLoading",
  props: {
    // giá trị padding top sử dụng đối với trường hợp loại 1.
    paddingTop: {
      type: Number,
      default: 0,
    },

    /**
     * Loại loading:
     * 1. Loading sử dụng trong table => mặc định.
     * 2. Loading toàn màn hình.
     */
    typeLoading: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
@import "./loading.scss";
.loading-container {
  height: 100%;
}
.loading-secondary {
  width: 60px;
  height: 60px;
  animation: rotateKeyFrame 1s infinite linear;
}
</style>
