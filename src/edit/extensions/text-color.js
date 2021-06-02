import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'textColor',

  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.color) {
                return {};
              }

              return {
                style: `color: ${attributes.color}`
              };
            },
            parseHTML: element => ({
              color: element.style.color.replace(/['"]+/g, '')
            })
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setTextColor: color => ({ chain }) => {
        return chain()
          .setMark('textStyle', { color })
          .run();
      },
      unsetTextColor: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { color: null })
          .removeEmptyTextStyle()
          .run();
      }
    };
  }
});
