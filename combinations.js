export const get_cell_colors = (top_col, left_col, num, h_line, v_line, d_line, a_line) => {
  const idx = combine([a_line, d_line, v_line, h_line], 2);
  return color_combo(top_col, left_col, Math.min(num, 6))[idx];
};

const combine = (bs, base) => {
  return parseInt(bs.join(''), base);
};

const color_combo = (n, w, num) => {
  const mix = get_combine_function(num);
  const next = (i) => (i + 1) % num;

  const m = mix(n, w);
  const nn = next(n);
  const nw = next(w);

  return [
    { id: 0, north: n, east: n, south: w, west: w },
    { id: 1, north: w, east: w, south: w, west: w },
    { id: 2, north: n, east: n, south: n, west: n },
    { id: 3, north: m, east: m, south: m, west: m },
    { id: 4, north: n, east: n, south: w, west: w },
    { id: 5, north: m, east: m, south: w, west: w },
    { id: 6, north: n, east: n, south: m, west: m },
    { id: 7, north: nn, east: nn, south: mix(nn, w), west: mix(nn, w) },
    { id: 8, north: n, east: n, south: n, west: w },
    { id: 9, north: w, east: nw, south: nw, west: w },
    { id: 10, north: n, east: nn, south: nn, west: n },
    { id: 11, north: m, east: next(m), south: next(m), west: m },
    { id: 12, north: n, east: nn, south: mix(nn, w), west: w },
    { id: 13, north: m, east: mix(m, nw), south: nw, west: w },
    { id: 14, north: n, east: nn, south: mix(nn, m), west: m },
    {
      id: 15,
      north: nn,
      east: mix(nn, next(mix(nn, w))),
      south: next(mix(nn, w)),
      west: mix(nn, w),
    },
  ];
};

const table2 = [
  [1, 1],
  [0, 0],
];

const table3 = [
  [2, 2, 1],
  [2, 0, 0],
  [1, 0, 1],
];

const table4 = [
  [3, 2, 1, 1],
  [2, 0, 3, 2],
  [3, 3, 1, 0],
  [1, 0, 0, 2],
];

const table5 = [
  [4, 3, 3, 1, 2],
  [3, 0, 4, 4, 2],
  [3, 4, 1, 0, 0],
  [1, 4, 0, 2, 1],
  [2, 2, 0, 1, 3],
];

const table6 = [
  [5, 2, 4, 1, 1, 3],
  [4, 0, 3, 5, 2, 2],
  [3, 5, 1, 4, 0, 3],
  [4, 4, 0, 2, 5, 1],
  [2, 5, 5, 1, 3, 0],
  [1, 3, 0, 0, 2, 4],
];

const combination_tables = [table2, table3, table4, table5, table6];

const get_combine_function = (n) => {
  return (a, b) => combination_tables[n - 2][b][a];
};
