<template>
  <editor-content :editor="editor" />
</template>

<script>
import { Editor, EditorContent } from 'tiptap';

export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.editor = new Editor({
      content: '<p>This is just a boring paragraph</p>'
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  components: {
    EditorContent
  }
};
</script>
