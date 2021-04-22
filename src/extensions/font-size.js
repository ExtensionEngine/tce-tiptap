import { AllSelection, TextSelection } from 'prosemirror-state';
import { applyMark } from '../utils';
import { getMarkAttrs } from 'tiptap-utils';
import { Mark } from 'tiptap';

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

export const DEFAULT_FONT_SIZE = 'default';

export default class FontSize extends Mark {
  get name() {
    return 'fontSize';
  }

  get defaultOptions() {
    return {
      fontSizes: FONT_SIZES
    };
  }

  get schema() {
    return {
      attrs: { px: '' },
      inline: true,
      group: 'inline',
      parseDOM: [
        {
          style: 'font-size',
          getAttrs: fontSize => {
            const attrs = {};
            if (!fontSize) return attrs;
            const px = convertToPX(fontSize);
            if (!px) return attrs;
            return { px };
          }
        }
      ],
      toDOM(node) {
        const { px } = node.attrs;
        const attrs = {};
        if (px) attrs.style = `font-size: ${px}px`;
        return ['span', attrs, 0];
      }
    };
  }

  commands({ type }) {
    return fontSize => (state, dispatch) => {
      let { tr } = state;
      tr = setFontSize(
        state.tr.setSelection(state.selection),
        type,
        fontSize
      );
      if (tr.docChanged || tr.storedMarksSet) {
        dispatch && dispatch(tr);
        return true;
      }
      return false;
    };
  }
}

const SIZE_PATTERN = /([\d.]+)px/i;

export function convertToPX(styleValue) {
  const matches = styleValue.match(SIZE_PATTERN);
  if (!matches) return '';
  const value = matches[1];
  if (!value) return '';
  return value;
}

export function setFontSize(tr, type, fontSize) {
  const { selection } = tr;
  if (!isCorrectSelection(selection)) return tr;
  const attrs = (fontSize && fontSize !== DEFAULT_FONT_SIZE)
    ? { px: fontSize }
    : null;
  tr = applyMark(tr, type, attrs);
  return tr;
}

export function findActiveFontSize(state) {
  const { schema, selection } = state;
  const markType = schema.marks.fontSize;
  if (!markType) return DEFAULT_FONT_SIZE;
  if (selection.empty) return resolveEmptyState(state, markType);
  const attrs = getMarkAttrs(state, markType);
  const fontSize = attrs.px;
  if (fontSize) return String(fontSize);
  return DEFAULT_FONT_SIZE;
}

function resolveEmptyState(state, markType) {
  const { selection, tr } = state;
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
  return sm ? String(sm.attrs.px || DEFAULT_FONT_SIZE) : DEFAULT_FONT_SIZE;
}

const isCorrectSelection = selection =>
  selection instanceof TextSelection || selection instanceof AllSelection;
