<template>
  <div v-if="editor" class="toolbar">
    <menu-button
      @click="editor.chain().focus().toggleCode().run()"
      :is-active="editor.isActive('code')"
      icon="code-tags" />
    <v-divider vertical />
    <menu-button @click="editor.chain().focus().undo().run()" icon="undo" />
    <menu-button @click="editor.chain().focus().redo().run()" icon="redo" />
    <v-divider vertical />
    <heading :editor="editor" />
    <font-family :editor="editor" />
    <font-size :editor="editor" />
    <v-divider vertical />
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
    <v-divider vertical />
    <tiptap-table :editor="editor" />
    <text-color :editor="editor" />
    <text-highlight :editor="editor" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().toggleBulletList().run()"
      :is-active="editor.isActive('bulletList')"
      icon="format-list-bulleted" />
    <menu-button
      @click="editor.chain().focus().toggleOrderedList().run()"
      :is-active="editor.isActive('orderedList')"
      icon="format-list-numbered" />
    <text-align :editor="editor" />
    <menu-button
      @click="editor.chain().focus().outdent(5).run()"
      icon="format-indent-decrease" />
    <menu-button
      @click="editor.chain().focus().indent(5).run()"
      icon="format-indent-increase" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().setHorizontalRule().run()"
      :is-active="editor.isActive('horizontalRule')"
      icon="minus" />
    <menu-button
      @click="editor.chain().focus().toggleBlockquote().run()"
      :is-active="editor.isActive('blockquote')"
      icon="format-quote-close" />
    <v-divider vertical />
    <link-button :editor="editor" icon="link" />
    <tce-image :editor="editor" />
    <v-divider vertical />
    <menu-button
      @click="editor.chain().focus().unsetAllMarks().run()"
      icon="format-clear" />
  </div>
</template>

<script>
import FontFamily from './MenuButtons/FontFamily.vue';
import FontSize from './MenuButtons/FontSize.vue';
import Heading from './MenuButtons/Heading.vue';
import LinkButton from './MenuButtons/Link.vue';
import MenuButton from './MenuButton.vue';
import TceImage from './MenuButtons/Image/index.vue';
import TextAlign from './MenuButtons/TextAlign.vue';
import TextColor from './MenuButtons/TextColor.vue';
import TextHighlight from './MenuButtons/TextHighlight.vue';
import TiptapTable from './MenuButtons/Table/index.vue';

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

<style,
    TextHighlight lang="scss" scoped>
.toolbar {
  display: flex;
  padding: 19px;
}
</style>
