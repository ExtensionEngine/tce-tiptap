<template>
  <v-menu
    ref="menu"
    v-model="menu"
    transition="slide-y-transition"
    :close-on-content-click="false"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="editor.isActive('link')"
        v-bind="attrs"
        :icon="icon" />
    </template>
    <v-card min-width="300">
      <v-card-text class="pb-0">
        <v-text-field
          ref="url"
          v-model="url"
          label="Url"
          placeholder="https://example.com"
          type="url" />
        <v-checkbox
          v-model="newTab"
          label="Open in new tab"
          type="checkbox" />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer />
        <v-btn @click="save()" text>Save</v-btn>
        <v-btn v-if="url" @click="remove" text>
          Remove
        </v-btn>
        <v-btn @click="close()" text>Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-link-button',
  props: {
    editor: { type: Object, required: true },
    icon: { type: String, required: true }
  },
  data: () => ({
    url: null,
    newTab: true,
    menu: false
  }),
  methods: {
    close() {
      this.url = null;
      this.menu = false;
    },
    save() {
      this.editor.chain().focus()
        .setLink({ href: this.url, target: this.newTab ? '_blank' : '_self' }
        ).run();
      this.close();
    },
    remove() {
      this.editor.chain().focus().unsetLink();
      this.close();
    }
  },
  watch: {
    menu() {
      this.editor.view.dom.blur();
      const attributes = this.editor.getAttributes('link');
      this.url = attributes.href || null;
      this.newTab = attributes && attributes.target === '_blank';
      this.$nextTick(() => this.$refs.menu.$el.focus());
    }
  },
  components: {
    MenuButton
  }
};
</script>

<style lang="scss" scoped>
.link-button {
  position: relative;

  &-form {
    display: flex;
    position: absolute;
    min-width: 300px;
  }
}
</style>
