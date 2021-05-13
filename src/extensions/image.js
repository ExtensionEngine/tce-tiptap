import Image from '@tiptap/extension-image';
import ImageView from '../components/ExtensionViews/Image.vue';
import { VueNodeViewRenderer } from '@tiptap/vue-2';

export const ImageDisplay = {
  INLINE: 'inline',
  BREAK_TEXT: 'block',
  FLOAT_LEFT: 'left',
  FLOAT_RIGHT: 'right'
};
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
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageView);
  }
});
