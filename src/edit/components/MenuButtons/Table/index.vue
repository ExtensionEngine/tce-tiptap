<template>
  <v-menu
    transition="slide-y-transition"
    bottom>
    <template #activator="{ on, attrs }">
      <menu-button
        v-on="on"
        :is-active="isActive"
        v-bind="attrs"
        icon="table"
        tooltip="Insert table">
        <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
      </menu-button>
    </template>
    <v-list dense>
      <v-menu>
        <template #activator="{ on, attrs }">
          <v-list-item
            v-on="on"
            :is-active="isActive"
            v-bind="attrs">
            <v-icon color="#333" class="mr-3">mdi-table-plus</v-icon>
            Insert table
          </v-list-item>
        </template>
        <table-grid @insert:table="insertTable" />
      </v-menu>
      <v-divider />
      <v-list-item
        @click="editor.chain().focus().addColumnBefore().run()"
        :disabled="!isTableActive">
        <v-icon
          color="#333"
          :disabled="!isTableActive"
          class="mr-3">
          mdi-table-column-plus-before
        </v-icon>
        Add column before
      </v-list-item>
      <v-list-item
        @click="editor.chain().focus().addColumnAfter().run()"
        :disabled="!isTableActive">
        <v-icon
          color="#333"
          :disabled="!isTableActive"
          class="mr-3">
          mdi-table-column-plus-after
        </v-icon>
        Add column after
      </v-list-item>
      <v-list-item
        @click="editor.chain().focus().deleteColumn().run()"
        :disabled="!isTableActive">
        <v-icon
          color="#333"
          :disabled="!isTableActive"
          class="mr-3">
          mdi-table-column-remove
        </v-icon>
        Delete column
      </v-list-item>
      <v-divider />
      <v-list-item
        @click="editor.chain().focus().addRowBefore().run()"
        :disabled="!isTableActive">
        <v-icon
          color="#333"
          :disabled="!isTableActive"
          class="mr-3">
          mdi-table-row-plus-before
        </v-icon> Add row before
      </v-list-item>
      <v-list-item
        @click="editor.chain().focus().addRowAfter().run()"
        :disabled="!isTableActive">
        <v-icon
          color="#333"
          :disabled="!isTableActive"
          class="mr-3">
          mdi-table-row-plus-after
        </v-icon> Add row after
      </v-list-item>
      <v-list-item
        @click="editor.chain().focus().deleteRow().run()"
        :disabled="!isTableActive">
        <v-icon
          color="#333"
          :disabled="!isTableActive"
          class="mr-3">
          mdi-table-row-remove
        </v-icon> Delete row
      </v-list-item>
      <v-divider />
      <v-list-item
        @click="editor.chain().focus().mergeCells().run()"
        :disabled="!isMergeCellsEnabled">
        <v-icon
          color="#333"
          :disabled="!isMergeCellsEnabled"
          class="mr-3">
          mdi-table-merge-cells
        </v-icon> Merge cells
      </v-list-item>
      <v-list-item
        @click="editor.chain().focus().splitCell().run()"
        :disabled="!isSplitCellEnabled">
        <v-icon
          color="#333"
          :disabled="!isSplitCellEnabled"
          class="mr-3">
          mdi-table-split-cell
        </v-icon> Split cell
      </v-list-item>
      <v-divider />
      <v-list-item
        @click="editor.chain().focus().deleteTable().run()"
        :disabled="!isTableActive">
        <v-icon
          color="#333"
          :disabled="!isTableActive"
          class="mr-3">
          mdi-table-cancel
        </v-icon> Delete table
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mergeCells, splitCell } from 'prosemirror-tables';
import MenuButton from '../../MenuButton.vue';
import TableGrid from './TableGrid.vue';

function isTableActive(state) {
  if (!state) return false;
  const { selection, doc } = state;
  const { from, to } = selection;
  let keepLooking = true;
  let active = false;

  doc.nodesBetween(from, to, node => {
    const name = node.type.name;
    if (
      keepLooking &&
      (name === 'table' || name === 'table_row' || name === 'table_column' || name === 'table_cell')
    ) {
      keepLooking = false;
      active = true;
    }
    return keepLooking;
  });

  return active;
}

function enableMergeCells(state) {
  return isTableActive(state) && mergeCells(state);
}

function enableSplitCell(state) {
  return isTableActive(state) && splitCell(state);
}

export default {
  name: 'tce-tiptap-table',
  props: {
    editor: { type: Object, required: true }
  },
  computed: {
    isActive: ({ editor }) => editor.isActive('table'),
    isTableActive: ({ editor }) => isTableActive(editor.state),
    isMergeCellsEnabled: ({ editor }) => enableMergeCells(editor.state),
    isSplitCellEnabled: ({ editor }) => enableSplitCell(editor.state)
  },
  methods: {
    insertTable({ row, col }) {
      this.editor.chain().focus().insertTable({
        rowsCount: row,
        colsCount: col,
        withHeaderRow: true
      }).run();
    }
  },
  components: {
    MenuButton,
    TableGrid
  }
};
</script>
