<template>
  <div class="step3__container">
    <div class="step3__container-title">
      {{ this.$MResources.ResultImportFile }}
    </div>
    <p class="text">+ {{ this.$MResources.RowsImportSuccess }}: {{ result }}</p>
    <p class="text">+ {{ this.$MResources.RowsImportFailure }}: 0</p>
  </div>
</template>

<script>
import MaterialExcelService from "@/service/materialexcel";

export default {
  name: "Step3",
  props: {
    /**
     * Id của file được gửi về từ backend.
     */
    fileId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Số hàng nhập khẩu thành công.
       */
      result: 0,
    };
  },
  beforeMount() {
    this.handleImport(this.fileId);
  },
  methods: {
    /**
     * call api để import file.
     * Lấy về sô lượng bản ghi nhập khẩu thành công và thất bại
     * Thông báo cho người dùng.
     * @author: nttue (20/07/2023)
     */
    async handleImport(id) {
      var res = await MaterialExcelService.importFileAsync(id);
      this.result = res;
      this.$emit("importSuccess", this.result > 0);
    },
  },
};
</script>

<style lang="scss">
.step3__container {
  padding: 20px;
}
.step3__container-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
