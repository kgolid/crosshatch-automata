export default (p, nums, col, x, y) => {
  p.push();
  p.translate(x, y);

  p.fill(col);
  p.noStroke();

  nums.forEach((num, i) => {
    for (var x = 0; x < 8; x++) {
      if (get_bit(num, 2, 8, 7 - x)) p.ellipse(x * 12, i * 10, 8, 8);
    }
  });
  p.pop();
};

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
