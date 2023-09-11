<template>
  <div class="step1__container">
    <p class="text">
      {{ this.$MResources.SelectDataMaterial }}
    </p>
    <div class="attachment">
      <input readonly :value="fileInfo.fileName" />
      <label class="input-upload" for="file">
        <input
          type="file"
          id="file"
          name="file"
          accept=".xlsx"
          style="display: none"
          @change="onFileChange"
        />
        <span class="input-upload__text">
          {{ this.$MResources.Select }}
        </span>
      </label>
    </div>
    <p class="text" @click="getExampleFile">
      {{ this.$MResources.NotExampleFile }}
      <span class="dowload"> {{ this.$MResources.Here }} </span>
    </p>
  </div>
</template>

<script>
import MaterialExcelService from "@/service/materialexcel";

import { saveAs } from "file-saver";

export default {
  name: "Step1",
  emits: ["onFile"],
  data() {
    return {
      // Đối tượng file được người dùng nhập vào.
      file: null,
      // Id của file
      fileId: "",

      // thông tin của file.
      fileInfo: {
        fileName: "",
      },
    };
  },

  /**
   * Xử lý sự kiện khi component được mounted vào DOM.
   * @author: nttue (20/07/2023)
   */
  beforeMount() {
    const fileData = sessionStorage.getItem("materialImportFile");
    // Nếu file được lưu vào sessionStorage thì gán các thông tin.
    if (fileData) {
      const fileObject = JSON.parse(fileData);
      this.fileInfo.fileName = fileObject.fileName;
      this.fileId = fileObject.id;
    }
  },

  /**
   * Xử lý trước component bị unmounted khỏi dom.
   * Lưu thông tin file vừa nhập vào sessionStorage.
   * @author: nttue (20/07/2023)
   */
  beforeUnmount() {
    // Tạo 1 đối tượng chứa thông tin file.
    const fileObject = {
      fileName: this.fileInfo.fileName,
      id: this.fileId,
    };
    // Chuyển dữ liệu sang dạng json rồi lưu vào sessionStorage.
    const fileObjectJson = JSON.stringify(fileObject);
    sessionStorage.setItem("materialImportFile", fileObjectJson);
  },
  watch: {
    /**
     * Khi file thay đổi thực hiện gửi request đến backend để lấy thông tin các sheet.
     * Gán các thông tin với các giá trị ở phần data.
     * @author: nttue (20/07/2023)
     */
    file: {
      async handler(newFile) {
        try {
          if (newFile) {
            this.fileInfo.fileName = newFile.name;
            this.$emit("onFile", newFile);
          }
        } catch (e) {
          console.log(e);
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Hàm clear thông tin file vừa nhập.
     * @author: nttue (20/07/2023)
     */
    clearFile() {
      this.fileId = "";
      this.fileInfo.fileName = "";
    },
    /**
     * Sự kiện thay đổi file.
     * @param {Object} event
     * @author: nttue (20/07/2023)
     */
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    /**
     * Hàm lấy file mẫu từ backend.
     * @author: nttue (20/07/2023)
     */
    async getExampleFile() {
      const blob = await MaterialExcelService.getExampleFileAsync();
      saveAs(blob, this.$MResources.ExampleFileName);
    },
  },
};
</script>
