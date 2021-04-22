
import { AllSelection, TextSelection } from 'prosemirror-state';
import { Extension } from 'tiptap';
import { isListNode } from '../utils/list';

function clamp(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

export const IndentProps = {
  max: 7,
  min: 0,
  more: 1,
  less: -1
};

function updateIndentLevel(tr, delta) {
  const { doc, selection } = tr;

  if (!doc || !selection) return tr;

  if (!(selection instanceof TextSelection || selection instanceof AllSelection)) {
    return tr;
  }

  const { from, to } = selection;

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;

    if (
      nodeType.name === 'paragraph' ||
      nodeType.name === 'heading' ||
      nodeType.name === 'blockquote'
    ) {
      tr = setNodeIndentMarkup(tr, pos, delta);
      return false;
    } else if (isListNode(node)) {
      return false;
    }
    return true;
  });

  return tr;
}

function setNodeIndentMarkup(tr, pos, delta) {
  if (!tr.doc) return tr;

  const node = tr.doc.nodeAt(pos);
  if (!node) return tr;

  const minIndent = IndentProps.min;
  const maxIndent = IndentProps.max;

  const indent = clamp(
    (node.attrs.indent || 0) + delta,
    minIndent,
    maxIndent
  );

  if (indent === node.attrs.indent) return tr;

  const nodeAttrs = {
    ...node.attrs,
    indent
  };

  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
}

function createIndentCommand(delta) {
  return (state, dispatch) => {
    const { selection } = state;
    let { tr } = state;
    tr = tr.setSelection(selection);
    tr = updateIndentLevel(tr, delta);

    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    }

    return false;
  };
}

export default class Indent extends Extension {
  get name() {
    return 'indent';
  }

  get defaultOptions() {
    return {
      minIndent: IndentProps.min,
      maxIndent: IndentProps.max
    };
  }

  commands() {
    return {
      indent: () => createIndentCommand(IndentProps.more),
      outdent: () => createIndentCommand(IndentProps.less)
    };
  }

  keys() {
    return {
      Tab: createIndentCommand(IndentProps.more),
      'Shift-Tab': createIndentCommand(IndentProps.less)
    };
  }
}
