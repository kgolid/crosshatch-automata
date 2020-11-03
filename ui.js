import * as dat from 'dat.gui';
import * as tome from 'chromotome';

export default function (options, run, randomize_rules) {
  let ctrls = {
    randomize: randomize_and_run,
  };

  const gui = new dat.GUI();

  let layout_folder = gui.addFolder('Layout');
  layout_folder.add(options, 'grid_size_x', 4, 50, 2).name('Segment width').onChange(run);
  layout_folder.add(options, 'grid_size_y', 4, 50, 2).name('Segment height').onChange(run);
  layout_folder.add(options, 'grid_init_x', 0, 20, 1).name('Segment start x').onChange(run);
  layout_folder.add(options, 'grid_init_y', 0, 20, 1).name('Segment start y').onChange(run);
  layout_folder.add(options, 'repeats_x', 1, 10, 1).name('Segment repeats x').onChange(run);
  layout_folder.add(options, 'repeats_y', 1, 10, 1).name('Segment repeats y').onChange(run);
  layout_folder.add(options, 'segment_padding', 0, 10, 2).name('Segment padding').onChange(run);
  layout_folder.open();

  let symm_folder = gui.addFolder('Symmetry');
  symm_folder.add(options, 'horizontal_reflection').name('Horizontal reflection').onChange(run);
  symm_folder.add(options, 'vertical_reflection').name('Vertical reflection').onChange(run);
  symm_folder
    .add(options, 'initial_horizontal_reflection')
    .name('Initial horizontal reflection')
    .onChange(run);
  symm_folder
    .add(options, 'initial_vertical_reflection')
    .name('Initial vertical reflection')
    .onChange(run);
  symm_folder.open();

  let divider_folder = gui.addFolder('Dividers');
  divider_folder.add(options, 'rule_h').name('Horizontal rule');
  divider_folder.add(options, 'rule_v').name('Vertical rule');
  divider_folder.add(options, 'rule_d').name('Desc Diagonal rule');
  divider_folder.add(options, 'rule_a').name('Asc Diagonal rule');
  divider_folder.add(ctrls, 'randomize').name('Randomize');
  divider_folder.open();

  let init_folder = gui.addFolder('Initial State');
  init_folder
    .add(options, 'init_state', ['empty', 'random', 'corner_cross'])
    .name('Initial state')
    .onChange(run);
  init_folder.add(options, 'redraw').name('Redraw');
  init_folder.open();

  let color_folder = gui.addFolder('Colors');
  color_folder.add(options, 'palette_name', tome.getNames()).name('Color palette').onChange(run);
  color_folder.add(options, 'display_stroke').name('Display stroke').onChange(run);
  color_folder.add(options, 'display_fill').name('Display fill').onChange(run);
  color_folder.open();

  gui.width = 350;

  function randomize_and_run() {
    randomize_rules();
    gui.updateDisplay();
    run();
  }
}
