<template>
  <div class="d-flex">
    <image-display
      :editor="editor" />
    <image-edit
      :editor="editor" />
    <image-remove
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
    editor: { type: Object, required: true }
  },
  components: {
    ImageDisplay,
    ImageEdit,
    ImageRemove
  }
};
</script>
