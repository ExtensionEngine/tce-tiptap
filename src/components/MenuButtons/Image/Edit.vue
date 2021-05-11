<template>
  <v-menu
    v-model="menu"
    transition="slide-y-transition"
    :close-on-content-click="false"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        v-bind="attrs"
        icon="image-edit" />
    </template>
    <v-card min-width="300">
      <v-card-text class="pb-0">
        <v-text-field
          v-model="imageAttrs.src"
          disabled
          label="Image url"
          placeholder="https://example.com"
          type="url" />
        <v-text-field
          v-model="imageAttrs.alt"
          label="Alt text"
          type="text" />
        <v-text-field
          v-model="imageAttrs.width"
          label="Width"
          placeholder="https://example.com"
          type="number" />
        <v-text-field
          v-model="imageAttrs.height"
          label="Height"
          placeholder="https://example.com"
          type="number" />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer />
        <v-btn @click="save" text>
          Save
        </v-btn>
        <v-btn @click="close" text>
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import MenuButton from '../../MenuButton.vue';
import { updateAttrs } from '../../../extensions/image';

export default {
  name: 'tce-tiptap-image-edit',
  props: {
    node: { type: Object, required: true },
    editor: { type: Object, required: true }
  },
  data: () => ({
    imageAttrs: {},
    menu: false
  }),
  methods: {
    save() {
      updateAttrs(this.imageAttrs, this.editor, this.node);
      this.close();
    },
    close() {
      this.imageAttrs = {};
      this.menu = false;
    }
  },
  async created() {
    this.imageAttrs = { ...this.node.attrs };
  },
  components: {
    MenuButton
  }
};
</script>
