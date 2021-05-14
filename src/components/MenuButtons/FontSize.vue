<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="!!editor.getAttributes('textStyle').fontSize"
        v-bind="attrs"
        icon="format-size">
        <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
      </menu-button>
    </template>
    <v-list dense class="font-sizes">
      <v-list-item-group v-model="size">
        <v-list-item
          v-for="fontSize in fontSizes"
          :key="fontSize"
          :value="fontSize"
          :class="{ 'active': editor.isActive('textStyle', { fontSize }) }">
          <v-list-item-title>{{ fontSize }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { FONT_SIZES } from '../../extensions/font-size';
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-font-size',
  props: {
    editor: { type: Object, required: true }
  },
  data: () => ({ size: 14 }),
  computed: {
    fontSizes: () => FONT_SIZES
  },
  methods: {
    toggleFontSize(size) {
      this.editor.chain().focus().setFontSize(size).run();
    }
  },
  watch: {
    size: 'toggleFontSize'
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
