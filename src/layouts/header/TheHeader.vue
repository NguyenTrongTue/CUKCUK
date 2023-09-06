<template>
  <div class="header">
    <div class="header__panel flex-start">
      <div class="flex-center" style="width: 36px" @click="resizeSidebar">
        <img
          class="pointer"
          src="@/assets/icon-left-header.webp"
          alt=""
          style="margin-top: 4px; margin-left: 12px"
        />
      </div>
      <img
        class="header__logo"
        src="@/assets/logo-text.webp"
        alt=""
        style="margin-left: 6px"
      />
    </div>
    <div class="header__right flex-between">
      <action-dropdown
        class="header__right-dropdown"
        v-model="branchName"
        :list="stocks"
        sizeType="medium"
      />

      <div class="header__right-settings flex-start">
        <action-dropdown
          v-model="language"
          :list="languages"
          sizeType="medium"
        />
        <div class="header__right-icon" style="margin-bottom: 2px">
          <micon class="icon-setting"></micon>
        </div>
        <div class="header__right-icon">
          <micon class="icon-notification"></micon>
        </div>

        <div class="user-info flex-start">
          <div class="user-avatar">
            <img src="@/assets/avatar.webp" alt="" class="avatar" />
          </div>
          <span class="user-name">Nguyễn Trọng Tuế</span>
          <div class="icon-triangle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      stocks: [
        "misa1",
        "misa2",
        "misa3",
        "misa4",
        "misa5",
        "misa1",
        "misa2",
        "misa3",
        "misa4",
        "misa5",
      ],
      languages: [
        this.$MResources.Thai,
        this.$MResources.Vietnamese,
        this.$MResources.Deutsch,
        this.$MResources.English,
      ],
      branchName: "misa1",
      language: this.$MResources.Vietnamese,
    };
  },
  /**
   * Đăng ký sự kiện resize cho widow
   * @author: nttue (01/08/2023)
   */
  mounted() {
    // nếu kích thức cửa sổ < 800px -> thu gọn side bar
    // lớn hơn thì hiện ra
    window.addEventListener("resize", () => {
      window.innerWidth < 1000
        ? this.$store.commit("showCollapse")
        : this.$store.commit("hideCollapse");
    });
  },
  computed: mapState({
    collapse: (state) => state.settings.collapse,
  }),
  methods: {
    /**
     * Hàm chỉnh kích thước sidebar.
     * @author: nttue (01/08/2023)
     */
    resizeSidebar() {
      this.$store.commit("changeCollapse");
    },
  },
};
</script>
<style lang="scss">
@import "./header.scss";
</style>
