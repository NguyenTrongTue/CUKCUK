<template>
  <div class="paging flex-between">
    <div class="paging__left">
      <div class="paging__left-toolbar flex-start">
        <div class="select-page-number flex-center">
          <div class="page-prev flex-start">
            <div
              class="paging__img flex-center"
              :class="disablePrevBtn && 'disabled'"
              @click="handleChooseFirstPage"
            >
              <mtooltip :content="this.$MResources.Firstpage" :arrow="false">
                <img src="@/assets/imgs/double-left.webp" alt="" />
              </mtooltip>
            </div>
            <mtooltip :content="this.$MResources.Prevpage" :arrow="false">
              <div
                class="paging__img flex-center"
                :class="disablePrevBtn && 'disabled'"
                @click="handleChoosePrevPage"
              >
                <img src="@/assets/imgs/page-prev.webp" alt="" />
              </div>
            </mtooltip>
          </div>
          <mseparate style="height: 16px" />
          <div class="page-number flex-center">
            <span>{{ this.$MResources.Page }}</span>

            <input
              class="input-page-number"
              :value="0"
              :readonly="true"
              v-if="totalRecords === 0"
            />
            <minput
              v-else
              class="input-page-number"
              v-model="pageNumber"
              :allowNumber="true"
              :minValue="1"
              :maxValue="totalPage"
            />
            <span>{{ this.$MResources.On }} {{ totalPage }}</span>
          </div>

          <div class="page-next flex-start">
            <mseparate style="height: 16px" />
            <mtooltip :content="this.$MResources.Nextpage" :arrow="false">
              <div
                class="paging__img flex-center"
                :class="disableNextBtn && 'disabled'"
                @click="handleChooseNextPage"
              >
                <img src="@/assets/imgs/page-next.webp" alt="" />
              </div>
            </mtooltip>
            <mtooltip :content="this.$MResources.Lastpage" :arrow="false">
              <div
                class="paging__img flex-center"
                :class="disableNextBtn && 'disabled'"
                @click="handleChooseLastPage"
              >
                <img src="@/assets/imgs/page-last.webp" alt="" />
              </div>
            </mtooltip>
          </div>
          <mseparate style="height: 16px" />
        </div>
        <div><mseparate style="height: 16px" /></div>

        <mtooltip :content="this.$MResources.Reload" :arrow="false">
          <div
            class="paging__img flex-center"
            style="margin: 0 8px"
            @click="onReload"
          >
            <img src="@/assets/imgs/refresh.webp" alt="" />
          </div>
        </mtooltip>
        <div>
          <mseparate style="height: 16px" />
        </div>
        <div class="select-page-size">
          <action-dropdown
            v-model="pageSize"
            :list="[25, 50, 100]"
            sizeType="small"
          />
        </div>
      </div>
    </div>
    <div class="paging__right">
      {{
        `${this.$MResources.Show} ${this.startIndex} - ${this.endIndex} ${this.$MResources.On} ${this.totalRecords} ${this.$MResources.Result}`
      }}
    </div>
  </div>
</template>
<script>
/**
 * Component paging
 * Thực hiện phân trang.
 * Chọn vị trí trang.
 * Chọn kích thước bản ghi / trang.
 * Thực hiện chuyển trang.
 * @author: nttue (20/08/2023)
 */
export default {
  emits: ["onReload", "choosePageSize", "choosePageNumber"],
  props: {
    /**
     * Tổng số bản ghi.
     */
    totalRecords: {
      type: Number,
    },
    /**
     * kích thước bản ghi / trang.
     */
    pageSizeProps: {
      type: Number,
    },
    /**
     * vị trí trang.
     */
    pageNumberProps: {
      type: Number,
    },
    /**
     * Tổng số trang.
     */
    totalPageProps: {
      type: Number,
    },
  },
  data() {
    return {
      pageSize: this.pageSizeProps,
      pageNumber: this.pageNumberProps,
    };
  },
  watch: {
    /**
     * Thực hiện gán lại kích thước trang.
     * @param {Number} newPageSize kích thước trang.
     * @author: nttue (20/08/2023)
     */
    pageSize(newPageSize) {
      this.pageNumber = 1;
      this.$emit("choosePageSize", newPageSize);
    },

    /**
     * Thực hiện gán lại vị trí trang.
     * @param {Number} newPageSize vị trí trang.
     * @author: nttue (20/08/2023)
     */
    pageNumber(newPageNumber) {
      this.$emit("choosePageNumber", newPageNumber);
    },
    /**
     * Thực hiện gán lại vị trí trang.
     * @param {Number} newPageSize vị trí trang.
     * @author: nttue (20/08/2023)
     */
    pageNumberProps(newPageNumber) {
      this.pageNumber = newPageNumber;
    },
  },
  methods: {
    /**
     * Hàm bắt sự kiện nạp lại dữ liệu.
     * @author: nttue (20/08/2023)
     */
    onReload() {
      this.$emit("onReload");
    },
    /**
     * Hàm chọn trang đầu tiên.
     * @author: nttue (20/08/2023)
     */
    handleChooseFirstPage() {
      this.pageNumber = 1;
    },
    /**
     * Hàm chọn trang trước.
     * @author: nttue (20/08/2023)
     */
    handleChoosePrevPage() {
      if (this.pageNumber > 1) {
        this.pageNumber--;
      } else {
        return;
      }
    },
    /**
     * Hàm chọn trang tiếp theo.
     * @author: nttue (20/08/2023)
     */
    handleChooseNextPage() {
      if (this.pageNumber === this.totalPage) {
        return;
      } else {
        this.pageNumber++;
      }
    },
    /**
     * Hàm chọn trang cuối cùng.
     * @author: nttue (20/08/2023)
     */
    handleChooseLastPage() {
      this.pageNumber = this.totalPage;
    },
  },
  computed: {
    /**
     * Hàm tính trang bắt đầu.
     * @author: nttue (20/08/2023)
     */
    startIndex() {
      let start = (this.pageNumber - 1) * this.pageSize;
      return this.totalRecords <= 0 ? 0 : start + 1;
    },

    /**
     * Hàm chỉ số cuối cùng.
     * @author: nttue (20/08/2023)
     */
    endIndex() {
      let end = this.startIndex - 1 + this.pageSize;
      return end > this.totalRecords ? this.totalRecords : end;
    },
    /**
     * Hàm tính tổng số trang.
     * @author: nttue (20/08/2023)
     */
    totalPage() {
      return this.totalPageProps;
    },

    /**
     * Hàm bất chế độ disabled.
     * @author: nttue (20/08/2023)
     */
    disablePrevBtn() {
      return this.pageNumber === 1;
    },
    /**
     * Hàm bất chế độ disabled.
     * @author: nttue (20/08/2023)
     */
    disableNextBtn() {
      return this.pageNumber === this.totalPage || this.totalPage === 0;
    },
  },
};
</script>
<style lang="scss">
@import "./paging.scss";
</style>
