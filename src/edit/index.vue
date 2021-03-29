<template>
  <div :class="{ sm: dense, disabled: isDisabled }" class="tce-tiptap-html">
    <div
      v-if="!isFocused && !content && showPlaceholder"
      class="tiptap-html-placeholder">
      <div class="placeholder-avatar">
        <span>&lt;</span>
        <span class="divider">/</span>
        <span>&gt;</span>
      </div>
      <div class="message">
        <span class="heading">HTML component</span>
        <span v-if="!dense">Select to edit</span>
      </div>
    </div>
    <editor-menu-bar v-else :editor="editor" v-slot="{ commands, isActive }">
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
    <editor-content :editor="editor" class="editor" />
  </div>
</template>

<script>
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  HardBreak,
  Heading,
  History,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Strike,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Underline
} from 'tiptap-extensions';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import debounce from 'lodash/debounce';

export default {
  name: 'tce-tiptap-html',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    showPlaceholder: { type: Boolean, default: true }
  },
  data: vm => ({
    content: vm.element?.data?.content ?? '',
    editor: null
  }),
  computed: {
    hasChanges() {
      const previousValue = this.element?.data?.content ?? '';
      return previousValue !== this.content;
    }
  },
  methods: {
    save() {
      if (!this.hasChanges) return;
      this.$emit('save', { content: this.content });
    }
  },
  watch: {
    element(val) {
      // Make sure that component state is kept
      // until events (i.e. focusout => save) are triggered
      setTimeout(() => {
        if (this.isFocused) return;
        this.content = val?.data?.content ?? '';
      }, 0);
    },
    isFocused(val, oldVal) {
      if (oldVal && !val) this.save();
    },
    isDragged(state, oldState) {
      if (state) {
        this.readonly = true;
      } else if (!state && oldState) {
        this.readonly = false;
      }
    },
    content: debounce(function () {
      this.save();
    }, 4000)
  },
  mounted() {
    this.editor = new Editor({
      content: this.content,
      extensions: [
        new Blockquote(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new History(),
        new ListItem(),
        new OrderedList(),
        new BulletList(),
        new Strike(),
        new Underline(),
        new Table(),
        new TableCell(),
        new TableHeader(),
        new TableRow()
      ],
      onUpdate: ({ getHTML }) => {
        this.content = getHTML();
      }
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  components: {
    EditorContent,
    EditorMenuBar
  }
};
</script>

<style lang="scss" scoped>
.toolbar-button {
  min-width: 34px;
  height: 34px;
  background: #fff;
  border: none;

  .mdi {
    color: #333;
    font-size: 20px;
    line-height: 20px;
    vertical-align: top;
  }
}

.editor {
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 3px;

  ::v-deep .ProseMirror {
    min-height: 300px;
    padding: 10px;

    &:focus {
      outline: #ddd auto 1px;
    }

    p {
      margin: 0;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>
