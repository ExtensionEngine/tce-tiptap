import { Extension, getNodeAttributes } from '@tiptap/core';

export default Extension.create({
  name: 'indent',

  defaultOptions: {
    types: ['heading', 'paragraph']
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          marginLeft: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.marginLeft) {
                return {};
              }

              return {
                style: `margin-left: ${attributes.marginLeft}px`
              };
            },
            parseHTML: element => {
              return {
                marginLeft: Number(element.style.marginLeft.replace(/['"px]+/g, ''))
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      indent: value => ({ commands, state }) => {
        return this.options.types.every(type => {
          let { marginLeft = 0 } = getNodeAttributes(state, type);
          marginLeft = marginLeft + value;
          if (marginLeft > 200) marginLeft = 200;
          return commands.updateAttributes(type, { marginLeft });
        });
      },
      outdent: value => ({ commands, state }) => {
        return this.options.types.every(type => {
          let { marginLeft = 0 } = getNodeAttributes(state, type);
          marginLeft = marginLeft - value;
          if (marginLeft < 0) return this.options.types.every(type => commands.resetAttributes(type, 'marginLeft'));
          return commands.updateAttributes(type, { marginLeft });
        });
      }
    };
  }
});
