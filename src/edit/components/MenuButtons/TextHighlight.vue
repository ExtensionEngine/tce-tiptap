<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="!!editor.getAttributes('textStyle').backgroundColor"
        v-bind="attrs"
        icon="format-color-highlight"
        tooltip="Highlight text" />
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
  name: 'tce-tiptap-text-hightlight',
  props: {
    editor: { type: Object, required: true },
    isActive: { type: Boolean, default: false }
  },
  methods: {
    onColorChange(color) {
      this.editor.chain().focus().setTextHighlight(color.hex).run();
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
