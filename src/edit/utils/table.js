import { mergeCells, splitCell } from 'prosemirror-tables';

export function isTableActive(state) {
  console.log(state);
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

export function enableMergeCells(state) {
  return isTableActive(state) && mergeCells(state);
}

export function enableSplitCell(state) {
  return isTableActive(state) && splitCell(state);
}
