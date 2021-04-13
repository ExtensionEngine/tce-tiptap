<template>
  <div>
    <editor-menu-bar v-if="editor" :editor="editor" v-slot="{ commands, isActive, getMarkAttrs }">
      <div class="toolbar">
        <menu-button
          :command="commands.code"
          :is-active="isActive.code()"
          icon="code-tags" />
        <menu-button :command="commands.undo" icon="undo" />
        <menu-button :command="commands.redo" icon="redo" />
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
        <menu-button
          :command="commands.bullet_list"
          :is-active="isActive.bullet_list()"
          icon="format-list-bulleted" />
        <menu-button
          :command="commands.ordered_list"
          :is-active="isActive.ordered_list()"
          icon="format-list-numbered" />
        <menu-button
          :command="commands.paragraph"
          :is-active="isActive.paragraph()"
          icon="format-pilcrow" />
        <menu-button
          :command="() => commands.heading({ level: 1 })"
          :is-active="isActive.heading({ level: 1 })"
          icon="format-header-1" />
        <menu-button
          :command="() => commands.heading({ level: 2 })"
          :is-active="isActive.heading({ level: 2 })"
          icon="format-header-2" />
        <menu-button
          :command="() => commands.heading({ level: 3 })"
          :is-active="isActive.heading({ level: 3 })"
          icon="format-header-3" />
        <menu-button
          :command="commands.blockquote"
          :is-active="isActive.blockquote()"
          icon="format-quote-close" />
        <link-button
          :command="commands.link"
          :is-active="isActive.link()"
          :link-attributes="getMarkAttrs('link')"
          icon="link" />
        <font-size :editor-context="{ editor, commands, isActive }" />
        <font-type :editor-context="{ editor, commands, isActive }" />
      </div>
    </editor-menu-bar>
  </div>
</template>

<script>
import { EditorMenuBar } from 'tiptap';
import FontSize from './MenuButtons/FontSize.vue';
import FontType from './MenuButtons/FontType.vue';
import LinkButton from './MenuButtons/Link.vue';
import MenuButton from './MenuButton.vue';

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
    EditorMenuBar,
    FontSize,
    FontType,
    MenuButton,
    LinkButton
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  padding: 19px;
}
</style>
