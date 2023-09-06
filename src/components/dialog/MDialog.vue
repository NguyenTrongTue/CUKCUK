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
          @click="onYes()"
        />
        <mbutton
          typeButton="primary no-icon"
          :label="this.$MResources.No"
          @click="onNo()"
        />
        <mbutton
          typeButton="primary no-icon"
          :label="'Hủy'"
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

  methods: {
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
