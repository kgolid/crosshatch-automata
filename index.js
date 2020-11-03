import get_pattern from './automata';
import display_label from './label';
import ui from './ui';

import { random_int } from './util';

import * as tome from 'chromotome';

const canvas_width = 1300;
const canvas_height = 1300;
const padding = 200;

let options;

let palette;
let cell_dim;

let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(canvas_width, canvas_height);
    p.noLoop();

    options = {
      grid_size_x: 20,
      grid_size_y: 20,
      grid_init_x: 4,
      grid_init_y: 8,
      repeats_x: 2,
      repeats_y: 2,
      horizontal_reflection: true,
      vertical_reflection: true,
      initial_horizontal_reflection: false,
      initial_vertical_reflection: false,
      palette_name: 'skyspider',
      rule_h: random_int(Math.pow(2, 8)),
      rule_v: random_int(Math.pow(2, 8)),
      rule_d: random_int(Math.pow(2, 8)),
      rule_a: random_int(Math.pow(2, 8)),
      redraw: draw,
      init_state: 'empty',
      segment_padding: 0,
      display_stroke: false,
      display_fill: true,
    };

    ui(options, draw, randomize_rules);

    draw();
  };

  function draw() {
    palette = tome.get(options.palette_name);
    cell_dim =
      (canvas_width - 2 * padding - (options.repeats_x - 1) * options.segment_padding) /
      (options.grid_size_x * options.repeats_x);

    const rules = {
      h: options.rule_h,
      v: options.rule_v,
      d: options.rule_d,
      a: options.rule_a,
    };

    const grid_terminal_x = options.grid_init_x + options.grid_size_x;
    const grid_terminal_y = options.grid_init_y + options.grid_size_y;
    const grid = get_pattern(
      rules,
      palette.colors.length,
      options.init_state,
      grid_terminal_x,
      grid_terminal_y
    );

    p.background(palette.background || '#dedede');
    draw_pattern(
      grid,
      options.grid_init_x,
      options.grid_init_y,
      grid_terminal_x,
      grid_terminal_y,
      padding,
      padding
    );

    const label_x = canvas_width - padding - 88;
    const label_y = canvas_height - padding + 20;
    display_label(p, [rules.h, rules.v, rules.d, rules.a], p.color(0, 50), label_x, label_y);
  }

  function draw_pattern(grid, x0, y0, x1, y1, xpos, ypos) {
    p.push();
    p.translate(xpos, ypos);

    const segment_width = (x1 - x0) * cell_dim;
    const segment_height = (y1 - y0) * cell_dim;
    for (let i = 0; i < options.repeats_y; i++) {
      p.push();
      const v_reflect =
        options.vertical_reflection && i % 2 === (options.initial_vertical_reflection ? 0 : 1);
      for (let j = 0; j < options.repeats_x; j++) {
        const h_reflect =
          options.horizontal_reflection &&
          j % 2 === (options.initial_horizontal_reflection ? 0 : 1);
        draw_segment(grid, x0, y0, x1, y1, h_reflect, v_reflect);
        p.translate(segment_width + options.segment_padding, 0);
      }
      p.pop();
      p.translate(0, segment_height + options.segment_padding);
    }
    p.pop();
  }

  function draw_segment(grid, x0, y0, x1, y1, href, vref) {
    p.push();
    if (href) {
      p.translate((x1 - x0) * cell_dim, 0);
      p.scale(-1, 1);
    }
    if (vref) {
      p.translate(0, (y1 - y0) * cell_dim);
      p.scale(1, -1);
    }

    if (options.display_fill) {
      for (let i = 0; i < y1 - y0; i++) {
        for (let j = 0; j < x1 - x0; j++) {
          const x = j + x0;
          const y = i + y0;
          fill_cell(grid[y][x], j * cell_dim, i * cell_dim);
          fill_cell(grid[y][x], j * cell_dim + 0.5, i * cell_dim + 0.5);
        }
      }
    }

    if (options.display_stroke) {
      for (let i = 0; i < y1 - y0; i++) {
        for (let j = 0; j < x1 - x0; j++) {
          const x = j + x0;
          const y = i + y0;
          stroke_cell(grid[y][x], j * cell_dim, i * cell_dim);
        }
      }
    }

    p.pop();
  }

  function stroke_cell(cell, x, y) {
    p.push();
    p.translate(x, y);

    p.strokeWeight(3);
    p.stroke(palette.stroke);
    if (cell.horizontal_line) p.line(0, 0, cell_dim, 0);
    if (cell.vertical_line) p.line(0, 0, 0, cell_dim);
    if (cell.descending_line) p.line(0, 0, cell_dim, cell_dim);
    if (cell.ascending_line) p.line(cell_dim, 0, 0, cell_dim);

    p.pop();
  }

  function fill_cell(cell, x, y) {
    p.push();
    p.translate(x, y);

    p.noStroke();
    p.fill(palette.colors[cell.north_color]);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(cell_dim, 0);
    p.vertex(cell_dim / 2, cell_dim / 2);
    p.endShape();

    p.fill(palette.colors[cell.east_color]);
    p.beginShape();
    p.vertex(cell_dim, 0);
    p.vertex(cell_dim, cell_dim);
    p.vertex(cell_dim / 2, cell_dim / 2);
    p.endShape();

    p.fill(palette.colors[cell.south_color]);
    p.beginShape();
    p.vertex(cell_dim, cell_dim);
    p.vertex(0, cell_dim);
    p.vertex(cell_dim / 2, cell_dim / 2);
    p.endShape();

    p.fill(palette.colors[cell.west_color]);
    p.beginShape();
    p.vertex(0, cell_dim);
    p.vertex(0, 0);
    p.vertex(cell_dim / 2, cell_dim / 2);
    p.endShape();

    p.pop();
  }

  function randomize_rules() {
    options.rule_h = random_int(Math.pow(2, 8));
    options.rule_v = random_int(Math.pow(2, 8));
    options.rule_d = random_int(Math.pow(2, 8));
    options.rule_a = random_int(Math.pow(2, 8));
  }

  p.keyPressed = function () {
    if (p.keyCode === 80)
      p.saveCanvas(
        'crosshatch-' +
          options.rule_h +
          '-' +
          options.rule_v +
          '-' +
          options.rule_d +
          '-' +
          options.rule_a,
        'png'
      );
  };
};
new p5(sketch);
