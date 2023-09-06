<template>
  <div :class="icon"></div>
</template>

<script>
export default {
  name: "MIcon",
  props: {
    /**
     * Tên của icon.
     */
    icon: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
@import "./icon.scss";
</style>
