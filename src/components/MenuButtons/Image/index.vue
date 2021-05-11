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
        icon="image-plus" />
    </template>
    <v-card min-width="300">
      <v-card-text class="pb-0">
        <v-text-field
          ref="imageUrl"
          v-model="imageUrl"
          label="Url"
          placeholder="https://example.com"
          type="url" />
        <v-text-field
          v-model="alt"
          label="Alt text" />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer />
        <v-btn @click="save" :disabled="!imageUrl" text>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import MenuButton from '../../MenuButton.vue';

export default {
  name: 'tce-tiptap-image',
  props: {
    editor: { type: Object, required: true }
  },
  data: () => ({
    menu: false,
    imageUrl: '',
    alt: ''
  }),
  methods: {
    save() {
      const { imageUrl: src, alt } = this;
      console.log(src);
      this.menu = false;
      this.editor.chain().focus().setImage({ src, alt }).run();
    }
  },
  components: {
    MenuButton
  }
};
</script>
