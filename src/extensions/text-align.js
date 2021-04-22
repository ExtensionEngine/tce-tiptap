import { Extension } from 'tiptap';

export const Alignment = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify'
};
export const ALIGN_PATTERN = new RegExp(`(${Alignment.left}|${Alignment.center}|${Alignment.right}|${Alignment.justify})`);

export default class TextAlign extends Extension {
  get name() {
    return 'textAlign';
  }

  get defaultOptions() {
    return {
      alignments: [
        Alignment.left,
        Alignment.center,
        Alignment.right,
        Alignment.justify
      ]
    };
  }

  commands() {
    return this.options.alignments.reduce((commands, alignment) => {
      if (!ALIGN_PATTERN.test(alignment)) return commands;

      return {
        ...commands,
        [`align_${alignment}`]: () => (state, dispatch) => {
          const { selection } = state;
          const tr = setTextAlign(
            state.tr.setSelection(selection),
            alignment === 'left' ? null : alignment
          );

          if (tr.docChanged) {
            dispatch && dispatch(tr);
            return true;
          } else {
            return false;
          }
        }
      };
    }, {});
  }
}

export function isTextAlignActive(state, alignment) {
  const { selection, doc } = state;
  const { from, to } = selection;

  let keepLooking = true;
  let active = false;

  doc.nodesBetween(from, to, node => {
    if (keepLooking && node.attrs.textAlign === alignment) {
      keepLooking = false;
      active = true;
    }
    return keepLooking;
  });

  return active;
}

const ALLOWED_NODE_TYPES = [
  'paragraph',
  'heading',
  'list_item',
  'todo_item',
  'title'
];

export function setTextAlign(tr, alignment) {
  const { selection, doc } = tr;

  if (!selection || !doc) {
    return tr;
  }

  const { from, to } = selection;

  const tasks = [];
  alignment = alignment || null;

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    if (ALLOWED_NODE_TYPES.includes(nodeType.name)) {
      const align = node.attrs.textAlign || null;
      if (align !== alignment) {
        tasks.push({
          node,
          pos,
          nodeType
        });

        return nodeType.name !== 'list_item' && nodeType.name !== 'todo_item';
      }
    }
    return true;
  });

  if (!tasks.length) return tr;

  tasks.forEach(job => {
    const { node, pos, nodeType } = job;
    let { attrs } = node;
    attrs = {
      ...attrs,
      textAlign: alignment
    };

    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });

  return tr;
}
