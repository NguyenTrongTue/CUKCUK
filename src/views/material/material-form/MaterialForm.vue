<template>
  <mpopup
    :headerTile="
      formMode === 1
        ? this.$MResources.editMaterialTitle
        : this.$MResources.addMaterialTitle
    "
    :hasClose="true"
    @closePopup="onExit"
  >
    <template #content ref="form">
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
              tabIndex="4"
              type="table"
              :data="materialgroups"
              :columnsTable="columnsCombobox"
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
              class="grid__column-6"
              tabIndex="6"
              type="table"
              :data="stocks"
              :columnsTable="columnsCombobox"
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
            label="Ghi chú"
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
                      column.field !== "Order"
                        ? item[column.field]
                        : indexRow + 1
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
                          :ref="'input_' + indexRow + '_' + indexColumn"
                          v-model="item[column.field]"
                          :defaultValue="operator[0].id"
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
        <div class="unfollow" v-if="formMode === this.$MEnum.formMode.update">
          <mcheckbox
            ref="UnFollowingRef"
            v-model="materialEdit.UnFollowing"
            :tabIndex="12"
          />
          <span
            class="unfollow__label"
            @click="materialEdit.UnFollowing = !materialEdit.UnFollowing"
            >{{ this.$MResources.UnFlowwing }}</span
          >
        </div>
      </div>
      <div class="popup__footer flex-between">
        <div class="popup__footer-left">
          <mtooltip :content="'Shift + F1'" :arrow="false">
            <mbutton
              icon="icon-help"
              :label="this.$MResources.HelpText"
              typeButton="primary"
              tabindex="16"
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
              tabindex="13"
              ref="buttonSaveRef"
            ></mbutton>
          </mtooltip>

          <mtooltip :content="'Ctrl + Shift + S'" :arrow="false">
            <mbutton
              img="/src/assets/imgs/saveadd.webp"
              :label="this.$MResources.SaveAndAddText"
              typeButton="primary"
              @click="handleSaveAndAdd"
              tabindex="14"
              ref="buttonSaveAndCreateRef"
            ></mbutton>
          </mtooltip>
          <mtooltip :content="'Shift + B'" :arrow="false">
            <mbutton
              img="/src/assets/imgs/disable.webp"
              label="Hủy bỏ"
              typeButton="primary"
              @click="closeForm"
              tabindex="15"
              ref="buttonCancelRef"
            ></mbutton>
          </mtooltip>
        </div>
      </div>
    </template>
  </mpopup>

  <mloading v-if="isLoading" :typeLoading="1" />

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
    :startTabIndex="17"
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

import validateFormMixin from "@/mixins/validateFormMixin.vue";
import handleKeyDownFormMixin from "@/mixins/handleKeyDownFormMixin.vue";

import MBaseForm from "@/components/base-form/MBaseForm.vue";
import {
  convertNumberDecimalToString,
  areObjectsEqual,
  createPrefixCode,
} from "@/utils/common";
import {
  datetime as datetimeResource,
  categories as categoriesResource,
  operator as operatorResource,
  columnsCombobox as columnsComboboxResource,
  unitRowTemplate as unitRowTemplateResource,
} from "@/views/material/material-form/form-resources.js";

