<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button v-on="on" v-bind="attrs" icon="format-font" />
    </template>

    <v-list dense>
      <v-list-item-group v-model="type">
        <v-list-item
          v-for="fontType in fontTypes"
          :key="fontType"
          @click="toggleFontType"
          :value="fontType">
          <v-list-item-title>{{ fontType }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import {
  findActiveFontType,
  FONT_TYPES
} from '../extensions/font-type';
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-font-type',
  props: {
    editorContext: { type: Object, required: true }
  },
  data: () => ({ type: 14 }),
  computed: {
    fontTypes: () => FONT_TYPES,
    editor() {
      return this.editorContext.editor;
    },
    activeFontType() {
      return findActiveFontType(this.editor.state);
    }
  },
  methods: {
    toggleFontType(type) {
      const { activeFontType, editorContext: { commands } } = this;
      if (type === activeFontType) return commands.fontType('');
      commands.fontType(type);
    }
  },
  watch: {
    type: 'toggleFontType'
  },
  components: {
    MenuButton
  }
};
</script>
