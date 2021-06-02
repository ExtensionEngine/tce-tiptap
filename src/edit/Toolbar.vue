<template>
  <div v-if="editor" class="toolbar">
    <menu-button
      @click="editor.chain().focus().toggleCode().run()"
      :is-active="editor.isActive('code')"
      icon="code-tags"
      tooltip="Code" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().undo().run()"
      icon="undo"
      tooltip="Undo" />
    <menu-button
      @click="editor.chain().focus().redo().run()"
      icon="redo"
      tooltip="Redo" />
    <v-divider vertical />
    <heading :editor="editor" />
    <font-family :editor="editor" />
    <font-size :editor="editor" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().toggleBold().run()"
      :is-active="editor.isActive('bold')"
      icon="format-bold"
      tooltip="Bold" />
    <menu-button
      @click="editor.chain().focus().toggleItalic().run()"
      :is-active="editor.isActive('italic')"
      icon="format-italic"
      tooltip="Italic" />
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
    <v-divider vertical />
    <tiptap-table :editor="editor" />
    <text-color :editor="editor" />
    <text-highlight :editor="editor" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().toggleBulletList().run()"
      :is-active="editor.isActive('bulletList')"
      icon="format-list-bulleted"
      tooltip="Bullet list" />
    <menu-button
      @click="editor.chain().focus().toggleOrderedList().run()"
      :is-active="editor.isActive('orderedList')"
      icon="format-list-numbered"
      tooltip="Numbered list" />
    <text-align :editor="editor" />
    <menu-button
      @click="editor.chain().focus().outdent(5).run()"
      icon="format-indent-decrease"
      tooltip="Outdent" />
    <menu-button
      @click="editor.chain().focus().indent(5).run()"
      icon="format-indent-increase"
      tooltip="Indent" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().setHorizontalRule().run()"
      :is-active="editor.isActive('horizontalRule')"
      icon="minus"
      tooltip="Horizontal rule" />
    <menu-button
      @click="editor.chain().focus().toggleBlockquote().run()"
      :is-active="editor.isActive('blockquote')"
      icon="format-quote-close"
      tooltip="Blockquote" />
    <menu-button
      @click="editor.chain().focus().toggleSuperscript().run()"
      icon="format-superscript"
      tooltip="Superscript" />
    <menu-button
      @click="editor.chain().focus().toggleSubscript().run()"
      icon="format-subscript"
      tooltip="Subscript" />
    <v-divider vertical />
    <link-button :editor="editor" icon="link" />
    <tce-image :editor="editor" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().unsetAllMarks().run()"
      icon="format-clear"
      tooltip="Clear formating" />
  </div>
</template>

<script>
import FontFamily from './components/MenuButtons/FontFamily.vue';
import FontSize from './components/MenuButtons/FontSize.vue';
import Heading from './components/MenuButtons/Heading.vue';
import LinkButton from './components/MenuButtons/Link.vue';
import MenuButton from './components/MenuButton.vue';
import TceImage from './components/MenuButtons/Image/index.vue';
import TextAlign from './components/MenuButtons/TextAlign.vue';
import TextColor from './components/MenuButtons/TextColor.vue';
import TextHighlight from './components/MenuButtons/TextHighlight.vue';
import TiptapTable from './components/MenuButtons/Table/index.vue';

export default {
  inject: ['$elementBus'],
  name: 'tce-tiptap-toolbar',
  data: () => ({
    editor: null
  }),
  created() {
    this.$elementBus.on('tiptap-editor', editor => {
      this.editor = editor;
    });
  },
  components: {
    TextColor,
    TextHighlight,
    FontSize,
    FontFamily,
    Heading,
    TceImage,
    MenuButton,
    LinkButton,
    TiptapTable,
    TextAlign
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  padding: 19px;
}
</style>
