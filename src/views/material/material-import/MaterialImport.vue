<template>
  <mpopup
    :headerTile="this.$MResources.ImportMaterial"
    :hasClose="true"
    @closePopup="handleClose"
  >
    <template #content>
      <div id="import-content">
        <div class="import__header">
          <span class="import__title">{{ stepTitle }}</span>
        </div>
        <div class="import__center">
          <div class="import__center-left">
            <div class="menu-item__step">
              <span class="import__title"
                >1. {{ this.$MResources.SelectResourceFile }}</span
              >
            </div>
            <div class="menu-item__step">
              <span class="import__title" G
                >2. {{ this.$MResources.CheckData }}</span
              >
            </div>
            <div class="menu-item__step">
              <span class="import__title"
                >3. {{ this.$MResources.ImportResult }}</span
              >
            </div>
          </div>
          <div class="import__center-right">
            <MaterialImportStep1
              v-if="currentStep === 1"
              @onFile="handleChooseFile"
            />
            <MaterialImportStep2
              v-else-if="currentStep === 2"
              :fileId="fileId"
              @onValidate="handleValidate"
            />
            <MaterialImportStep3
              :fileId="fileId"
              @importSuccess="handleImportSuccess"
              v-else-if="currentStep === 3"
            />
          </div>
        </div>
        <div class="import__footer flex-between">
          <div>
            <mbutton
              icon="icon-help"
              :label="this.$MResources.HelpText"
              typeButton="primary"
            ></mbutton>
          </div>
          <div class="flex-start dialog-footer__right" v-if="currentStep === 1">
            <mbutton
              img="/src/assets/imgs/import-back.png"
              :label="this.$MResources.Back"
              :disabledProps="true"
              typeButton="primary"
            ></mbutton>
            <mbutton
              img="/src/assets/imgs/import-right.png"
              :label="this.$MResources.Continue"
              positonIcon="right"
              typeButton="primary"
              :disabledProps="!chooseFile"
              @click="handleNextStep2"
            ></mbutton>
            <mbutton
              img="/src/assets/imgs/disable.webp"
              :label="this.$MResources.Cancel"
              typeButton="primary"
              @click="handleClose"
            ></mbutton>
          </div>
          <div class="flex-start dialog-footer__right" v-if="currentStep === 2">
            <mbutton
              img="/src/assets/imgs/import-back.png"
              :label="this.$MResources.Back"
              typeButton="primary"
              @click="handleBackStep1"
            ></mbutton>
            <mbutton
              img="/src/assets/imgs/import.png"
              :label="this.$MResources.Excute"
              :disabledProps="!allValid"
              typeButton="primary"
              @click="handleNextStep3"
            ></mbutton>
            <mbutton
              img="/src/assets/imgs/disable.webp"
              :label="this.$MResources.Cancel"
              typeButton="primary"
              @click="handleClose"
            ></mbutton>
          </div>
          <div class="flex-start dialog-footer__right" v-if="currentStep === 3">
            <mbutton
              img="/src/assets/close.png"
              :label="this.$MResources.Close"
              typeButton="primary"
              @click="handleClose"
            ></mbutton>
          </div>
        </div>
      </div>
    </template>
  </mpopup>
</template>

<script>
import MaterialImportStep1 from "@/views/material/material-import/step1/MaterialImportStep1.vue";
import MaterialImportStep2 from "@/views/material/material-import/step2/MaterialImportStep2.vue";
import MaterialImportStep3 from "@/views/material/material-import/step3/MaterialImportStep3.vue";
import MaterialExcelService from "@/service/materialexcel";

export default {
  components: { MaterialImportStep1, MaterialImportStep2, MaterialImportStep3 },
  name: "MaterialImport",
  data() {
    return {
      /**
       * Tiêu đề mô tả của từng bước.
       */
      stepTitle: `${this.$MResources.Step} 1: ${this.$MResources.SelectResourceFile}`,
      /**
       * Bước bắt đầu.
       */
      currentStep: 1,
      /**
       * Thuộc tính kiểm tra xem đã chọn file hay chưa.
       */
      chooseFile: false,
      /**
       * Thuộc tính kiểm tra xem file kiểm tra có khớp với file mẫu trên backend không.
       */
      isCheckedSuccess: false,
      allValid: false,
      /**
       * Id của file nhận được khi gửi lên backend.
       */
      fileId: "",
      /**
       * Tình trạng import file.
       */
      success: false,
      /**
       * File được người dùng nhập liệu.
       */
      file: null,
      /**
       * Thuộc tính kiểm tra file đã thay đổi.
       */
      changedFile: false,
    };
  },
  beforeMount() {
    const fileObjectJson = JSON.stringify({});
    sessionStorage.setItem("materialImportFile", fileObjectJson);
  },
  watch: {
    file: {
      handler() {
        this.changedFile = true;
      },
      deep: true,
    },
  },
  methods: {
    /**
     * xử lý sự kiện nhập khẩu thành công.
     * @author: nttue (20/07/2023)
     */
    handleImportSuccess() {
      this.success = true;
    },
    /**
     * xử lý sự kiện chuyển sang bước 3.
     * @author: nttue (20/07/2023)
     */
    handleNextStep3() {
      this.currentStep = 3;
      this.stepTitle = `${this.$MResources.Step} 3: ${this.$MResources.ImportResult}`;
    },

    /**
     * xử lý sự kiện bước validate.
     * @author: nttue (20/07/2023)
     */
    handleValidate(flag) {
      this.allValid = flag;
    },
    /**
     * xử lý sự kiện chọn file.
     * @author: nttue (20/07/2023)
     */
    handleChooseFile(newFile) {
      this.chooseFile = true;
      this.file = newFile;
    },
    /**
     * xử lý sự kiện chuyển sang bước 2.
     * @author: nttue (20/07/2023)
     */
    async handleNextStep2() {
      var formData = new FormData();
      formData.append("formFile", this.file);
      if (this.changedFile) {
        var checkFileResponse = await MaterialExcelService.checkFileAsync(
          formData
        );

        if (checkFileResponse.Message === "Success") {
          this.fileId = checkFileResponse.Data;

          this.currentStep = 2;
          this.isCheckedSuccess = true;
          this.stepTitle = `${this.$MResources.Step} 2: ${this.$MResources.CheckData}`;
        } else {
          this.$store.commit("dialog/setErrorMessage", {
            message: this.$MResources.InvalidImportFile,
          });
          this.isCheckedSuccess = false;
          this.fileId = "";
        }
      } else {
        if (this.isCheckedSuccess) {
          this.currentStep = 2;
        } else {
          this.$store.commit("dialog/setErrorMessage", {
            message: this.$MResources.InvalidImportFile,
          });
        }
      }
    },

    /**
     * xử lý sự kiện quay lại bước 1.
     * @author: nttue (20/07/2023)
     */
    handleBackStep1() {
      this.currentStep = 1;
    },
    /**
     * xử lý sự kiện đóng form import.
     * @author: nttue (20/07/2023)
     */
    handleClose() {
      this.$emit("closeFormImport", this.success);
      this.success = false;
    },
  },
};
</script>

<style lang="scss">
@import "./material-import.scss";
</style>
