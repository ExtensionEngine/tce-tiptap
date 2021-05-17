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
        icon="image-edit"
        tooltip="Edit image" />
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

export default {
  name: 'tce-tiptap-image-edit',
  props: {
    editor: { type: Object, required: true }
  },
  data: () => ({
    imageAttrs: {},
    menu: false
  }),
  methods: {
    save() {
      this.editor.commands.updateAttributes('image', this.imageAttrs);
      this.close();
    },
    close() {
      this.menu = false;
    }
  },
  created() {
    this.imageAttrs = this.editor.getAttributes('image');
  },
  components: {
    MenuButton
  }
};
</script>
