<template>
  <div>
    <editor-menu-bar
      v-if="editor"
      :editor="editor"
      v-slot="{ commands, isActive, getMarkAttrs }">
      <div class="toolbar">
        <menu-button
          :command="commands.code"
          :is-active="isActive.code()"
          icon="code-tags" />
        <v-divider vertical />
        <menu-button :command="commands.undo" icon="undo" />
        <menu-button :command="commands.redo" icon="redo" />
        <v-divider vertical />
        <heading :editor-context="{ editor, commands, isActive }" />
        <font-size :editor-context="{ editor, commands, isActive }" />
        <font-type :editor-context="{ editor, commands, isActive }" />
        <v-divider vertical />
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
        <menu-button
          :command="commands.strike"
          :is-active="isActive.strike()"
          icon="format-strikethrough" />
        <v-divider vertical />
        <color-picker
          :command="commands.textColor"
          :is-active="isActive.textColor()" />
        <color-picker
          :command="commands.textHighlight"
          :is-active="isActive.textHighlight()"
          icon="format-color-highlight" />
        <v-divider vertical />
        <menu-button
          :command="commands.bullet_list"
          :is-active="isActive.bullet_list()"
          icon="format-list-bulleted" />
        <menu-button
          :command="commands.ordered_list"
          :is-active="isActive.ordered_list()"
          icon="format-list-numbered" />
        <text-align :editor-context="{ editor, commands, isActive }" />
        <v-divider vertical />
        <link-button
          :command="commands.link"
          :is-active="isActive.link()"
          :link-attributes="getMarkAttrs('link')"
          icon="link" />
        <tiptap-table :editor-context="{ editor, commands, isActive }" />
        <menu-button
          :command="commands.horizontal_rule"
          :is-active="isActive.horizontal_rule()"
          icon="minus" />
        <menu-button
          :command="commands.blockquote"
          :is-active="isActive.blockquote()"
          icon="format-quote-close" />
        <v-divider vertical />
        <menu-button
          :command="commands.clearFormat"
          icon="format-clear" />
      </div>
    </editor-menu-bar>
  </div>
</template>

<script>
import ColorPicker from './MenuButtons/ColorPicker.vue';
import { EditorMenuBar } from 'tiptap';
import FontSize from './MenuButtons/FontSize.vue';
import FontType from './MenuButtons/FontType.vue';
import Heading from './MenuButtons/Heading.vue';
import LinkButton from './MenuButtons/Link.vue';
import MenuButton from './MenuButton.vue';
import TextAlign from './MenuButtons/TextAlign.vue';
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
    ColorPicker,
    EditorMenuBar,
    FontSize,
    FontType,
    Heading,
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
