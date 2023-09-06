<template>
  <div class="modal">
    <div
      class="popup modal-container"
      ref="form"
      :style="{ left: leftModal + '%', top: topModal + '%' }"
    >
      <div class="popup__header flex-between" @mousedown="handleMoveForm">
        <div class="popup__header-right">
          {{
            formMode === 1
              ? this.$MResources.editMaterialTitle
              : this.$MResources.addMaterialTitle
          }}
        </div>
        <div class="popup__header-left flex-start">
          <div class="popup__header-icon">
            <div class="icon-zoom-white"></div>
          </div>
          <div class="popup__header-icon" @click="onExit">
            <div class="icon-close-white"></div>
          </div>
        </div>
      </div>
      <div class="popup__content">
        <div class="popup__content-detail grid">
          <div class="grid_row form-row">
            <minput
              formName="Material"
              :label="'Tên'"
              name="MaterialName"
              ref="MaterialName"
              v-model="materialEdit.MaterialName"
              rules="required|maxlength_100"
              class="grid__column-6"
              tabIndex="1"
              :isUpdateValueWhenBlur="true"
            />
            <minput
              :label="'Mã'"
              formName="Material"
              name="MaterialCode"
              ref="MaterialCode"
              v-model="materialEdit.MaterialCode"
              rules="required|maxlength_10"
              class="grid__column-6"
              tabIndex="2"
            />
          </div>
          <div class="grid_row form-row">
            <mcombobox
              label="Tính chất"
              name="Category"
              ref="Category"
              v-model="materialEdit.Category"
              style="margin-right: 22px"
              :showingComboboxProp="showingCombobox"
              @editShowCombobox="editShowCombobox"
              rules="required"
              class="grid__column-6"
              tabIndex="3"
              :data="categories"
            />

            <mcombobox
              tooltip="Nhóm nguyên vật liệu"
              label="Nhóm NVL"
              name="MaterialGroupId"
              ref="MaterialGroupId"
              v-model="materialEdit.MaterialGroupId"
              class="grid__column-6"
              :hasAdd="true"
              rules="required"
              tabIndex="4"
              type="table"
              Tiêu
              đề
              cột
              trong
              combobox
              của
              stock.
              :data="materialgroups"
              :columnsTable="columnsStock"
              @onAddItem="handleOpenMaterialGroupStock"
              :showingComboboxProp="showingCombobox"
              @editShowCombobox="editShowCombobox"
            />
          </div>
          <div class="grid_row form-row">
            <div class="grid__column-6 grid_row" style="margin-right: 22px">
              <mcombobox
                tooltip="Đơn vị tính"
                :label="'ĐVT'"
                name="UnitId"
                ref="UnitId"
                v-model="materialEdit.UnitId"
                :hasAdd="true"
                rules="required"
                class="grid__column-8"
                tabIndex="5"
                :data="units"
                @onAddItem="handleOpenFormUnit"
                :showingComboboxProp="showingCombobox"
                @editShowCombobox="editShowCombobox"
              />
            </div>
            <mcombobox
              :label="'Kho ngầm định'"
              name="StockId"
              ref="StockId"
              v-model="materialEdit.StockId"
              :hasAdd="true"
              rules="required"
              class="grid__column-6"
              tabIndex="6"
              type="table"
              Tiêu
              đề
              cột
              trong
              combobox
              của
              stock.
              :data="stocks"
              :columnsTable="columnsStock"
              @onAddItem="handleOpenFormStock"
              :showingComboboxProp="showingCombobox"
              @editShowCombobox="editShowCombobox"
            />
          </div>
          <div class="grid_row form-row">
            <div class="grid__column-6 grid_row" style="margin-right: 22px">
              <minput
                :label="'Hạn sử dụng'"
                name="ExpiryTime"
                ref="ExpiryTime"
                v-model="materialEdit.ExpiryTime"
                class="grid__column-8"
                tabIndex="7"
                textAlign="right"
                :allowNumber="true"
              />
              <mcombobox
                style="margin-left: 8px"
                name="ExpiryType"
                ref="ExpiryType"
                v-model="materialEdit.ExpiryType"
                class="grid__column-6"
                tabIndex="8"
                :data="datetime"
                :showingComboboxProp="showingCombobox"
                @editShowCombobox="editShowCombobox"
              />
            </div>
            <div class="grid__column-6 grid_row">
              <minput
                tooltip="Số lượng tồn kho tối thiểu"
                :label="'SL tồn tối thiểu'"
                name="MinimumStock"
                ref="MinimumStock"
                v-model="materialEdit.MinimumStock"
                class="grid__column-8"
                textAlign="right"
                tabIndex="9"
                :allowDecimal="true"
              />
            </div>
          </div>
          <minput
            :label="'Mô tả'"
            typeInput="textarea"
            name="Description"
            v-model="materialEdit.Description"
            ref="Description"
            tabIndex="10"
          />
        </div>

        <div class="popup__tab">
          <span class="popup__tab-item">{{
            this.$MResources.unitConversion
          }}</span>
        </div>

        <div class="unit-container">
          <div class="unit-container__table" @contextmenu="handleContextMenu">
            <table class="table">
              <thead class="t-head" ref="tableHeader">
                <tr>
                  <th
                    v-for="(column, index) in columns"
                    :key="index"
                    :style="{
                      width: column.width ? column.width + 'px' : null,
                      minWidth: column.width ? column.width + 'px' : null,
                    }"
                  >
                    <mtooltip
                      :content="column.tooltip"
                      :arrow="false"
                      v-if="column.tooltip"
                    >
                      <span>
                        {{ column.headerName }}
                      </span></mtooltip
                    >
                    <span v-else>
                      {{ column.headerName }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody
                class="t-body"
                v-if="!isLoadingTable"
                v-click-outside="handleUnEditCellUnit"
              >
                <tr
                  v-for="(item, indexRow) in unitRows"
                  :key="indexRow"
                  v-show="item.Mode !== 3"
                >
                  <td
                    v-for="(column, indexColumn) in columns"
                    :key="indexColumn"
                    :class="{
                      'not-edit': column.type === 'string',
                      edit: column.type !== 'string',
                      editting:
                        cellEdit.row === indexRow &&
                        cellEdit.column === indexColumn,
                    }"
                    :style="{ 'text-align': column.textAlign }"
                    @click="handleEditCellUnit(indexRow, indexColumn)"
                  >
                    <span v-if="column.type === 'string'">{{
                      item[column.field]
                    }}</span>
                    <div v-else>
                      <div
                        v-if="
                          cellEdit.row === indexRow &&
                          cellEdit.column === indexColumn
                        "
                      >
                        <minput
                          :allowDecimal="column.allowDecimal"
                          textAlign="right"
                          v-if="column.type === 'input'"
                          v-model="item[column.field]"
                          :ref="'input_' + indexRow + '_' + indexColumn"
                        />

                        <mcombobox
                          v-else-if="column.type === 'combobox-add'"
                          :hasAdd="true"
                          :data="units"
                          textAlign="left"
                          @onAddItem="
                            () => {
                              cellAddUnit = indexRow;
                              handleOpenFormUnit();
                            }
                          "
                          v-model="item[column.field]"
                          :ref="'input_' + indexRow + '_' + indexColumn"
                        />
                        <mcombobox
                          v-else-if="column.type === 'combobox'"
                          :data="operator"
                          v-model="item[column.field]"
                          :ref="'input_' + indexRow + '_' + indexColumn"
                        />
                      </div>
                      <span v-else>{{
                        convertIdToText(
                          item[column.field],
                          column.type,
                          column.allowDecimal
                        )
                      }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
              <mloading
                style="position: absolute; height: 148px"
                :paddingTop="tableHeaderHeight"
                v-else
              />
            </table>
          </div>
          <div class="add-row flex-start">
            <mtooltip :content="'Ctrl + Insert'" :arrow="false">
              <mbutton
                icon="icon-add"
                label="Thêm dòng"
                typeButton="primary"
                @click="addRow"
                tabindex="11"
                ref="buttonInsertRowRef"
              ></mbutton>
            </mtooltip>
            <mtooltip :content="'Ctrl + Delete'" :arrow="false">
              <mbutton
                icon="icon-remove"
                label="Xóa dòng"
                typeButton="primary"
                :disabled="this.unitRows.length === 0"
                @click="removeRow"
                tabindex="11"
                ref="buttonRemoveRowRef"
              ></mbutton>
            </mtooltip>
          </div>
        </div>
        <div class="unfollow" v-if="formMode !== 0">
          <mcheckbox v-model="materialEdit.UnFollowing" />
          <span class="unfollow__label">{{ this.$MResources.UnFlowwing }}</span>
        </div>
      </div>
      <div class="popup__footer flex-between">
        <div class="popup__footer-left">
          <mtooltip :content="'Shift + F1'" :arrow="false">
            <mbutton
              icon="icon-help"
              :label="this.$MResources.HelpText"
              typeButton="primary"
              tabindex="15"
              ref="buttonHelpRef"
            ></mbutton>
          </mtooltip>
        </div>
        <div class="popup__footer-right flex-start">
          <mtooltip :content="'Ctrl + S'" :arrow="false">
            <mbutton
              img="/src/assets/imgs/save.webp"
              :label="this.$MResources.SaveText"
              typeButton="primary"
              @click="handleSaveForm"
              tabindex="12"
              ref="buttonSaveRef"
            ></mbutton>
          </mtooltip>

          <mtooltip :content="'Ctrl + Shift + S'" :arrow="false">
            <mbutton
              img="/src/assets/imgs/saveadd.webp"
              :label="this.$MResources.SaveAndAddText"
              typeButton="primary"
              @click="handleSaveAndAdd"
              tabindex="13"
              ref="buttonSaveAndCreateRef"
            ></mbutton>
          </mtooltip>
          <mtooltip :content="'Shift + B'" :arrow="false">
            <mbutton
              img="/src/assets/imgs/disable.webp"
              label="Hủy bỏ"
              typeButton="primary"
              @click="closeForm"
              tabindex="14"
              ref="buttonCancelRef"
            ></mbutton>
          </mtooltip>
        </div>
      </div>
    </div>
    <mloading v-if="isLoading" />
  </div>
  <mdialog
    v-if="showDialog"
    :content="dialogContent"
    @onYes="handleYes"
    @onNo="hanleClickNo"
    @onCancel="hanleClickCancel"
  ></mdialog>

  <MBaseForm
    v-if="showSubForm"
    :formHeader="objectForm.formHeader"
    :service="objectForm.service"
    :formData="objectForm.formData"
    :formName="objectForm.formName"
    :startTabIndex="16"
    @closeForm="handleCloseSubForm"
    @updateList="handleUpdateList"
  />
  <mcontext :dataListProp="contextList" ref="contextRef" />
</template>

<script>
import { unitCoversionColumns } from "@/resource/datatable.js";
import {
  UnitFormInput,
  StockFormInput,
  MaterialGroupFormInput,
} from "@/resource/dataform.js";
import materialService from "@/service/material.js";
import unitService from "@/service/unit.js";
import stockService from "@/service/stock.js";
import materialGroupService from "@/service/materialGroup.js";
import UnitConversionService from "@/service/UnitConversion.js";
import GlobalDialog from "@/components/global-dialog/MGlobalDialog.vue";
import validateFormMixin from "@/mixins/validateFormMixin.vue";
import handleKeyDownFormMixin from "@/mixins/handleKeyDownFormMixin.vue";

import MBaseForm from "@/components/base-form/MBaseForm.vue";
import { convertNumberDecimalToString, areObjectsEqual } from "@/utils/common";

export default {
  emits: ["onClose", "onReload"],
  mixins: [validateFormMixin, handleKeyDownFormMixin],
  components: {
    GlobalDialog,
    MBaseForm,
  },
  props: {
    /**
     * Prop nguyên vật liệu được truyền vào từ component MaterialList
     */
    material: {
      type: Object,
      required: true,
    },
    /**
     * Chế độ form: thêm, nhân bản, sửa
     */
    formMode: {
      type: Number,
    },
  },
  data() {
    return {
      /**
       * Tiêu đề cột trong bảng đơn vị chuyển đổi.
       */
      columns: unitCoversionColumns,
      /**
       * NVL sửa đổi trong form.
       */
      materialEdit: { ...this.material },
      /**
       * NVL ban đầu.
       */
      startingMaterial: { ...this.material },
      /**
       * Danh sách đơn vị chuyển đổi trước khi update.
       */
      prevUnitConversions: [],

      // Thuộc tính hiển thị loading ở table.
      isLoading: false,

      // Thuộc tính hiển thị loading ở table.
      isLoadingTable: false,

      // Thuộc tính hiển thị form thêm mới.
      showSubForm: false,

      // Thuộc tính hiển thị dialog cảnh báo.
      showDialog: false,

      /**
       * Chiều cao header của bảng.
       */
      tableHeaderHeight: 0,
      /**
       * Vị trí top của form.
       */
      topModal: 50,
      /**
       * Vị trí left của form.
       */
      leftModal: 50,
      /**
       * Tên combobox đang show droplist.
       */
      showingCombobox: "",

      /**
       * Vị trị ô thêm mới đơn vị tính.
       */
      cellAddUnit: -1,
      /**
       * Đối tượng trong sub-form: unit, stock, materialgroup.
       */
      objectForm: {
        formHeader: "",
        service: null,
        formData: null,
        formName: "",
      },

      /**
       * Đối tượng mẫu của unitconversion.
       * Khi thêm hàng thì add đối tượng này vào mảng unitRows.
       */
      unitRowTemplate: {
        Order: 1,
        UnitId: "",
        ConversionRate: 1.0,
        Calculation: "*",
        Description: "",
        Mode: 1,
      },
      /**
       * Vị trí ô đang ở chế độ sửa trong bảng unitconversion.
       */
      cellEdit: {
        row: -1,
        column: -1,
      },

      dialogContent: null,
      /**
       * DS đơn vị chuyển đổi.
       */
      unitRows: [],
      /**
       * Danh sách kho ngầm định.
       */
      stocks: [],
      /**
       * DS tên đơn vị tính.
       */
      unitsLabel: [],
      units: [],
      /**
       * Danh sách nhóm NVL.
       */
      materialgroups: [],
      /**
       * Danh sách đơn vị chuyển đổi lúc đầu.
       */
      unitConversionsAtFirst: [],
      /**
       * Mảng chứa thông tin của context.
       */
      contextList: [
        {
          icon: "icon-add",
          text: `${this.$MResources.addRow} (Ctrl+Insert)`,
          method: this.addRow,
        },
        {
          icon: "icon-replication",
          text: `${this.$MResources.removeRow} (Ctrl+Delete)`,
          method: this.removeRow,
        },
      ],
      /**
       * Tiêu đề cột trong combobox của stock.
       */
      columnsStock: [
        {
          field: "code",
          headerName: this.$MResources.CodeText,
        },
        {
          field: "name",
          headerName: this.$MResources.NameText,
        },
      ],
      /**
       * Mảng chứa thông tin chuyển phần tính chất.
       */
      categories: [
        { id: this.$MResources.materials, name: this.$MResources.materials },
        { id: this.$MResources.otherItem, name: this.$MResources.otherItem },
        {
          id: this.$MResources.bottledDrinks,
          name: this.$MResources.bottledDrinks,
        },
      ],
      /**
       * Toán tử trong phần phép tính đơn vị chuyển đổi.
       */
      operator: [
        { id: "*", name: "*", label: this.$MResources.Divide },
        { id: "/", name: "/", label: this.$MResources.Substract },
      ],
      /**
       * Danh sách loại thời gian: ngày, tháng, năm.
       */
      datetime: [
        {
          id: this.$MResources.dayLabel,
          name: this.$MResources.dayLabel,
        },
        { id: this.$MResources.monthLabel, name: this.$MResources.monthLabel },
        { id: this.$MResources.yearLabel, name: this.$MResources.yearLabel },
      ],
    };
  },

  async mounted() {
    // Thực hiện focus vào ô input đầu tiên khi mở form lên.
    this.$refs[this.refsList[0]].focus();

    if (this.$refs.tableHeader) {
      this.tableHeaderHeight =
        this.$refs.tableHeader.getBoundingClientRect().height + 2;
    }
  },
  async created() {
    // Lấy danh sách đơn vị đơn vị tính, kho, nhóm nguyên vật liệu.
    await this.fetchData(this.getUnits);
    await this.fetchData(this.getStocks);
    await this.fetchData(this.getMaterialGroups);

    // Nếu chế độ form là sửa hoặc nhân bản thì lấy danh sách đơn vị chuyển đổi.
    if (
      this.formMode === this.$MEnum.formMode.replication ||
      this.formMode === this.$MEnum.formMode.update
    ) {
      this.getUnitConversion();
    }
  },

  methods: {
    /**
     * Hàm di chuyển vị trí của form theo con trỏ chuột.
     * @author: nttue (03/09/2023)
     */
    handleMoveForm(event) {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.pageX;
      const startY = event.pageY;
      const form = this.$refs.form;
      const formRect = this.$refs.form.getBoundingClientRect();

      const maxTop = Math.ceil(
        ((window.innerHeight - formRect.height / 2) / window.innerHeight) * 100
      );
      const maxLeft = Math.ceil(
        ((window.innerWidth - formRect.width / 2) / window.innerWidth) * 100
      );
      const minTop = Math.ceil(
        ((0.5 * formRect.height) / window.innerHeight) * 100
      );
      const minLeft = Math.ceil(
        ((0.5 * formRect.width) / window.innerWidth) * 100
      );

      const handleMouseMove = (event) => {
        const diffX = event.pageX - startX;
        const diffY = event.pageY - startY;

        const percentY = Math.ceil(
          ((formRect.top + diffY + formRect.height / 2) / window.innerHeight) *
            100
        );
        const percentX = Math.ceil(
          ((formRect.left + diffX + formRect.width / 2) / window.innerWidth) *
            100
        );

        this.leftModal = Math.min(Math.max(percentX, minLeft), maxLeft);
        this.topModal = Math.min(Math.max(percentY, minTop), maxTop);
      };

      const mouseUpHandler = () => {
        form.removeEventListener("mousemove", handleMouseMove);
        form.removeEventListener("mouseup", mouseUpHandler);
      };
      form.addEventListener("mousemove", handleMouseMove);
      form.addEventListener("mouseup", mouseUpHandler);
    },
    /**
     * Hàm reset form trước khi đóng form.
     * @author: nttue (20/08/2023)
     */
    handleClearForm() {
      this.unitRows = [];
    },
    /**
     * Hàm hiển thị tên combobox đang hiển thị droplist.
     * @author: nttue (20/08/2023)
     */
    editShowCombobox(comboboxName) {
      this.showingCombobox = comboboxName;
    },
    /**
     * Hàm focus vào ô input đầu tiên bị lỗi sau khi đóng dialog cảnh báo
     * @author: nttue (20/08/2023)
     */
    handleFocusInputError() {
      this.$refs[this.refsList[this.firstError]].focus();
    },

    /**
     * Hàm chuyển đổi dữ liệu từ id sang text để hiển thị.
     *  @author: nttue (20/08/2023)
     */
    convertIdToText(value, type, allowDecimal) {
      if (type === "combobox-add") {
        const object = this.units.find((item) => item.id === value);
        return object ? object.name : "";
      }

      return allowDecimal ? convertNumberDecimalToString(value) : value;
    },

    /**
     * Hàm thực hiện mở phần context khi người dùng nhấn chuột phải.
     * @param {Object} event đối tượng event khi click.
     * @author: nttue (20/08/2023)
     */
    handleContextMenu(event) {
      event.stopPropagation();
      event.preventDefault(); // Chặn sự kiện mặc định
      this.$refs.contextRef.show(event);
    },

    /**
     * Hàm bắt sự kiện khi đóng phần sửa 1 ô trong bảng đơn vị chuyển đổi.
     * @author: nttue (20/08/2023)
     */
    handleUnEditCellUnit() {
      this.cellEdit = {
        row: -1,
        column: -1,
      };
    },

    /**
     * Hàm lấy ra các đơn vị chuyển đổi theo ID của material.
     * @author: nttue (20/08/2023)
     */
    async getUnitConversion() {
      this.isLoadingTable = true;
      const res = await UnitConversionService.getListByMaterialId(
        this.materialEdit.MaterialId
      );
      // Gán thêm trường Order để lấy số thứ tự của ĐVCĐ.
      // Gán Edit mode mặc định là none => chưa làm gì.
      this.unitRows = res.map((item, index) => {
        if (item.UnitId && item.ConversionRate && item.Calculation) {
          var code = this.findCodeById(item.UnitId, this.units);
          var codeOfMaterialUnitCode = this.findCodeById(
            this.materialEdit.UnitId,
            this.units
          );
          if (item.Calculation === "*") {
            item.Description = `1 ${code} = ${convertNumberDecimalToString(
              item.ConversionRate
            )} ${item.Calculation} ${codeOfMaterialUnitCode}`;
          } else {
            item.Description = `1 ${code} = 1 ${
              item.Calculation
            } ${convertNumberDecimalToString(
              item.ConversionRate
            )} ${codeOfMaterialUnitCode}`;
          }
        }
        return {
          ...item,
          Order: index + 1,
          Mode: this.$MEnum.MODE.NONE,
        };
      });

      // gán ĐVCĐ ban đầu.
      this.unitConversionsAtFirst = JSON.parse(JSON.stringify(this.unitRows));
      // gán ĐVCĐ trước.
      this.prevUnitConversions = JSON.parse(JSON.stringify(this.unitRows));
      this.isLoadingTable = false;
    },

    // MARK: Phần mở sub form: unit, stock và materialgroup.
    /**
     * Hàm thực hiện mở form unit.
     * @author: nttue (20/08/2023)
     */
    handleOpenFormUnit() {
      this.handleOpenSubForm(unitService, UnitFormInput, "Unit");
    },

    /**
     * Hàm thực hiện mở form kho ngầm định.
     * @author: nttue (20/08/2023)
     */
    handleOpenFormStock() {
      this.handleOpenSubForm(stockService, StockFormInput, "Stock");
    },

    /**
     * Hàm thực hiện mở form nhóm nguyên vật liệu.
     * @author: nttue (20/08/2023)
     */
    handleOpenMaterialGroupStock() {
      this.handleOpenSubForm(
        materialGroupService,
        MaterialGroupFormInput,
        "MaterialGroup"
      );
    },

    /**
     * Hàm thực hiện mở form detail.
     * @author: nttue (20/08/2023)
     */
    handleOpenSubForm(service, formData, formName) {
      this.showSubForm = true;
      // Gán tiêu đề form.
      this.objectForm.formHeader = this.$MResources.FormName[formName].add;
      // gán api service cho form.
      this.objectForm.service = service;
      // gán mảng input cho form.
      this.objectForm.formData = formData;
      // gán tên form.
      this.objectForm.formName = formName;
    },
    /**
     * Hàm thực hiện sự kiện đóng subform.
     * @author: nttue (20/08/2023)
     */
    handleCloseSubForm() {
      this.showSubForm = false;
    },
    /**
     * Hàm thực hiện sự kiện đóng subform và thêm bản ghi mới vào danh sách.
     * @author: nttue (20/08/2023)
     */
    handleUpdateList(newObject, formName) {
      this.showSubForm = false;
      if (newObject && formName) {
        /**
         * Trường hợp Unit thêm mới gán đối tượng vừa thêm mới vào mảng.
         * thực hiện focus vào combobox vừa thêm mới dữ liệu.
         */
        switch (formName) {
          case "Unit":
            this.units.push({ id: newObject.UnitId, name: newObject.UnitCode });
            if (this.cellAddUnit >= 0) {
              this.unitRows[this.cellAddUnit].UnitId = newObject.UnitId;
              this.handleEditCellUnit(this.cellAddUnit, 1);
            } else {
              this.materialEdit.UnitId = newObject.UnitId;
              this.$refs.UnitId.focus();
            }
            this.cellAddUnit = -1;
            break;

          case "Stock":
            this.stocks.push({
              id: newObject.StockId,
              code: newObject.StockCode,
              name: newObject.StockName,
            });
            this.materialEdit.StockId = newObject.StockId;
            this.$refs.StockId.focus();
            break;

          case "MaterialGroup":
            this.materialgroups.push({
              id: newObject.MaterialGroupId,
              code: newObject.MaterialGroupCode,
              name: newObject.MaterialGroupName,
            });
            this.materialEdit.MaterialGroupId = newObject.MaterialGroupId;
            this.$refs.MaterialGroupId.focus();
            break;
        }
      }
    },

    /**
     * Hàm xử lý sự kiện khi người dùng click vào button có ở dialog.
     * @author: nttue (20/08/2023)
     */
    handleYes() {
      this.showDialog = false;
      let mode = this.$MEnum.SUBMIT_MODE.ADD;
      this.handleSaveMaterial(mode);
      this.closeForm();
    },

    /**
     * Hàm xử lý sự kiện khi người dùng click vào button không ở dialog.
     * @author: nttue (20/08/2023)
     */
    hanleClickNo() {
      this.closeForm();
    },

    /**
     * Hàm xử lý sự kiện khi người dùng click vào button bỏ quả ở dialog.
     * @author: nttue (20/08/2023)
     */
    hanleClickCancel() {
      this.showDialog = false;
    },

    /**
     * @description Hàm thực hiện kiểm tra xem các input có lỗi không
     * nếu không gửi sự kiện đóng form và thêm mới nhân viên
     * nếu có lỗi thì bắn ra một dialog để cảnh báo cho người dùng
     * @param {Number} mode
     * @return
     * @author: nttue (20/08/2023)
     * Modified at: 28/6/2023
     */
    async handleSaveMaterial(mode) {
      // Thực hiện validate Material trước đơn vị chuyển đổi.
      if (this.validateData()) {
        // Nếu validate trả về true => có lỗi => commit 1 dialog để cảnh báo người dùng.
        this.$store.commit("dialog/setErrorMessage", {
          message: this.$refs[this.refsList[this.firstError]].error,
          handleClose: this.handleFocusInputError,
        });
      }
      // Thực hiện validate đơn vị chuyển dổi.
      else if (this.validateUnitConversion() !== this.$MEnum.maxIndex) {
        let rowError = this.validateUnitConversion();
        this.$store.commit("dialog/setErrorMessage", {
          message: this.$MResources.unitConversionIsEmpty,
          handleClose: () => {
            this.handleEditCellUnit(rowError, 1);
          },
        });
      } else {
        // Tạo 1 đối tượng gửi lên backend để update.
        const materialInput = {
          MaterialCreateDto: {
            ...this.materialEdit,
            UnFollowing: this.materialEdit.UnFollowing
              ? this.$MEnum.YES_OR_NO.YES
              : this.$MEnum.YES_OR_NO.NO,
          },
          UnitConversionCreateDtos: this.unitRows,
        };
        // Nếu chế độ form đang là thêm hoặc nhân bản thì gọi api post.
        if (
          this.formMode === this.$MEnum.formMode.add ||
          this.formMode === this.$MEnum.formMode.replication
        ) {
          await materialService.post(materialInput);
          this.$store.dispatch("showToast", {
            label: this.$MResources.ToastMessage.MaterialCreate,
          });
          this.$emit("onReload");
        } else if (this.formMode === this.$MEnum.formMode.update) {
          // Nếu sử dụng hàm isEdited kiểm tra nguyên vật liệu đầu vào với nguyên vật liệu đã sửa đổi.
          // Nếu true => call api để udpate.
          if (this.isEdited()) {
            await materialService.update(
              this.materialEdit.MaterialId,
              materialInput
            );

            this.$emit("onReload");
          }
          // Ngược lại thì không phải call api.
          this.$store.dispatch("showToast", {
            label: this.$MResources.ToastMessage.MaterialUpdate,
          });
        }
        // gán lại chỉ số firstError = maxIndex.
        this.firstError = this.$MEnum.maxIndex;
        this.handleClearForm();
        if (mode === this.$MEnum.SUBMIT_MODE.ADD) {
          this.closeForm();
        } else {
          this.startingMaterial = {};
          this.materialEdit = {};
        }
      }
    },

    /**
     * Hàm thực hiện validate phần đơn vị chuyển đổi.
     * Đồng thời kiểm tra xem những đơn vị chuyển đổi nào được sửa.
     * @return trả về tình trạng validate.
     * @author: nttue (20/08/2023)
     */
    validateUnitConversion() {
      // gán chỉ sổ của ô bị lỗi là max index.
      var isError = this.$MEnum.maxIndex;
      console.log(this.unitRows);
      for (let i = 0; i < this.unitRows.length; i++) {
        const unitRow = this.unitRows[i];
        const unitConversion = this.unitConversionsAtFirst.find(
          (conversion) =>
            conversion.UnitConversionId === unitRow.UnitConversionId
        );

        // Kiểm tra nếu unitRow.UnitId là rỗng
        if (!unitRow.UnitId) {
          isError = Math.min(isError, i);
        }
        // console.log(unitRow, unitConversion);

        // Kiểm tra nếu có sự khác biệt giữa unitRow và unitConversion và unitRow.Mode là NONE
        if (
          unitConversion &&
          !areObjectsEqual(unitRow, unitConversion) &&
          unitRow.Mode === this.$MEnum.MODE.NONE
        ) {
          unitRow.Mode = this.$MEnum.MODE.EDIT;
        }
      }
      // Trả về giá trị isError
      return isError;
    },

    /**
     * Hàm thực hiện lưu form.
     * @author: nttue (20/08/2023)
     */
    handleSaveForm() {
      let mode = this.$MEnum.SUBMIT_MODE.ADD;
      this.handleSaveMaterial(mode);
    },

    /**
     * Hàm thực hiện lưu form và thêm mới mới.
     * @author: nttue (20/08/2023)
     */
    handleSaveAndAdd() {
      let mode = this.$MEnum.SUBMIT_MODE.ADD_AND_CREATE;
      this.handleSaveMaterial(mode);
    },

    /**
     * Xử lý sự kiện khi người dùng muốn chỉnh sửa ô trong bảng.
     * @param {number} indexRow - Chỉ số dòng trong bảng.
     * @param {number} indexColumn - Chỉ số cột trong bảng.
     * @author: nttue (20/08/2023)
     */
    handleEditCellUnit(indexRow, indexColumn) {
      // Ngăn chặn sự lan truyền của sự kiện để tránh xung đột.
      event.stopPropagation();

      // Lưu thông tin ô đang được chỉnh sửa (dòng và cột).
      this.cellEdit = {
        row: indexRow,
        column: indexColumn,
      };

      // Tạo tên cho input dựa trên chỉ số dòng và cột.
      const inputName = "input_" + indexRow + "_" + indexColumn;

      // Sử dụng $nextTick để đảm bảo rằng các thay đổi trước đó đã được cập nhật.
      this.$nextTick(() => {
        // Tìm và kiểm tra tồn tại của input theo tên đã tạo.
        if (this.$refs[inputName] && this.$refs[inputName][0]) {
          // Tập trung vào input để người dùng có thể nhập liệu.
          this.$refs[inputName][0].focus();
        }
      });
    },

    /**
     * Hàm thực hiện thêm một hàng vào bảng đơn vị chuyển đổi.
     * @author: nttue (20/08/2023)
     */
    addRow(event) {
      event?.stopPropagation();

      if (this.materialEdit.UnitId) {
        this.unitRows.push({
          ...this.unitRowTemplate,
          Order: this.unitRows.length + 1,
        });

        this.handleEditCellUnit(this.unitRows.length - 1, 1);
      } else {
        this.$store.commit("dialog/setErrorMessage", {
          message: this.$MResources.unitIsEmpty,
          handleClose: () => {
            this.$refs["UnitId"].focus();
          },
        });
      }
    },
    /**
     * Hàm thực hiện xóa một hàng vào bảng đơn vị chuyển đổi.
     * @author: nttue (20/08/2023)
     */
    removeRow() {
      for (let i = this.unitRows.length - 1; i >= 0; i--) {
        if (!this.unitRows[i].UnitConversionId) {
          this.unitRows.pop();
          break;
        } else {
          if (this.unitRows[i].Mode != this.$MEnum.MODE.DELETE) {
            this.unitRows[i].Mode = this.$MEnum.MODE.DELETE;
            break;
          }
        }
      }
    },

    /**
     * Hàm thực hiện gửi sự kiện đóng form.
     * @author: nttue (20/08/2023)
     */
    closeForm() {
      this.$emit("onClose");
    },

    /**
     * Hàm thực hiện mở dialog.
     * @author: nttue (20/08/2023)
     */
    openDialog(content) {
      this.showDialog = true;
      this.dialogContent = content;
    },

    /**
     * Hàm thực hiện xử lý sự kiện khi người dùng muốn thoát form.
     * @author: nttue (20/08/2023)
     */
    onExit() {
      this.isEdited()
        ? this.openDialog({
            label: this.$MResources.DataChanged,
          })
        : this.closeForm();
    },

    /**
     * Hàm base để fetch dữ liệu.
     * @author: nttue (20/08/2023)
     */
    async fetchData(getDataFunction) {
      try {
        this.isLoading = true;
        getDataFunction();
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },

    // MARK: Hàm lấy danh sách kho, đơn vị tính và nhóm nguyên vật liệu
    /**
     * Hàm thực hiện lấy đơn vị.
     * @author: nttue (20/08/2023)
     */
    async getUnits() {
      const data = await unitService.get();
      this.units = data.map((item) => {
        return {
          id: item.UnitId,
          name: item.UnitCode,
        };
      });
    },

    /**
     * Hàm thực hiện danh sách kho ngầm định.
     * @author: nttue (20/08/2023)
     */
    async getStocks() {
      const data = await stockService.get();
      this.stocks = data.map((item) => {
        return {
          id: item.StockId,
          name: item.StockName,
          code: item.StockCode,
        };
      });
    },

    /**
     * Hàm thực hiện danh sách nhóm nguyên vật liệu.
     * @author: nttue (20/08/2023)
     */
    async getMaterialGroups() {
      const data = await materialGroupService.get();
      this.materialgroups = data.map((item) => {
        return {
          id: item.MaterialGroupId,
          code: item.MaterialGroupCode,
          name: item.MaterialGroupName,
        };
      });
    },
    // ENDMARK

    /**
     * Hàm thực hiện tìm mã theo id.
     * @author: nttue (20/08/2023)
     */
    findCodeById(id, data) {
      var filterItem = data.find((item) => item.id === id);
      if (filterItem) {
        return filterItem.name;
      } else {
        return "";
      }
    },

    /**
     * Hàm kiểm tra xem đối tượng material đầu vào với đầu ra khác nhau không.
     * @returns {boolean} - True nếu có sự thay đổi, ngược lại là False.
     * @author: nttue (20/08/2023)
     */
    isEdited() {
      // Lấy danh sách các key trong đối tượng materialEdit.
      const listKeys = Object.keys(this.materialEdit);

      // Duyệt qua các key và so sánh giá trị trong materialEdit và startingMaterial.
      for (let i = 0; i < listKeys.length; i++) {
        const key = listKeys[i];

        // Kiểm tra nếu startingMaterial không có key tương ứng với materialEdit.
        if (!this.startingMaterial.hasOwnProperty(key)) {
          // Nếu materialEdit[key] tồn tại, gán giá trị của startingMaterial[key] thành chuỗi rỗng.
          // Ngược lại, gán giá trị của startingMaterial[key] bằng giá trị của materialEdit[key].
          if (this.materialEdit[key]) {
            this.startingMaterial[key] = "";
          } else {
            this.startingMaterial[key] = this.materialEdit[key];
          }
        }
      }

      // Tạo đối tượng startingMaterialInput bằng cách kết hợp startingMaterial và unitConversionsAtFirst.
      const startingMaterialInput = {
        ...this.startingMaterial,
        ...this.unitConversionsAtFirst,
      };

      // Tạo đối tượng materialInputAfter bằng cách kết hợp materialEdit và unitRows.
      const materialInputAfter = {
        ...this.materialEdit,
        ...this.unitRows,
      };

      console.log(this.unitConversionsAtFirst, this.unitRows);

      // So sánh hai đối tượng dưới dạng JSON để xác định sự thay đổi.
      return !areObjectsEqual(startingMaterialInput, materialInputAfter);
    },
  },

  watch: {
    /**
     * Hàm call api để lấy mã mới khi người dùng nhập tên NVL.
     * @param {String} newValue tên NVL
     * @author: nttue (20/08/2023)
     */
    "materialEdit.MaterialName": async function (newValue) {
      try {
        if (newValue && newValue.trim()) {
          const newMaterialCode = await materialService.getNewCode(newValue);
          this.materialEdit.MaterialCode = newMaterialCode;
        } else {
          this.materialEdit.MaterialCode = "";
        }
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Hàm thực hiện gán giá trị phần mổ trả khi người dùng điền đầy đủ thông tin phần đơn vị chuyển đổi.
     * @param {String} newValue đơn vị chuyển đổi
     * @author: nttue (20/08/2023)
     */
    "materialEdit.UnitId": function (newValue) {
      try {
        var newUnit = this.units.find((item) => item.id === newValue)?.name;

        if (newValue?.trim()) {
          this.unitRows.forEach((item) => {
            if (item.UnitId && item.ConversionRate && item.Calculation) {
              if (item.Calculation === "*") {
                item.Description = `1 ${
                  item.UnitCode
                } = ${convertNumberDecimalToString(item.ConversionRate)} ${
                  item.Calculation
                } ${newUnit}`;
              } else {
                item.Description = `1 ${code} = 1 ${
                  item.Calculation
                } ${convertNumberDecimalToString(
                  item.ConversionRate
                )} ${newUnit}`;
              }
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Hàm thực hiện validate trường hợp trùng đơn vị chuyển đổi và tính toán mô tả cho đơn vị chuyển đổi.
     * @param {String} newValue - Đơn vị chuyển đổi mới.
     * @author: nttue (20/08/2023)
     */
    unitRows: {
      // Xử lý khi có thay đổi trong mảng unitRows.
      handler(newUnitConversions) {
        newUnitConversions.forEach((item, index) => {
          const currentRowIndex = index; // Lưu index vào biến tạm

          // Kiểm tra nếu đơn vị chuyển đổi trùng với đơn vị tính của vật liệu.
          if (item.UnitId === this.materialEdit.UnitId) {
            // Đặt đơn vị chuyển đổi thành đơn vị trước đó.
            item.UnitId = this.prevUnitConversions[index].UnitId;

            // Hiển thị thông báo lỗi và xử lý khi người dùng đóng thông báo.
            this.$store.commit("dialog/setErrorMessage", {
              message: this.$MResources.ucIsDuplicatedWithUnitCode,
              handleClose: () => {
                this.handleEditCellUnit(currentRowIndex, 1);
              },
            });
          }

          // Kiểm tra nếu tỷ lệ chuyển đổi bằng 0.
          if (item.ConversionRate === 0) {
            item.ConversionRate = 0;

            // Hiển thị thông báo lỗi và xử lý khi người dùng đóng thông báo.
            this.$store.commit("dialog/setErrorMessage", {
              message: this.$MResources.UnitConsersionGreaterThanZero,
              handleClose: () => {
                this.handleEditCellUnit(currentRowIndex, 2);
              },
            });
          }

          // Tính toán mô tả cho đơn vị chuyển đổi.
          if (item.UnitId && item.ConversionRate && item.Calculation) {
            var description = "";
            var code = this.findCodeById(item.UnitId, this.units);
            var codeOfMaterialUnitCode = this.findCodeById(
              this.materialEdit.UnitId,
              this.units
            );
            if (item.Calculation === "*") {
              description = `1 ${code} = ${convertNumberDecimalToString(
                item.ConversionRate
              )} ${item.Calculation} ${codeOfMaterialUnitCode}`;
            } else {
              description = `1 ${code} = 1 ${
                item.Calculation
              } ${convertNumberDecimalToString(
                item.ConversionRate
              )} ${codeOfMaterialUnitCode}`;
            }
            this.unitRows[currentRowIndex].Description = description;
          } else {
            this.unitRows[currentRowIndex].Description = "";
          }

          // Cập nhật đơn vị chuyển đổi trong unitRows.
          if (item.UnitId) {
            var newUnit = this.units.find(
              (itemUnit) => itemUnit.id === item.UnitId
            );
            this.unitRows[currentRowIndex].UnitId = newUnit.id;
          }
        });

        // Kiểm tra và xử lý nếu có đơn vị chuyển đổi trùng lặp.
        for (let i = 0; i < newUnitConversions.length; i++) {
          for (let j = i + 1; j < newUnitConversions.length; j++) {
            if (
              newUnitConversions[j].UnitId === newUnitConversions[i].UnitId &&
              newUnitConversions[j].UnitId
            ) {
              var code = this.findCodeById(
                newUnitConversions[j].UnitId,
                this.units
              );
              newUnitConversions[j].UnitId = this.prevUnitConversions[j].UnitId;

              // Hiển thị thông báo lỗi và xử lý khi người dùng đóng thông báo.
              this.$store.commit("dialog/setErrorMessage", {
                message: `${this.$MResources.unitConversion} <<${code}>> ${this.$MResources.used}`,
                handleClose: () => {
                  this.handleEditCellUnit(j, 1);
                },
              });
            }
          }
        }

        // Lưu lại các giá trị trước đó của đơn vị chuyển đổi.
        this.prevUnitConversions = newUnitConversions.map((item) => {
          return {
            ...item,
          };
        });
      },
      deep: true, // Theo dõi thay đổi sâu trong mảng unitRows.
    },
  },
  computed: {
    /**
     * @return trả vể 1 mảng chứa tên của các ref trong form.
     * @author nttue (07/07/2023)
     */
    refsList() {
      return Object.keys(this.$refs);
    },
  },
};
</script>

<style lang="scss">
@import "./material-form.scss";
</style>
