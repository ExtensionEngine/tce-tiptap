<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="isActive"
        v-bind="attrs"
        icon="table" />
    </template>
    <v-list dense>
      <v-menu>
        <template #activator="{ on, attrs }">
          <v-list-item
            v-on="on"
            :is-active="isActive"
            v-bind="attrs">
            <v-icon class="mr-2">mdi-table-plus</v-icon>Insert table
          </v-list-item>
        </template>
        <table-grid @insert:table="insertTable" />
      </v-menu>
      <v-divider />
      <v-list-item
        @click="editorContext.commands.addColumnBefore"
        :disabled="!isTableActive">
        <v-icon class="mr-2">mdi-table-column-plus-before</v-icon>
        Add column before
      </v-list-item>
      <v-list-item
        @click="editorContext.commands.addColumnAfter"
        :disabled="!isTableActive">
        <v-icon class="mr-2">mdi-table-column-plus-after</v-icon>
        Add column after
      </v-list-item>
      <v-list-item
        @click="editorContext.commands.deleteColumn"
        :disabled="!isTableActive">
        <v-icon class="mr-2">mdi-table-column-remove</v-icon>
        Delete column
      </v-list-item>
      <v-divider />
      <v-list-item
        @click="editorContext.commands.addRowBefore"
        :disabled="!isTableActive">
        <v-icon class="mr-2">mdi-table-row-plus-before</v-icon> Add row before
      </v-list-item>
      <v-list-item
        @click="editorContext.commands.addRowAfter"
        :disabled="!isTableActive">
        <v-icon class="mr-2">mdi-table-row-plus-after</v-icon> Add row after
      </v-list-item>
      <v-list-item
        @click="editorContext.commands.deleteRow"
        :disabled="!isTableActive">
        <v-icon class="mr-2">mdi-table-row-remove</v-icon> Delete row
      </v-list-item>
      <v-divider />
      <v-list-item
        @click="editorContext.commands.mergeCells"
        :disabled="!enableMergeCells">
        <v-icon class="mr-2">mdi-table-merge-cells</v-icon> Merge cells
      </v-list-item>
      <v-list-item
        @click="editorContext.commands.splitCell"
        :disabled="!enableSplitCell">
        <v-icon class="mr-2">mdi-table-split-cell</v-icon> Split cell
      </v-list-item>
      <v-divider />
      <v-list-item
        @click="editorContext.commands.deleteTable"
        :disabled="!isTableActive">
        <v-icon class="mr-2">mdi-table-cancel</v-icon> Delete table
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import {
  enableMergeCells,
  enableSplitCell,
  isTableActive
} from '../../utils/table';
import MenuButton from '../../MenuButton.vue';
import TableGrid from './TableGrid.vue';

export default {
  name: 'tce-tiptap-table',
  props: {
    editorContext: { type: Object, required: true }
  },
  computed: {
    editor: ({ editorContext: { editor } }) => editor,
    isActive: ({ editorContext: { isActive } }) => isActive.table(),
    isTableActive: ({ editor }) => isTableActive(editor.state),
    enableMergeCells: ({ editor }) => enableMergeCells(editor.state),
    enableSplitCell: ({ editor }) => enableSplitCell(editor.state)
  },
  methods: {
    insertTable({ row, col }) {
      console.log({ row, col });
      this.editorContext.commands.createTable({
        rowsCount: row,
        colsCount: col,
        withHeaderRow: true
      });
    }
  },
  components: {
    MenuButton,
    TableGrid
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
