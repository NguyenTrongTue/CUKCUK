<template>
  <mpopup
    :headerTile="this.$MResources.TitleDialog"
    :hasClose="true"
    v-if="isShowMessage"
  >
    <template #content>
      <div class="dialog-global__container-content flex-start">
        <div class="dialog-icon flex-center">
          <img src="@/assets/imgs/icon-warning.png" alt="" />
        </div>
        <div class="dialog-description">
          {{ content }}
        </div>
      </div>
      <div class="dialog-footer flex-end">
        <mbutton
          typeButton="primary no-icon"
          :label="this.$MResources.OkText"
          @click="onClose()"
        />
      </div>
    </template>
  </mpopup>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MDialogMessage",

  methods: {
    /**
     * @description hàm xử lý sự kiện nhấn nút đồng ý.
     * Thực hiện đóng dialog và kích hoạt hàm ở component chứa dialog này.
     * @author: nttue (20/07/2023)
     */
    onClose() {
      this.$store.commit("dialog/hideErrorMessage");
      if (this.handleClose) {
        this.handleClose();
      }
    },
  },
  /**
   * sử dụng map state để lấy ra các state của dialog.
   * @author: nttue (20/07/2023)
   */
  computed: mapState({
    content: (state) => state.dialog.errorMessage,
    isShowMessage: (state) => state.dialog.isShowMessage,
    handleClose: (state) => state.dialog.handleClose,
  }),
};
</script>
