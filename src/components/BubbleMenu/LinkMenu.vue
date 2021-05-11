<template>
  <div class="d-flex">
    <link-button
      :editor="editor"
      :icon="isLinkSelection ? 'pencil' : 'link'" />
    <template v-if="isLinkSelection">
      <menu-button
        @click="openLink"
        icon="eye"
        class="menu-button" />
      <menu-button
        @click="removeLink"
        icon="link-off"
        class="menu-button" />
      <v-divider
        class="mx-1"
        vertical />
    </template>
  </div>
</template>

<script>
import LinkButton from '../MenuButtons/Link.vue';
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-link-menu',
  props: {
    editor: { type: Object, required: true },
    isLinkSelection: { type: Boolean, required: true }
  },
  methods: {
    openLink() {
      window.open(this.linkAttributes.href, '_blank');
    },
    removeLink() {
      this.editor.chain().focus().unsetLink();
    }
  },
  components: {
    LinkButton,
    MenuButton
  }
};
</script>
