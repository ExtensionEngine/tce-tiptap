import Image from '@tiptap/extension-image';

export default Image.extend({
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      width: {
        default: 200
      },
      height: {
        default: 'auto'
      },
      display: {
        default: 'block',
        renderHTML: ({ display }) => {
          if (!display) {
            return {};
          }

          const options = {
            inline: 'display: inline',
            block: 'display: block',
            left: 'float: left',
            right: 'float: right'
          };

          return {
            style: options[display]
          };
        },
        parseHTML: element => {
          const display = element.style.float
            ? element.style.float.replace(/['"]+/g, '')
            : element.style.display.replace(/['"]+/g, '');
          return {
            display
          };
        }
      }
    };
  }
});
