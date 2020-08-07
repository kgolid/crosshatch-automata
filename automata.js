import { get_cell_colors } from './combinations';
import { random_int } from './util';

export default function (rule_nums, num_of_cols, init_state, width, height) {
  const rule_fns = {
    h_rule: get_rule(2, rule_nums.h),
    v_rule: get_rule(2, rule_nums.v),
    d_rule: get_rule(2, rule_nums.d),
    a_rule: get_rule(2, rule_nums.a),
  };

  // Create grid of size w+1, h+1, as first row and col are empty.
  const grid = empty_cell_grid(width + 1, height + 1);
  //grid[0][0] = new Cell(0, 0, 1, 1);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (i * j === 0) {
        if (init_state === 'corner_cross' && i + j === 0) grid[i][j] = new Cell(0, 0, 1, 1);
        if (init_state === 'random')
          grid[i][j] = new Cell(
            random_int(num_of_cols),
            random_int(num_of_cols),
            random_int(num_of_cols),
            random_int(num_of_cols)
          );
      } else {
        grid[i][j] = calculate_new_cell(neighbors_of(j, i, grid), rule_fns, num_of_cols);
      }
    }
  }
  // Remove empty row and col before returning grid.
  return grid.splice(1).map((r) => r.splice(1));
}

const calculate_new_cell = ({ n, nw, w }, { h_rule, v_rule, d_rule, a_rule }, num_of_cols) => {
  var h_line = h_rule(w.ascending_line, w.horizontal_line, nw.descending_line);
  var v_line = v_rule(nw.descending_line, n.vertical_line, n.ascending_line);
  var d_line = d_rule(w.horizontal_line, nw.descending_line, n.vertical_line);
  var a_line = a_rule(w.horizontal_line, nw.ascending_line, n.vertical_line);

  var cols = get_cell_colors(
    n.south_color,
    w.east_color,
    num_of_cols,
    h_line,
    v_line,
    d_line,
    a_line
  );

  return new Cell(h_line, v_line, d_line, a_line, cols.north, cols.east, cols.south, cols.west);
};

const neighbors_of = (x, y, arr) => ({
  n: arr[y - 1][x],
  nw: arr[y - 1][x - 1],
  w: arr[y][x - 1],
});

class Cell {
  constructor(h, v, d, a, n, e, s, w) {
    this.horizontal_line = h || 0;
    this.vertical_line = v || 0;
    this.descending_line = d || 0;
    this.ascending_line = a || 0;

    this.north_color = n || 0;
    this.east_color = e || 0;
    this.south_color = s || 0;
    this.west_color = w || 0;
  }
}

export const empty_cell_grid = (width, height) => {
  return [...Array(height)].map((_) => [...Array(width)].map((_) => new Cell()));
};

// Get bit at pos(ition) for num(ber)
const get_bit = (num, base, size, pos) => {
  return parseInt(
    Number(num)
      .toString(base)
      .padStart(Math.pow(base, size), 0)
      .split('')
      .reverse()
      .join('')
      .charAt(pos)
  );
};

const combine = (bs, base) => {
  return parseInt(bs.join(''), base);
};

// Returns given number in the form of a tertiary function (a rule)
const get_rule = (base, num) => (...bs) => get_bit(num, base, bs.length, combine(bs, base));
