<template>
  <div id="toast" v-if="isShowToast">
    <div class="toast success">
      <div class="icon-success"></div>
      <span class="toast-message"
        ><span class="toast-import">Thành công!</span>
        {{ content.label }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Dialog",
  props: {
    /**
     * Nội dung toast message.
     */
    label: {
      label: String,
    },
  },
  /**
   * Sử dụng computed để lấy ra các state global
   * @author: nttue (20/08/2023)
   */
  computed: mapState({
    content: (state) => state.toast.content,
    isShowToast: (state) => state.toast.isShowToast,
  }),
};
</script>

<style lang="scss">
@import "./toast.scss";
</style>
