<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        v-bind="attrs"
        icon="format-align-left"
        tooltip="Align text">
        <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
      </menu-button>
    </template>
    <v-list dense class="text-alignment">
      <v-list-item-group v-model="alignment">
        <v-list-item
          v-for="it in alignments"
          :key="it"
          :value="it"
          :class="{ 'active': editor.isActive({ textAlign: it }) }">
          <v-list-item-title>
            <menu-button
              @click="editor.chain().focus().setTextAlign(it).run()"
              :is-active="editor.isActive({ textAlign: it }) "
              :icon="`format-align-${it}`" />
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import MenuButton from '../MenuButton.vue';

export default {
  name: 'tce-tiptap-text-align',
  props: {
    editor: { type: Object, required: true }
  },
  data: () => ({ alignment: 'left' }),
  computed: {
    alignments: () => ['left', 'center', 'right', 'justify']
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
