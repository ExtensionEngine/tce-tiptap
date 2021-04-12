<template>
  <div class="d-flex">
    <link-button
      :command="editorContext.commands.link"
      :is-active="editorContext.isActive.link()"
      :link-attributes="linkAttributes"
      :icon="isLinkSelection ? 'pencil' : 'link'" />
    <template v-if="isLinkSelection">
      <menu-button
        :command="openLink"
        icon="eye"
        class="menu-button" />
      <menu-button
        :command="removeLink"
        icon="link-off"
        class="menu-button" />
      <v-divider
        class="mx-1"
        vertical />
    </template>
  </div>
</template>

<script>
import LinkButton from '../MenuButtons/Link';
import MenuButton from '../MenuButton';

export default {
  props: {
    editorContext: { type: Object, required: true },
    isLinkSelection: { type: Boolean, required: true }
  },
  computed: {
    linkAttributes() {
      return this.editorContext.getMarkAttrs('link');
    }
  },
  methods: {
    openLink() {
      window.open(this.linkAttributes.href, '_blank');
    },
    removeLink() {
      this.editorContext.commands.link({ href: null, target: null });
    }
  },
  components: {
    LinkButton,
    MenuButton
  }
};
</script>
