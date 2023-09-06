<template>
  <mcontext :dataListProp="contextList" ref="contextRef" />
</template>
<script>
export default {
  data() {
    return {
      /**
       * Mảng chứa thông tin của context menu bao gồm:
       * icon: icon của item trong context menu.
       * text: text của item trong context menu.
       * function: hàm kích hoạt khi click chuột vào item trong context menu.
       */
      contextList: [
        {
          icon: "icon-add",
          text: this.$MResources.AddText,
          method: this.handleAdd,
        },
        {
          icon: "icon-replication",
          text: this.$MResources.ReplicationText,
          method: this.handleDuplicate,
        },
        {
          icon: "icon-edit",
          text: this.$MResources.EditText,
          method: this.handleUpdate,
        },
        {
          icon: "icon-remove",
          text: this.$MResources.DeleteText,
          method: this.handleRemove,
        },
        {
          icon: "icon-add",
          text: this.$MResources.ReloadText,
          method: this.handleReload,
        },
      ],
    };
  },
};
</script>
