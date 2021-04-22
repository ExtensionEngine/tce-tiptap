<template>
  <v-card class="pa-3">
    <div class="table-grid">
      <div class="table-grid-wrapper">
        <div v-for="row in gridSize.row" :key="'r' + row" class="table-grid-row">
          <div
            v-for="col in gridSize.col"
            :key="'c' + col"
            @mouseover="selectGridSize(row, col)"
            @mousedown="onMouseDown(row, col)"
            :class="{ 'selected': isSelected(row, col) }"
            class="table-grid-cell">
            <div class="table-grid-cell-inner"></div>
          </div>
        </div>
      </div>
      <div class="table-grid-footer">
        {{ selectedGridSize.row }} x {{ selectedGridSize.col }}
      </div>
    </div>
  </v-card>
</template>

<script>
const INIT_GRID_SIZE = 5;
const MAX_GRID_SIZE = 10;
const DEFAULT_SELECTED_GRID_SIZE = 2;

export default {
  name: 'table-grid',
  data: () => ({
    gridSize: {
      row: INIT_GRID_SIZE,
      col: INIT_GRID_SIZE
    },
    selectedGridSize: {
      row: DEFAULT_SELECTED_GRID_SIZE,
      col: DEFAULT_SELECTED_GRID_SIZE
    }
  }),
  methods: {
    isSelected(row, col) {
      return col <= this.selectedGridSize.col && row <= this.selectedGridSize.row;
    },
    selectGridSize(row, col) {
      if (row === this.gridSize.row) {
        this.gridSize.row = Math.min(row + 1, MAX_GRID_SIZE);
      }
      if (col === this.gridSize.col) {
        this.gridSize.col = Math.min(col + 1, MAX_GRID_SIZE);
      }
      this.selectedGridSize.row = row;
      this.selectedGridSize.col = col;
    },
    onMouseDown(row, col) {
      this.$emit('insert:table', { row, col });
    },
    resetgridSize() {
      this.gridSize = {
        row: INIT_GRID_SIZE,
        col: INIT_GRID_SIZE
      };
      this.selectedGridSize = {
        row: DEFAULT_SELECTED_GRID_SIZE,
        col: DEFAULT_SELECTED_GRID_SIZE
      };
    }
  }
};
</script>

<style scoped lang="scss">
.table-grid {
  &-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &-row {
    display: flex;
  }

  .table-grid-cell {
    padding: 5px;
    background-color: #fff;

    &-inner {
      width: 16px;
      height: 16px;
      padding: 4px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      border-radius: 2px;
    }

    &.selected {
      .table-grid-cell-inner {
        background-color: #ffe5ec;
        border-color: #ff6590;
      }
    }
  }

  &-footer {
    margin-top: 5px;
    text-align: center;
  }
}
</style>
