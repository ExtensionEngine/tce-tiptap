import { transformCSStoLineHeight, transformLineHeightToCSS } from '../utils/line-height';
import { Paragraph as TiptapParagraph } from 'tiptap';

export const Alignment = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify'
};

export const ALIGN_PATTERN = new RegExp(`(${Alignment.left}|${Alignment.center}|${Alignment.right}|${Alignment.justify})`);

export const ParagraphNodeSpec = {
  attrs: {
    textAlign: { default: null },
    indent: { default: null },
    lineHeight: { default: null }
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [{
    tag: 'p',
    getAttrs
  }],
  toDOM
};

// @ts-ignore
function getAttrs(dom) {
  let {
    textAlign,
    lineHeight
  } = dom.style;

  let align = dom.getAttribute('data-text-align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  const indent = parseInt(dom.getAttribute('data-indent'), 10) || 0;

  lineHeight = transformCSStoLineHeight(lineHeight) || null;

  return {
    textAlign: align,
    indent,
    lineHeight
  };
}

function toDOM(node) {
  const {
    textAlign,
    indent,
    lineHeight
  } = node.attrs;

  let style = '';
  const attrs = {};

  if (textAlign && textAlign !== 'left') {
    style += `text-align: ${textAlign};`;
  }

  if (indent) {
    attrs['data-indent'] = indent;
  }

  if (lineHeight) {
    const cssLineHeight = transformLineHeightToCSS(lineHeight);
    style += `line-height: ${cssLineHeight};`;
  }

  style && (attrs.style = style);

  return ['p', attrs, 0];
}

export default class Paragraph extends TiptapParagraph {
  get defaultOptions() {
    return {
      px: 12
    };
  }

  get schema() {
    return ParagraphNodeSpec;
  }
}

export const toParagraphDOM = toDOM;
export const getParagraphNodeAttrs = getAttrs;
