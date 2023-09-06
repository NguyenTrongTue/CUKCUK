<template>
  <div class="input-default flex-start" :class="error ? 'error' : ''">
    <div class="input-label-wrapper flex-start" v-if="label">
      <mtooltip
        :offset="[-20, 0]"
        :content="tooltip"
        :arrow="false"
        v-if="tooltip"
      >
        <span class="input-label">{{ label }}</span>
        <span class="input-required">{{
          rules?.includes("required") ? " (*)" : ""
        }}</span>
      </mtooltip>
      <div v-else>
        <span class="input-label">{{ label }}</span>
        <span class="input-required">{{
          rules?.includes("required") ? " (*)" : ""
        }}</span>
      </div>
    </div>

    <component
      :is="typeInput === 'textarea' ? 'textarea' : 'input'"
      class="input"
      ref="minput"
      :type="typeInput ? typeInput : 'text'"
      :rules="rules"
      :name="name"
      :error="error"
      :value="dataValue"
      :style="{ 'text-align': textAlign }"
      :placeholder="placeholderInput"
      :tabindex="tabIndex"
      :spellcheck="false"
      @input="onInput"
      @focus="onFocus"
      @keydown="onlyAllowNumber"
      @blur="onBlur(name)"
      role="textbox"
    />

    <img
      class="input-icon-error"
      v-if="error"
      src="@/assets/imgs/exclamation.webp"
    />
    <div class="input-error">{{ error }}</div>
    <div v-if="reRender"></div>
  </div>
</template>

<script>
/**
 * Component InputPri
 * Cho phép người dùng nhập liệu thông tin.
 * @author: nttue (20/08/2023)
 */

/**
 * Danh sách các phím được phép gõ đối với input chỉ cho phép nhập các ký tự số.
 */
const ALLOWED_KEYS = [
  "Tab",
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "F5",
];

