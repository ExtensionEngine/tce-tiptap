import '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'textHighlight',

  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`
              };
            },
            parseHTML: element => ({
              backgroundColor: element.style.backgroundColor.replace(/['"]+/g, '')
            })
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setTextHighlight: backgroundColor => ({ chain }) => {
        return chain()
          .setMark('textStyle', { backgroundColor })
          .run();
      },
      unsetTextHighlight: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { backgroundColor: null })
          .removeEmptyTextStyle()
          .run();
      }
    };
  }
});