export default {
  /**
   * Gửi sự kiện đóng form và tải lại trang.
   */
  emits: ["onClose", "onReload"],
  /**
   * ValidateFormMixn dùng để định nghĩa kịch bản validate dùng chung cho các form.
   * handleKeyDownFormMixin xử lý các sự kiện phím tắt cho form.
   */
  mixins: [validateFormMixin, handleKeyDownFormMixin],
  components: {
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
     * Chế độ form truyền từ ngoài vào: thêm, nhân bản, sửa
     */
    formModeProp: {
      type: Number,
    },
  },
  data() {
    return {
      /**
       * Chế độ form: thêm, nhân bản, sửa
       */
      formMode: this.formModeProp,
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
      /**
       * Thuộc tính hiển thị loading ở table.
       */
      isLoading: false,
      /**
       * Thuộc tính hiển thị loading ở table.
       */
      isLoadingTable: false,
      /**
       * Thuộc tính hiển thị form thêm mới.
       */
      showSubForm: false,
      /**
       * Thuộc tính hiển thị dialog cảnh báo.
       */
      showDialog: false,
      /**
       * Chiều cao header của bảng.
       */
      tableHeaderHeight: 0,
      /**
       * Tên combobox đang show droplist.
       */
      showingCombobox: "",
      /**
       * Vị trị ô thêm mới đơn vị tính.
       */
      cellAddUnit: -1,

      /**
       * Chỉ số hàng đang được focus trong bảng đơn vị chuyển đổi.
       */
      rowFocused: -1,

      /**
       * Tên ô nhập liệu đang mở form thêm mới.
       */
      inputName: "",
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
      unitRowTemplate: unitRowTemplateResource,
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
      /**
       * Danh sách dữ liệu đơn vị tính.
       */
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
      columnsCombobox: columnsComboboxResource,
      /**
       * Mảng chứa thông tin chuyển phần tính chất.
       */
      categories: categoriesResource,
      /**
       * Toán tử trong phần phép tính đơn vị chuyển đổi.
       */
      operator: operatorResource,
      /**
       * Danh sách loại thời gian: ngày, tháng, năm.
       */
      datetime: datetimeResource,
      /**
       * Chỉ số lớn nhất của code được trả về từ backend.
       */
      maxCode: -1,
    };
  },
  /**
   * Nếu nhận được lỗi trùng mã trả về từ backend thì focus vào ô input mã.
   */
  beforeMount() {
    this.$emitter.on("duplicateCode", () => {
      this.$nextTick(() => {
        this.$refs["MaterialCode"].focus();
      });
    });
  },
  /**
   * Thực hiện 1 số nhiệm vụ khi mở form được mô tả ở dưới.
   */
  async mounted() {
    // Thực hiện focus vào ô input đầu tiên khi mở form lên.
    this.$refs[this.refsList[0]].focus();
    // Thực hiện call api để lấy mã mới nhất từ be.

    if (this.formMode != this.$MEnum.formMode.update) {
      this.getNewMaterialCodeAsync();
    }
    if (this.$refs.tableHeader) {
      this.tableHeaderHeight =
        this.$refs.tableHeader.getBoundingClientRect().height + 2;
    }

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

  watch: {
    /**
     * Hàm call api để lấy mã mới khi người dùng nhập tên NVL.
     * @param {String} newValue tên NVL
     * @author: nttue (20/08/2023)
     */
    "materialEdit.MaterialName": async function (newValue) {
      try {
        if (newValue && newValue.trim()) {
          var newMaterialCode = "";
          if (this.formMode === this.$MEnum.formMode.update) {
            newMaterialCode =
              createPrefixCode(newValue) +
              this.removeNonNumericPrefix(this.startingMaterial.MaterialCode);
          } else {
            newMaterialCode = createPrefixCode(newValue) + this.maxCode;
          }
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
    "materialEdit.UnitId": function (newValue, oldValue) {
      try {
        var newUnit = this.units.find((item) => item.id === newValue)?.name;
        this.unitRows.forEach((item) => {
          // Kiểm tra nếu đơn vị chuyển đổi trùng với đơn vị tính của vật liệu.
          if (
            this.materialEdit.UnitId &&
            item.UnitId === this.materialEdit.UnitId &&
            item.Mode != this.$MEnum.MODE.DELETE
          ) {
            // Đặt đơn vị chuyển đổi thành đơn vị trước đó.
            this.materialEdit.UnitId = oldValue;

            // Hiển thị thông báo lỗi và xử lý khi người dùng đóng thông báo.
            this.$store.commit("dialog/setErrorMessage", {
              message: this.$MResources.ucIsDuplicatedWithUnitCode,
              handleClose: () => {
                this.$refs["UnitId"].focus();
                this.$refs["UnitId"].assignInputValue(this.materialEdit.UnitId);
              },
            });
          }
        });
        if (newValue?.trim()) {
          this.unitRows.forEach((item) => {
            if (item.UnitId && item.ConversionRate && item.Calculation) {
              item.Description = this.insertDescription(
                item.UnitCode,
                item.Calculation,
                item.ConversionRate,
                newUnit
              );
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
        const newUC = newUnitConversions.filter(
          (item) => item.Mode !== this.$MEnum.MODE.DELETE
        );
        newUC.forEach((item, index) => {
          const currentRowIndex = index; // Lưu index vào biến tạm

          // Kiểm tra nếu đơn vị chuyển đổi trùng với đơn vị tính của vật liệu.
          if (
            item.UnitId &&
            item.UnitId === this.materialEdit.UnitId &&
            item.Mode !== this.$MEnum.MODE.DELETE
          ) {
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
              message: this.$MResources.ConversionRateGreatherThanZero,
              handleClose: () => {
                this.handleEditCellUnit(currentRowIndex, 2);
              },
            });
          }

          // Tính toán mô tả cho đơn vị chuyển đổi.
          if (
            item.UnitId &&
            item.ConversionRate &&
            item.Calculation &&
            this.materialEdit.UnitId
          ) {
            var description = "";
            var code = this.findCodeById(item.UnitId, this.units);
            var codeOfMaterialUnitCode = this.findCodeById(
              this.materialEdit.UnitId,
              this.units
            );
            description = this.insertDescription(
              code,
              item.Calculation,
              item.ConversionRate,
              codeOfMaterialUnitCode
            );
            this.unitRows[currentRowIndex].Description = description;
          } else {
            this.unitRows[currentRowIndex].Description = "";
          }
        });

        // Kiểm tra và xử lý nếu có đơn vị chuyển đổi trùng lặp.
        for (let i = 0; i < newUC.length; i++) {
          for (let j = i + 1; j < newUC.length; j++) {
            if (newUC[j].UnitId === newUC[i].UnitId && newUC[j].UnitId) {
              var code = this.findCodeById(newUC[j].UnitId, this.units);
              let lastCellError =
                newUC[j].UnitId === this.prevUnitConversions[j].UnitId;

              if (lastCellError) {
                newUC[i].UnitId = this.prevUnitConversions[i].UnitId;
              } else {
                newUC[j].UnitId = this.prevUnitConversions[j].UnitId;
              }

              // Hiển thị thông báo lỗi và xử lý khi người dùng đóng thông báo.
              this.$store.commit("dialog/setErrorMessage", {
                message: `${this.$MResources.unitConversion} <<${code}>> ${this.$MResources.used}`,
                handleClose: () => {
                  this.handleEditCellUnit(lastCellError ? i : j, 1);
                },
              });
            }
          }
        }

        // Lưu lại các giá trị trước đó của đơn vị chuyển đổi.
        this.prevUnitConversions = newUC.map((item) => {
          return {
            ...item,
          };
        });
      },
      deep: true, // Theo dõi thay đổi sâu trong mảng unitRows.
    },
  },
  methods: {
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

    //MARK: Hàm xử lý 1 số sự kiện của form.
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
     * Hàm mô tả đơn vị chuyển đổi.
     * @param {String} code đơn vị chuyển đổi.
     * @param {String} calculation Phép tính.
     * @param {Double} conversionRate tỉ lệ chuyển đổi.
     * @param {String} codeOfMaterialUnitCode đơn vị tính của nguyên vật liệu.
     * @author: nttue (20/08/2023)
     */
    insertDescription(
      code,
      calculation,
      conversionRate,
      codeOfMaterialUnitCode
    ) {
      var description = "";
      if (calculation === "*") {
        description = `1 ${code} = ${convertNumberDecimalToString(
          conversionRate
        )} ${calculation} ${codeOfMaterialUnitCode}`;
      } else {
        description = `1 ${code} = 1 ${calculation} ${convertNumberDecimalToString(
          conversionRate
        )} ${codeOfMaterialUnitCode}`;
      }
      return description;
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
     * Xử lý sự kiện khi người dùng muốn chỉnh sửa ô trong bảng.
     * @param {number} indexRow - Chỉ số dòng trong bảng.
     * @param {number} indexColumn - Chỉ số cột trong bảng.
     * @author: nttue (20/08/2023)
     */
    handleEditCellUnit(indexRow, indexColumn) {
      // Ngăn chặn sự lan truyền của sự kiện để tránh xung đột.
      event.stopPropagation();

      this.rowFocused = indexRow;

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

      this.unitRows.push({
        ...this.unitRowTemplate,
        Order: this.unitRows.length + 1,
      });

      this.handleEditCellUnit(this.unitRows.length - 1, 1);
    },
    /**
     * Hàm thực hiện xóa một hàng vào bảng đơn vị chuyển đổi.
     * @author: nttue (20/08/2023)
     */
    removeRow() {
      // Trường hợp tồn tại rowFocused thì xóa hàng đó.
      if (this.rowFocused > -1 && this.rowFocused < this.unitRows.length) {
        const deleteRow = this.unitRows[this.rowFocused];
        if (!deleteRow.UnitConversionId) {
          this.unitRows.splice(this.rowFocused, 1);
        } else {
          if (deleteRow.Mode != this.$MEnum.MODE.DELETE) {
            deleteRow.Mode = this.$MEnum.MODE.DELETE;
          }
        }
      }
      // Ngược lại thì xóa từ cuối hàng hoặc nếu đã có id thì chuyển editmode thành đã xóa.
      else {
        for (let i = this.unitRows.length - 1; i >= 0; i--) {
          const deleteRow = this.unitRows[i];
          if (!deleteRow.UnitConversionId) {
            this.unitRows.pop();
            break;
          } else {
            if (deleteRow.Mode != this.$MEnum.MODE.DELETE) {
              deleteRow.Mode = this.$MEnum.MODE.DELETE;
              break;
            }
          }
        }
      }
    },

    /**
     * Hàm thực hiện gửi sự kiện đóng form.
     * @author: nttue (20/08/2023)
     */
    closeForm() {
      if (!this.showSubForm) {
        this.$emit("onClose");
      }
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
      if (!this.showSubForm) {
        this.isEdited()
          ? this.openDialog({
              label: this.$MResources.DataChanged,
            })
          : this.closeForm();
      }
    },
    /**
     * Hàm hiển thị thông báo lỗi.
     * @param {String} message Thông báo lỗi.
     * @param {Function} handleClose Hàm chạy sau khi đóng thông báo lỗi
     * @author: nttue (20/08/2023)
     */
    showErrorMessage(message, handleClose) {
      this.$store.commit("dialog/setErrorMessage", {
        message,
        handleClose,
      });
    },
    // MARK: Hàm lấy danh sách kho, đơn vị tính, nhóm nguyên vật liệu, đơn vị chuyển đổi.
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
    /**
     * Hàm lấy ra các đơn vị chuyển đổi theo ID của material.
     * @author: nttue (20/08/2023)
     */
    async getUnitConversion() {
      try {
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
            item.Description = this.insertDescription(
              code,
              item.Calculation,
              item.ConversionRate,
              codeOfMaterialUnitCode
            );
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
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * Hàm lấy chỉ sổ lớn nhất của mã từ backend;
     * @author: nttue (20/08/2023)
     */
    async getNewMaterialCodeAsync() {
      this.maxCode = await materialService.getNewCode();
    },
    // MARK: Phần mở sub form: unit, stock và materialgroup.
    /**
     * Hàm thực hiện mở form unit.
     * @author: nttue (20/08/2023)
     */
    handleOpenFormUnit() {
      if (this.cellAddUnit < 0) {
        this.inputName = "UnitId";
      }
      this.handleOpenSubForm(unitService, UnitFormInput, "Unit");
    },

    /**
     * Hàm thực hiện mở form kho ngầm định.
     * @author: nttue (20/08/2023)
     */
    handleOpenFormStock() {
      this.inputName = "StockId";
      this.handleOpenSubForm(stockService, StockFormInput, "Stock");
    },

    /**
     * Hàm thực hiện mở form nhóm nguyên vật liệu.
     * @author: nttue (20/08/2023)
     */
    handleOpenMaterialGroupStock() {
      this.inputName = "MaterialGroupId";
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
      if (this.cellAddUnit > -1) {
        this.handleEditCellUnit(this.cellAddUnit, 1);
      } else {
        this.$refs[this.inputName].focus();
      }

      this.cellAddUnit = -1;
      this.inputName = "";
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

    // MARK: Các hàm xử lý xử kiện dialog cảnh báo khi đóng form mà dữ liệu đã thay đổi.
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
      this.$refs[this.refsList[0]].focus();
    },

    // MARK: Các hàm xử lý sự kiện khi lưu form.
    /**
     * Hàm thực hiện lưu form.
     * @author: nttue (20/08/2023)
     */
    handleSaveForm() {
      this.handleSaveMaterial(this.$MEnum.SUBMIT_MODE.ADD);
    },

    /**
     * Hàm thực hiện lưu form và thêm mới mới.
     * @author: nttue (20/08/2023)
     */
    handleSaveAndAdd() {
      this.handleSaveMaterial(this.$MEnum.SUBMIT_MODE.ADD_AND_CREATE);
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
      // Kiểm tra và validate dữ liệu về Material.
      const materialValidationError = this.validateData();

      if (materialValidationError) {
        // Nếu có lỗi trong dữ liệu Material, hiển thị thông báo lỗi.
        this.showErrorMessage(
          this.$refs[this.refsList[this.firstError]].error,
          this.handleFocusInputError
        );
      } else {
        // Kiểm tra và validate đơn vị chuyển đổi.
        const { indexUnitIdError, indexConversionRateError } =
          this.validateUnitConversion();
        if (indexUnitIdError !== this.$MEnum.maxIndex) {
          // Nếu có lỗi về đơn vị chuyển đổi, hiển thị thông báo lỗi và điều hướng đến đơn vị đó.
          this.showErrorMessage(this.$MResources.unitConversionIsEmpty, () => {
            this.handleEditCellUnit(indexUnitIdError, 1);
          });
        } else if (indexConversionRateError !== this.$MEnum.maxIndex) {
          this.showErrorMessage(
            this.$MResources.ConversionRateGreatherThanZero,
            () => {
              this.handleEditCellUnit(indexConversionRateError, 2);
            }
          );
        } else {
          // Tạo đối tượng dữ liệu để gửi lên backend để cập nhật hoặc thêm mới.
          const materialInput = {
            MaterialCreateDto: {
              ...this.materialEdit,
              UnFollowing: this.materialEdit.UnFollowing
                ? this.$MEnum.YES_OR_NO.YES
                : this.$MEnum.YES_OR_NO.NO,
            },
            UnitConversionCreateDtos: this.unitRows,
          };

          if (
            this.formMode === this.$MEnum.formMode.add ||
            this.formMode === this.$MEnum.formMode.replication
          ) {
            // Gọi API POST để thêm mới nguyên vật liệu.
            await this.handlePostMaterial(materialInput, mode);
          } else if (this.formMode === this.$MEnum.formMode.update) {
            // Kiểm tra xem nguyên vật liệu đã được chỉnh sửa chưa.
            if (this.isEdited()) {
              // Nếu đã chỉnh sửa, gọi API để cập nhật.
              await this.handleUpdateMaterial(materialInput, mode);
            } else {
              // Nếu không có sự thay đổi, kiểm tra chế độ thực hiện (Thêm mới hoặc Cập nhật) và thực hiện tương ứng.
              this.handleNonEditedMaterial(mode);
            }
          }
          // Đặt chỉ số firstError về maxIndex và làm sạch form.
          this.firstError = this.$MEnum.maxIndex;
        }
      }
    },

    /**
     * Hàm gọi API POST nguyên vật liệu.
     * @param {Object} materialInput - Đầu vào của api thêm mới NVL.
     * @param {Number} mode chế độ form.
     * @author: nttue (20/08/2023)
     */
    async handlePostMaterial(materialInput, mode) {
      const response = await materialService.post(materialInput);

      if (!response.errorCode) {
        this.handleMaterialUpdateSuccess(mode, "create");
      }
    },

    /**
     * Hàm gọi API UPDATE nguyên vật liệu.
     * @param {Object} materialInput - Đầu vào của api cập nhật NVL.
     * @param {Number} mode chế độ form.
     * @author: nttue (20/08/2023)
     */
    async handleUpdateMaterial(materialInput, mode) {
      const response = await materialService.update(
        this.materialEdit.MaterialId,
        materialInput
      );

      if (!response.errorCode) {
        this.handleMaterialUpdateSuccess(mode, "update");
      }
    },

    /**
     * Hàm xử lý sau khi cập nhật nguyên vật liệu thành công.
     * @param {Number} mode chế độ form.
     * @author: nttue (20/08/2023)
     */
    handleMaterialUpdateSuccess(mode, toast) {
      this.$emit("onReload");
      this.$store.dispatch("showToast", {
        label: this.$MResources.ToastMessage["Material"][toast],
      });
      this.handleNonEditedMaterial(mode);
    },

    /**
     * Hàm xử lý khi không có sự thay đổi trong nguyên vật liệu.
     * @param {Number} mode chế độ form.
     * @author: nttue (20/08/2023)
     */
    handleNonEditedMaterial(mode) {
      if (mode === this.$MEnum.SUBMIT_MODE.ADD) {
        this.closeForm();
      } else {
        this.handleResetDataForm();
        this.getNewMaterialCodeAsync();
        this.formMode = this.$MEnum.SUBMIT_MODE.ADD;
        this.$refs[this.refsList[0]].focus();
      }
    },

    /**
     * Hàm reset dữ liệu trong form.
     * @author: nttue (20/08/2023)
     */
    handleResetDataForm() {
      const newMaterial = {
        ExpiryType: this.$MResources.dayLabel,
        Category: this.$MResources.materials,
      };
      this.startingMaterial = { ...newMaterial };
      this.materialEdit = { ...newMaterial };
      this.unitConversionsAtFirst = [];
      this.unitRows = [];
      this.prevUnitConversions = [];
    },

    /**
     * Hàm thực hiện validate phần đơn vị chuyển đổi.
     * Đồng thời kiểm tra xem những đơn vị chuyển đổi nào được sửa.
     * @return trả về tình trạng validate.
     * @author: nttue (20/08/2023)
     */
    validateUnitConversion() {
      // gán chỉ sổ của ô bị lỗi là max index.
      var indexUnitIdError = this.$MEnum.maxIndex;
      var indexConversionRateError = this.$MEnum.maxIndex;

      for (let i = 0; i < this.unitRows.length; i++) {
        const unitRow = this.unitRows[i];
        const unitConversion = this.unitConversionsAtFirst.find(
          (conversion) =>
            conversion.UnitConversionId === unitRow.UnitConversionId
        );

        // Kiểm tra nếu unitRow.UnitId là rỗng
        if (!unitRow.UnitId) {
          indexUnitIdError = Math.min(indexUnitIdError, i);
        }
        // Kiểm tra nếu tỉ lệ chuyển đổi > 0
        if (unitRow.ConversionRate === 0) {
          indexConversionRateError = Math.min(indexConversionRateError, i);
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
      // Trả về giá trị indexUnitIdError
      return { indexUnitIdError, indexConversionRateError };
    },

    //MARK: Hàm thực hiện nhiệm vụ: tìm item trong mảng theo id
    // Kiểm tra đối tượng đã thay đổi so với đối tượng ban đầu
    // Xóa các ký tự không phải là số trong 1 từ: AB123 => 123.
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

      // So sánh hai đối tượng dưới dạng JSON để xác định sự thay đổi.
      return !areObjectsEqual(startingMaterialInput, materialInputAfter);
    },
    /**
     * Hàm loại bỏ tất cả các ký tự không phải số ở đầu chuỗi và trả về phần còn lại.
     * @param {string} value - Chuỗi đầu vào.
     * @returns {string} - Phần của chuỗi có các ký tự số ở đầu, hoặc chuỗi rỗng nếu không có số.
     * @author: nttue (20/08/2023)
     */
    removeNonNumericPrefix(value) {
      // Regex để kiểm tra xem ký tự có phải là số không
      var regex = /^[0-9]+/;
      // Biến lưu vị trí của ký tự đầu tiên không phải số (không tìm thấy ban đầu)
      var indexStartNumber = -1;

      // Duyệt chuỗi từ cuối về đầu
      for (let i = value.length - 1; i >= 0; i--) {
        // Nếu ký tự hiện tại không phải số, cập nhật vị trí của ký tự đầu tiên không phải số
        if (!regex.test(value[i])) {
          indexStartNumber = i + 1;
          break;
        }
      }

      // Trả về phần của chuỗi có các ký tự số ở đầu, hoặc chuỗi rỗng nếu không có số.
      return indexStartNumber > -1 ? value.slice(indexStartNumber) : "";
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
