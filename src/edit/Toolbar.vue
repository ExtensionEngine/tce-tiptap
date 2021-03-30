<template>
  <editor-menu-bar v-if="editor" :editor="editor" v-slot="{ commands, isActive }">
    <div class="toolbar">
      <button
        @click="commands.code"
        class="toolbar-button"
        :class="{ 'is-active': isActive.code() }">
        <span class="mdi mdi-code-tags"></span>
      </button>
      <button
        @click="commands.undo"
        class="toolbar-button">
        <span class="mdi mdi-undo"></span>
      </button>
      <button
        @click="commands.redo"
        class="toolbar-button">
        <span class="mdi mdi-redo"></span>
      </button>
      <button
        @click="commands.bold"
        class="toolbar-button"
        :class="{ 'is-active': isActive.bold() }">
        <span class="mdi mdi-format-bold"></span>
      </button>
      <button
        @click="commands.italic"
        class="toolbar-button"
        :class="{ 'is-active': isActive.italic() }">
        <span class="mdi mdi-format-italic"></span>
      </button>
      <button
        @click="commands.underline"
        class="toolbar-button"
        :class="{ 'is-active': isActive.underline() }">
        <span class="mdi mdi-format-underline"></span>
      </button>
      <button
        @click="commands.strike"
        class="toolbar-button"
        :class="{ 'is-active': isActive.strike() }">
        <span class="mdi mdi-format-strikethrough"></span>
      </button>
      <button
        @click="commands.bullet_list"
        class="toolbar-button"
        :class="{ 'is-active': isActive.bullet_list() }">
        <span class="mdi mdi-format-list-bulleted"></span>
      </button>
      <button
        @click="commands.ordered_list"
        class="toolbar-button"
        :class="{ 'is-active': isActive.ordered_list() }">
        <span class="mdi mdi-format-list-numbered"></span>
      </button>
      <button
        @click="commands.paragraph"
        class="toolbar-button"
        :class="{ 'is-active': isActive.paragraph() }">
        <span class="mdi mdi-format-pilcrow"></span>
      </button>
      <button
        @click="commands.heading({ level: 1 })"
        class="toolbar-button"
        :class="{ 'is-active': isActive.heading({ level: 1 }) }">
        <span class="mdi mdi-format-header-1"></span>
      </button>
      <button
        @click="commands.heading({ level: 2 })"
        class="toolbar-button"
        :class="{ 'is-active': isActive.heading({ level: 2 }) }">
        <span class="mdi mdi-format-header-2"></span>
      </button>
      <button
        @click="commands.heading({ level: 3 })"
        class="toolbar-button"
        :class="{ 'is-active': isActive.heading({ level: 3 }) }">
        <span class="mdi mdi-format-header-3"></span>
      </button>
      <button
        @click="commands.blockquote"
        class="toolbar-button"
        :class="{ 'is-active': isActive.blockquote() }">
        <span class="mdi mdi-format-quote-close"></span>
      </button>
      <button
        @click="commands.link"
        class="toolbar-button"
        :class="{ 'is-active': isActive.link() }">
        <span class="mdi mdi-link"></span>
      </button>
    </div>
  </editor-menu-bar>
</template>

<script>
import { EditorMenuBar } from 'tiptap';

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
    EditorMenuBar
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  padding: 19px;
}

.toolbar-button {
  min-width: 34px;
  height: 34px;
  background: transparent;
  border: none;

  .mdi {
    color: #333;
    font-size: 20px;
    line-height: 20px;
    vertical-align: top;
  }

  &.is-active {
    .mdi {
      color: #ff6590;
    }

    background: #ffe5ec;
  }
}

</style>
