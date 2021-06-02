import { Mark, mergeAttributes } from '@tiptap/core';

export default Mark.create({
  name: 'superscript',
  defaultOptions: {
    HTMLAttributes: {}
  },
  parseHTML() {
    return [
      { tag: 'sup' },
      {
        style: 'vertical-align',
        getAttrs: value => value === 'super'
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['sup', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setSuperscript: () => ({ commands }) => {
        return commands.setMark('superscript');
      },
      toggleSuperscript: () => ({ commands }) => {
        return commands.toggleMark('superscript');
      },
      unsetSuperscript: () => ({ commands }) => {
        return commands.unsetMark('superscript');
      }
    };
  }
});
