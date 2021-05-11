import ImageView from '../components/ExtensionViews/Image.vue';
import { Image as TiptapImage } from 'tiptap-extensions';

export const ImageDisplay = {
  INLINE: 'inline',
  BREAK_TEXT: 'block',
  FLOAT_LEFT: 'left',
  FLOAT_RIGHT: 'right'
};
export const DEFAULT_IMAGE_URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export const DEFAULT_IMAGE_WIDTH = 200;
export const DEFAULT_IMAGE_DISPLAY = ImageDisplay.INLINE;

export const updateAttrs = (attrs, editor, node) => {
  const { view } = editor;
  if (!view.editable) return;
  const { state } = view;
  const newAttrs = { ...node.attrs, ...attrs };
  const { from } = state.selection;
  const transaction = state.tr.setNodeMarkup(from, null, newAttrs);
  view.dispatch(transaction);
};

function getAttrs(dom) {
  const { cssFloat, display } = dom.style;
  let { width, height } = dom.style;

  let dp = dom.getAttribute('data-display') || dom.getAttribute('display');
  if (dp) {
    dp = /(inline|block|left|right)/.test(dp) ? dp : ImageDisplay.INLINE;
  } else if (cssFloat === 'left' && !display) {
    dp = ImageDisplay.FLOAT_LEFT;
  } else if (cssFloat === 'right' && !display) {
    dp = ImageDisplay.FLOAT_RIGHT;
  } else if (!cssFloat && display === 'block') {
    dp = ImageDisplay.BREAK_TEXT;
  } else {
    dp = ImageDisplay.INLINE;
  }

  width = width || dom.getAttribute('width') || null;
  height = height || dom.getAttribute('height') || null;

  return {
    src: dom.getAttribute('src') || '',
    title: dom.getAttribute('title') || '',
    alt: dom.getAttribute('alt') || '',
    width: !width ? null : parseInt(width, 10),
    height: !height ? null : parseInt(height, 10),
    display: dp
  };
}

function toDOM(node) {
  const { src, alt, width, height, display } = node.attrs;

  const attrs = {
    src,
    alt,
    width,
    height
  };

  attrs['data-display'] = display;
  attrs.class = 'test';

  return ['img', attrs];
}

export default class Image extends TiptapImage {
  get defaultOptions() {
    return {
      defaultWidth: DEFAULT_IMAGE_WIDTH,
      defaultDisplay: DEFAULT_IMAGE_DISPLAY,
      urlPattern: DEFAULT_IMAGE_URL_REGEX,
      uploadRequest: null
    };
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {
          default: ''
        },
        alt: {
          default: ''
        },
        width: {
          default: this.imageDefaultWidth > 0
            ? this.imageDefaultWidth
            : DEFAULT_IMAGE_WIDTH
        },
        height: {
          default: this.imageDefaultHeight > 0
            ? this.imageDefaultHeight
            : null
        },
        display: {
          default: /(inline|block|left|right)/.test(this.defaultDisplay)
            ? this.defaultDisplay
            : DEFAULT_IMAGE_DISPLAY
        }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [{ tag: 'img[src]', getAttrs }],
      toDOM
    };
  }

  get view() {
    return ImageView;
  }
}
