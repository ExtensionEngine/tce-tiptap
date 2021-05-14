import { Extension } from '@tiptap/core';

export const FONT_SIZES = [
  '8',
  '10',
  '12',
  '14',
  '16',
  '18',
  '20',
  '24',
  '30',
  '36',
  '48',
  '60',
  '72'
];

export default Extension.create({
  name: 'fontSize',

  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}px`
              };
            },
            parseHTML: element => ({
              fontSize: element.style.fontSize.replace(/['"px]+/g, '')
            })
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      }
    };
  }
});
