<template>
  <mpopup :headerTile="'CUKCUK - Quản lý nhà hàng'">
    <template #content>
      <div class="dialog-global__container-content flex-start">
        <div class="dialog-icon flex-center">
          <img src="@/assets/imgs/icon-question.png" alt="" />
        </div>
        <div class="dialog-description">
          {{ content.label }}
        </div>
      </div>
      <div class="dialog-footer flex-end">
        <mbutton
          typeButton="primary no-icon"
          :label="'Không'"
          @click="onNo()"
        />

        <mbutton typeButton="primary no-icon" :label="'Có'" @click="onOk()" />
      </div>
    </template>
  </mpopup>
</template>

<script>
import materialService from "@/service/materialService.js";

export default {
  emits: ["onCloseDialog", "onDelete"],
  props: {
    hasClose: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      required: true,
    },
  },

  methods: {
    /**
     * Hàm xử lý sự kiện nhấn không.
     * @author: nttue (20/08/2023)
     */
    onNo() {
      this.$emit("onCloseDialog");
    },
    /**
     * Hàm xử lý sự kiện nhấn có.
     * @author: nttue (20/08/2023)
     */
    async onOk() {
      try {
        await materialService.delete(this.content.id);
        this.$emit("onDelete");

        this.$store.commit("showToast", {
          label: this.$MResources.ToastMessage.MaterialDelete,
        });
      } catch (e) {
        this.$emit("onCloseDialog");
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
.dialog-global__container-content {
  width: 400px;
}
</style>
