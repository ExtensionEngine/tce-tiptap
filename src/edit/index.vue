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
    <template v-else>
      <editor-content :editor="editor" class="editor" />
      <bubble-menu :editor="editor" />
    </template>
  </div>
</template>

<script>
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  HardBreak,
  History,
  HorizontalRule,
  Italic,
  ListItem,
  OrderedList,
  Strike,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Underline
} from 'tiptap-extensions';
import {
  ClearFormat,
  FontSize,
  FontType,
  Heading,
  Link,
  TextColor,
  TextHighlight
} from './extensions';
import { Editor, EditorContent } from 'tiptap';
import BubbleMenu from './BubbleMenu/index';
import debounce from 'lodash/debounce';

export default {
  name: 'tce-tiptap-html',
  inject: ['$elementBus'],
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
      this.$elementBus.emit('tiptap-editor', this.editor);
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
        new ClearFormat(),
        new Italic(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3, 4, 5] }),
        new HorizontalRule(),
        new History(),
        new ListItem(),
        new OrderedList(),
        new BulletList(),
        new Strike(),
        new Underline(),
        new Table(),
        new TableCell(),
        new TableHeader(),
        new TableRow(),
        new Link(),
        new FontSize(),
        new FontType(),
        new TextColor(),
        new TextHighlight()
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
    BubbleMenu
  }
};
</script>

<style lang="scss" scoped>
$min-width: 11.25rem;
$min-height: 8.75rem;
$min-height-sm: 5.5rem;
$borderSize: 6px;
$tooltipColor: #37474f;

.tiptap-html-placeholder {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: $min-height;
  margin-bottom: 0;
  padding: 0.5rem 0 0;

  .placeholder-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3.75rem;
    height: 3.75rem;
    padding-top: 0.125rem;
    color: #f1f1f1;
    font-size: 2rem;
    line-height: 2rem;
    background: #263238;
    border-radius: 50%;

    .divider {
      font-size: 0.75rem;
    }
  }

  .message {
    padding: 0.5rem 0;
    text-align: center;
    font-family: Roboto, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.75rem;

    span {
      display: block;
    }

    .heading {
      padding: 0.5rem 0;
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }
}

.editor {
  text-align: left;

  ::v-deep {
    .ProseMirror {
      min-height: 10rem;
      padding: 10px;

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
      }

      &:focus {
        outline: none;
      }

      p {
        margin: 0;

        &:focus {
          outline: none;
        }
      }

      table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        margin: 0;
        overflow: hidden;

        td, th {
          position: relative;
          min-width: 1em;
          padding: 3px 5px;
          border: 1px solid #ddd;
          vertical-align: top;
          box-sizing: border-box;

          > * {
            margin-bottom: 0;
          }
        }

        th {
          font-weight: bold;
          text-align: left;
        }

        .selectedCell::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(200, 200, 255, 0.4);
          z-index: 2;
          pointer-events: none;
        }

        .column-resize-handle {
          position: absolute;
          top: 0;
          right: -2px;
          bottom: 0;
          width: 4px;
          background-color: #adf;
          z-index: 20;
          pointer-events: none;
        }
      }
    }
  }
}
</style>
