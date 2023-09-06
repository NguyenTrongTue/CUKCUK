<template>
  <div>
    <TheHeader></TheHeader>
    <div class="container">
      <TheSidebar></TheSidebar>
      <div class="content"><slot> </slot></div>
    </div>
  </div>
</template>

<script>
import TheHeader from "./header/TheHeader.vue";
import TheSidebar from "./sidebar/TheSidebar.vue";

export default {
  name: "DefaultLayout",
  components: {
    TheHeader,
    TheSidebar,
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
}
.sidebar.collapse + .content {
  .main-content__center {
    width: calc(100vw);
  }
}
.content {
  flex: 1;
}
</style>
