const pocketStyles = require('pocket-styles');
import Paper from 'paper';

const CanvasCursor = (color, radius, fill) => {
  const cursor = document.createElement('div');
  const cursor__canvas = document.createElement('canvas');

  initStyles();

  document.body.append(cursor, cursor__canvas);
  setBounds();

  const chosenColor = color || '#000';
  const chosenRadius = radius || 15;
  const chosenFill = fill || false;

  let clientX = -100;
  let clientY = -100;
  let innerCursor = cursor;
  initCursor();

  let lastX = 0;
  let lastY = 0;
  let group = null;

  initCanvas();

  window.addEventListener('resize', () => {
    setBounds();
  });

  function initStyles() {
    pocketStyles.apply(document.body, {
      cursor: 'none',
    });

    pocketStyles.apply(cursor, {
      position: 'fixed',
      left: '0',
      top: '0',
      pointerEvents: 'none',
      width: '10px',
      height: '10px',
      left: '-5px',
      top: '-5px',
      borderRadius: '0%',
      opacity: '0',
      zIndex: '11000',
      background: '#000',
    });

    pocketStyles.apply(cursor__canvas, {
      width: '100vw',
      height: '100vh',
      zIndex: '12000',
      position: 'fixed',
      left: '0',
      top: '0',
      pointerEvents: 'none',
    });
  }

  function initCursor() {
    // add listener to track the current mouse position
    document.addEventListener('mousemove', e => {
      clientX = e.clientX;
      clientY = e.clientY;
    });

    // transform the innerCursor to the current mouse position
    // use requestAnimationFrame() for smooth performance
    const render = () => {
      innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  function setBounds() {
    const bounds = cursor__canvas.getBoundingClientRect();
    cursor__canvas.width = bounds.width;
    cursor__canvas.height = bounds.height;
    console.log('yes');
  }

  function initCanvas() {
    const canvas = cursor__canvas;
    Paper.setup(canvas);
    const strokeColor = chosenColor;
    const strokeWidth = 1;
    const segments = 6;
    const radius = chosenRadius;

    // the base shape for the noisy circle
    const polygon = new Paper.Path.RegularPolygon(
      new Paper.Point(0, 0),
      segments,
      radius,
    );
    polygon.strokeColor = strokeColor;
    polygon.fillColor = chosenFill ? strokeColor : 'transparent';
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();
    group = new Paper.Group([polygon]);
    group.applyMatrix = false;

    // function for linear interpolation of values
    const lerp = (a, b, n) => {
      return (1 - n) * a + n * b;
    };

    // function to map a value from one range to another range
    const map = (value, in_min, in_max, out_min, out_max) => {
      return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      );
    };

    // the draw loop of Paper.js
    // (60fps with requestAnimationFrame under the hood)
    Paper.view.onFrame = event => {
      // using linear interpolation, the circle will move 0.2 (20%)
      // of the distance between its current position and the mouse
      // coordinates per Frame

      // move circle around normally
      lastX = lerp(lastX, clientX, 0.2);
      lastY = lerp(lastY, clientY, 0.2);
      group.position = new Paper.Point(lastX, lastY);
    };
  }
};

export default CanvasCursor;
