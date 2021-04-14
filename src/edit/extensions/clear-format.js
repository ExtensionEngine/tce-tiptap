import { Extension } from 'tiptap';
import { setTextAlign } from '../utils/text-align';
import { setTextLineHeight } from '../utils/line-height';

const FORMAT_MARKS = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strike',
  link: 'link',
  textColor: 'text_color',
  textHighlight: 'text_highlight',
  fontSize: 'fontSize',
  fontType: 'fontType'
};

export function clearMarks(tr, schema) {
  const { doc, selection } = tr;
  if (!selection || !doc) return tr;

  const { from, to, empty } = selection;
  if (empty) return tr;

  const markTypesToRemove = new Set(
    Object.values(FORMAT_MARKS).map(n => schema.marks[n]).filter(Boolean)
  );

  if (!markTypesToRemove.size) return tr;

  const tasks = [];
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.marks && node.marks.length) {
      node.marks.some(mark => {
        if (markTypesToRemove.has(mark.type)) {
          tasks.push({ node, pos, mark });
        }
      });
      return true;
    }
    return true;
  });

  tasks.forEach(job => {
    const { node, mark, pos } = job;
    tr = tr.removeMark(pos, pos + node.nodeSize, mark.type);
  });

  tr = setTextAlign(tr, null);
  tr = setTextLineHeight(tr, null);

  return tr;
}

export default class FormatClear extends Extension {
  get name() {
    return 'clearFormat';
  }

  commands() {
    return () => (state, dispatch) => {
      const tr = clearMarks(state.tr.setSelection(state.selection), state.schema);

      if (dispatch && tr.docChanged) {
        dispatch(tr);
        return true;
      }
      return false;
    };
  }
}
