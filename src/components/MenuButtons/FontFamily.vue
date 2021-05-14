<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        v-bind="attrs"
        :is-active="!!editor.getAttributes('textStyle').fontFamily"
        icon="format-font">
        <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
      </menu-button>
    </template>
    <v-list dense class="font-types">
      <v-list-item-group v-model="font">
        <v-list-item
          v-for="fontFamily in fontFamilies"
          :key="fontFamily"
          :value="fontFamily"
          :class="{ 'active': editor.isActive('textStyle', { fontFamily }) }">
          <v-list-item-title>
            <span :style="`font-family: ${fontFamily}`">{{ fontFamily }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import MenuButton from '../MenuButton.vue';

const fontFamilies = () => [
  'Arial',
  'Arial Black',
  'Georgia',
  'Impact',
  'Tahoma',
  'Times New Roman',
  'Verdana',
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace'
];

export default {
  name: 'tce-tiptap-font-family',
  props: { editor: { type: Object, required: true } },
  data: () => ({ font: '' }),
  computed: { fontFamilies },
  methods: {
    toggleFontFamily(font) {
      this.editor.chain().focus().setFontFamily(font).run();
    }
  },
  watch: { font: 'toggleFontFamily' },
  components: { MenuButton }
};
</script>

<style lang="scss" scoped>
.font-types.v-list .v-list-item.active {
  color: #ff6590 !important;

  &::before {
    opacity: 0.12;
  }
}
</style>
