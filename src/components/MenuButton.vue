<template>
  <v-btn
    v-on="$listeners"
    v-bind="$attrs"
    text
    rounded
    :class="{ 'active': isActive }"
    class="menu-button mx-1">
    <v-icon>{{ `mdi-${icon}` }}</v-icon>
    <span class="slot"><slot></slot></span>
  </v-btn>
</template>

<script>
export default {
  name: 'tce-tiptap-menu-button',
  props: {
    isActive: { type: Boolean, default: false },
    icon: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.menu-button.v-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  background: transparent;
  border: none;

  .mdi {
    color: #333;
    font-size: 20px;
    line-height: 20px;
    vertical-align: top;
  }

  &.active {
    .mdi {
      color: #ff6590;
    }

    .slot ::v-deep .mdi {
      color: #ff6590;
    }

    background: #ffe5ec;
  }
}
</style>
