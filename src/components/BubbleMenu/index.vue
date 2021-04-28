<template>
  <editor-menu-bubble
    v-if="editor"
    :editor="editor"
    class="editor-bubble-menu"
    v-slot="{ commands, isActive, getMarkAttrs, menu }">
    <v-card
      class="bubble-menu"
      :class="{ 'is-active': menu.isActive }"
      :style="`left: ${left || menu.left}px; bottom: ${menu.bottom}px;`">
      <v-card-text class="d-flex pa-1">
        <template v-if="isImage">
          <image-menu
            :node="imageNode"
            :editor-context="{ commands, isActive, editor }" />
        </template>
        <template v-if="isText">
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
        </template>
      </v-card-text>
    </v-card>
  </editor-menu-bubble>
</template>

<script>
import { EditorMenuBubble } from 'tiptap';
import { getMarkRange } from 'tiptap-utils';
import ImageMenu from './ImageMenu.vue';
import LinkMenu from './LinkMenu.vue';
import MenuButton from '../MenuButton.vue';
import { TextSelection } from 'prosemirror-state';

export default {
  name: 'tce-tiptap-bubble-menu',
  props: {
    editor: { type: Object, default: null }
  },
  data: () => ({
    isLink: false,
    isImage: false,
    isText: false,
    imageNode: null,
    opened: true,
    left: null
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
      this.left = null;
    },
    isImageSelection(selection) {
      if (!selection.node) {
        this.isImage = false;
        return;
      }

      this.isImage = selection.node.type.name === 'image';
      this.isText = false;
      this.imageNode = selection.node;
      const { from, to } = selection;
      const imageWidth = selection.node.attrs.width;
      const start = this.editor.view.coordsAtPos(from);
      const end = this.editor.view.coordsAtPos(to);
      const box = this.editor.view.dom.getBoundingClientRect();
      const left = Math.max((start.left + end.left) / 2, start.left + 3);
      this.left = left - box.left + imageWidth / 2;
    },
    isTextSelection(selection) {
      this.isText = selection instanceof TextSelection;
      this.left = null;
    },
    getSelectionType(selection) {
      this.isTextSelection(selection);
      this.isLinkSelection(selection);
      this.isImageSelection(selection);
    }
  },
  watch: {
    'editor.state.selection': 'getSelectionType'
  },
  components: {
    EditorMenuBubble,
    ImageMenu,
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
