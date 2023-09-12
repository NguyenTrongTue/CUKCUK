<template>
  <table class="table" ref="table" @dragover="onDragOver">
    <thead class="t-head" ref="tableHeader">
      <tr>
        <th
          v-for="(column, index) in columns"
          :key="index"
          :style="{
            width: column.width ? column.width + 'px' : null,
            minWidth: column.width ? column.width + 'px' : null,
          }"
          :class="column.pinned ? 'pinned-left' : ''"
          :ref="column.field"
          @drop="onDrop($event, column.field)"
          @dragstart="onDragStart(column.field)"
          draggable="true"
          v-show="column.isShow"
          @click="handleScroll(index)"
        >
          <div
            class="t-head__text flex-center"
            @click="handleSort(column.field)"
          >
            <mtooltip
              :content="column.tooltip"
              :arrow="false"
              v-if="column.headerName !== column.dataColumnName"
            >
              <span>
                {{ column.headerName }}
              </span></mtooltip
            >
            <span v-else>
              {{ column.headerName }}
            </span>
            <mtooltip
              class="sort-item"
              :content="contentSorting(column.headerName, 'desc')"
              :arrow="false"
              v-if="showSorting(column.field) === 'desc'"
            >
              <img src="@/assets/imgs/sort_desc.webp" alt="" />
            </mtooltip>
            <mtooltip
              class="sort-item"
              v-if="showSorting(column.field) === 'asc'"
              :content="contentSorting(column.headerName, 'asc')"
              :arrow="false"
            >
              <img src="@/assets/imgs/sort_asc.png" alt="" />
            </mtooltip>
          </div>
          <div class="table-filter flex-center">
            <TypeFilter
              v-if="column.filterMode"
              :dataList="operators[column.filterMode]"
              v-model="column.typeFilterMode"
              :field="column.field"
              :index="index"
              :indexFilter="indexFilter"
              @unFilter="handleHideFilter"
              @filter="handleFilter"
            />
            <minput
              style="flex: 1"
              v-if="column.typeFilter === 'input'"
              v-model="column.value"
              :isUpdateValueWhenBlur="true"
            />

            <minput
              style="flex: 1"
              v-else-if="column.typeFilter === 'input-allowDecimal'"
              v-model="column.value"
              :allowDecimal="true"
              textAlign="right"
              :isUpdateValueWhenBlur="true"
            />

            <mdate
              style="flex: 1"
              v-if="column.typeFilter === 'datetime'"
              v-model="column.value"
            />
            <mcombobox
              style="flex: 1"
              :data="comboboxData[column.field].data"
              v-else-if="column.typeFilter === 'combobox'"
              v-model="column.value"
            />
          </div>

          <div
            class="resizer"
            @mousedown="createResizableColumn($event, index)"
          ></div>
        </th>
      </tr>
    </thead>
    <tbody class="t-body" v-if="!isLoading">
      <tr
        v-for="(item, index) in dataList"
        :key="index"
        :class="{ choosed: item.id === rowChoosed?.id }"
        @dblclick="onUpdateRow(item)"
        @click="onChooseRow(item)"
        @contextmenu="onChooseRow(item)"
      >
        <td
          v-for="(column, index) in columns"
          v-show="column.isShow"
          :key="index"
          :style="{
            'text-align': column.textAlign,
            width: column.width ? column.width + 'px' : null,
            minWidth: column.width ? column.width + 'px' : null,
          }"
          :class="column.pinned ? 'pinned-left' : ''"
          :ref="column.field"
        >
          <mtooltip
            :content="formatData(item[column.field], column.type)"
            v-if="column.type !== 'checkbox'"
            :arrow="false"
            :offset="[0, 0]"
          >
            <span> {{ formatData(item[column.field], column.type) }}</span>
          </mtooltip>
          <div v-else-if="column.type === 'checkbox'" class="flex-center">
            <mcheckbox :required="true" v-model="item[column.field]" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <mloading :paddingTop="tableHeaderHeight" v-if="isLoading" />
  <div
    v-if="noData && !isLoading"
    style="width: 100%"
    class="no-data flex-center"
  >
    <img src="@/assets/icon/bg-nodata.svg" alt="" />
    <p class="no-data-desc">
      {{ this.$MResources.NoData }}
    </p>
  </div>
</template>

<script>
import TypeFilter from "@/components/table/type-filter/TypeFilter.vue";
import valueConversion from "@/utils/valueConversion";
import { resizeColumn } from "@/utils/common";

