<template>
  <div class="sidebar" :class="collapse ? 'collapse' : ''">
    <router-link :to="'/material-group'" class="menu-item flex-start">
      <div class="menu-item__icon">
        <div class="icon-list"></div>
      </div>
      <div class="menu-item__label">
        {{ this.$MResources.MaterialLabel }}
      </div>
    </router-link>

    <router-link :to="'/'" class="menu-item flex-start">
      <div class="menu-item__icon">
        <img src="@/assets/icon/icon-menu.png" alt="" />
      </div>
      <div class="menu-item__label">{{ this.$MResources.materials }}</div>
    </router-link>
    <router-link :to="'/stock'" class="menu-item flex-start">
      <div class="menu-item__icon">
        <div class="icon-stock"></div>
      </div>
      <div class="menu-item__label">
        {{ this.$MResources.StockLabel }}
      </div> </router-link
    ><router-link :to="'/unit'" class="menu-item flex-start">
      <div class="menu-item__icon">
        <div class="icon-unit"></div>
      </div>
      <div class="menu-item__label">
        {{ this.$MResources.UnitLabel }}
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    collapse: (state) => state.settings.collapse,
  }),
};
</script>

<style lang="scss">
@import "./sidebar.scss";
</style>
