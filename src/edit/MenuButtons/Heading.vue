<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="isHeadingActive()"
        v-bind="attrs"
        icon="format-pilcrow" />
    </template>
    <v-list dense class="font-sizes">
      <v-list-item-group v-model="level">
        <v-list-item
          :value="0"
          :class="{ 'active': isHeadingActive(0)}">
          Normal
        </v-list-item>
        <v-list-item
          v-for="l in levels"
          :key="l"
          :value="l"
          :class="{ 'active': isHeadingActive(l)}">
          <v-list-item-title>
            <component :is="`h${l}`">Heading {{ l }}</component>
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import {
  isHeadingActive
} from '../extensions/heading';
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-heading',
  props: {
    editorContext: { type: Object, required: true }
  },
  data: () => ({ level: 0 }),
  computed: {
    editor: ({ editorContext: { editor } }) => editor,
    levels: ({ editor }) => editor.extensions.options.heading.levels
  },
  methods: {
    isHeadingActive(level) {
      return isHeadingActive(this.editor.state, level);
    },
    toggleHeading(level) {
      level > 0
        ? this.editorContext.commands.heading({ level })
        : this.editorContext.commands.paragraph();
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
.font-sizes.v-list .v-list-item.active {
  color: #ff6590 !important;

  &::before {
    opacity: 0.12;
  }
}
</style>
