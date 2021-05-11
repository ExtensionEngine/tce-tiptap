<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="editor.isActive('heading')"
        v-bind="attrs"
        icon="format-pilcrow" />
    </template>
    <v-list dense class="headings">
      <v-list-item-group v-model="level">
        <v-list-item :value="0">Normal</v-list-item>
        <v-list-item
          v-for="l in [1, 2, 3, 4, 5, 6]"
          :key="l"
          :value="l"
          :class="{ 'active': editor.isActive('heading', { level: l }) }">
          <v-list-item-title>
            <component :is="`h${l}`">Heading {{ l }}</component>
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-heading',
  props: {
    editor: { type: Object, required: true }
  },
  data: () => ({ level: 0 }),
  methods: {
    toggleHeading(level) {
      if (level) return this.editor.chain().focus().toggleHeading({ level }).run();
      this.editor.commands.setNode('paragraph');
    }
  },
  watch: {
    level: 'toggleHeading'
  },
  components: {
    MenuButton
  }
};
</script>
<style lang="scss" scoped>
.headings.v-list .v-list-item.active {
  color: #ff6590 !important;

  &::before {
    opacity: 0.12;
  }
}
</style>
