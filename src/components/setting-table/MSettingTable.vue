<template>
  <div class="modal" v-show="showSetting">
    <div class="popup-right" ref="settingRef">
      <div class="popup-header flex-start">
        <div class="popup-header-left flex-start">
          <span class="popup-title">
            {{ this.$MResources.Customize }}
          </span>
        </div>
        <div class="popup-header-icon flex-start" @click="onExit">
          <mtooltip :content="this.$MResources.Close + ' (Esc)'">
            <div class="icon-close-white pointer"></div>
          </mtooltip>
        </div>
      </div>
      <div class="setting-table-container">
        <div class="setting-table-content">
          <table class="table" @dragover="onDragOver" ref="table">
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
                </th>
              </tr>
            </thead>
            <tbody class="t-body">
              <tr
                v-for="(item, index) in rows"
                :key="index"
                @click="onEdit(index)"
                @drop="onDrop($event, item.field)"
                @dragstart="onDragStart(item.field)"
                :draggable="true"
              >
                <td
                  v-for="(column, indexColumn) in columns"
                  :key="indexColumn"
                  :style="{
                    'text-align': column.textAlign,
                    width: column.width ? column.width + 'px' : null,
                    minWidth: column.width ? column.width + 'px' : null,
                  }"
                >
                  <div v-if="column.type === 'checkbox'" class="flex-center">
                    <mcheckbox v-model="item[column.field]" />
                  </div>
                  <div v-else-if="column.type === 'icon'">
                    <div :class="column.iconName" style="margin: auto"></div>
                  </div>
                  <div v-else-if="column.type === 'input'">
                    <div v-if="this.editMode === index">
                      <minput v-model="item[column.field]" />
                    </div>
                    <mtooltip
                      v-else
                      :content="item[column.field]"
                      :arrow="false"
                      :offset="[0, 0]"
                    >
                      <span> {{ item[column.field] }}</span>
                    </mtooltip>
                  </div>
                  <div v-else-if="column.type === 'string'">
                    <mtooltip
                      :content="item[column.field]"
                      :arrow="false"
                      :offset="[0, 0]"
                    >
                      <span> {{ item[column.field] }}</span>
                    </mtooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="setting-table-bottom">
          <div class="flex-between wrapper-button">
            <mbutton
              img="/src/assets/imgs/disable.webp"
              :label="this.$MResources.Cancel"
              typeButton="primary"
              @click="onExit"
            ></mbutton>

            <div class="flex-start">
              <div style="margin-right: 12px">
                <mbutton
                  img="/src/assets/imgs/saveadd.webp"
                  :label="this.$MResources.ImplicitSampling"
                  typeButton="primary"
                  @click="getDefaultSample"
                ></mbutton>
              </div>
              <mtooltip
                :arrow="false"
                :content="this.$MResources.SaveText + ' (Ctrl+S)'"
              >
                <mbutton
                  img="/src/assets/imgs/save.webp"
                  :label="this.$MResources.SaveText"
                  typeButton="primary"
                  @click="onSave"
                ></mbutton>
              </mtooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { settingHeader } from "./settingsHeader";
import { materialColumns } from "@/resource/datatable.js";

export default {
  name: "MSettingTable",

  data() {
    return {
      columns: settingHeader,
      rows: [],
      showSetting: false,
      editMode: -1,
    };
  },
  created() {
    const data = JSON.parse(localStorage.getItem("table-setting"));
    this.rows = data || materialColumns;
  },

  methods: {
    /**
     * Hàm xử lý sự kiện bắt đầu kéo.
     * @param {String} field Giá trị tên trường.
     * @author: nttue (20/07/2023)
     */
    onDragStart(field) {
      event.dataTransfer.setData("text/plain", field);
    },

    /**
     * Hàm xử lý sự kiện di chuyển phần tử kéo trên 1 phần tử khác.
     * @param {String} field Giá trị tên trường.
     * @author: nttue (20/07/2023)
     */
    onDragOver(event) {
      event.preventDefault();
    },
    /**
     * Hàm thực hiện xử lý việc drop một hàng
     * @param {Object} event
     * @param {String} targetField Giá trị tên của hàng muốn đổi
     * @author: nttue (20/07/2023)
     */
    onDrop(event, targetField) {
      event.preventDefault();
      const sourceField = event.dataTransfer.getData("text/plain");
      const sourceIndex = this.rows.findIndex(
        (item) => item.field === sourceField
      );
      const targetIndex = this.rows.findIndex(
        (item) => item.field === targetField
      );
      if (sourceIndex >= 0 && targetIndex >= 0) {
        this.rows.splice(targetIndex, 0, this.rows.splice(sourceIndex, 1)[0]);
      }
    },

    /**
     * Hàm thực hiện sửa thông các tiêu đề
     * @author: nttue (17/07/2023)
     */
    onEdit(index) {
      if (this.editMode !== index) {
        this.editMode = index;
      }
    },

    /**
     * Hàm thực hiện lưu thông tin cài đặt cột.
     * @author: nttue (17/07/2023)
     */
    onSave() {
      this.$store.commit("saveSettingTable", { setting: this.rows });
      this.onExit();
    },

    /**
     * Hàm thực hiện lấy mẫu cấu hình ngầm định của cột.
     * @author: nttue (17/07/2023)
     */
    getDefaultSample() {
      this.rows = materialColumns.map((item) => ({ ...item }));
    },

    /**
     * Hàm thực hiện chế độ exit.
     * @author: nttue (17/07/2023)
     */
    onExit() {
      this.hidden();
    },

    /**
     * Hàm thực hiện hiển thị component.
     * @author: nttue (17/07/2023)
     */
    show() {
      this.showSetting = true;
    },

    /**
     * Hàm thực hiện ẩn component.
     * @author: nttue (17/07/2023)
     */
    hidden() {
      this.showSetting = false;
    },
  },
  computed: {
    settingTable() {
      var result = this.$store.getters.tableSetting;

      return result;
    },
  },
  watch: {
    settingTable: {
      handler(newSetting) {
        this.rows = newSetting.map((item) => ({ ...item }));
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss">
@import "./setting-table.scss";
</style>
