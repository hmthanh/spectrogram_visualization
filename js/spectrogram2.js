// var spec3D = {
//   cxRot: 90,
//   prevX: 0,

//   start: function (source, canvas) {
//     this.canvas = canvas;

//     // analyze source
//     var audioCtx = new AudioContext();
//     if (source.tagName === "AUDIO") {
//       source = audioCtx.createMediaElementSource(source); // creates source from audio tag with at least 2channels
//       source.connect(audioCtx.destination); // route source to destination
//     }

//     // Analyser
//     this.analyser = source.context.createAnalyser();
//     this.analyser.fftSize = 4096;
//     this.analyser.smoothingTimeConstant = 0;
//     source.connect(this.analyser);

//     // Visualizer
//     spec3D.attached();
//     spec3D.startRender();
//   },

//   attached: function() {
//     console.log('spectrogram-3d attached');
//     spec3D.onResize_();
//     spec3D.init_();

//     window.addEventListener('resize', spec3D.onResize_.bind(spec3D));
//   },

//   stopRender: function() {
//     spec3D.isRendering = false;
//   },

//   startRender: function() {
//     if (spec3D.isRendering) {
//       return;
//     }
//     spec3D.isRendering = true;
//     spec3D.draw_();
//   },

//   init_: function() {
//     // Initialize everything.
//     var analyserView = new AnalyserView(this.canvas);
//     analyserView.setAnalyserNode(this.analyser);
//     analyserView.initByteBuffer();
//     spec3D.analyserView = analyserView;
//   },

//   onResize_: function() {
//     console.log('onResize_');
//     spec3D.canvas.width = spec3D.canvas.clientWidth;
//     spec3D.canvas.height = spec3D.canvas.clientHeight;
//   },

//   draw_: function() {
//     if (!spec3D.isRendering) {
//       console.log('stopped draw_');
//       return;
//     }

//     spec3D.analyserView.doFrequencyAnalysis();
//     requestAnimationFrame(spec3D.draw_.bind(spec3D));
//   }
// };
class Spec3D {
  constructor() {
    this.cxRot = 90;
    this.prevX = 0;
    this.isRendering = false;
  }

  start(source, canvas) {
    this.canvas = canvas;

    // Analyze source
    const audioCtx = new AudioContext();
    if (source.tagName === "AUDIO") {
      source = audioCtx.createMediaElementSource(source); // Create source from audio tag with at least 2 channels
      source.connect(audioCtx.destination); // Route source to destination
    }

    // Analyser
    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = 4096;
    this.analyser.smoothingTimeConstant = 0;
    source.connect(this.analyser);

    // Visualizer
    this.attached();
    this.startRender();
  }

  attached() {
    console.log('spectrogram-3d attached');
    this.onResize();
    this.init();

    window.addEventListener('resize', () => this.onResize());
  }

  stopRender() {
    this.isRendering = false;
  }

  startRender() {
    if (this.isRendering) return;

    this.isRendering = true;
    this.draw();
  }

  init() {
    // Initialize everything
    this.analyserView = new AnalyserView(this.canvas);
    this.analyserView.setAnalyserNode(this.analyser);
    this.analyserView.initByteBuffer();
  }

  onResize() {
    console.log('onResize');
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  draw() {
    if (!this.isRendering) {
      console.log('stopped draw');
      return;
    }

    this.analyserView.doFrequencyAnalysis();
    requestAnimationFrame(() => this.draw());
  }
}

// Usage
const spec3D = new Spec3D();