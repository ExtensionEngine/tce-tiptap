<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="isActive"
        v-bind="attrs"
        icon="format-font" />
    </template>
    <v-list dense class="font-types">
      <v-list-item-group v-model="type">
        <v-list-item
          v-for="fontType in fontTypes"
          :key="fontType"
          :value="fontType"
          :class="{ 'active': fontType === activeFontType}">
          <v-list-item-title>
            <span :style="`font-family: ${fontType}`">{{ fontType }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { findActiveFontType, FONT_TYPES } from '../extensions/font-type';
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-font-type',
  props: { editorContext: { type: Object, required: true } },
  data: () => ({ type: '' }),
  computed: {
    fontTypes: () => FONT_TYPES,
    editor: ({ editorContext: { editor } }) => editor,
    activeFontType: ({ editor }) => findActiveFontType(editor.state),
    isActive: ({ editorContext: { isActive } }) => isActive.fontType()
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

<style lang="scss" scoped>
.font-types.v-list .v-list-item.active {
  color: #ff6590 !important;

  &::before {
    opacity: 0.12;
  }
}
</style>
