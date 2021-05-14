<template>
  <bubble-menu v-if="editor" :editor="editor">
    <v-card>
      <v-card-text class="d-flex pa-1">
        <image-menu v-if="isImage" :editor="editor" />
        <template v-else>
          <link-menu
            :editor="editor"
            :is-link-selection="isLink"
            :link-attributes="linkAttributes" />
          <menu-button
            @click="editor.chain().focus().toggleBold().run()"
            :is-active="editor.isActive('bold')"
            icon="format-bold"
            tooltip="Bold" />
          <menu-button
            @click="editor.chain().focus().toggleItalic().run()"
            :is-active="editor.isActive('italic')"
            icon="format-italic"
            tooltip="italic" />
          <menu-button
            @click="editor.chain().focus().toggleUnderline().run()"
            :is-active="editor.isActive('underline')"
            icon="format-underline"
            tooltip="Underline" />
          <menu-button
            @click="editor.chain().focus().toggleStrike().run()"
            :is-active="editor.isActive('strike')"
            icon="format-strikethrough"
            tooltip="Strikethrough" />
        </template>
      </v-card-text>
    </v-card>
  </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-2';
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
    linkAttributes: {}
  }),
  methods: {
    isLinkSelection() {
      this.linkAttributes = this.editor.getAttributes('link');
      this.isLink = !!this.linkAttributes.href;
    },
    isImageSelection(selection) {
      if (!selection.node) {
        this.isImage = false;
        return;
      }
      this.isImage = selection.node.type.name === 'image';
    },
    isTextSelection(selection) {
      this.isText = selection instanceof TextSelection;
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
