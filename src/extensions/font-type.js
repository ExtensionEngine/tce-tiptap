
import { AllSelection, TextSelection } from 'prosemirror-state';
import { applyMark } from '../utils';
import { getMarkAttrs } from 'tiptap-utils';
import { Mark } from 'tiptap';

export const FONT_TYPES = [
  'Arial',
  'Arial Black',
  'Georgia',
  'Impact',
  'Tahoma',
  'Times New Roman',
  'Verdana',
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace'
].reduce((acc, font) => {
  acc[font] = font;
  return acc;
}, {});

const DEFAULT_FONT = '';

export default class FontType extends Mark {
  get name() {
    return 'fontType';
  }

  get defaultOptions() {
    return {
      fontTypes: FONT_TYPES
    };
  }

  get schema() {
    return {
      attrs: {
        name: ''
      },
      inline: true,
      group: 'inline',
      parseDOM: [
        {
          style: 'font-family',
          getAttrs: name => {
            return {
              name: name ? name.replace(/["']/g, '') : ''
            };
          }
        }
      ],
      toDOM(node) {
        const { name } = node.attrs;
        const attrs = {};

        if (name) {
          attrs.style = `font-family: ${name}`;
        }
        return ['span', attrs, 0];
      }
    };
  }

  commands({ type }) {
    return name => (state, dispatch) => {
      let { tr } = state;
      tr = setFontType(
        state.tr.setSelection(state.selection),
        type,
        name
      );
      if (tr.docChanged || tr.storedMarksSet) {
        dispatch && dispatch(tr);
        return true;
      }
      return false;
    };
  }
}

export function findActiveFontType(state) {
  const { schema, selection } = state;
  const markType = schema.marks.fontType;
  if (!markType) return DEFAULT_FONT;
  if (selection.empty) return resolveEmptySelection(state, markType);
  const attrs = getMarkAttrs(state, markType);
  const fontName = attrs.name;
  if (!fontName) return DEFAULT_FONT;
  return fontName;
}

function setFontType(tr, type, name) {
  const { selection } = tr;
  if (!isCorrectSelection(selection)) return tr;
  const attrs = name ? { name } : null;
  tr = applyMark(tr, type, attrs);
  return tr;
}

function resolveEmptySelection(state, markType) {
  const { tr, selection } = state;
  const storedMarks = tr.storedMarks ||
    state.storedMarks ||
    (
      selection instanceof TextSelection &&
      selection.$cursor &&
      selection.$cursor.marks &&
      selection.$cursor.marks()
    ) ||
    [];

  const sm = storedMarks.find(m => m.type === markType);
  return (sm && sm.attrs.name) || DEFAULT_FONT;
}

const isCorrectSelection = selection =>
  selection instanceof TextSelection || selection instanceof AllSelection;
