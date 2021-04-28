<template>
  <div class="d-flex">
    <image-display
      :node="node"
      :editor-context="editorContext" />
    <image-edit
      :node="node"
      :editor-context="editorContext" />
    <image-remove
      :node="node"
      :editor-context="editorContext" />
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
    editorContext: { type: Object, required: true }
  },
  components: {
    ImageDisplay,
    ImageEdit,
    ImageRemove
  }
};
</script>
