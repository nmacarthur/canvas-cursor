const pocketStyles = require('pocket-styles');
const Paper = require('paper');

class CanvasCursor {
  constructor(color, radius, fill) {
    this.cursor = document.createElement('div');
    this.cursor__canvas = document.createElement('canvas');

    this.initStyles();

    document.body.append(this.cursor, this.cursor__canvas);

    this.color = color || '#000';
    this.radius = radius || 15;
    this.fill = fill || false;

    this.clientX = -100;
    this.clientY = -100;
    this.innerCursor = this.cursor;
    this.initCursor();

    this.lastX = 0;
    this.lastY = 0;
    this.showCursor = false;
    this.group = null;

    this.fillOuterCursor = null;
    this.initCanvas();
  }

  initStyles() {
    pocketStyles.apply(document.body, {
      cursor: 'none',
    });

    pocketStyles.apply(this.cursor, {
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

    pocketStyles.apply(this.cursor__canvas, {
      width: '100vw',
      height: '100vh',
      zIndex: '12000',
      position: 'fixed',
      left: '0',
      top: '0',
      pointerEvents: 'none',
    });
  }

  initCursor() {
    // add listener to track the current mouse position
    document.addEventListener('mousemove', e => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });

    // transform the innerCursor to the current mouse position
    // use requestAnimationFrame() for smooth performance
    const render = () => {
      this.innerCursor.style.transform = `translate(${this.clientX}px, ${this.clientY}px)`;

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  initCanvas() {
    const canvas = this.cursor__canvas;
    Paper.setup(canvas);
    const strokeColor = this.color;
    const strokeWidth = 1;
    const segments = 6;
    const radius = this.radius;

    // the base shape for the noisy circle
    const polygon = new Paper.Path.RegularPolygon(
      new Paper.Point(0, 0),
      segments,
      radius,
    );
    polygon.strokeColor = strokeColor;
    polygon.fillColor = this.fill ? strokeColor : 'transparent';
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();
    this.group = new Paper.Group([polygon]);
    this.group.applyMatrix = false;

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
      this.lastX = lerp(this.lastX, this.clientX, 0.2);
      this.lastY = lerp(this.lastY, this.clientY, 0.2);
      this.group.position = new Paper.Point(this.lastX, this.lastY);
    };
  }
}

export default CanvasCursor;
