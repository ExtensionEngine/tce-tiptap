<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="isActive"
        v-bind="attrs"
        :icon="icon" />
    </template>
    <v-color-picker
      @input="onColorChange"
      dot-size="25"
      mode="hexa"
      show-swatches
      swatches-max-height="200" />
  </v-menu>
</template>

<script>
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-color-picker',
  props: {
    command: { type: Function, default: () => {} },
    isActive: { type: Boolean, default: false },
    icon: { type: String, default: 'palette' }
  },
  methods: {
    onColorChange(color) {
      this.command(color.hex).run();
    }
  },
  components: {
    MenuButton
  }
};
</script>

<style lang="scss" scoped>
.font-sizes.v-list .v-list-item.active {
  color: #ff6590 !important;

  &::before {
    opacity: 0.12;
  }
}
</style>
