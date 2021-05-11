<template>
  <div class="d-flex">
    <image-display
      :node="node"
      :editor="editor" />
    <image-edit
      :node="node"
      :editor="editor" />
    <image-remove
      :node="node"
      :editor="editor" />
  </div>
</template>

<script>
import ImageDisplay from '../MenuButtons/Image/Display.vue';
import ImageEdit from '../MenuButtons/Image/Edit.vue';
import ImageRemove from '../MenuButtons/Image/Remove.vue';

export default {
  name: 'tce-tiptap-image-menu',
  props: {
    node: { type: Object, required: true },
    editor: { type: Object, required: true }
  },
  components: {
    ImageDisplay,
    ImageEdit,
    ImageRemove
  }
};
</script>
