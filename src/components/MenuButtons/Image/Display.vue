<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        v-bind="attrs"
        icon="image-text"
        tooltip="Align image" />
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
import MenuButton from '../../MenuButton.vue';

export default {
  name: 'tce-tiptap-image-display',
  props: {
    editor: { type: Object, required: true }
  },
  data: () => ({ display: '' }),
  computed: {
    alignments: () => ['inline', 'block', 'left', 'right']
  },
  methods: {
    updateAligment(display) {
      this.editor.commands.updateAttributes('image', { display });
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
