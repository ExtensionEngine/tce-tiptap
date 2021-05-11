<template>
  <div>
    <menu-button :command="() => removeImage()" icon="delete" />
  </div>
</template>

<script>
import { deleteSelection } from 'prosemirror-commands';
import MenuButton from '../../MenuButton.vue';

export default {
  name: 'tce-tiptap-remove-image',
  props: {
    node: { type: Object, required: true },
    editor: { type: Object, required: true }
  },
  methods: {
    removeImage() {
      const { state, dispatch } = this.editor.view;
      deleteSelection(state, dispatch);
    }
  },
  components: { MenuButton }
};
</script>
