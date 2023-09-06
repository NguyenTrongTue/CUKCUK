<template>
  <div class="input-default date-wrapper" :class="error ? 'error' : ''">
    <div class="input-label-wrapper" v-show="label">
      <span class="input-label">{{ label }}</span>
    </div>

    <mdate-picker
      placeholder=""
      ref="input"
      :error="error"
      class="date-picker"
      text-input
      auto-apply
      :format="$store.state.date.formatDate"
      v-model="date"
      calendar-cell-class-name="dp-custom-cell"
      :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
    >
      <template
        #month-year="{ month, year, updateMonthYear, handleMonthYearChange }"
      >
        <div class="custom-month-year-component">
          <div class="datepicker-control" v-if="!isOpenSelectMonthYear">
            <div class="pointer icon" @click="handleMonthYearChange(false)">
              <span class="icon-arrow-left"></span>
            </div>
            <span class="month-year-label" @click="openSelectMonthYear"
              >{{ this.$MResources.Month }}
              {{ month + 1 }}
              {{ this.$MResources.Year }}
              {{ year }}</span
            >
            <div class="pointer icon" @click="handleMonthYearChange(true)">
              <span class="icon-arrow-right"></span>
            </div>
          </div>
          <div v-else>
            <div class="selected-wrapper">
              <div class="icon" @click="decreaseYear">
                <span v-show="!isPickMonth" class="icon-arrow-top"></span>
              </div>
              <span>{{ yearSelected }}</span>
              <div class="icon" @click="increaseYear">
                <span v-show="!isPickMonth" class="icon-arrow-bottom"></span>
              </div>
            </div>
            <div class="calendar-select">
              <table>
                <tr v-for="row in [0, 1, 2, 3]" :key="row">
                  <td v-for="col in [0, 1, 2]" :key="col">
                    <div
                      v-if="isPickMonth"
                      :class="
                        monthSelected === months[row * 3 + col].value
                          ? 'selected'
                          : ''
                      "
                      @click="
                        selectedMonth(
                          months[row * 3 + col].value,
                          updateMonthYear
                        )
                      "
                    >
                      {{ months[row * 3 + col].label }}
                    </div>
                    <div
                      v-else
                      :class="
                        yearSelected === years[row * 3 + col].value
                          ? 'selected'
                          : ''
                      "
                      @click="selecteYear(years[row * 3 + col].value)"
                    >
                      {{ years[row * 3 + col].value }}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template #action-extra="{ selectCurrentDate }">
        <div class="action-row flex-center" @click="selectCurrentDate()">
          <span>
            {{ this.$MResources.Today }}
          </span>
        </div>
      </template>
      <template #action-row> </template>
    </mdate-picker>
    <div class="input-error">{{ error }}</div>
  </div>
</template>

<script>
/**
 * Component MDatePicker
 * Cho phép người dùng nhập liệu, chọn ngày tháng năm.
 * Tự động autocomplete.
 * @author: nttue (20/08/2023)
 */
import VueDatePicker from "@vuepic/vue-datepicker";
import { validate } from "@/utils/validate/validation.js";

