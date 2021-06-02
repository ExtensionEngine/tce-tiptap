import { Mark, mergeAttributes } from '@tiptap/core';

export default Mark.create({
  name: 'subscript',
  defaultOptions: {
    HTMLAttributes: {}
  },
  parseHTML() {
    return [
      { tag: 'sub' },
      {
        style: 'vertical-align',
        getAttrs: value => value === 'sub'
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['sub', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setSubscript: () => ({ commands }) => {
        return commands.setMark('subscript');
      },
      toggleSubscript: () => ({ commands }) => {
        return commands.toggleMark('subscript');
      },
      unsetSubscript: () => ({ commands }) => {
        return commands.unsetMark('subscript');
      }
    };
  }
});
