<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        v-bind="attrs"
        icon="image-text" />
    </template>
    <v-list dense class="font-sizes">
      <v-list-item-group v-model="display">
        <v-list-item
          v-for="alignment in alignments"
          :key="alignment"
          :value="alignment">
          <v-list-item-title>
            {{ alignment }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { ImageDisplay, updateAttrs } from '../../../extensions/image';
import MenuButton from '../../MenuButton.vue';

export default {
  name: 'tce-tiptap-image-display',
  props: {
    node: { type: Object, required: true },
    editorContext: { type: Object, required: true }
  },
  data: () => ({ display: '' }),
  computed: {
    editor: ({ editorContext: { editor } }) => editor,
    alignments: () => Object.values(ImageDisplay)
  },
  methods: {
    updateAligment(display) {
      updateAttrs({ display }, this.editor, this.node);
    }
  },
  watch: {
    display: 'updateAligment'
  },
  components: {
    MenuButton
  }
};
</script>