export default {
  emits: ["onChooseRow", "filter", "onSort", "onUpdateRow"],

  props: {
    columnsProp: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    propsRowChoosed: {
      type: Object,
    },
    loadingProp: {
      type: Boolean,
    },
  },
  components: { TypeFilter },

  data() {
    return {
      dataList: this.rows,
      isLoading: false,
      noData: false,
      indexFilter: -1,
      columns: [],
      rowChoosed: this.propsRowChoosed,
      tableHeaderHeight: 0,

      /**
       * Toán tử so sánh để thực hiện lọc
       */
      operators: {
        // Toán tử so sánh số, ngày tháng năm.
        ComparisonOperators: [
          {
            value: this.$MEnum.COMPARISON_OPERATORS.EQUAL,
            symbol: "=",
            label: this.$MResources.equal,
          },
          {
            value: this.$MEnum.COMPARISON_OPERATORS.GRETHER_THAN,
            symbol: ">",
            label: this.$MResources.greatherThan,
          },
          {
            value: this.$MEnum.COMPARISON_OPERATORS.LESS_THAN,
            symbol: "<",
            label: this.$MResources.lessThan,
          },
          {
            value: this.$MEnum.COMPARISON_OPERATORS.GREATER_THAN_OR_EQUAL,
            symbol: "≥",
            label: this.$MResources.greaterThanOrEqual,
          },
          {
            value: this.$MEnum.COMPARISON_OPERATORS.LESS_THAN_OR_EQUAL,
            symbol: "≤",
            label: this.$MResources.lessThanOrEqual,
          },
        ],
        // Toán tử so sánh chuỗi.
        StringOperators: [
          {
            value: this.$MEnum.STRING_OPERATORS.CONTAIN,
            symbol: "∗",
            label: this.$MResources.contain,
          },
          {
            value: this.$MEnum.STRING_OPERATORS.EQUAL,
            symbol: "=",
            label: this.$MResources.equal,
          },
          {
            value: this.$MEnum.STRING_OPERATORS.START_BY,
            symbol: "+",
            label: this.$MResources.startBy,
          },
          {
            value: this.$MEnum.STRING_OPERATORS.END_BY,
            symbol: "-",
            label: this.$MResources.endBy,
          },
          {
            value: this.$MEnum.STRING_OPERATORS.ORTHER,
            symbol: "!",
            label: this.$MResources.orther,
          },
        ],
      },

      /**
       * Dữ liệu cho phần combobox để lọc.
       */
      comboboxData: {
        UnFollowing: {
          data: [
            { id: this.$MEnum.YES_OR_NO.NO, name: this.$MResources.No },
            { id: this.$MEnum.YES_OR_NO.YES, name: this.$MResources.Yes },
          ],
        },
        Category: {
          data: [
            {
              id: this.$MResources.materials,
              name: this.$MResources.materials,
            },
            {
              id: this.$MResources.otherItem,
              name: this.$MResources.otherItem,
            },
            {
              id: this.$MResources.bottledDrinks,
              name: this.$MResources.bottledDrinks,
            },
          ],
        },
      },
      queryFilter: [],
      querySort: [],
      oldQueryFilter: [],
    };
  },

  mounted() {
    this.columns = this.columnsProp.map((item) => {
      return {
        ...item,
      };
    });
    document.addEventListener("keydown", this.handleKeyDown);
    this.handlePinned(this.columns);
    this.tableHeaderHeight =
      this.$refs.tableHeader.getBoundingClientRect().height + 2;
  },

  updated() {
    this.handlePinned(this.columns);
  },

  beforeUnMount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },

  watch: {
    /**
     * Hàm gán lại phần loading.
     * @author: nttue (20/08/2023)
     */
    loadingProp(newLoading) {
      this.isLoading = newLoading;
    },
    /**
     * Hàm gán lại dữ liệu.
     * @author: nttue (20/08/2023)
     */
    rows: {
      handler(newRows) {
        this.dataList = newRows;
      },
      deep: true,
    },
    /**
     * Hàm gán lại tiêu đề cột.
     * @author: nttue (20/08/2023)
     */
    columnsProp: {
      handler(newColumns) {
        var pinnedList = newColumns.filter((item) => item.pinned);
        var noPinnedList = newColumns.filter((item) => !item.pinned);
        this.columns = [...pinnedList, ...noPinnedList];
        this.oldQueryFilter = [...newColumns];
      },
      deep: true,
    },
    /**
     * Hàm gán lại tiêu đề cột.
     * @author: nttue (20/08/2023)
     */
    columns: {
      /**
       * Hàm xử lý sự kiện khi người dùng nhập thông tin để lọc.
       * @param {Array} newColumns Thông tin cột mới
       * @author: nttue (20/08/2023)
       */
      handler(newColumns) {
        var filters = newColumns.map((column) => {
          return {
            field: column.field,
            typeFilterMode: column.typeFilterMode,
            value: column.value,
          };
        });
        filters.forEach((column) => {
          if (column.value || column.value === 0) {
            var findIndexField = this.queryFilter.findIndex(
              (item) => item.fieldName === column.field
            );
            if (findIndexField >= 0) {
              this.queryFilter[findIndexField].fieldValue =
                column.value.toString();
              this.queryFilter[findIndexField].filterMode =
                column.typeFilterMode ?? 1;
            } else {
              this.queryFilter.push({
                filterMode: column.typeFilterMode ?? 1,
                fieldName: column.field,
                fieldValue: column.value.toString(),
                addition: this.$MEnum.ADDITION.AND,
              });
            }
          } else {
            var findIndexField = this.queryFilter.findIndex(
              (item) => item.fieldName === column.field
            );
            if (findIndexField >= 0) {
              this.queryFilter.splice(findIndexField, 1);
            }
          }
        });

        if (JSON.stringify(this.oldQueryFilter) !== JSON.stringify(filters)) {
          this.$emit("filter", this.queryFilter);
          this.oldQueryFilter = filters;
        }
        this.handlePinned(this.columns);
      },
      deep: true,
    },

    /**
     * Hàm gán lại hàng được chọn khi một hàng được chọn
     * @author: nttue (20/08/2023)
     */
    propsRowChoosed: {
      handler(newPropsRowChoosed) {
        this.rowChoosed = newPropsRowChoosed;
      },
      deep: true,
    },

    /**
     * Hàm gán lại thuộc tính nodata khi không có dữ liệu.
     * @author: nttue (20/08/2023)
     */
    "dataList.length": function (newLength) {
      this.noData = newLength === 0;
    },
  },

  methods: {
    assingValueFilter(type) {
      if (type === "input-allowDecimal") {
        return {
          typeFilterMode: 7,
          value: 0,
        };
      } else if (type === "combobox") {
        return {
          value: 0,
        };
      } else {
        return {
          typeFilterMode: 0,
          value: "",
        };
      }
    },
    assignFilter(columns) {
      var filters = columns.map((column) => {
        var result = this.assignFilter(column.typeFilter);
        return {
          field: column.field,
          ...result,
        };
      });

      return filters;
    },
    /**
     * Hàm bắt sự kiện người dụng click vào ô th của thanh thead
     * Lúc này table sẽ tự động cuộn chuột đến vị trí đó.
     * @param {Event} index chỉ số của cột.
     * @author: nttue (20/08/2023)
     */
    handleScroll(index) {
      this.$nextTick(() => {
        const dropdownItems = this.$refs.table.querySelectorAll("th");
        const targetItem = dropdownItems[index];
        if (targetItem) {
          targetItem.scrollIntoView({
            behavior: "smooth",
            inline: "center",
          });
        }
      });
    },
    /**
     * Hàm bắt sự kiện người dụng nhấn mũi tên lên xuống trong bảng.
     * Lúc này hàng được chọn sẽ thay đổi theo.
     * @param {Event} event event của sự kiện
     * @author: nttue (20/07/2023)
     */
    handleKeyDown(event) {
      const keyCode = event.keyCode;
      let findIndex = this.dataList.findIndex(
        (row) => row.id === this.rowChoosed.id
      );
      if (keyCode === this.$MEnum.KEYBOARD.ARROW_UP) {
        this.rowChoosed =
          findIndex > 0 ? this.dataList[findIndex - 1] : this.dataList[0];
        this.$emit("onChooseRow", this.rowChoosed);
      } else if (keyCode === this.$MEnum.KEYBOARD.ARROW_DOWN) {
        this.rowChoosed =
          findIndex < this.dataList.length - 1
            ? this.dataList[findIndex + 1]
            : this.dataList[this.dataList.length - 1];
        this.$emit("onChooseRow", this.rowChoosed);
      }
    },
    /**
     * Hàm thực hiện ghim cột
     * @author: nttue (17/07/2023)
     */
    handlePinned(columns) {
      let start = 0;
      const pinnedList = columns.filter((item) => item.pinned);
      const noPinnedList = columns.filter((item) => !item.pinned);

      pinnedList.forEach((pinnedItem) => {
        const pinnedRefs = this.$refs[pinnedItem.field];
        if (pinnedRefs) {
          var width = pinnedRefs[0].offsetWidth;
          pinnedRefs.forEach((ref) => {
            ref.style.left = start + "px";
          });
        }
        start += width;
      });

      // Xóa style.left trong mảng noPinnedList
      noPinnedList.forEach((noPinnedItem) => {
        const noPinnedRefs = this.$refs[noPinnedItem.field];
        if (noPinnedRefs) {
          noPinnedRefs.forEach((ref) => {
            ref.style.removeProperty("left");
          });
        }
      });
    },

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
     *  Hàm thực hiện xử lý việc drop một cột
     * @param {Object} event
     * @param {String} targetField Giá trị tên của hàng muốn đổi
     * @author: nttue (20/07/2023)
     */
    onDrop(event, targetField) {
      event.preventDefault();

      const columnField = event.dataTransfer.getData("text/plain");

      const columnIndex = this.columns.findIndex(
        (column) => column.field === columnField
      );

      const targetColumnIndex = this.columns.findIndex(
        (column) => column.field === targetField
      );

      if (this.columns[targetColumnIndex].pinned) {
        this.columns[columnIndex].pinned = true;
      } else {
        this.columns[columnIndex].pinned = false;
      }
      this.columns.splice(
        targetColumnIndex,
        0,
        this.columns.splice(columnIndex, 1)[0]
      );
    },

    /**
     * xử lý sự kiện resize column cho table
     * @author: nttue (20/08/2023)
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
     * Hàm bắt sự kiện dbclick để sửa thông tin bản ghi tại 1 hàng.
     * @param {Object} row hàng được dbclick.
     * @author: nttue (20/08/2023)
     */
    onUpdateRow(row) {
      this.$emit("onUpdateRow", row);
    },

    /**
     * Hàm chuyển đổi dữ liệu của bảng về dạng tương ứng dựa vào type.
     * @param {String} data dữ liệu của bảng
     * @param {String} type loai dữ liệu của bảng
     * @author: nttue (20/08/2023)
     */
    formatData(data, type) {
      return valueConversion(data, type);
    },

    /**
     * Hàm hiện mũi tên khi thực hiện sorting cột.
     * @author: nttue (20/08/2023)
     */
    showSorting(field) {
      var findField = this.querySort.find((item) => item.fieldName === field);
      if (findField) {
        return findField.sortMode === 0
          ? "desc"
          : findField.sortMode === 1
          ? "asc"
          : "";
      } else {
        return "";
      }
    },

    /**
     * Hàm hiển thị thông tin sắp xếp.
     * @param {String} headerName - Tiêu đề cột.
     * @param {String} directive tính chất sắp xếp.
     * @author: nttue (20/08/2023)
     */
    contentSorting(headerName, directive) {
      if (directive === "desc") {
        return `Sắp xếp cột ${headerName} giảm dần`;
      } else {
        return `Sắp xếp cột ${headerName} tăng dần`;
      }
    },

    /**
     * Hàm sử lý sự kiện khi người dùng click vào ô tiêu đề của bảng đẻ thực hiện sorting.
     * @author: nttue (20/08/2023)
     */
    handleSort(field) {
      var findIndexField = this.querySort.findIndex(
        (item) => item.fieldName === field
      );

      if (findIndexField === -1) {
        this.querySort.push({
          sortMode: 0,
          fieldName: field,
        });
      } else {
        if (this.querySort[findIndexField].sortMode === 0) {
          this.querySort[findIndexField].sortMode = 1;
        } else {
          this.querySort = this.querySort.filter(
            (item) => item.fieldName !== field
          );
        }
      }
      this.$emit("onSort", this.querySort);
    },

    /**
     * Hàm xử lý sự kiện click outside ra khỏi phần tử filter.
     * Nó sẽ thực hiện đóng phần tử filter.
     * @author: nttue (20/08/2023)
     */
    handleFilter(index) {
      this.indexFilter = index;
    },

    /**
     * Hàm xử lý sự kiện click outside ra khỏi phần tử filter.
     * Nó sẽ thực hiện đóng phần tử filter.
     * @author: nttue (20/08/2023)
     */
    handleHideFilter() {
      this.indexFilter = -1;
    },

    /**
     * Hàm mở context để lựu chọn chế độ lọc dữ liệu của cột đó.
     * @author: nttue (20/08/2023)
     */
    onFilter(event, index) {
      event.preventDefault();
      event.stopPropagation();

      if (this.indexFilter == index) {
        this.indexFilter = -1;
      } else {
        this.indexFilter = index;
      }
    },

    /**
     * Hàm bắt sự kiện khi người dùng click vào một hàng để chọn.
     * @author: nttue (20/08/2023)
     */
    onChooseRow(item) {
      this.$emit("onChooseRow", item);
    },

    /**
     * Hàm chuyển đổi giá trị của chế độ lọc sang ký tự.
     * @author: nttue (20/08/2023)
     */
    symbolComputed(selectedValue) {
      var item = this.data.find((item) => item.value == selectedValue);
      return item.symbol;
    },
  },
};
</script>
<style lang="scss">
@import "./table.scss";
</style>
