const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');


const createPan = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid'});
  folder.addInput(params, 'cols', {min: 10, max: 50, step: 1});
  folder.addInput(params, 'rows', {min: 10, max: 50, step: 1});
  folder.addInput(params, 'scaleMin', {min: 1, max: 500});
  folder.addInput(params, 'scaleMax', {min: 1, max: 100});

  folder = pane.addFolder({title: 'Noise'});
  folder.addInput(params, 'freq')
  folder.addInput(params, 'amp')
  folder.addInput(params, 'animate');
};

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 50,
  freq: -0.010,
  amp: 0,
  animate: true
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = '#377FAB';
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridW = width * 1.5;
    const gridH = height * 1.5;
    const cellW = gridW / cols;
    const cellH = gridH / rows;
    const margX = (width - gridW) * 1;
    const margY = (height - gridH) * 1;

    for(let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor( i / cols);

      const x = col * cellW;
      const y = row * cellH;
      const w = cellW * 0.8;
      const h = cellH * 0.8;

      const f = params.animate ? frame : params.frame;

      // const n = random.noise2D(x + frame * 10, y, params.freq);
      const n = random.noise3D(x, y, f * 10, params.freq);

      const angle = n * Math.PI * params.amp;
      // const scale = (n + 1) / 2 * 30;
      // const scale = (n * 0.5 + 0.5) * 30;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x, y);
      context.translate(margX, margY);
      context.translate(cellW * 0.5, cellH * 0.5)
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      

      context.beginPath();
      // context.moveTo(w * -0.5, 0);
      // context.lineTo(w * 0.5, 0);
        context.arc(x, y, 15, 0, 2 * Math.PI)
        
        context.stroke();
        
      context.restore();
    }
  };
};


createPan();
canvasSketch(sketch, settings);




