<template>
  <bubble-menu v-if="editor" :editor="editor">
    <v-card>
      <v-card-text class="d-flex pa-1">
        <template v-if="isImage">
          <image-menu
            :node="imageNode"
            :editor="editor" />
        </template>
        <template v-else>
          <link-menu
            :editor="editor"
            :is-link-selection="isLink"
            :link-attributes="linkAttributes"
            icon="link" />
          <menu-button
            @click="editor.chain().focus().toggleBold().run()"
            :is-active="editor.isActive('bold')"
            icon="format-bold" />
          <menu-button
            @click="editor.chain().focus().toggleItalic().run()"
            :is-active="editor.isActive('italic')"
            icon="format-italic" />
          <menu-button
            @click="editor.chain().focus().toggleUnderline().run()"
            :is-active="editor.isActive('underline')"
            icon="format-underline" />
          <menu-button
            @click="editor.chain().focus().toggleStrike().run()"
            :is-active="editor.isActive('strike')"
            icon="format-strikethrough" />
        </template>
      </v-card-text>
    </v-card>
  </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-2';
import { getMarkAttributes } from '@tiptap/core';
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
    linkAttributes: {},
    opened: true,
    left: null
  }),
  methods: {
    isLinkSelection(selection) {
      const { schema, state } = this.editor;
      const linkType = schema.marks.link;

      if (!linkType || !selection) {
        this.isLink = false;
        return;
      }

      this.linkAttributes = getMarkAttributes(state, linkType);
      this.isLink = !!this.linkAttributes.href;
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
    BubbleMenu,
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
