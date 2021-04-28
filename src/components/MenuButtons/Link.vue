<template>
  <v-menu
    v-model="menu"
    transition="slide-y-transition"
    :close-on-content-click="false"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="isActive"
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
        <v-btn @click="save(command)" text>Save</v-btn>
        <v-btn v-if="linkAttributes.href" @click="remove" text>
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
    command: { type: Function, required: true },
    isActive: { type: Boolean, default: false },
    linkAttributes: { type: Object, required: true },
    icon: { type: String, required: true }
  },
  data: () => ({
    url: null,
    newTab: true,
    menu: false
  }),
  methods: {
    openMenu({ href, target }) {
      this.url = href;
      this.newTab = target === '_blank';
      this.isMenuOpen = true;
      this.$nextTick(() => {
        this.$refs.url.focus();
      });
    },
    close() {
      this.url = null;
      this.menu = false;
    },
    save() {
      this.command({ href: this.url, target: this.newTab ? '_blank' : '_self' });
      this.close();
    },
    remove() {
      this.command({ href: null, target: null });
      this.close();
    }
  },
  watch: {
    menu() {
      this.url = this.linkAttributes.href;
      this.newTab = this.linkAttributes.target === '_blank';
      this.$nextTick(() => {
        this.$refs.url.focus();
      });
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
