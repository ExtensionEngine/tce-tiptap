<template>
  <div class="link-button">
    <menu-button
      :command="() => openMenu(linkAttributes)"
      :is-active="isActive"
      :icon="icon" />
    <v-form
      v-if="isMenuOpen"
      v-click-outside="closeMenu"
      @keydown.esc="closeMenu"
      @submit.prevent="save(command, url)"
      class="link-button-form">
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
          <v-btn @click="save(command)" text>
            Save
          </v-btn>
          <v-btn v-if="linkAttributes.href" @click="remove(command)" text>
            Remove
          </v-btn>
          <v-btn @click="closeMenu()" text>
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import MenuButton from '../MenuButton';

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
    isMenuOpen: false
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
    closeMenu() {
      this.url = null;
      this.isMenuOpen = false;
    },
    save(command) {
      command({ href: this.url, target: this.newTab ? '_blank' : '_self' });
      this.closeMenu();
    },
    remove(command) {
      command({ href: null, target: null });
      this.closeMenu();
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
