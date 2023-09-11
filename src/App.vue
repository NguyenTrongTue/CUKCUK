<template>
  <router-view></router-view>
  <mdialog-message />
  <MToast />
  <mloading :typeLoading="1" v-show="showLoading" />
  <MBackGround v-if="showBackground" />
</template>

<script>
import { mapState } from "vuex";
import MToast from "@/components/toast/MToast.vue";
import MBackGround from "@/components/background/MBackGround.vue";
export default {
  components: { MToast, MBackGround },
  /**
   * Sử dụng computed để lấy ra các state global
   * @author: nttue (20/08/2023)
   */ computed: mapState({
    showLoading: (state) => state.loading.isLoading,
    showBackground: (state) => state.loading.showBackground,
  }),

  mounted() {
    setTimeout(() => {
      this.$store.commit("hideBackground");
    }, 2500);
  },
};
</script>
