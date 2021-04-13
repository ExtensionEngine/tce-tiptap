<template>
  <v-btn
    v-on="$listeners"
    @click="command"
    v-bind="$attrs"
    icon
    :class="{ 'active': isActive }"
    class="menu-button mx-1">
    <v-icon>{{ `mdi-${icon}` }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'tce-tiptap-menu-button',
  props: {
    command: { type: Function, default: () => {} },
    isActive: { type: Boolean, default: false },
    icon: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.menu-button {
  min-width: 34px;
  height: 34px;
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

    background: #ffe5ec;
  }
}
</style>
