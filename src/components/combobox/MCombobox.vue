<template>
  <div class="select flex-start" ref="combobox">
    <div class="combobox-label__wrapper" v-if="label">
      <mtooltip
        :offset="[-20, 0]"
        :content="tooltip"
        :arrow="false"
        v-if="tooltip"
      >
        <span class="combobox-label">{{ label }}</span>
        <span class="input-required">{{
          rules === "required" ? " (*)" : ""
        }}</span>
      </mtooltip>
      <div v-else>
        <span class="combobox-label">{{ label }}</span>
        <span class="input-required">{{
          rules === "required" ? " (*)" : ""
        }}</span>
      </div>
    </div>
    <div class="combobox">
      <input
        ref="inputCombobox"
        type="text"
        :typeError="typeError"
        :rules="rules"
        :style="{ 'text-align': textAlign }"
        :class="error ? 'combobox-input error' : 'combobox-input'"
        :error="error"
        :value="inputValue"
        :tabindex="tabIndex"
        :spellcheck="false"
        @input="onInput"
        @focus="$event.target.select()"
        @blur="onBlur"
        @keydown="onKeyDown($event)"
      />

      <div class="input-error">{{ error }}</div>

      <div class="combobox-icon">
        <div class="dropdown-icon flex-center" @click="showDropdown">
          <div class="icon-triangle-gray" :class="show && 'show'"></div>
        </div>
        <div class="icon-add__wrapper" v-if="hasAdd" @click="onAddItem">
          <div class="icon-sum"></div>
        </div>
      </div>

      <Teleport to="body">
        <div
          v-custom-outside="onClickOutside"
          class="combobox-dropdown-body"
          v-show="show"
          :style="{
            width: widthDropdown + 'px',
            left: left + 'px',
            top: top + 'px',
          }"
          ref="dropdownRef"
        >
          <div v-if="type !== 'table'">
            <div
              v-if="dataList.length > 0"
              class="combobox-dropdown-item"
              :class="{
                selected: item.id === modelValue,
                'item-hover': index === indexHover,
              }"
              v-for="(item, index) in dataList"
              :key="index"
              @click="onClick(item)"
            >
              {{ item.label ?? item.name }}
            </div>
          </div>
          <div v-else>
            <table class="table" v-if="dataList.length > 0">
              <thead class="t-head">
                <tr>
                  <th v-for="(item, index) in columns" :key="index">
                    {{ item.headerName }}
                  </th>
                </tr>
              </thead>

              <tbody class="t-body">
                <tr
                  v-for="(item, index) in dataList"
                  :key="item.id"
                  :class="{
                    selected: item.id === modelValue,
                    'item-hover': index === indexHover,
                  }"
                  @click="chooseRows(item)"
                >
                  <td v-for="(column, index) in columns" :key="index">
                    {{ item[column.field] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Teleport>
    </div>
    <img
      class="input-icon-error"
      v-if="error"
      src="@/assets/imgs/exclamation.webp"
    />
  </div>
</template>

<script>
/**
 * Component MCombobox
 * Cho phép người dùng nhập liệu để tìm kiếm phần tử trong list.
 * Tự động autocomplete.
 * @author: nttue (20/08/2023)
 */
export default {
  name: "MCombobox",
  emits: ["onAddItem", "update:modelValue", "editShowCombobox"],
  props: {
    // thuộc tính tùy chọn, nếu combobox là 1 table thì rows nó là dữ liệu truyền vào.
    data: {
      type: Array,
    },

    // là label của combobox
    label: {
      type: String,
    },

    // Thuộc tính căn chỉnh chữ trong ô input.
    textAlign: {
      type: String,
    },

    // Có chức năng thêm mới phần tử hay không.
    hasAdd: {
      type: Boolean,
      default: false,
    },

    // Giá trị của model value.
    modelValue: {
      type: [String, Number],
    },

    // là 1 số luật quy định sẵn cho combox để validate dữ liệu.
    rules: {
      type: String,
    },

    // gán lỗi của combobox khi có lỗi.
    typeError: {
      type: String,
    },

    // Tên của combobox.
    name: {
      type: String,
    },

    // Thuộc tính tabindex của combobox.
    tabIndex: {
      type: String,
    },

    // Loại combobox => gồm 2 loại : default và table.
    type: {
      type: String,
    },

    // combobox có tooltip hay không.
    tooltip: {
      type: String,
    },

    // column của droplist => sử dụng với trường hợp là bảng.
    columnsTable: {
      type: Array,
    },

    // tên comboxbox đang hiển thị.
    showingComboboxProp: {
      type: String,
    },
  },
  data() {
    return {
      // Vị trí của component bên trái màn hình.
      left: 0,

      // Vị trí của component bên tên màn hình.
      top: 0,

      // Thuộc tính hiển thị droplist hay không
      show: false,

      // Lỗi của comboxbox
      error: "",

      // Vị trị của hàng khi nhấn mũi trên lên xuống.
      indexHover: -1,

      // Giá trị của ô input
      inputValue: "",

      // Dữ liệu của combobox
      dataList: [...this.data],

      // column của droplist => sử dụng với trường hợp là bảng.
      columns: this.columnsTable,

      // kích thước chiều rộng của phần tử
      widthDropdown: 0,

      // Thuộc tính kiểm tra xem người dùng có đang gõ vào input không.
      isKeyDown: false,

      // Cờ kiểm tra xem đã chạy vào hàm xử lí click ra ngoài.
      isClickOutSide: false,
    };
  },
  created() {
    const selectedLabel = this.data.find((item) => item.id === this.modelValue);
    this.inputValue = selectedLabel ? selectedLabel.name : "";
  },

  watch: {
    /**
     * @description index hover khi nó đang ở hàng nào thì input sẽ hiển giá trị ở hàng đó.
     * @author nttue (20/07/2023)
     */
    indexHover(newIndex) {
      if (newIndex >= 0) {
        this.$nextTick(async () => {
          const selector =
            this.type !== "table" ? ".combobox-dropdown-item" : "tr";
          const dropdownItems = await this.$nextTick(() =>
            this.$refs.dropdownRef.querySelectorAll(selector)
          );

          const targetItem = dropdownItems[newIndex];
          if (targetItem) {
            targetItem.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      }
    },

    /**
     * Hàm thực hiện gán lại giá trị của data list với giá trị mới được truyền vào.
     * @param {*} newRows Giá trị mới của data list
     */
    data(newRows) {
      this.dataList = [...newRows];

      const selectedLabel = this.data.find(
        (item) => item.id === this.modelValue
      );

      this.inputValue = selectedLabel ? selectedLabel.name : "";
    },

    /**
     * cập nhật giá trị của giá trị columns khi columnprop thay đổi.
     * sử dụng đối với trường hợp droplist của combobox là bảng.
     * @param {Array} newColumns
     * @author: nttue (29/08/2023)
     */
    columnsTable(newColumns) {
      this.columns = [...newColumns];
    },

    /**
     * gán việc hiển thị tên combobox.
     * @author: nttue (29/08/2023)
     */
    showingComboboxProp(newValue) {
      this.show = this.name === newValue ? true : false;
    },

    /**
     * Hàm cập nhật giá trị của giá trị ô input khi modelValue thay đổi.
     * @param {String} newValue giá trị của inputed
     * @author: nttue (29/08/2023)
     */
    modelValue(newValue) {
      const selectedLabel = this.data.find((item) => item.id === newValue);
      this.inputValue = selectedLabel ? selectedLabel.name : "";
    },

    /**
     * Hàm gán lại giá trị của index hover khi người dùng gõ vào input.
     * @param {String} value giá trị của inputed
     * @author: nttue (29/08/2023)
     */
    inputValue(newValue) {
      this.error = "";
    },
  },
  methods: {
    /**
     * Hàm gửi sự kiện thêm 1 đối tượng mới.
     * @param {Object} event
     * @author: nttue (29/08/2023)
     */
    onAddItem(event) {
      event.stopPropagation();

      this.$emit("editShowCombobox", "");
      this.$emit("onAddItem");
    },

    /**
     * Hàm xử lý sự kiện chọn 1 mục trang danh sách.
     * @param {Object} item đối tượng được chọn
     * @author: nttue (29/08/2023)
     */
    chooseRows(item) {
      this.inputValue = item.name;
      this.$emit("update:modelValue", item.id);
      this.hiddenComboboxData();
    },

    /**
     * Xử lý sự kiện khi người dùng nhập dữ liệu vào ô input.
     * @param {Event} event Sự kiện nhập liệu từ người dùng.
     * @author: nttue (29/08/2023)
     */
    onInput(event) {
      this.isKeyDown = true;
      let searchValue = event.target.value;
      this.inputValue = searchValue;

      if (!searchValue) {
        this.dataList = [...this.data];
      } else {
        var searchResult = this.data.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        );

        this.dataList = [...searchResult];
        this.indexHover = searchResult.length > 0 ? 0 : -1;
        this.showDropdown();
      }
    },

    /**
     * Hàm xử lý sự kiện blur ra ô input của người dùng.
     * @author: nttue (29/08/2023)
     */
    onBlur() {
      if (this.indexHover >= 0) {
        this.$emit("update:modelValue", this.dataList[this.indexHover].id);
        this.inputValue = this.dataList[this.indexHover].name;
      } else {
        if (!this.inputValue) {
          this.$emit("update:modelValue", "");
        } else {
          const item = this.data.find((item) => item.id === this.modelValue);
          if (item) {
            this.inputValue = item.name;
          } else {
            this.inputValue = "";
            this.$emit("update:modelValue", "");
          }
        }
      }

      this.indexHover = -1;
      this.dataList = [...this.data];
    },

    /**
     * @description Hàm bắt sự kiện nhấn phím lên, xuống và enter của người dùng
     * @param {*} event
     * @author: nttue (29/08/2023)
     */
    onKeyDown(event) {
      event.stopPropagation();

      try {
        this.isKeyDown = true;
        this.showDropdown();
        const keyCode = event.keyCode;

        if (keyCode === this.$MEnum.KEYBOARD.ARROW_DOWN) {
          if (this.indexHover < this.dataList.length - 1) {
            this.indexHover++;
          } else {
            this.indexHover = 0;
          }
          this.inputValue = this.dataList[this.indexHover].name;
        } else if (keyCode === this.$MEnum.KEYBOARD.ARROW_UP) {
          if (this.indexHover > 0) {
            this.indexHover--;
          } else {
            this.indexHover = this.dataList.length - 1;
          }
          this.inputValue = this.dataList[this.indexHover].name;
        } else if (keyCode === this.$MEnum.KEYBOARD.ENTER) {
          if (this.dataList[this.indexHover]) {
            this.$emit("update:modelValue", this.dataList[this.indexHover].id);
          } else {
            this.inputValue = "";
            this.$emit("update:modelValue", "");
          }
          this.show = false;
          this.isKeyDown = false;
        } else if (keyCode === this.$MEnum.KEYBOARD.TAB) {
          this.hiddenComboboxData();
          this.isKeyDown = false;
        }
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Hàm gán lại giá trị hiển thị trong input với giá trị mới khi model value thay đổi.
     * @param {*} newValue Giá trị mới của model value.
     * @author: nttue (29/08/2023)
     */
    onClick(item) {
      this.inputValue = item.name;

      this.$emit("update:modelValue", item.id);
      this.hiddenComboboxData();
    },

    /**
     * @description hàm ẩn dropdown
     * @author: nttue (29/08/2023)
     */
    hiddenComboboxData() {
      this.$refs.inputCombobox?.blur();
      this.show = false;
    },
    /**
     * @description hàm show dropdown
     * @author: nttue (29/08/2023)
     */
    showDropdown(event = null) {
      event && event.stopPropagation();
      event && event.preventDefault();

      const comboboxElement = this.$refs.inputCombobox;

      this.top = comboboxElement.getBoundingClientRect().top + 26;
      this.left = comboboxElement.getBoundingClientRect().left;

      if (window.innerHeight - this.top < 170) {
        var distance =
          this.dataList.length >= 6
            ? 170
            : this.dataList.length > 0
            ? 2 + this.dataList.length * 28
            : 30;
        this.top = comboboxElement.getBoundingClientRect().top - distance;
      }

      this.$refs.inputCombobox?.focus();
      if (!this.isKeyDown) {
        this.show = !this.isClickOutSide;
      } else {
        this.show = true;
      }

      this.isClickOutSide = false;

      if (this.name) {
        if (this.show) {
          this.$emit("editShowCombobox", this.name);
        } else {
          this.$emit("editShowCombobox", "");
        }
      }

      this.widthDropdown =
        this.$refs.inputCombobox.getBoundingClientRect().width;
      var index = this.data.findIndex((item) => item === this.modelValue);

      if (index >= 0 && this.show) {
        // Kiểm tra chỉ số index hợp lệ
        this.$nextTick(() => {
          const dropdownItems = this.$refs.dropdownRef.querySelectorAll(
            ".combobox-dropdown-item"
          );
          const targetItem = dropdownItems[index];
          if (targetItem) {
            targetItem.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      }
    },
    /**
     * @description bắt sự kiện kích ra bên ngoài phần từ dropdown
     * @author: nttue (29/08/2023)
     */
    onClickOutside() {
      this.isClickOutSide = this.show;
      this.show = false;
    },

    /**
     * Hàm sử lý sự kiện focus vào input trong combobox.
     * @author: nttue (10/07/2023)
     */
    focus() {
      this.isKeyDown = false;
      this.$refs.inputCombobox.focus();
      this.$refs.inputCombobox.select();
    },
  },
};
</script>
<style lang="scss">
@import "./combobox.scss";
</style>
