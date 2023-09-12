<template>
  <div class="step2__container">
    <div class="step2__info flex-start">
      <div class="step2__info-left">
        <span class="import__title"
          >{{ validateResult.success }}/{{ rows.length }}
          {{ this.$MResources.ValidDataLine }}</span
        >
      </div>
      <div class="step2__info-right">
        <span class="import__title"
          >{{ validateResult.failure }}/{{ rows.length }}
          {{ this.$MResources.InvalidDataLine }}
        </span>
      </div>
    </div>
    <div class="step2__table-container">
      <table ref="table" class="table">
        <thead class="t-head">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :style="{
                width: column.width ? column.width + 'px' : null,
                minWidth: column.width ? column.width + 'px' : null,
              }"
            >
              <span class="t-head__text flex-center">
                {{ column.headerName }}
              </span>

              <div
                class="resizer"
                @mousedown="createResizableColumn($event, index)"
              ></div>
            </th>
          </tr>
        </thead>
        <tbody class="t-body">
          <tr v-for="(row, index) in rows" :key="index">
            <td
              v-for="(column, index) in columns"
              :key="index"
              :style="{
                'text-align': column.textAlign,
                width: column.width ? column.width + 'px' : null,
                minWidth: column.width ? column.width + 'px' : null,
              }"
            >
              <div
                :class="
                  column.field === 'ValidateDescription' &&
                  (!row.IsValid ? 'data__invalid' : 'data__valid')
                "
                v-if="column.type === 'list'"
                v-for="(validateItem, index) in row[column.field]"
                :key="index"
              >
                <span>{{ validateItem }}</span>
              </div>
              <mtooltip
                v-else
                :content="row[column.field]"
                :arrow="false"
                :offset="[0, 0]"
              >
                <span> {{ row[column.field] }}</span>
              </mtooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text" @click="getExampleFile">
      {{ this.$MResources.DownloadValidateResult }}
      <span class="dowload">{{ this.$MResources.Here }}</span>
    </p>
  </div>
</template>

<script>
import { headerInfo } from "./headerInfo";
import { resizeColumn } from "@/utils/common";
import MaterialExcelService from "@/service/materialexcel";
import { saveAs } from "file-saver";
export default {
  name: "Step2",
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
       * Kết quả validate file.
       */
      validateResult: {
        // Số bản ghi không có lỗi.
        success: 0,
        // Sối bản ghi bị lỗi.
        failure: 0,
      },

      // Tiêu đề cột của bảng kết quả validate.
      columns: headerInfo,

      // Dữ liệu validate trả về.
      rows: [],
    };
  },
  /**
   * Thực hiện map tên cột trong file excel với tên cột trong server.
   * @author: nttue (20/07/2023)
   */
  async beforeMount() {
    this.handleValidate(this.fileId);
  },

  methods: {
    async getExampleFile() {
      var res = await MaterialExcelService.getCheckFileAsync(this.fileId);
      saveAs(res, `${this.$MResources.CheckResult}_${this.fileId}.xlsx`);
    },
    /**
     * xử lý sự kiện resize column cho table
     * @author: nttue (20/07/2023)
     */
    createResizableColumn(event, index) {
      return resizeColumn(
        event,
        event.target,
        this.$refs.table,
        this.columns[index]
      );
    },

    /**
     * Thực hiện call api để validate file gửi lên.
     * @author: nttue (20/07/2023)
     */
    async handleValidate(id) {
      try {
        var res = await MaterialExcelService.validateFileAsync(id);
        this.rows = res.map((item) => {
          return {
            ...item,
            ValidateDescription:
              item.ValidateDescription.length > 0
                ? item.ValidateDescription
                : ["Hợp lệ"],
          };
        });
        let valid = 0;
        let inValid = 0;
        res.forEach((item) => {
          if (item.IsValid) {
            valid++;
          } else {
            inValid++;
          }
        });
        this.validateResult.success = valid;
        this.validateResult.failure = inValid;

        this.$emit(
          "onValidate",
          this.validateResult.success === this.rows.length
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
.step2__container {
  width: 728px;
  padding: 10px;
  height: 100%;
}
.step2__table-container {
  border: 1px solid #ccc;
  position: relative;
  height: calc(100% - 60px);

  width: 100%;
  overflow: overlay;
}
</style>
