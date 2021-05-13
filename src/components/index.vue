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
      <bubble-menu-content v-if="editor" :editor="editor" />
    </template>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import { FontSize, Image, Indent, TextColor, TextHighlight } from '../extensions';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import BubbleMenuContent from './BubbleMenu/index.vue';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import debounce from 'lodash/debounce';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import FontFamily from '@tiptap/extension-font-family';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

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
        BubbleMenu,
        Blockquote,
        Bold,
        BulletList,
        Code,
        CodeBlock,
        Document,
        Dropcursor,
        Gapcursor,
        HardBreak,
        Heading,
        History,
        HorizontalRule,
        Indent,
        Image,
        Italic,
        ListItem,
        Link.configure({ openOnClick: false }),
        OrderedList,
        Paragraph,
        Strike,
        Text,
        TextStyle,
        FontFamily,
        FontSize,
        Underline,
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        TextAlign,
        TextColor,
        TextHighlight
      ],
      onUpdate: () => {
        this.content = this.editor.getHTML();
      }
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  components: {
    EditorContent,
    BubbleMenuContent
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
      display: inline-block;
      width: 100%;
      min-height: 10rem;
      padding: 10px;
      flex-direction: column;

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
      }

      &:focus {
        outline: none;
      }

      p {
        margin: 0 0 1rem 0;

        &:focus {
          outline: none;
        }
      }

      table {
        width: 100%;
        margin: 0;
        border-collapse: collapse;
        table-layout: fixed;
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
