<template>
  <v-menu
    v-model="menu"
    transition="slide-y-transition"
    :close-on-content-click="false"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="editor.isActive('image')"
        v-bind="attrs"
        icon="image-plus" />
    </template>
    <v-card min-width="300">
      <v-card-text class="pb-0">
        <v-text-field
          ref="imageUrl"
          v-model="imageAttrs.src"
          label="Url"
          :disabled="!!imageAttrs.src"
          placeholder="https://example.com"
          type="url" />
        <v-text-field
          v-model="imageAttrs.alt"
          label="Alt text" />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer />
        <v-btn @click="save" :disabled="!!imageAttrs.src" text>
          Save
        </v-btn>
        <v-btn @click="menu = false" text>
          Close
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
    imageAttrs: {
      src: null,
      alt: null
    }
  }),
  methods: {
    save() {
      this.menu = false;
      this.editor.chain().focus().setImage(this.imageAttrs).run();
    }
  },
  watch: {
    menu() {
      console.log(this.editor.getAttributes('image'));
      this.imageAttrs = this.editor.getAttributes('image');
    }
  },
  components: {
    MenuButton
  }
};
</script>
