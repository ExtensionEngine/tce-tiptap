import applyMark from '../utils/apply-mark';
import { isHexColor } from '../utils/color';
import { Mark } from 'tiptap';

export default class TextHighlight extends Mark {
  get name() {
    return 'textHighlight';
  }

  get schema() {
    return {
      attrs: {
        highlightColor: ''
      },
      inline: true,
      group: 'inline',
      parseDOM: [{
        tag: 'span[style*=background-color]',
        getAttrs: dom => {
          const { backgroundColor } = dom.style;

          return {
            highlightColor: backgroundColor
          };
        }
      }],
      toDOM(node) {
        const { highlightColor } = node.attrs;
        let style = '';
        if (highlightColor) {
          style += `background-color: ${highlightColor};`;
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
        const markType = schema.marks.textHighlight;
        const attrs = color && isHexColor(color) ? { highlightColor: color } : null;
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
