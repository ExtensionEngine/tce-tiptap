import applyMark from '../utils/apply-mark';
import { isHexColor } from '../utils/color';
import { Mark } from 'tiptap';

export default class TextColor extends Mark {
  get name() {
    return 'textColor';
  }

  get schema() {
    return {
      attrs: {
        color: ''
      },
      inline: true,
      group: 'inline',
      parseDOM: [{
        style: 'color',
        getAttrs: color => {
          return {
            color
          };
        }
      }],
      toDOM(node) {
        const { color } = node.attrs;
        let style = '';
        if (color) {
          style += `color: ${color};`;
        }
        return ['span', { style }, 0];
      }
    };
  }

  commands() {
    return color => (state, dispatch) => {
      if (color !== undefined) {
        const { schema } = state;
        let { tr } = state;
        const markType = schema.marks.textColor;
        const attrs = color && isHexColor(color) ? { color } : null;
        tr = applyMark(
          state.tr.setSelection(state.selection),
          markType,
          attrs
        );
        if (tr.docChanged || tr.storedMarksSet) {
          dispatch && dispatch(tr);
          return true;
        }
      }
      return false;
    };
  }
}