export default {
  name: "MDatePicker",
  components: {
    VueDatePicker,
  },
  props: {
    // label của thẻ date picker.
    label: {
      type: String,
    },

    // các rule của date picker như : required, rule date,...
    rules: {
      type: String,
    },

    // model value
    modelValue: {
      type: [Date, String],
      default: new Date(),
    },

    // Thuộc tính tabindex của MDatePicker.
    tabIndex: {
      type: String,
    },

    // Tên của MDatePicker.
    name: {
      type: String,
    },
  },
  data() {
    return {
      // Lỗi của comboxbox
      error: "",

      // giá trị ngày tháng, năm hiển thị trên ô input.
      date: this.modelValue,

      // Thuộc tính hiển thị bảng chọn tháng, năm.
      isOpenSelectMonthYear: false,

      // Đang ở chế độ chọn tháng.
      isPickMonth: false,

      // Tháng được chọn.
      mouthSelected: "",

      // Năm được chọn.
      yearSelected: "",

      // Danh sách các năm.
      years: [],

      // Mảng chứa các tháng.
      months: [
        { value: 1, label: "Thg 1" },
        { value: 2, label: "Thg 2" },
        { value: 3, label: "Thg 3" },
        { value: 4, label: "Thg 4" },
        { value: 5, label: "Thg 5" },
        { value: 6, label: "Thg 6" },
        { value: 7, label: "Thg 7" },
        { value: 8, label: "Thg 8" },
        { value: 9, label: "Thg 9" },
        { value: 10, label: "Thg 10" },
        { value: 11, label: "Thg 11" },
        { value: 12, label: "Thg 12" },
      ],
    };
  },
  watch: {
    /**
     * Hàm update giá trị của date.
     * @author: nttue (10/07/2023)
     */
    modelValue() {
      this.date = this.modelValue;
    },

    /**
     * Thực hiện gán lại date khi modelValue thay đổi.
     * @param {Date} newValue
     * @author: nttue (10/07/2023)
     */
    date(newValue) {
      if (this.rules) {
        const err = validate[this.rules](
          newValue,
          this.$MResources["Material"][this.name][this.rules]
        );
        this.error = err;
      }
      this.resetMonthYear(newValue);
      this.$emit("update:modelValue", newValue);
    },
  },

  /**
   * Gán giá trị tab index.
   * Lắng nghe sự kiện blur và change.
   * @author: nttue (10/07/2023)
   */
  mounted() {
    this.$refs.input.$el.querySelector("input").tabIndex = this.tabIndex;
    const input = this.$refs.input.$el;
    input.querySelector("input").addEventListener("blur", this.onBlur);
    input.querySelector("input").addEventListener("change", this.onInput);
  },
  methods: {
    /**
     * Hàm sử lý sự kiện focus vào input trong MDatePicker.
     * @author: nttue (10/07/2023)
     */
    focus() {
      this.$refs.input.$el.querySelector("input").focus();
      this.$refs.input.$el.querySelector("input").select();
    },

    /**
     * Hàm giảm giá trị của các năm đang chọn xuống 11.
     * @author nttue (20/07/2023)
     */
    decreaseYear() {
      this.years = this.years.map((year) => {
        return {
          ...year,
          value: year.value - 11,
        };
      });
    },

    /**
     * Hàm tăng giá trị của các năm đang chọn lên 12.
     * @author nttue (20/07/2023)
     */
    increaseYear() {
      this.years = this.years.map((year) => {
        return {
          ...year,
          value: year.value + 12,
        };
      });
    },

    /**
     * Hàm chọn năm.
     * @author nttue (20/07/2023)
     */
    selecteYear(value) {
      this.yearSelected = value;
      this.isPickMonth = true;
    },

    /**
     * Cập nhật tháng năm.
     * @param {} value tháng
     * @param {*} updateMonthYear Hàm cập nhật tháng năm của vue-datepicker
     * @author nttue (20/07/2023)
     */
    selectedMonth(value, updateMonthYear) {
      this.monthSelected = value;

      this.isOpenSelectMonthYear = false;
      this.isPickMonth = false;
      updateMonthYear(this.monthSelected - 1, this.yearSelected);
    },

    /**
     * Mở phần chọn tháng năm.
     * @author nttue (20/07/2023)
     */
    openSelectMonthYear() {
      this.isOpenSelectMonthYear = true;
    },

    /**
     * Hàm reset lại năm.
     * @param {*} date
     * @author nttue (20/07/2023)
     */
    resetMonthYear(date) {
      try {
        let tempDate;

        if (!date) {
          tempDate = new Date(Date.now());
        } else {
          tempDate = new Date(date);
        }

        let tempYear = tempDate.getFullYear();
        this.years = [];

        for (let i = 0; i < 12; i++) {
          this.years.push({
            value: tempYear - i,
            label: tempYear - i,
          });
        }

        this.yearSelected = tempYear;
        this.monthSelected = tempDate.getMonth() + 1;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
@import "./datepicker.scss";
</style>
