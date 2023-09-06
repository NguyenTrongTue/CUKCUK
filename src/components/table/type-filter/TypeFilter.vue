<template>
  <div class="select-type-filter" @click="onFilter" ref="filterElement">
    <span class="value-type">{{ symbolComputed(dataValue) }}</span>
    <div class="type-filter">
      <div
        class="dropdown-list"
        v-show="showChooseCondition && indexShow === index"
        v-custom-outside="handleHideFilter"
        :style="{
          left: left + 'px',
          top: top + 'px',
        }"
      >
        <div
          class="dropdown-item"
          v-for="(item, index) in data"
          :key="index"
          @click="chooseValue($event, item)"
        >
          <div class="flex-start dropdown-item__left">
            <img
              v-if="item.value === dataValue"
              style
              src="@/assets/imgs/table-circle-blue16.png"
              alt=""
            />
            <div v-else style="width: 20px"></div>

            <span class="filter-symbol"> {{ item.symbol }} </span>
          </div>
          : {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["filter", "update:modelValue"],
  props: {
    modelValue: {
      type: [String, Number],
    },
    index: {
      type: Number,
    },
    indexFilter: {
      type: Number,
    },
    dataList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dataValue: this.modelValue,
      showChooseCondition: false,
      data: this.dataList,
      top: 0,
      left: 0,
      indexShow: this.indexFilter,
    };
  },
  watch: {
    indexFilter(newIndex) {
      this.indexShow = newIndex;
    },
    dataList(newDataList) {
      this.data = newDataList;
    },
  },
  methods: {
    /**
     * Hàm ẩn context .
     * @author: nttue (20/08/2023)
     */
    handleHideFilter() {
      this.showChooseCondition = false;
    },
    /**
     * Hàm mở context để lựu chọn chế độ lọc dữ liệu của cột đó.
     * @author: nttue (20/08/2023)
     */
    onFilter(event) {
      event.preventDefault();
      event.stopPropagation();

      this.showChooseCondition = !this.showChooseCondition;

      const filter = this.$refs.filterElement;
      this.$emit("filter", this.index);

      this.top = filter.getBoundingClientRect().top + 26;
      this.left = filter.getBoundingClientRect().left;

      if (window.innerHeight - this.top < 170) {
        var distance =
          this.data.length >= 6
            ? 170
            : this.data.length > 0
            ? 2 + this.data.length * 28
            : 30;

        this.top = filter.getBoundingClientRect().top - distance;
      }
      if (window.innerWidth - this.left < 150) {
        var distance = 124;
        this.left = filter.getBoundingClientRect().left - distance;
      }
    },
    chooseValue(event, item) {
      event.stopPropagation();
      this.dataValue = item.value;
      this.showChooseCondition = false;
      this.$emit("update:modelValue", this.dataValue);
    },

    /**
     * Hàm chuyển đổi giá trị của chế độ lọc sang ký tự.
     * @author: nttue (20/08/2023)
     */
    symbolComputed(selectedValue) {
      var item = this.data?.find((item) => item.value == selectedValue);

      if (item) {
        return item.symbol;
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss"></style>
