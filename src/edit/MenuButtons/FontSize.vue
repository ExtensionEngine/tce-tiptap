<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button v-on="on" v-bind="attrs" icon="format-size" />
    </template>

    <v-list dense>
      <v-list-item-group v-model="size">
        <v-list-item
          v-for="fontSize in fontSizes"
          :key="fontSize"
          @click="toggleFontSize"
          :value="fontSize">
          <v-list-item-title>{{ fontSize }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import {
  DEFAULT_FONT_SIZE,
  findActiveFontSize,
  FONT_SIZES
} from '../extensions/font-size';
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-font-size',
  props: {
    editorContext: { type: Object, required: true }
  },
  data: () => ({ size: 14 }),
  computed: {
    fontSizes: () => FONT_SIZES,
    editor() {
      return this.editorContext.editor;
    },
    activeFontSize() {
      return findActiveFontSize(this.editor.state);
    }
  },
  methods: {
    toggleFontSize(size) {
      const { activeFontSize, editorContext: { commands } } = this;
      if (size === activeFontSize) return commands.fontSize(DEFAULT_FONT_SIZE);
      commands.fontSize(size);
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
