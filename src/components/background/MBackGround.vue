<template>
  <div
    class="background"
    :style="{ background: 'url(/src/assets/imgs/background.jpg)' }"
  >
    <div class="logo">
      <img class="logo-img" src="/src/assets/logocukcuk_splash_en.png" />
      <img class="logo-loading" src="/src/assets/imgs/page-loading.gif" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MBackGround",
};
</script>
<style lang="scss">
@import "./background.scss";
</style>
