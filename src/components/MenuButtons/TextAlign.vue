<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        v-bind="attrs"
        icon="format-align-left" />
    </template>
    <v-list dense class="text-alignment">
      <v-list-item-group v-model="alignment">
        <v-list-item
          v-for="it in alignments"
          :key="it"
          :value="it"
          :class="{ 'active': isTextAlignActive(editor.state, it)}">
          <v-list-item-title>
            <menu-button
              :command="editorContext.commands[`align_${it}`]"
              :is-active="isTextAlignActive(editor.state, it)"
              :icon="`format-align-${it}`" />
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { isTextAlignActive } from '../../extensions/text-align';
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-heading',
  props: {
    editorContext: { type: Object, required: true }
  },
  data: () => ({ alignment: 'left' }),
  computed: {
    editor: ({ editorContext: { editor } }) => editor,
    alignments: ({ editor }) => editor.extensions.options.textAlign.alignments
  },
  methods: {
    isTextAlignActive
  },
  components: {
    MenuButton
  }
};
</script>

<style lang="scss" scoped>
.text-alignment.v-list .v-list-item.active {
  color: #ff6590 !important;

  &::before {
    opacity: 0.12;
  }
}
</style>
