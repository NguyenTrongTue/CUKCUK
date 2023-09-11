<template>
  <div class="toolbar">
    <mtooltip :content="'Shift + 1'" :arrow="false">
      <mbutton
        icon="icon-add"
        :label="this.$MResources.AddText"
        typeButton="outline"
        @click="onAdd"
      ></mbutton>
    </mtooltip>
    <mtooltip :content="'Shift + 2'" :arrow="false">
      <mbutton
        icon="icon-replication"
        :label="this.$MResources.ReplicationText"
        :disabledProps="disabledButton"
        typeButton="outline"
        @click="onDuplicate"
      ></mbutton>
    </mtooltip>
    <mtooltip :content="'Shift + 3'" :arrow="false">
      <mbutton
        icon="icon-edit"
        :label="this.$MResources.EditText"
        :disabledProps="disabledButton"
        typeButton="outline"
        @click="onUpdate"
      ></mbutton>
    </mtooltip>
    <mtooltip :content="'Shift + 4'" :arrow="false">
      <mbutton
        icon="icon-remove"
        :label="this.$MResources.DeleteText"
        :disabledProps="disabledButton"
        typeButton="outline"
        @click="onRemove"
      ></mbutton>
    </mtooltip>
    <mtooltip :content="'Shift + 5'" :arrow="false">
      <mbutton
        icon="icon-reload"
        :label="this.$MResources.ReloadText"
        typeButton="outline"
        @click="onReload"
      ></mbutton>
    </mtooltip>

    <mbutton
      v-show="!isBase"
      img="/src/assets/imgs/import.png"
      :label="this.$MResources.ImportText"
      typeButton="outline"
      @click="onImport"
    ></mbutton>
    <mbutton
      v-show="!isBase"
      img="/src/assets/imgs/export.png"
      :label="this.$MResources.ExportText"
      :disabledProps="disabledButton"
      typeButton="outline"
      @click="onExport"
    ></mbutton>
    <mbutton
      v-show="!isBase"
      icon="icon-setting-small"
      :label="this.$MResources.SettingText"
      typeButton="outline"
      @click="onSetting"
    ></mbutton>
  </div>
</template>
<script>
export default {
  emits: [
    "onImport",
    "onReload",
    "onAdd",
    "onUpdate",
    "onDuplicate",
    "onRemove",
    "onSetting",
    "onExport",
  ],
  props: {
    noData: {
      type: Boolean,
    },
    isBase: {
      type: Boolean,
    },
  },
  data() {
    return {
      disabledButton: this.noData,
    };
  },

  created() {
    window.addEventListener("keydown", this.handleKeyDown);
  },
  watch: {
    noData(newNoData) {
      this.disabledButton = newNoData;
    },
  },
  methods: {
    /**
     * Hàm lắng nghe sự kiện nhấn phím của người dùng
     * @param {Object} event - Đối tượng sự kiện
     * @author: nttue (20/08/2023)
     */
    handleKeyDown(event) {
      const keyCode = event.keyCode;
      if (event.shiftKey && keyCode == this.$MEnum.KEYBOARD.keyOne) {
        this.onAdd();
        event.preventDefault();
      } else if (event.shiftKey && keyCode == this.$MEnum.KEYBOARD.keyTwo) {
        this.onDuplicate();
        event.preventDefault();
      } else if (event.shiftKey && keyCode == this.$MEnum.KEYBOARD.keyThree) {
        event.preventDefault();
        this.onUpdate();
      } else if (event.shiftKey && keyCode == this.$MEnum.KEYBOARD.keyFour) {
        this.onRemove();
        event.preventDefault();
      } else if (event.shiftKey && keyCode == this.$MEnum.KEYBOARD.keyFive) {
        this.onReload();
        event.preventDefault();
      }
    },
    /**
     * Hàm bắt sự kiện nạp lại dữ liệu.
     * @author: nttue (20/08/2023)
     */
    onReload() {
      this.$emit("onReload");
    },
    /**
     * Hàm bắt sự kiện thêm mới 1 bản ghi.
     * @author: nttue (20/08/2023)
     */
    onAdd() {
      this.$emit("onAdd");
    },
    /**
     * Hàm bắt sự kiện sửa 1 bản ghi.
     * @author: nttue (20/08/2023)
     */
    onUpdate() {
      this.$emit("onUpdate");
    },
    /**
     * Hàm bắt sự kiện nhân bản 1 bản ghi.
     * @author: nttue (20/08/2023)
     */
    onDuplicate() {
      this.$emit("onDuplicate");
    },
    /**
     * Hàm bắt sự kiện xóa 1 bản ghi.
     * @author: nttue (20/08/2023)
     */
    onRemove() {
      this.$emit("onRemove");
    },

    /**
     * Hàm bắt sự kiện xóa 1 bản ghi.
     * @author: nttue (20/08/2023)
     */
    onExport() {
      this.$emit("onExport");
    },

    /**
     * Hàm bắt sự kiện xóa 1 bản ghi.
     * @author: nttue (20/08/2023)
     */
    onImport() {
      this.$emit("onImport");
    },

    /**
     * Hàm bắt sự kiện mở phần setting cột cho table.
     * @author: nttue (20/08/2023)
     */
    onSetting() {
      this.$emit("onSetting");
    },
  },
};
</script>

<style lang="scss">
@import "./toolbar.scss";
</style>
