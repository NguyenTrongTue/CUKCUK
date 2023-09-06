<template>
  <mpopup :headerTile="this.$MResources.TitleDialog" :hasClose="true">
    <template #content>
      <div class="dialog-global__container-content flex-start">
        <div class="dialog-icon flex-center">
          <img src="@/assets/imgs/icon-warning.png" alt="" />
        </div>
        <div class="dialog-description">
          {{ content.label }}
        </div>
      </div>
      <div class="dialog-footer flex-end">
        <mbutton
          typeButton="primary no-icon"
          :label="this.$MResources.OkText"
          @click="onOk()"
        />
      </div>
    </template>
  </mpopup>
</template>

<script>
export default {
  emits: ["onOk"],
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

  methods: {
    /**
     * @description hàm xử lý sự kiện nhấn nút có.
     * @author nttue (20/07/2023)
     */
    onOk() {
      this.$emit("onOk", this.content.method ?? null);
    },
  },
};
</script>

<style lang="scss">
.dialog-global__container-content {
  width: 400px;
}
</style>
