<template>
  <editor-menu-bubble
    v-if="editor"
    :editor="editor"
    class="editor-bubble-menu"
    v-slot="{ commands, isActive, getMarkAttrs, menu }">
    <v-card
      class="bubble-menu"
      :class="{ 'is-active': menu.isActive }"
      :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`">
      <v-card-text class="d-flex pa-1">
        <link-menu
          :is-link-selection="isLink"
          :editor-context="{ commands, isActive, getMarkAttrs }" />
        <menu-button
          :command="commands.bold"
          :is-active="isActive.bold()"
          icon="format-bold" />
        <menu-button
          :command="commands.italic"
          :is-active="isActive.italic()"
          icon="format-italic" />
        <menu-button
          :command="commands.underline"
          :is-active="isActive.underline()"
          icon="format-underline" />
      </v-card-text>
    </v-card>
  </editor-menu-bubble>
</template>

<script>
import { EditorMenuBubble } from 'tiptap';
import { getMarkRange } from 'tiptap-utils';
import LinkMenu from './LinkMenu';
import MenuButton from '../MenuButton';

export default {
  name: 'bubble-menu',
  props: {
    editor: { type: Object, default: null }
  },
  data: () => ({
    isLink: false
  }),
  methods: {
    isLinkSelection(selection) {
      const { schema } = this.editor;
      const linkType = schema.marks.link;
      if (!linkType || !selection) {
        this.isLink = false;
        return;
      }

      const { $from, $to } = selection;
      const range = getMarkRange($from, linkType);
      if (!range) {
        this.isLink = false;
        return;
      }

      this.isLink = range.to === $to.pos;
    }
  },
  watch: {
    'editor.state.selection': 'isLinkSelection'
  },
  components: {
    EditorMenuBubble,
    LinkMenu,
    MenuButton
  }
};
</script>

<style lang="scss" scoped>

.bubble-menu {
  display: -webkit-box;
  display: flex;
  position: absolute;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  z-index: 20;
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity 0.2s, visibility 0.2s;
  transition: opacity 0.2s, visibility 0.2s;
}

.bubble-menu.is-active {
  opacity: 1;
  visibility: visible;
}

</style>