import { upperCaseName } from "@/utils/common";
import { validate } from "@/utils/validate/validation.js";
export default {
  name: "InputPri",
  props: {
    // là label của combobox

    label: {
      type: String,
      default: "",
    },

    /**
     * Loại input:
     * 1. Cho phép nhập số.
     * 2. Cho phép nhập số thập phân.
     * 3. Cho phép nhập tất cả các ký tự.
     */
    typeInput: {
      type: String,
    },

    /**
     * Tên form mà đang sử dụng nó.
     */
    formName: {
      type: String,
    },

    // Thuộc tính cho phép nhập số.
    allowNumber: {
      type: Boolean,
      default: false,
    },

    // Thuộc tính cho phép nhập số thập phân.
    allowDecimal: {
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

    // combobox có tooltip hay không.
    tooltip: {
      type: String,
    },

    // Thuộc tính căn chỉnh chữ trong ô input.
    textAlign: {
      type: String,
    },

    // Thuộc tính placeholder trong ô input.
    placeholderInput: {
      type: String,
      default: "",
    },

    // Thuộc tính tabindex của input.
    tabIndex: {
      type: [String, Number],
    },

    // Tên của input.
    name: {
      type: String,
      default: "",
    },
    // Loại input => gồm 2 loại : default và table.
    type: {
      type: String,
      default: "",
    },

    // giá trị mặc định của input
    defaultValue: {
      type: String,
    },

    // giá trị nhỏ nhất.
    minValue: {
      type: Number,
    },

    // giá trị lớn nhất.
    maxValue: {
      type: Number,
    },
  },

  data() {
    return {
      // Giá trị của ô input
      dataValue: "",

      // Lỗi của input
      error: "",
      reRender: false,
    };
  },
  created() {
    this.assignDataValue(this.modelValue);
  },

  watch: {
    // cập nhật giá trị của giá trị ô input khi modelValue thay đổi.
    modelValue(newValue) {
      this.assignDataValue(newValue);
    },
  },
  methods: {
    /**
     * Format lại giá trị hiển thị trong input theo định dạng.
     * @param {*} value Giá trị của input
     * @author: nttue (29/08/2023)
     */
    assignDataValue(value) {
      if (this.allowNumber) {
        if (value) {
          this.dataValue = this.convertStringToNumber(
            value.toString().replace(/\./g, "")
          );
        } else {
          value = "0";
        }
      }
      if (this.allowDecimal) {
        if (value) {
          let check = value.toString().includes(".");
          if (check) {
            var spiriter = value.toString().split(".");

            let partLeft = this.convertStringToNumber(
              spiriter[0].replace(/\./g, "")
            );

            let left = partLeft ? partLeft : "0";

            let partRight =
              spiriter[1].length === 1 ? spiriter[1][0] + "0" : spiriter[1];

            this.dataValue = left + "," + partRight;
          } else {
            this.dataValue =
              this.convertStringToNumber(value.toString().replace(/\./g, "")) +
              ",00";
          }
        } else {
          this.dataValue = "0,00";
        }
      } else {
        this.dataValue = value;
      }
    },

    /**
     * Chỉ cho phép gõ số đối với input cho phép gõ số và thêm dấu "," nếu cho phép gõ dấu thập phân.
     * @author: nttue (29/08/2023)
     */
    onlyAllowNumber(event) {
      if (
        (isNaN(event.key) &&
          !ALLOWED_KEYS.includes(event.key) &&
          (this.allowNumber || (event.key !== "," && this.allowDecimal))) ||
        (this.allowDecimal && event.key === "," && this.dataValue.includes(","))
      ) {
        event.preventDefault();
      }
      if (event.key === "Enter" || event.key === "Tab") {
        this.updateModelValue();
      }
    },
    updateModelValue() {
      if (this.minValue && this.maxValue) {
        let value = this.convertStringToData(this.dataValue);

        if (value < this.minValue || value > this.maxValue) {
          this.dataValue = this.minValue.toString();
        } else {
          this.$emit(
            "update:modelValue",
            this.convertStringToData(this.dataValue)
          );
        }
      } else {
        this.$emit(
          "update:modelValue",
          this.convertStringToData(this.dataValue)
        );
      }
    },
    /**
     * @description hàm xử sự kiện khi người dùng gõ vào input
     * @author: nttue (29/08/2023)
     * Modified at (10/07/2023)
     */
    onInput(event) {
      const prevValue = event.target.value;
      const caretPosition = this.$refs.minput.selectionStart;
      this.formatData(prevValue, prevValue.length - caretPosition);

      this.$nextTick(() => {
        this.$refs.minput.selectionStart = caretPosition;
        this.$refs.minput.selectionEnd = caretPosition;
      });

      if (this.rules) {
        this.validateData();
      }
    },

    /**
     * Hàm thực hiện format dữ liệu cho ô input trong trường hợp input thuộc kiểu chỉ cho phép nhập số thập phân.
     * @param {String} input giá trị của ô inputs
     * @param {Number} caretPosition vị trí con trỏ trong ô input
     * @author: nttue (29/08/2023)
     */
    formatData(input, caretPosition = -1) {
      var result = "";
      if (this.allowDecimal) {
        if (!input.includes(",")) {
          result = input + ",00";
        } else {
          var spriter = input.split(",");
          let right = spriter[1];
          if (right.length === 1) {
            right += "0";
          }

          if (spriter[0].replace(/\./g, "")) {
            let partLeft = this.convertStringToNumber(
              spriter[0].replace(/\./g, "")
            );
            let left = partLeft ? partLeft : "0";
            let partRight = "";

            if (caretPosition === 0 && right.length > 2) {
              partRight = right[0] + right[2];
            } else if (caretPosition === 0 && right.length === 2) {
              partRight = right[0] + right[1];
            } else {
              partRight = right[0] + right[1];
            }

            result = left + "," + partRight;
          } else {
            this.dataValue = "";
          }
        }
      } else if (this.allowNumber) {
        result = this.convertStringToNumber(input.replace(/\./g, ""));
      } else {
        result = input;
      }
      this.dataValue = result;
      this.reRender = !this.reRender;
    },

    /**
     * Hàm thực hiển chuyển đổi giá trị từ chuỗi string sang số. ví dụ 12345 => 12.345
     * @param {String} input giá trị đầu vào
     * @author: nttue (29/08/2023)
     */
    convertStringToNumber(input) {
      var inputFilter = input.replace(/^0+/, "");
      return inputFilter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    /**
     * Hàm thực hiển chuyển đổi giá trị từ chuỗi string sang số. ví dụ 12345 => 12.345
     * @param {String} input giá trị đầu vào
     * @author: nttue (29/08/2023)
     */
    convertStringToData(input) {
      var result = "";
      if (this.allowNumber) {
        result = +input;
      } else if (this.allowDecimal) {
        let cleanInput = input.replace(/\./g, "").replace(",", ".");
        let parsedNumber = parseFloat(cleanInput);
        result = parsedNumber;
      } else {
        result = input;
      }
      return result;
    },

    /**
     * Hàm thực hiện validate dữ liệu khi người dùng nhập liệu hoặc blur ra ô input.
     * Nếu có lỗi sẽ thực hiện gán lỗi và đưa ra cảnh báo cho người dùng.
     * @author: nttue (29/08/2023)
     */
    validateData() {
      const rulesList = this.rules.split("|");
      for (let i = 0; i < rulesList.length; i++) {
        const err = validate[rulesList[i]](
          this.dataValue,
          this.$MResources[this.formName][this.name][rulesList[i]]
        );
        if (err) {
          this.error = err;
          return;
        }
      }
      this.error = "";
    },

    /**
     * @description Hàm xử lý sự kiện khi người dùng focus vào input
     * @author: nttue (29/08/2023)
     */
    focus() {
      this.$refs.minput.focus();
    },

    /**
     * @description Hàm xử lý sự kiện khi người dùng focus vào input
     * @author: nttue (29/08/2023)
     */
    onFocus() {
      this.$refs.minput.select();
    },

    /**
     * @description hàm xử lý sự kiện khi người dùng blur khỏi input
     * @param {name} name tên của input
     * @author: nttue (29/08/2023)
     */
    onBlur(name) {
      this.updateModelValue();

      if (this.type && this.dataValue) {
        this.dataValue = upperCaseName(this.dataValue);
      }
      if (
        this.rules?.includes("required") ||
        (this.rules && this.dataValue.trim())
      ) {
        this.validateData();
      }
    },
  },
};
</script>

<style lang="scss">
@import "./input-text.scss";
</style>
